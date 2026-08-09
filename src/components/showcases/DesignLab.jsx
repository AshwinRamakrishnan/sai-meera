import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Monitor, Layers, Printer, Target, Palette } from 'lucide-react';
import './DesignLab.css';
import designLabImg from '../../assets/design_lab_setup.png';

const capabilities = [
  { icon: <Monitor size={16} />,  label: 'Dual-screen colour-accurate workspace' },
  { icon: <Layers size={16} />,   label: 'CMYK separation & ICC profile export' },
  { icon: <Target size={16} />,   label: 'Print-ready bleed & margin setup' },
  { icon: <Printer size={16} />,  label: 'File preparation for offset & flex' },
  { icon: <Palette size={16} />,  label: 'Pantone matching & spot-colour design' },
];

const DesignLab = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });
  const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } } };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

  return (
    <section className="dl-section" id="design-lab" ref={ref}>
      <div className="dl-container">
        <motion.div
          className="dl-image-col"
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={designLabImg} alt="Sai Meera professional design workstation" className="dl-image" />
          <div className="dl-image-caption">In-house Design Lab · Colour Calibrated</div>
        </motion.div>
        <motion.div className="dl-text-col" variants={stagger} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <motion.span className="dl-eyebrow" variants={fade}>DESIGN LAB</motion.span>
          <motion.h2 className="dl-heading" variants={fade}>Where Ideas<br />Take Form.</motion.h2>
          <motion.p className="dl-body" variants={fade}>
            From concept to print-ready artwork, our in-house design lab ensures perfect colour, clarity and precision at every step — before a single sheet touches the press.
          </motion.p>
          <motion.ul className="dl-caps" variants={fade}>
            {capabilities.map((cap, i) => (
              <li key={i} className="dl-cap-item">
                <span className="dl-cap-icon">{cap.icon}</span>
                <span className="dl-cap-label">{cap.label}</span>
              </li>
            ))}
          </motion.ul>
          <motion.a href="/contact" className="dl-link" variants={fade}>TALK TO OUR DESIGN TEAM →</motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default DesignLab;
