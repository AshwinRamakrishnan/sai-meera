import React from 'react';
import { motion } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import HeroParticles from './HeroParticles';
import './HeroSection.css';

const HeroSection = () => {
  const stats = [
    { value: '1962', label: 'Founded' },
    { value: '60+', label: 'Years Legacy' },
    { value: '3.2m', label: 'Print Width' },
    { value: '1440', label: 'DPI Precision' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 1, ease: 'easeOut', delay: 0.6 }
    }
  };

  return (
    <section className="hero-section">
      <BackgroundGrid />
      <HeroParticles />
      
      <div className="hero-content-wrapper">
        <motion.div 
          className="hero-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-label" variants={itemVariants}>
            // INDUSTRIAL PRINTING EXCELLENCE
          </motion.div>
          
          <motion.h1 className="hero-heading" variants={itemVariants}>
            <span className="hero-heading-line1">Sai Meera</span>
            <span className="hero-heading-line2">Legacy Printing</span>
          </motion.h1>
          
          <motion.p className="hero-description" variants={itemVariants}>
            A 60+ year industrial printing institution built on heritage, craftsmanship, and cinematic precision. From traditional offset to large-format flex — every machine tells a story.
          </motion.p>
          
          <motion.div className="hero-cta-group" variants={itemVariants}>
            <button className="hero-btn hero-btn-outline">Explore Legacy</button>
            <button className="hero-btn hero-btn-filled">Launch Production</button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-right"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-stats-card">
            <div className="hero-stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat-item">
                  <div className="hero-stat-value">{stat.value}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
