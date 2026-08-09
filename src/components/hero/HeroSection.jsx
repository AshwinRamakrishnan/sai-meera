import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-grid">
        {/* Left: Text Content */}
        <motion.div
          className="hero-text-col"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* EST. 1962 label */}
          <motion.div className="hero-est-label" variants={itemVariants}>
            <span className="hero-est-rule" />
            EST. 1962
          </motion.div>

          {/* Two-tone headline */}
          <motion.h1 className="hero-heading" variants={itemVariants}>
            <span className="hero-heading-white">PRINTING THAT</span>
            <span className="hero-heading-gold">LEAVES A MARK.</span>
          </motion.h1>

          {/* Description */}
          <motion.p className="hero-description" variants={itemVariants}>
            From premium invitations to large-format industrial production — precision printed for businesses, brands and celebrations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div className="hero-cta-row" variants={itemVariants}>
            <a href="#machines-strip" className="hero-btn-primary">
              EXPLORE OUR WORK <span className="hero-btn-arrow">→</span>
            </a>
            <Link to="/contact" className="hero-btn-outline">
              GET A QUOTE
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div className="hero-stats-strip" variants={itemVariants}>
            <span className="hero-stat">EST. 1962</span>
            <span className="hero-stat-dot">•</span>
            <span className="hero-stat">60+ YEARS OF CRAFT</span>
            <span className="hero-stat-dot">•</span>
            <span className="hero-stat">3.2M PRINT WIDTH</span>
            <span className="hero-stat-dot">•</span>
            <span className="hero-stat">1440 DPI PRECISION</span>
          </motion.div>
        </motion.div>

        {/* Right: Machine Image */}
        <motion.div
          className="hero-image-col"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          {/* TODO: Replace with high-res client-supplied flex printer / offset press photo */}
          <img
            src="/images/hero_printing_press.jpg"
            alt="Industrial offset printing press at Sai Meera"
            className="hero-machine-img"
          />
          <div className="hero-image-fade" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
