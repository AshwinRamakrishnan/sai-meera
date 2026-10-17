import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Sparkles } from 'lucide-react';
import plateImg from '../../assets/offset_printing_plates.jpg';
import './CtaBanner.css';

const CtaBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section className="cta-banner" id="cta-banner" ref={ref}>
      {/* Authentic Printing Plates Texture Overlay */}
      <div
        className={`cta-banner-bg-img ${isInView ? 'is-active' : ''}`}
        style={{ backgroundImage: `url(${plateImg})` }}
        aria-hidden="true"
      />

      {/* Atmospheric Vignette & Purple-Gold Radial Glow */}
      <div className="cta-banner-glow" aria-hidden="true" />
      <div className="cta-banner-overlay" aria-hidden="true" />

      {/* Moving Golden Border Beam */}
      <div className={`cta-border-sweep ${isInView ? 'is-active' : ''}`} aria-hidden="true" />

      <div className="cta-banner-inner">
        {/* Left Editorial Copy */}
        <div className="cta-banner-left">
          <motion.div
            className="cta-banner-eyebrow-wrap"
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="cta-eyebrow-dash" aria-hidden="true" />
            <span className="cta-banner-eyebrow">READY TO PRINT?</span>
            <Sparkles size={12} className="cta-eyebrow-sparkle" aria-hidden="true" />
          </motion.div>

          <motion.h2
            className="cta-banner-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            Have a Project <span className="cta-heading-accent">in Mind?</span>
          </motion.h2>

          <motion.p
            className="cta-banner-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            Let's bring your ideas to life — from a single business card to a 3.2m hoarding.
            Crafted with over six decades of precision engineering.
          </motion.p>
        </div>

        {/* Right CTA Actions */}
        <motion.div
          className="cta-banner-right"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/contact" className="cta-banner-btn magnetic">
            <span className="cta-btn-shimmer" aria-hidden="true" />
            <span className="cta-btn-text">GET A FREE QUOTE</span>
            <ArrowRight size={16} className="cta-btn-icon" strokeWidth={2.4} />
          </Link>

          <a href="tel:+919597072660" className="cta-banner-phone">
            <Phone size={13} className="cta-phone-icon" />
            <span>OR CALL US DIRECTLY: +91 95970 72660</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaBanner;
