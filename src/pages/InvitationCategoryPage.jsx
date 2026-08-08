import React, { useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useInView } from 'framer-motion';
import { INVITATION_CATEGORIES } from '../data/categories';
import './InvitationCategoryPage.css';

/* ── Shared animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

/* ── AnimatedSection: triggers fade-up on scroll entry ── */
function AnimatedSection({ children, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
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

/* ── Category page component ── */
export default function InvitationCategoryPage() {
  const { category } = useParams();
  const cat = INVITATION_CATEGORIES[category];

  // 404 for unknown slugs
  if (!cat) {
    return (
      <div className="inv-cat-notfound">
        <div className="inv-cat-notfound-title">Category Not Found</div>
        <div className="inv-cat-notfound-sub">
          We don't have an invitation type called "{category}".
        </div>
        <Link to="/invitations" className="inv-cat-notfound-link">
          ← Back to All Invitations
        </Link>
      </div>
    );
  }

  return (
    <div className="inv-cat-page" style={{ '--cat-accent': cat.accentColor }}>
      {/* SEO */}
      <Helmet>
        <title>{cat.title} — Sai Meera Printing</title>
        <meta name="description" content={cat.description} />
        <meta property="og:title" content={`${cat.title} — Sai Meera Printing`} />
        <meta property="og:description" content={cat.description} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="inv-cat-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="inv-cat-breadcrumb-sep">›</span>
        <Link to="/invitations">Invitations</Link>
        <span className="inv-cat-breadcrumb-sep">›</span>
        <span className="inv-cat-breadcrumb-current">{cat.title}</span>
      </nav>

      {/* Hero */}
      <section className="inv-cat-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inv-cat-hero-label">{cat.heroLabel}</div>
          <h1 className="inv-cat-hero-title">{cat.title}</h1>
          <div className="inv-cat-hero-subtitle">{cat.subtitle}</div>
          <p className="inv-cat-hero-desc">{cat.description}</p>
          <Link to="/contact" className="inv-cat-hero-cta">
            Get a Free Quote →
          </Link>
        </motion.div>
      </section>

      {/* Styles / Designs */}
      <section className="inv-cat-section">
        <AnimatedSection>
          <motion.div variants={fadeUp}>
            <div className="inv-cat-section-label">Design Styles</div>
            <h2 className="inv-cat-section-title">Choose Your Look</h2>
            <p className="inv-cat-section-sub">
              Every style is printed on premium stock with attention to every detail.
            </p>
          </motion.div>

          <div className="inv-cat-styles-grid">
            {cat.styles.map((style) => (
              <motion.div key={style.id} className="inv-cat-style-card" variants={fadeUp}>
                {/* TODO: Replace placeholder with real product photography supplied by client */}
                <div className="inv-cat-style-placeholder">
                  <span className="inv-cat-placeholder-icon">🖨️</span>
                  <span className="inv-cat-placeholder-text">Sample Photo — TODO</span>
                </div>
                <h3 className="inv-cat-style-name">{style.name}</h3>
                <p className="inv-cat-style-desc">{style.desc}</p>
                <div className="inv-cat-style-specs">
                  {style.specs.map((spec, i) => (
                    <div key={i} className="inv-cat-style-spec">{spec}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Pricing */}
      <section className="inv-cat-section" style={{ paddingTop: 0 }}>
        <AnimatedSection>
          <motion.div variants={fadeUp}>
            <div className="inv-cat-section-label">Pricing</div>
            <h2 className="inv-cat-section-title">Transparent Packages</h2>
            <p className="inv-cat-section-sub">
              No hidden costs. Quality materials at every tier.
            </p>
          </motion.div>

          <div className="inv-cat-pricing-grid">
            {cat.pricing.map((tier) => (
              <motion.div
                key={tier.name}
                className={`inv-cat-pricing-card${tier.popular ? ' popular' : ''}`}
                variants={fadeUp}
              >
                {tier.popular && (
                  <div className="inv-cat-popular-badge">Most Popular</div>
                )}
                <div className="inv-cat-pricing-name">{tier.name}</div>
                <div>
                  <span className="inv-cat-pricing-price">{tier.price}</span>
                  <span className="inv-cat-pricing-unit">{tier.unit}</span>
                </div>
                <div className="inv-cat-pricing-minqty">{tier.minQty}</div>
                <div className="inv-cat-pricing-features">
                  {tier.features.map((f, i) => (
                    <div key={i} className="inv-cat-pricing-feature">
                      <div className="inv-cat-feature-dot" />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Process */}
      <section className="inv-cat-section" style={{ paddingTop: 0 }}>
        <AnimatedSection>
          <motion.div variants={fadeUp}>
            <div className="inv-cat-section-label">How It Works</div>
            <h2 className="inv-cat-section-title">Our Process</h2>
            <p className="inv-cat-section-sub">
              From brief to delivery — a smooth, premium experience.
            </p>
          </motion.div>

          <div className="inv-cat-process-grid">
            {cat.process.map((step) => (
              <motion.div key={step.n} className="inv-cat-process-step" variants={fadeUp}>
                <div className="inv-cat-step-num">{step.n}</div>
                <h3 className="inv-cat-step-title">{step.title}</h3>
                <p className="inv-cat-step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <div className="inv-cat-cta">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="inv-cat-cta-title">
            Ready to Create Your {cat.title}?
          </h2>
          <p className="inv-cat-cta-sub">
            Contact us with your details and we'll get you a quote within 24 hours.
          </p>
          <div className="inv-cat-cta-btns">
            <Link to="/contact" className="inv-cat-cta-primary">
              Get a Free Quote →
            </Link>
            <Link to="/invitations" className="inv-cat-cta-secondary">
              ← View All Invitations
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
