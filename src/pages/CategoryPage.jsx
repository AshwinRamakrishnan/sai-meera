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

/* ── AnimatedSection: scroll-triggered stagger container ── */
function AnimatedSection({ children, className, tone }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  // Respectful tone: no stagger animation — render statically
  if (tone === 'respectful') {
    return <div ref={ref} className={className}>{children}</div>;
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated item wrapper ── */
function AnimItem({ children, tone }) {
  if (tone === 'respectful') return <>{children}</>;
  return <motion.div variants={fadeUp}>{children}</motion.div>;
}

/* ── Hero wrapper: respectful = no motion ── */
function HeroWrapper({ children, tone }) {
  if (tone === 'respectful') {
    return <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Group label map ── */
const GROUP_NAMES = {
  invitations: 'Invitations',
  flex: 'Flex & Banners',
  cards: 'Cards & Stationery',
  business: 'Business Print',
};

/* ── CategoryPage ── */
export default function CategoryPage() {
  const { slug } = useParams();
  const cat = getCategoryBySlug(slug);

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

  const tone = cat.tone || 'festive';
  const groupName = GROUP_NAMES[cat.group] || 'Products';

  return (
    <div
      className="cat-page"
      data-tone={tone}
      style={{ '--cat-accent': cat.accentColor }}
    >
      {/* SEO */}
      <Helmet>
        <title>{cat.name} — Sai Meera Printing</title>
        <meta name="description" content={cat.description} />
        <meta property="og:title" content={`${cat.name} — Sai Meera Printing`} />
        <meta property="og:description" content={cat.description} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="cat-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="cat-breadcrumb-sep">›</span>
        <Link to={`/products?group=${cat.group}`}>{groupName}</Link>
        <span className="cat-breadcrumb-sep">›</span>
        <span className="cat-breadcrumb-current">{cat.name}</span>
      </nav>

      {/* Political disclaimer */}
      {cat.disclaimer && (
        <div className="cat-disclaimer">
          <span className="cat-disclaimer-icon">⚠️</span>
          <span>{cat.disclaimer}</span>
        </div>
      )}

      {/* Hero */}
      <section className="cat-hero">
        <HeroWrapper tone={tone}>
          <div className="cat-hero-label">{cat.heroLabel}</div>
          <h1 className="cat-hero-title">{cat.name}</h1>
          <div className="cat-hero-subtitle">{cat.subtitle}</div>
          <p className="cat-hero-desc">{cat.description}</p>
          <Link to="/contact" className="cat-hero-cta">
            {tone === 'respectful' ? 'Contact Us Discretely' : 'Get a Free Quote →'}
          </Link>
        </HeroWrapper>
      </section>

      {/* Styles / Designs */}
      <section className="cat-section">
        <AnimatedSection tone={tone}>
          <AnimItem tone={tone}>
            <div className="cat-section-label">Design Styles</div>
            <h2 className="cat-section-title">
              {tone === 'respectful' ? 'Our Designs' : 'Choose Your Look'}
            </h2>
            <p className="cat-section-sub">
              {tone === 'respectful'
                ? 'Each design is handled with care and dignity.'
                : 'Every style is printed on premium stock with attention to every detail.'}
            </p>
          </AnimItem>

          <div className="cat-styles-grid">
            {cat.styles.map((style) => (
              <AnimItem key={style.id} tone={tone}>
                <div className="cat-style-card">
                  {/* TODO: Replace with real product photography — Phase X */}
                  <div className="cat-style-placeholder">
                    <span className="cat-placeholder-icon">
                      {tone === 'respectful' ? '🕊️' : '🖨️'}
                    </span>
                    <span className="cat-placeholder-text">Photo — TODO</span>
                  </div>
                  <h3 className="cat-style-name">{style.name}</h3>
                  <p className="cat-style-desc">{style.desc}</p>
                  <div className="cat-style-specs">
                    {style.specs.map((spec, i) => (
                      <div key={i} className="cat-style-spec">{spec}</div>
                    ))}
                  </div>
                </div>
              </AnimItem>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Pricing */}
      <section className="cat-section">
        <AnimatedSection tone={tone}>
          <AnimItem tone={tone}>
            <div className="cat-section-label">Pricing</div>
            <h2 className="cat-section-title">Transparent Packages</h2>
            <p className="cat-section-sub">No hidden costs. Quality materials at every tier.</p>
          </AnimItem>

          <div className="cat-pricing-grid">
            {cat.pricing.map((tier) => (
              <AnimItem key={tier.name} tone={tone}>
                <div className={`cat-pricing-card${tier.popular ? ' popular' : ''}`}>
                  {tier.popular && (
                    <div className="cat-popular-badge">Most Popular</div>
                  )}
                  <div className="cat-pricing-name">{tier.name}</div>
                  <div>
                    <span className="cat-pricing-price">{tier.price}</span>
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
              </AnimItem>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Process */}
      <section className="cat-section">
        <AnimatedSection tone={tone}>
          <AnimItem tone={tone}>
            <div className="cat-section-label">How It Works</div>
            <h2 className="cat-section-title">Our Process</h2>
            <p className="cat-section-sub">
              {tone === 'respectful'
                ? 'We handle every step with care and discretion.'
                : 'From brief to delivery — a smooth, premium experience.'}
            </p>
          </AnimItem>

          <div className="cat-process-grid">
            {cat.process.map((step) => (
              <AnimItem key={step.n} tone={tone}>
                <div className="cat-process-step">
                  <div className="cat-step-num">{step.n}</div>
                  <h3 className="cat-step-title">{step.title}</h3>
                  <p className="cat-step-desc">{step.desc}</p>
                </div>
              </AnimItem>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <div className="cat-cta">
        <motion.div
          initial={tone === 'respectful' ? false : { opacity: 0, y: 20 }}
          whileInView={tone === 'respectful' ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="cat-cta-title">
            {tone === 'respectful'
              ? 'We Are Here to Help'
              : `Ready to Order Your ${cat.name}?`}
          </h2>
          <p className="cat-cta-sub">
            {tone === 'respectful'
              ? 'Our team handles all memorial printing with care, discretion, and priority.'
              : 'Contact us with your details and we\'ll get you a quote within 24 hours.'}
          </p>
          <div className="cat-cta-btns">
            <Link to="/contact" className="cat-cta-primary">
              {tone === 'respectful' ? 'Contact Us' : 'Get a Free Quote →'}
            </Link>
            <Link to="/products" className="cat-cta-secondary">
              ← Browse All Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
