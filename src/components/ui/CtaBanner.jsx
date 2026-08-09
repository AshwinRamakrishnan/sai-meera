import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './CtaBanner.css';

const CtaBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });
  return (
    <section className="cta-banner" id="cta-banner" ref={ref}>
      <div className="cta-banner-bg" />
      <motion.div
        className="cta-banner-inner"
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="cta-banner-left">
          <span className="cta-banner-eyebrow">READY TO PRINT?</span>
          <h2 className="cta-banner-heading">Have a Project in Mind?</h2>
          <p className="cta-banner-sub">
            Let's bring your ideas to life — from a single business card to a 3.2m hoarding.
          </p>
        </div>
        <div className="cta-banner-right">
          <Link to="/contact" className="cta-banner-btn">GET A FREE QUOTE →</Link>
          <a href="tel:+919876543210" className="cta-banner-phone">OR CALL US DIRECTLY</a>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaBanner;
