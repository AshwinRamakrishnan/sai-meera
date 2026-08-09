import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Cog, Leaf, Package } from 'lucide-react';
import './TrustQuality.css';
import inkImg from '../../assets/printing_ink_rollers.jpg';

const pillars = [
  {
    icon: <Clock size={22} />,
    title: '60+ Years in Business',
    desc: 'Three generations of printing experience. Every machine, every process, every print refined over decades.',
  },
  {
    icon: <Cog size={22} />,
    title: 'In-House Production',
    desc: 'From design preparation to cutting and finishing, every step happens under one roof — no outsourcing.',
  },
  {
    icon: <Leaf size={22} />,
    title: 'Eco-Solvent Inks',
    desc: 'Our large-format press uses eco-solvent inks — lower VOC emissions and UV-resistant outdoor durability.',
  },
  {
    icon: <Package size={22} />,
    title: 'Offset to Large Format',
    desc: 'Whether it is 100 business cards or a 3.2m hoarding, we have the press, process and precision to deliver.',
  },
];

const TrustQuality = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section className="tq-section" id="trust-quality" ref={ref}>
      <div className="tq-bg" style={{ backgroundImage: `url(${inkImg})` }} />
      <div className="tq-bg-overlay" />
      <div className="tq-container">
        <motion.div
          className="tq-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="tq-eyebrow">WHY CHOOSE SAI MEERA</span>
          <h2 className="tq-heading">Built on Craft.<br />Delivered with Pride.</h2>
        </motion.div>
        <div className="tq-grid">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              className="tq-pillar"
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="tq-icon">{p.icon}</div>
              <h3 className="tq-title">{p.title}</h3>
              <p className="tq-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustQuality;
