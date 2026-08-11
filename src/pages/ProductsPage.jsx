import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ALL_CATEGORIES, GROUPS } from '../data/categories';
import './ProductsPage.css';

/* ── Category icon map ── */
const CAT_ICONS = {
  'hindu-wedding':    '🪔',
  'muslim-nikah':     '🌙',
  'christian-wedding':'✝️',
  'engagement':       '💍',
  'reception':        '🎉',
  'baby-shower':      '🍼',
  'valaikaapu':       '💛',
  'ear-piercing':     '✨',
  'puberty-function': '🌸',
  'housewarming':     '🏠',
  'birthday':         '🎂',
  'anniversary':      '💖',
  'naming-ceremony':  '⭐',
  'temple-festival':  '🪷',
  'funeral-memorial': '🕊️',
  'flex-banner':      '🖥️',
  'wedding-flex':     '🎊',
  'shop-opening':     '🏪',
  'political-event':  '📢',
  'rollup-banner':    '🗂️',
  'greeting-card':    '💌',
  'visiting-card':    '🪪',
  'thank-you-card':   '🙏',
  'menu-card':        '🍽️',
  'certificate':      '🏆',
  'bill-book':        '📋',
  'corporate-event':  '🏢',
  'school-college':   '🎓',
  'custom-print':     '🖨️',
};

const GROUP_ORDER = ['invitations', 'flex', 'cards', 'business'];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGroup = searchParams.get('group') || 'all';

  // Scroll to active group section on URL change
  useEffect(() => {
    if (activeGroup !== 'all') {
      const el = document.getElementById(`group-${activeGroup}`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, [activeGroup]);

  const setGroup = (g) => {
    setSearchParams(g === 'all' ? {} : { group: g });
  };

  const visibleGroups = activeGroup === 'all'
    ? GROUP_ORDER
    : GROUP_ORDER.filter((g) => g === activeGroup);

  return (
    <div className="products-page">
      <Helmet>
        <title>All Printing Services & Products | SAI MEERA DIGITAL DESIGN</title>
        <meta
          name="description"
          content="Explore our wide range of industrial, commercial, and personal printing products in Kumbakonam. Invitations, flex banners, business cards, and more."
        />
        <meta property="og:title" content="All Printing Services & Products | SAI MEERA DIGITAL DESIGN" />
        <meta property="og:description" content="Explore our wide range of industrial, commercial, and personal printing products in Kumbakonam." />
      </Helmet>

      {/* Hero */}
      <section className="products-hero kolam-hero-bg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div className="products-hero-label">
            // COMPLETE PRINT CATALOGUE
          </div>
          <h1 className="gold-shimmer">All Print Services</h1>
          <p>
            From sacred ceremonies to commercial signage — 29 categories of premium
            printing, all under one roof. Every print job handled with expertise and care.
          </p>

          {/* Group filter tabs */}
          <div className="products-filter-bar">
            <button
              className={`products-filter-btn ${activeGroup === 'all' ? 'active' : ''}`}
              onClick={() => setGroup('all')}
            >
              All Services
            </button>
            {GROUP_ORDER.map((gSlug) => (
              <button
                key={gSlug}
                className={`products-filter-btn ${activeGroup === gSlug ? 'active' : ''}`}
                onClick={() => setGroup(gSlug)}
              >
                {GROUPS[gSlug].label}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Catalogue grid */}
      <div className="products-catalogue">
        {visibleGroups.map((gSlug, gi) => {
          const group = GROUPS[gSlug];
          const cats = ALL_CATEGORIES.filter((c) => c.group === gSlug);
          return (
            <motion.div
              key={gSlug}
              id={`group-${gSlug}`}
              className="products-group"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-6%' }}
            >
              {/* Group header */}
              <motion.div className="products-group-header" variants={fadeUp}>
                <div className="products-group-left">
                  <div
                    className="products-group-accent-line"
                    style={{ color: group.accentColor }}
                  >
                    <div
                      className="products-group-dot"
                      style={{ background: group.accentColor }}
                    />
                    {group.slug.toUpperCase().replace('-', ' ')}
                  </div>
                  <h2 className="products-group-name">{group.label}</h2>
                  <p className="products-group-desc">{group.desc}</p>
                </div>
                <span className="products-group-view-all">
                  {cats.length} services →
                </span>
              </motion.div>

              {/* Cards */}
              <div className="products-cards-grid">
                {cats.map((cat) => (
                  <motion.div key={cat.slug} variants={fadeUp}>
                    <Link
                      to={`/products/${cat.slug}`}
                      className="products-cat-card"
                      data-tone={cat.tone}
                      style={{
                        '--card-accent': cat.accentColor,
                      }}
                    >
                      <div className="products-card-icon">
                        {CAT_ICONS[cat.slug] || '🖨️'}
                      </div>
                      <div className="products-card-name">{cat.name}</div>
                      <div className="products-card-desc">{cat.desc}</div>
                      <div className="products-card-arrow">View details →</div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Global CTA */}
      <div className="products-cta">
        <motion.div
          className="products-cta-inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>Not Sure What You Need?</h2>
          <p>
            Tell us about your requirement and we'll guide you to the right product
            and give you a free quote.
          </p>
          <Link to="/contact" className="products-cta-btn">
            Get a Free Quote →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
