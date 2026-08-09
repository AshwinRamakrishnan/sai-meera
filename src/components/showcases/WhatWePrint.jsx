import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import './WhatWePrint.css';

const categories = [
  {
    num: '01',
    title: 'INVITATIONS & CEREMONIES',
    desc: 'Wedding, Nikah, Engagement & Custom Invitations',
    link: '/category/wedding-invitations'
  },
  {
    num: '02',
    title: 'CORPORATE PRINTING',
    desc: 'Business Cards, Stationery, Brochures & Marketing Collateral',
    link: '/category/business-cards'
  },
  {
    num: '03',
    title: 'LARGE FORMAT PRINTING',
    desc: 'Flex Banners, Posters, Hoardings & Outdoor Advertising',
    link: '/category/flex-banners'
  },
  {
    num: '04',
    title: 'INDUSTRIAL PRINTING',
    desc: 'Offset, Commercial & Bulk Production Solutions',
    link: '/products'
  }
];

const WhatWePrint = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="wwp-section" id="what-we-print">
      <div className="wwp-container" ref={ref}>

        {/* Header row */}
        <motion.div
          className="wwp-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="wwp-header-left">
            <span className="wwp-gold-label">WHAT WE PRINT</span>
            <h2 className="wwp-heading">Solutions for Every Printing Need.</h2>
          </div>
          <Link to="/products" className="wwp-explore-link">EXPLORE SERVICES →</Link>
        </motion.div>

        {/* Hairline divider */}
        <div className="wwp-rule" />

        {/* 4 columns */}
        <motion.div
          className="wwp-grid"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
        >
          {categories.map((cat) => (
            <motion.div key={cat.num} className="wwp-col" variants={fadeUp}>
              <span className="wwp-col-num">{cat.num}</span>
              <div className="wwp-col-rule" />
              <Link to={cat.link} className="wwp-col-title">{cat.title}</Link>
              <p className="wwp-col-desc">{cat.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default WhatWePrint;
