import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './LegacySection.css';
import legacyImg from '../../assets/legacy_workshop.jpg';
import inkRollers from '../../assets/printing_ink_rollers.jpg';

const LegacySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });

  // Editorial motion variants
  const photoColVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const photoRevealVariants = {
    hidden: {
      opacity: 0,
      clipPath: 'inset(6% 0% 6% 0%)',
      scale: 1.04,
    },
    visible: {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
      scale: 1,
      transition: {
        duration: 1.25,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.88, y: 14 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.65,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const textColVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const fade = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const pillarsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.3,
      },
    },
  };

  const pillarItemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="legacy-section" id="legacy" ref={ref}>

      {/* Full-bleed background texture */}
      <div
        className="legacy-texture"
        style={{ backgroundImage: `url(${inkRollers})` }}
        aria-hidden="true"
      />
      <div className="legacy-texture-overlay" aria-hidden="true" />

      <div className="legacy-container">
        {/* Left: Archival living photo column */}
        <motion.div
          className="legacy-photo-col"
          variants={photoColVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="legacy-photo-frame">
            {/* 4 Delicate Archival Gold Corner Brackets */}
            <div className="legacy-corner-bracket legacy-corner-tl" aria-hidden="true" />
            <div className="legacy-corner-bracket legacy-corner-tr" aria-hidden="true" />
            <div className="legacy-corner-bracket legacy-corner-bl" aria-hidden="true" />
            <div className="legacy-corner-bracket legacy-corner-br" aria-hidden="true" />

            {/* Archival Hairline Inner Border */}
            <div className="legacy-frame-border" aria-hidden="true" />

            {/* Archival Photograph with clip-path reveal and specular shimmer */}
            <motion.div
              className="legacy-photo"
              style={{ backgroundImage: `url(${legacyImg})` }}
              variants={photoRevealVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <div className="legacy-photo-overlay" aria-hidden="true" />

              {/* Slow subtle gold specular light sweep */}
              <div className="legacy-photo-shimmer" aria-hidden="true" />

              {/* 1962 Founded Badge with restrained entrance */}
              <motion.div
                className="legacy-photo-badge"
                variants={badgeVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                <span className="lpb-num">1962</span>
                <span className="lpb-label">Founded</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right: Editorial story & quality pillars */}
        <motion.div
          className="legacy-text-col"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={textColVariants}
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

          {/* Three Quality Pillars with connecting gold accent line */}
          <motion.div
            className="legacy-pillars"
            variants={pillarsContainerVariants}
          >
            {/* Pillar 1 */}
            <motion.div className="legacy-pillar" variants={pillarItemVariants}>
              <div className="lp-indicator" aria-hidden="true">
                <span className="lp-pip" />
                <div className="lp-rule" />
              </div>
              <div className="lp-title">TIMELESS EXPERIENCE</div>
              <div className="lp-desc">Decades of hands-on expertise and dedication to craft.</div>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div className="legacy-pillar" variants={pillarItemVariants}>
              <div className="lp-indicator" aria-hidden="true">
                <span className="lp-pip" />
                <div className="lp-rule" />
              </div>
              <div className="lp-title">MODERN TECHNOLOGY</div>
              <div className="lp-desc">Advanced machines for precision, clarity and consistency.</div>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div className="legacy-pillar" variants={pillarItemVariants}>
              <div className="lp-indicator" aria-hidden="true">
                <span className="lp-pip" />
                <div className="lp-rule" />
              </div>
              <div className="lp-title">UNCOMPROMISED QUALITY</div>
              <div className="lp-desc">Every detail inspected. Every piece printed with pride.</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LegacySection;
