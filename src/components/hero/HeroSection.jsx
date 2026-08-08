import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import BackgroundGrid from './BackgroundGrid';
import HeroParticles from './HeroParticles';
import { FaArrowRight } from 'react-icons/fa';
import './HeroSection.css';

const AnimatedCounter = ({ value, duration = 3, delay = 1, decimals = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const displayValue = useTransform(spring, (current) => 
    current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        spring.set(value);
      }, delay * 1000);
    }
  }, [isInView, spring, value, delay]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const stats = [
    { value: 1962, suffix: '', label: 'Founded' },
    { value: 60, suffix: '+', label: 'Years Legacy' },
    { value: 3.2, suffix: 'm', label: 'Print Width', decimals: 1 },
    { value: 1440, suffix: '', label: 'DPI Precision' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const textRevealVariants = {
    hidden: { opacity: 0, y: 50, rotateX: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } // Apple-style spring
    }
  };

  return (
    <section className="hero-section">
      <BackgroundGrid />
      <HeroParticles />
      
      {/* Subtle Aurora Glow */}
      <div className="hero-glow hero-glow-cyan" />
      <div className="hero-glow hero-glow-gold" />
      
      <motion.div 
        className="hero-content-wrapper"
        style={{ y: y1, opacity }}
      >
        <motion.div 
          className="hero-main-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-label-pill" variants={textRevealVariants}>
            <span className="pulse-dot" /> INDUSTRIAL PRINTING EXCELLENCE
          </motion.div>
          
          <div className="hero-heading-container">
            <motion.h1 className="hero-heading" variants={textRevealVariants}>
              Sai Meera
            </motion.h1>
            <motion.h1 className="hero-heading hero-heading-accent" variants={textRevealVariants}>
              Legacy Printing.
            </motion.h1>
          </div>
          
          <motion.p className="hero-description" variants={textRevealVariants}>
            A 60+ year industrial printing institution built on heritage, craftsmanship, and cinematic precision. From traditional offset to large-format flex — every machine tells a story.
          </motion.p>
          
          <motion.div className="hero-cta-group" variants={textRevealVariants}>
            <a href="#machines" className="hero-btn-primary magnetic">
              Launch Production <FaArrowRight size={20} />
            </a>
            <a href="#legacy" className="hero-btn-secondary magnetic">
              Explore Legacy
            </a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-stats-wrapper"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-stats-glass-card">
            <div className="hero-stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat-item">
                  <div className="hero-stat-value">
                    <AnimatedCounter 
                      value={stat.value} 
                      duration={3} 
                      delay={1}
                      decimals={stat.decimals || 0}
                    />
                    {stat.suffix}
                  </div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
