import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { INVITATION_CATEGORY_LIST } from '../data/categories';
import './InvitationsPage.css';

/* Color palette map for category cards */
const PALETTE_COLORS = {
  'gold-maroon':     { bg: 'rgba(245,166,35,0.07)',  border: 'rgba(245,166,35,0.25)',  dot: '#f5a623' },
  'pink-gold':       { bg: 'rgba(212,96,138,0.07)',  border: 'rgba(212,96,138,0.25)',  dot: '#d4608a' },
  'pastel-blue-pink': { bg: 'rgba(123,200,245,0.07)', border: 'rgba(123,200,245,0.25)', dot: '#7bc8f5' },
  'turmeric-green':  { bg: 'rgba(232,160,32,0.07)',  border: 'rgba(232,160,32,0.25)',  dot: '#e8a020' },
};

const CATEGORY_ICONS = {
  wedding:      '💍',
  engagement:   '💐',
  'baby-shower': '🍼',
  valaikaapu:   '💛',
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function InvitationsPage() {
  return (
    <div className="invitations-page">
      <Helmet>
        <title>Invitation Printing — Sai Meera | Wedding, Engagement & More</title>
        <meta
          name="description"
          content="Premium wedding, engagement, baby shower, and Valaikaapu invitation printing in Chennai. Traditional Tamil designs, gold foil, and premium paper stocks."
        />
        <meta property="og:title" content="Invitation Printing — Sai Meera" />
        <meta property="og:description" content="Premium South Indian invitation printing — wedding, engagement, Valaikaapu, and baby shower cards." />
      </Helmet>

      {/* Hero */}
      <section className="inv-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inv-hero-label">// PREMIUM INVITATION PRINTING</div>
          <h1>Wedding & Event<br />Invitation Printing</h1>
          <p>
            Exquisite invitations crafted with premium papers, gold foil stamping, and traditional South Indian artistry — for your most sacred moments.
          </p>
          <Link to="/contact" className="inv-hero-cta">Get a Free Quote →</Link>
        </motion.div>
      </section>

      {/* Category Overview Grid */}
      <section className="inv-section">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-8%' }}
        >
          <motion.div variants={fadeUp}>
            <h2 className="inv-section-title">
              Choose Your <span>Invitation Type</span>
            </h2>
            <p className="inv-section-sub">
              Each category has its own dedicated design styles, paper options, and pricing.
            </p>
          </motion.div>

          <div className="inv-grid-2" style={{ marginTop: '2.5rem' }}>
            {INVITATION_CATEGORY_LIST.map((cat) => {
              const colors = PALETTE_COLORS[cat.palette] || PALETTE_COLORS['gold-maroon'];
              const icon = CATEGORY_ICONS[cat.slug] || '✉️';
              return (
                <motion.div key={cat.slug} variants={fadeUp}>
                  <Link
                    to={`/invitations/${cat.slug}`}
                    className="inv-glass-card inv-overview-card"
                    style={{
                      background: colors.bg,
                      borderColor: colors.border,
                      '--cat-dot': colors.dot,
                    }}
                  >
                    <div className="inv-overview-icon">{icon}</div>
                    <div className="inv-overview-content">
                      <h3 className="inv-overview-title">{cat.title}</h3>
                      <p className="inv-overview-subtitle">{cat.subtitle}</p>
                      <div className="inv-overview-styles">
                        {cat.styles.map((s) => (
                          <span key={s.id} className="inv-overview-style-tag">
                            {s.name}
                          </span>
                        ))}
                      </div>
                      <div className="inv-overview-cta">
                        View styles & pricing →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Process — shared across all invitation types */}
      <section className="inv-section">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-8%' }}
        >
          <motion.div variants={fadeUp}>
            <h2 className="inv-section-title">Our <span>Process</span></h2>
            <p className="inv-section-sub">
              From concept to doorstep — a seamless, premium experience.
            </p>
          </motion.div>

          <div className="inv-process-grid" style={{ marginTop: '2.5rem' }}>
            {[
              { n: '1', title: 'Design Consultation', desc: 'Discuss themes, colors, and content with our expert designers.' },
              { n: '2', title: 'Digital Proof', desc: 'Review and approve the digital preview before any printing begins.' },
              { n: '3', title: 'Premium Printing', desc: 'Offset or digital printing with exquisite foil and embossing options.' },
              { n: '4', title: 'Quality Delivery', desc: 'Careful packaging and on-time delivery for your special day.' },
            ].map((step) => (
              <motion.div key={step.n} className="inv-glass-card inv-process-step" variants={fadeUp}>
                <div className="inv-step-number">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="inv-cta-section">
        <h2>Not Sure Which Type You Need?</h2>
        <p>Contact us and our team will guide you to the perfect invitation for your occasion.</p>
        <Link to="/contact" className="inv-cta-btn">
          Get a Free Consultation
        </Link>
      </section>
    </div>
  );
}
