import React, { useRef, useEffect } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import './LegacySection.css';

import { animate } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 3, delay = 0, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        animate(0, value, {
          duration: duration,
          ease: "easeOut",
          onUpdate: (latest) => setDisplayValue(latest)
        });
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, duration, delay]);

  const formattedValue = React.useMemo(() => {
    return Math.round(displayValue) + suffix;
  }, [displayValue, suffix]);

  return <motion.span ref={ref}>{formattedValue}</motion.span>;
};

const LegacySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="legacy-section" id="legacy">
      <div className="legacy-container" ref={ref}>
        <motion.div 
          className="legacy-header"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
        >
          <span className="legacy-label">Our Story</span>
          <h2 className="legacy-title">A Legacy Built Through Machines & Generations</h2>
        </motion.div>

        <motion.div 
          className="legacy-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Main Story Card */}
          <motion.div className="legacy-split-card" variants={itemVariants}>
            <div className="legacy-split-image" style={{ backgroundImage: 'url("/src/assets/printing_ink_rollers.jpg")' }} />
            <div className="legacy-split-content">
              <h3 className="bento-title">The Name That Never Changed</h3>
              <p className="bento-text">
                Through three different ownerships spanning religious and cultural lines — from its Christian founder, to a Muslim custodian, to its current Hindu proprietor — the name 'Sai Meera' has endured. It's not just a brand; it's a testament to the trust each owner placed in the legacy of the machines and the community they served.
              </p>
            </div>
          </motion.div>

          {/* Faith System Card */}
          <motion.div className="legacy-split-card reverse" variants={itemVariants}>
            <div className="legacy-split-image" style={{ backgroundImage: 'url("/src/assets/offset_printing_plates.jpg")' }} />
            <div className="legacy-split-content">
              <h3 className="bento-title">Universal Trust</h3>
              <p className="bento-text">
                We operate under the philosophy that true craftsmanship transcends boundaries. Our shop floor has seen prayers from multiple faiths, all united by a singular dedication to the art of printing.
              </p>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div className="legacy-bento-card bento-stats" variants={itemVariants}>
            <div className="bento-stat-wrapper">
              <div className="big-stat-val">
                <AnimatedCounter value={3} duration={2} />
              </div>
              <div className="big-stat-label">Different Ownership Eras</div>
            </div>
            <div className="bento-stat-wrapper" style={{ marginTop: '2rem' }}>
              <div className="big-stat-val" style={{ background: 'linear-gradient(135deg, var(--cyan) 0%, #00d4ff 100%)', WebkitBackgroundClip: 'text' }}>
                <AnimatedCounter value={100} duration={2} suffix="%" />
              </div>
              <div className="big-stat-label">Name Retention</div>
            </div>
          </motion.div>

          {/* Timeline Card */}
          <motion.div className="legacy-bento-card bento-timeline" variants={itemVariants}>
            <h3 className="bento-title">Era Milestones</h3>
            <div className="timeline-list">
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <h4>1962 — Foundation</h4>
                  <p>Established by our Christian founder with a single manual offset press.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <h4>1985 — Custodianship</h4>
                  <p>A Muslim proprietor takes over, expanding into continuous stationery.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <h4>2000s — Modernization</h4>
                  <p>Current Hindu proprietor acquires Sai Meera, introducing large-format digital flex printing while preserving the original offset machines.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LegacySection;
