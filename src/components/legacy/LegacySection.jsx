import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Cpu, Star } from 'lucide-react';
import './LegacySection.css';

const features = [
  {
    icon: <Award size={18} />,
    label: 'TIMELESS EXPERIENCE',
    desc: 'Built on decades of hands-on expertise and dedication.'
  },
  {
    icon: <Cpu size={18} />,
    label: 'MODERN TECHNOLOGY',
    desc: 'Advanced machines for precision, clarity and consistency.'
  },
  {
    icon: <Star size={18} />,
    label: 'UNCOMPROMISED QUALITY',
    desc: 'Every detail inspected. Every piece printed with pride.'
  }
];

const LegacySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  };

  return (
    <section className="legacy-section" id="legacy">
      <div className="legacy-container" ref={ref}>
        <div className="legacy-grid">

          {/* Col 1: Archival Photo */}
          <motion.div
            className="legacy-photo-col"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* TODO: Replace with real archival B&W workshop photograph from client */}
            <div
              className="legacy-photo"
              style={{ backgroundImage: 'url("/images/legacy_workshop.jpg")' }}
            >
              <div className="legacy-photo-overlay" />
              <p className="legacy-photo-caption"><em>Our beginning. Our foundation.</em></p>
            </div>
          </motion.div>

          {/* Col 2: Story Text */}
          <motion.div
            className="legacy-text-col"
            variants={stagger}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.span className="legacy-gold-label" variants={fadeUp}>OUR LEGACY</motion.span>
            <motion.h2 className="legacy-heading" variants={fadeUp}>
              Crafted Across Generations.
            </motion.h2>
            <motion.p className="legacy-body" variants={fadeUp}>
              For over six decades, Sai Meera has blended traditional craftsmanship with modern technology to produce exceptional print that stands the test of time. Through three generations of ownership, one name — and one standard of quality — has endured.
            </motion.p>
            <motion.a href="#legacy" className="legacy-read-more" variants={fadeUp}>
              READ OUR STORY →
            </motion.a>
          </motion.div>

          {/* Col 3: Feature Items */}
          <motion.div
            className="legacy-features-col"
            variants={stagger}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {features.map((feat, i) => (
              <motion.div key={i} className="legacy-feature-item" variants={fadeUp}>
                <div className="legacy-feature-icon">{feat.icon}</div>
                <div>
                  <div className="legacy-feature-label">{feat.label}</div>
                  <div className="legacy-feature-desc">{feat.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default LegacySection;
