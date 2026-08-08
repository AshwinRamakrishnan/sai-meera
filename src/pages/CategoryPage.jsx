import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { getCategoryBySlug } from '../data/categories';
import ImageUpload from '../components/ui/ImageUpload';
import { submitEnquiry, createRazorpayOrder, verifyRazorpayPayment } from '../lib/api';
import './CategoryPage.css';

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
};

/* ── Tone-aware wrappers ── */
function AnimatedSection({ children, tone }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  if (tone === 'respectful') return <div ref={ref}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

function FadeItem({ children, tone }) {
  if (tone === 'respectful') return <>{children}</>;
  return <motion.div variants={fadeUp}>{children}</motion.div>;
}

function HeroMotion({ children, tone }) {
  if (tone === 'respectful') return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Tamil ornamental divider component ── */
function TamilDivider() {
  return (
    <div className="tamil-divider" aria-hidden="true">
      <div className="tamil-divider-center">
        <div className="tamil-divider-dot" />
        <div className="tamil-divider-gem" />
        <div className="tamil-divider-dot" />
      </div>
    </div>
  );
}

/* ── Group name lookup ── */
const GROUP_NAMES = {
  invitations: 'Invitations',
  flex:        'Flex & Banners',
  cards:       'Cards & Stationery',
  business:    'Business Print',
};

/* ── Placeholder icon per tone ── */
const PLACEHOLDER_ICON = {
  festive:      '🖨️',
  professional: '📋',
  respectful:   '🕊️',
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function CategoryPage() {
  const { slug } = useParams();
  const cat = getCategoryBySlug(slug);

  /* Payment State */
  const [selectedTier, setSelectedTier] = useState('');
  const [quantity, setQuantity] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '', phone: '' });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  // Reset payment state when category changes
  useEffect(() => {
    setSelectedTier('');
    setQuantity('');
    setPaymentSuccess(false);
    setPaymentError('');
    setCheckoutModalOpen(false);
  }, [slug]);

  const handleFastCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!checkoutData.name || !checkoutData.email || !checkoutData.phone) {
      setPaymentError('Please fill all details.');
      return;
    }
    
    setPaymentLoading(true);
    setPaymentError('');
    try {
      // 1. Create a quick enquiry record
      const enquiryPayload = {
        name: checkoutData.name,
        email: checkoutData.email,
        phone: checkoutData.phone,
        service: 'other',
        categorySlug: slug,
        message: `Fast Checkout Order: ${cat.name} — ${selectedTier} x ${quantity}`
      };
      
      const enquiryRes = await submitEnquiry(enquiryPayload);
      if (!enquiryRes.success || !enquiryRes.enquiryId) throw new Error(enquiryRes.error || 'Failed to create order record');
      
      const enquiryId = enquiryRes.enquiryId;
      setCheckoutModalOpen(false);

      // 2. Call Razorpay Edge Function
      const orderRes = await createRazorpayOrder(
        enquiryId,
        slug,
        selectedTier,
        Number(quantity)
      );
      if (!orderRes.success) throw new Error(orderRes.error || 'Failed to create Razorpay order');

      // 3. Open Razorpay Checkout
      const options = {
        key: orderRes.key,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: 'Sai Meera Printing',
        description: orderRes.description,
        order_id: orderRes.orderId,
        prefill: {
          name: checkoutData.name,
          email: checkoutData.email,
          contact: checkoutData.phone
        },
        theme: {
          color: cat.accentColor || '#eab308'
        },
        handler: async function (response) {
          try {
            setPaymentLoading(true);
            const verifyRes = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            if (verifyRes.success) {
              setPaymentSuccess(true);
              setPaymentId(response.razorpay_payment_id);
            } else {
              setPaymentError('Payment verification failed.');
            }
          } catch (err) {
            setPaymentError(err.message);
          } finally {
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setPaymentError(response.error.description);
        setPaymentLoading(false);
      });
      rzp.open();

    } catch (err) {
      setPaymentError(err.message);
      setPaymentLoading(false);
    }
  };

  /* 404 */
  if (!cat) {
    return (
      <div className="cat-notfound">
        <div className="cat-notfound-title">Category Not Found</div>
        <div className="cat-notfound-sub">
          We don't have a product category called "{slug}".
        </div>
        <Link to="/products" className="cat-notfound-link">
          ← Browse All Products
        </Link>
      </div>
    );
  }

  const tone       = cat.tone || 'festive';
  const groupName  = GROUP_NAMES[cat.group] || 'Products';
  const isFestive  = tone === 'festive';
  const isRespect  = tone === 'respectful';

  return (
    <div
      className="cat-page"
      data-tone={tone}
      style={{ '--cat-accent': cat.accentColor }}
    >
      {/* ── SEO ── */}
      <Helmet>
        <title>{cat.name} — Sai Meera Printing</title>
        <meta name="description" content={cat.description} />
        <meta property="og:title" content={`${cat.name} — Sai Meera Printing`} />
        <meta property="og:description" content={cat.description} />
      </Helmet>

      {/* ── Breadcrumb ── */}
      <nav className="cat-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="cat-breadcrumb-sep">›</span>
        <Link to={`/products?group=${cat.group}`}>{groupName}</Link>
        <span className="cat-breadcrumb-sep">›</span>
        <span className="cat-breadcrumb-current">{cat.name}</span>
      </nav>

      {/* ── Political disclaimer ── */}
      {cat.disclaimer && (
        <div className="cat-disclaimer" role="note">
          <span className="cat-disclaimer-icon">⚠️</span>
          <span>{cat.disclaimer}</span>
        </div>
      )}

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className={`cat-hero kolam-hero-bg${isFestive ? ' kolam-corner' : ''}`}>
        <HeroMotion tone={tone}>
          {/* Tamil badge */}
          <div className={`cat-hero-label${isFestive ? ' kolam-ring' : ''}`}>
            {cat.heroLabel}
          </div>

          {/* Title */}
          <h1 className={`cat-hero-title${isFestive ? ' gold-shimmer' : ''}`}>
            {cat.name}
          </h1>

          <div className="cat-hero-subtitle">{cat.subtitle}</div>
          <p className="cat-hero-desc">{cat.description}</p>

          <div className="cat-hero-actions">
            <Link to="/contact" className="cat-hero-cta cat-cta-primary-btn">
              {isRespect ? 'Contact Us Discretely' : 'Get a Free Quote →'}
            </Link>
            <Link to="/products" className="cat-hero-cta-ghost">
              ← All Products
            </Link>
          </div>
        </HeroMotion>
      </section>

      {/* ── Toran divider (festive only) ── */}
      {isFestive && (
        <div className="cat-toran-strip" aria-hidden="true">
          <div className="toran-border" />
          <img
            src="/tamil-divider.jpg"
            alt=""
            className="tamil-section-divider-img"
            loading="lazy"
          />
        </div>
      )}

      {/* ══════════════════════════════════════
          STYLES / DESIGNS
      ══════════════════════════════════════ */}
      <section className="cat-section">
        <AnimatedSection tone={tone}>
          <FadeItem tone={tone}>
            <div className="temple-label cat-section-label-wrap">
              <span className="temple-label-text">Design Styles</span>
            </div>
            <h2 className="cat-section-title">
              {isRespect ? 'Our Designs' : 'Choose Your Look'}
            </h2>
            <p className="cat-section-sub">
              {isRespect
                ? 'Each design is handled with care and dignity.'
                : 'Every style is printed on premium stock with attention to every detail.'}
            </p>
          </FadeItem>

          <div className="cat-styles-grid">
            {cat.styles.map((style) => (
              <FadeItem key={style.id} tone={tone}>
                <div className={`cat-style-card tamil-card`}>
                  {/* ── Tamil-styled placeholder ── */}
                  <div className="tamil-placeholder">
                    <div className="tamil-placeholder-label">
                      <span className="tamil-placeholder-icon">
                        {PLACEHOLDER_ICON[tone]}
                      </span>
                      <span className="tamil-placeholder-text">{style.name}</span>
                      {/* TODO: Replace with real product photo — Phase X */}
                      <span className="tamil-placeholder-sub">Photo coming soon</span>
                    </div>
                  </div>

                  <h3 className="cat-style-name">{style.name}</h3>
                  <p className="cat-style-desc">{style.desc}</p>
                  <div className="cat-style-specs">
                    {style.specs.map((spec, i) => (
                      <div key={i} className="cat-style-spec">{spec}</div>
                    ))}
                  </div>
                </div>
              </FadeItem>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Ornamental divider between sections */}
      {!isRespect && (
        <div className="cat-divider-wrap">
          <TamilDivider />
        </div>
      )}

      {/* ══════════════════════
          PHOTO UPLOAD (invitation/festive categories only)
      ══════════════════════ */}
      {isFestive && (
        <section className="cat-section cat-upload-section">
          <AnimatedSection tone={tone}>
            <FadeItem tone={tone}>
              <div className="temple-label cat-section-label-wrap">
                <span className="temple-label-text">Personalise</span>
              </div>
              <h2 className="cat-section-title">Upload Your Photos</h2>
              <p className="cat-section-sub">
                Share your photos with us — couple portraits, family photos, or venue
                images. We'll incorporate them into your invitation design.
              </p>
            </FadeItem>
            <FadeItem tone={tone}>
              <div className="cat-upload-wrap">
                <ImageUpload
                  label=""
                  hint="Photos are used only for your design. Max 5 images, 10 MB each. JPEG · PNG · WEBP · HEIC accepted."
                  accentColor={cat.accentColor}
                />
              </div>
            </FadeItem>
          </AnimatedSection>
        </section>
      )}

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section className="cat-section cat-section-pricing">
        <AnimatedSection tone={tone}>
          <FadeItem tone={tone}>
            <div className="temple-label cat-section-label-wrap">
              <span className="temple-label-text">Pricing</span>
            </div>
            <h2 className="cat-section-title">Transparent Packages</h2>
            <p className="cat-section-sub">No hidden costs. Quality materials at every tier.</p>
          </FadeItem>

          <div className="cat-pricing-grid">
            {cat.pricing.map((tier) => (
              <FadeItem key={tier.name} tone={tone}>
                <div className={`cat-pricing-card${tier.popular ? ' popular' : ''}`}>
                  {tier.popular && (
                    <div className="cat-popular-badge">Most Popular</div>
                  )}
                  <div className="cat-pricing-name">{tier.name}</div>
                  <div className="cat-pricing-price-row">
                    <span className={`cat-pricing-price${isFestive ? ' tamil-gold-text' : ''}`}>
                      {tier.price}
                    </span>
                    {tier.unit && (
                      <span className="cat-pricing-unit">{tier.unit}</span>
                    )}
                  </div>
                  <div className="cat-pricing-minqty">{tier.minQty}</div>
                  <div className="cat-pricing-features">
                    {tier.features.map((f, i) => (
                      <div key={i} className="cat-pricing-feature">
                        <div className="cat-feature-dot" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeItem>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ══════════════════════════════════════
          FAST CHECKOUT MODAL
      ══════════════════════════════════════ */}
      {checkoutModalOpen && (
        <div className="cat-modal-overlay">
          <div className="cat-modal-content">
            <h3 className="cat-modal-title">Fast Checkout</h3>
            <p className="cat-modal-sub">Please provide your details to proceed with payment.</p>
            
            <form onSubmit={handleFastCheckoutSubmit} className="cat-modal-form">
              <div className="cat-form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  required 
                  value={checkoutData.name} 
                  onChange={e => setCheckoutData({...checkoutData, name: e.target.value})} 
                />
              </div>
              <div className="cat-form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  required 
                  value={checkoutData.email} 
                  onChange={e => setCheckoutData({...checkoutData, email: e.target.value})} 
                />
              </div>
              <div className="cat-form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  value={checkoutData.phone} 
                  onChange={e => setCheckoutData({...checkoutData, phone: e.target.value})} 
                />
              </div>

              {paymentError && <div className="cat-payment-error">{paymentError}</div>}

              <div className="cat-modal-actions">
                <button 
                  type="button" 
                  className="cat-modal-cancel" 
                  onClick={() => setCheckoutModalOpen(false)}
                  disabled={paymentLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="cat-modal-submit"
                  disabled={paymentLoading}
                >
                  {paymentLoading ? 'Processing...' : 'Proceed to Pay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          PAYMENT SECTION (Only if fixed pricing exists)
      ══════════════════════════════════════ */}
      {cat.pricing && typeof cat.pricing[0]?.price === 'string' && cat.pricing[0].price.includes('₹') && (
        <section className="cat-section cat-section-payment">
          <AnimatedSection tone={tone}>
            <div className="cat-payment-container">
              {paymentSuccess ? (
                <div className="cat-payment-success-box">
                  <div className="cat-success-icon">✓</div>
                  <h3>Payment Successful!</h3>
                  <p>Your order has been placed. Payment ID: {paymentId}</p>
                </div>
              ) : (
                <>
                  <h3 className="cat-payment-title">Order Online</h3>
                  <div className="cat-payment-controls">
                    <div className="cat-payment-group">
                      <label>Select Tier</label>
                      <select 
                        value={selectedTier} 
                        onChange={(e) => setSelectedTier(e.target.value)}
                        className="cat-payment-select"
                      >
                        <option value="">-- Choose Tier --</option>
                        {cat.pricing.map(t => (
                          <option key={t.name} value={t.name}>
                            {t.name} — {t.price}{t.unit} ({t.minQty})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="cat-payment-group">
                      <label>Quantity</label>
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="cat-payment-input"
                        placeholder="e.g. 100"
                        min="1"
                      />
                    </div>
                  </div>

                  {selectedTier && quantity && (
                    <div className="cat-payment-summary">
                      <span className="cat-summary-label">Estimated Total:</span>
                      <span className="cat-summary-val">
                        ₹{(() => {
                          const tierData = cat.pricing.find(t => t.name === selectedTier);
                          if (!tierData) return 0;
                          const priceNum = parseInt(tierData.price.replace(/\D/g, ''));
                          return (priceNum * Number(quantity)).toLocaleString('en-IN');
                        })()}
                      </span>
                    </div>
                  )}

                  {paymentError && !checkoutModalOpen && <div className="cat-payment-error">{paymentError}</div>}

                  <button 
                    className="cat-hero-cta"
                    style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      const tierData = cat.pricing.find(t => t.name === selectedTier);
                      const minQ = tierData ? parseInt(tierData.minQty.replace(/\D/g, '')) : 1;
                      if (!selectedTier || !quantity || Number(quantity) < minQ) {
                        setPaymentError(`Please select a tier and enter a minimum quantity of ${minQ}`);
                        return;
                      }
                      setPaymentError('');
                      setCheckoutModalOpen(true);
                    }}
                  >
                    Pay Now
                  </button>
                </>
              )}
            </div>
          </AnimatedSection>
        </section>
      )}

      {!isRespect && (
        <div className="cat-divider-wrap">
          <TamilDivider />
        </div>
      )}

      {/* ══════════════════════════════════════
          PROCESS
      ══════════════════════════════════════ */}
      <section className="cat-section cat-section-process">
        <AnimatedSection tone={tone}>
          <FadeItem tone={tone}>
            <div className="temple-label cat-section-label-wrap">
              <span className="temple-label-text">How It Works</span>
            </div>
            <h2 className="cat-section-title">Our Process</h2>
            <p className="cat-section-sub">
              {isRespect
                ? 'We handle every step with care and discretion.'
                : 'From brief to delivery — a smooth, premium experience.'}
            </p>
          </FadeItem>

          <div className="cat-process-grid">
            {cat.process.map((step) => (
              <FadeItem key={step.n} tone={tone}>
                <div className="cat-process-step">
                  <div className="cat-step-num">{step.n}</div>
                  <h3 className="cat-step-title">{step.title}</h3>
                  <p className="cat-step-desc">{step.desc}</p>
                </div>
              </FadeItem>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <div className={`cat-cta${isRespect ? ' cat-cta-respectful' : ''}`}>
        {/* Bottom toran strip for festive */}
        {isFestive && <div className="cat-cta-toran toran-border" aria-hidden="true" />}

        <motion.div
          initial={isRespect ? false : { opacity: 0, y: 20 }}
          whileInView={isRespect ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="cat-cta-inner"
        >
          {!isRespect && <TamilDivider />}

          <h2 className="cat-cta-title">
            {isRespect
              ? 'We Are Here to Help'
              : `Ready to Order Your ${cat.name.split(' ').slice(-2).join(' ')}?`}
          </h2>
          <p className="cat-cta-sub">
            {isRespect
              ? 'Our team handles all memorial printing with care, discretion, and priority turnaround.'
              : "Contact us with your details and we'll get you a free quote within 24 hours."}
          </p>
          <div className="cat-cta-btns">
            <Link to="/contact" className={`cat-cta-primary${isRespect ? '' : ''}`}>
              {isRespect ? 'Contact Us' : 'Get a Free Quote →'}
            </Link>
            <Link to="/products" className="cat-cta-secondary">
              ← All Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
