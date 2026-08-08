import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { getCategoryBySlug } from '../data/categories';
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
