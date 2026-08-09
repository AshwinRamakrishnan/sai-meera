import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  MousePointer2, Brush, Target, Printer, MonitorUp
} from 'lucide-react';
import './DesignLab.css';

const capabilities = [
  { icon: <MousePointer2 size={16} />, label: 'Selection & Masking' },
  { icon: <Brush size={16} />,         label: 'Retouching & Healing' },
  { icon: <Target size={16} />,        label: 'CMYK Color Separation' },
  { icon: <Printer size={16} />,       label: 'Print-Ready Bleed Setup' },
  { icon: <MonitorUp size={16} />,     label: 'ICC Profile Export' },
];

const DesignLab = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  return (
    <section className="dl-section" id="design-lab">
      <div className="dl-container" ref={ref}>

        {/* Col 1: Text */}
        <motion.div
          className="dl-text-col"
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.span className="dl-gold-label" variants={fadeUp}>DESIGN LAB</motion.span>
          <motion.h2 className="dl-heading" variants={fadeUp}>
            Where Ideas<br />Take Form.
          </motion.h2>
          <motion.p className="dl-body" variants={fadeUp}>
            From concept to print-ready artwork, our design lab ensures perfect colour, clarity and precision at every step.
          </motion.p>
          <motion.a href="/contact" className="dl-link" variants={fadeUp}>
            EXPLORE DESIGN LAB →
          </motion.a>
        </motion.div>

        {/* Col 2: Workstation Image */}
        <motion.div
          className="dl-image-col"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {/* TODO: Replace with client's real studio/workstation photo */}
          <img
            src="/src/assets/offset_printing_plates.jpg"
            alt="Design workstation at Sai Meera"
            className="dl-image"
          />
        </motion.div>

        {/* Col 3: Capabilities list */}
        <motion.div
          className="dl-caps-col"
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {capabilities.map((cap, i) => (
            <motion.div key={i} className="dl-cap-item" variants={fadeUp}>
              <span className="dl-cap-icon">{cap.icon}</span>
              <span className="dl-cap-label">{cap.label}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default DesignLab;
