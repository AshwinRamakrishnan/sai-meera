import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import './WhatWePrint.css';
import imgInvite from '../../assets/gallery_invitations.jpg';
import imgCorporate from '../../assets/gallery_business_cards.png';
import imgFlex from '../../assets/gallery_flex_banner.png';
import imgOffset from '../../assets/machine_offset_press.jpg';

const categories = [
  {
    num: '01',
    title: 'Invitations & Ceremonies',
    desc: 'Wedding cards, Nikah invitations, engagement and custom ceremonial prints crafted with care.',
    link: '/category/wedding-invitations',
    img: imgInvite,
  },
  {
    num: '02',
    title: 'Corporate Printing',
    desc: 'Business cards, stationery, brochures and marketing collateral built to represent your brand.',
    link: '/category/business-cards',
    img: imgCorporate,
  },
  {
    num: '03',
    title: 'Large Format',
    desc: 'Eco-solvent flex banners, hoardings, posters and outdoor advertising at 1440 DPI clarity.',
    link: '/category/flex-banners',
    img: imgFlex,
  },
  {
    num: '04',
    title: 'Offset & Industrial',
    desc: 'High-speed offset production at 15,000 sheets per hour for bulk and commercial requirements.',
    link: '/products',
    img: imgOffset,
  },
];

const WhatWePrint = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section className="wwp-section" id="what-we-print" ref={ref}>
      <div className="wwp-container">
        {/* Header */}
        <motion.div
          className="wwp-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="wwp-eyebrow">WHAT WE PRINT</span>
            <h2 className="wwp-heading">Solutions for Every<br />Printing Need.</h2>
          </div>
          <Link to="/products" className="wwp-explore-link">EXPLORE ALL SERVICES →</Link>
        </motion.div>

        {/* Gold rule */}
        <div className="wwp-rule" />

        {/* 4 category tiles */}
        <div className="wwp-grid">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.num}
              className="wwp-tile"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={cat.link} className="wwp-tile-link">
                <div className="wwp-tile-img-wrap">
                  <img src={cat.img} alt={cat.title} className="wwp-tile-img" />
                  <div className="wwp-tile-img-overlay" />
                </div>
                <div className="wwp-tile-body">
                  <span className="wwp-tile-num">{cat.num}</span>
                  <h3 className="wwp-tile-title">{cat.title}</h3>
                  <p className="wwp-tile-desc">{cat.desc}</p>
                  <span className="wwp-tile-cta">VIEW MORE →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWePrint;
