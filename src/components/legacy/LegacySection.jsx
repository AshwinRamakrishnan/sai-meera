import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './LegacySection.css';
import legacyImg from '../../assets/legacy_workshop.jpg';
import inkRollers from '../../assets/printing_ink_rollers.jpg';

const LegacySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });

  const fade = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="legacy-section" id="legacy" ref={ref}>

      {/* Full-bleed background texture */}
      <div className="legacy-texture"
           style={{ backgroundImage: `url(${inkRollers})` }} />
      <div className="legacy-texture-overlay" />

      <div className="legacy-container">
        {/* Left: archival photo */}
        <motion.div
          className="legacy-photo-col"
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="legacy-photo"
               style={{ backgroundImage: `url(${legacyImg})` }}>
            <div className="legacy-photo-overlay" />
            <div className="legacy-photo-badge">
              <span className="lpb-num">1962</span>
              <span className="lpb-label">Founded</span>
            </div>
          </div>
        </motion.div>

        {/* Right: text */}
        <motion.div
          className="legacy-text-col"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
        >
          <motion.span className="legacy-eyebrow" variants={fade}>
            OUR LEGACY
          </motion.span>
          <motion.h2 className="legacy-heading" variants={fade}>
            Crafted Across<br />Generations.
          </motion.h2>
          <motion.p className="legacy-body" variants={fade}>
            For over six decades, Sai Meera has blended traditional craftsmanship
            with modern technology to produce exceptional print that stands the test
            of time. Through three generations of ownership, one name — and one
            standard of quality — has endured.
          </motion.p>

          <motion.div className="legacy-pillars" variants={fade}>
            <div className="legacy-pillar">
              <div className="lp-rule" />
              <div className="lp-title">TIMELESS EXPERIENCE</div>
              <div className="lp-desc">Decades of hands-on expertise and dedication to craft.</div>
            </div>
            <div className="legacy-pillar">
              <div className="lp-rule" />
              <div className="lp-title">MODERN TECHNOLOGY</div>
              <div className="lp-desc">Advanced machines for precision, clarity and consistency.</div>
            </div>
            <div className="legacy-pillar">
              <div className="lp-rule" />
              <div className="lp-title">UNCOMPROMISED QUALITY</div>
              <div className="lp-desc">Every detail inspected. Every piece printed with pride.</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LegacySection;
