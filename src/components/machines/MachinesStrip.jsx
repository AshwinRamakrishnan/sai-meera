import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './MachinesStrip.css';
import imgFlex from '../../assets/machine_flex_printer.jpg';
import imgOffset from '../../assets/machine_offset_press.jpg';
import imgCutter from '../../assets/machine_paper_cutter.jpg';

const machines = [
  {
    num: '01',
    model: 'FX-3200 PRO',
    name: 'Large Format Eco-Solvent Flex Printer',
    specs: '3200 mm · 1440 DPI · 80 sqm/hr',
    anchor: '#flex-sec',
    img: imgFlex,
  },
  {
    num: '02',
    model: 'OS-SM74-6C',
    name: 'Industrial Offset Printing Press',
    specs: '6-Colour · 15K sheets/hr · Pantone',
    anchor: '#offset-sec',
    img: imgOffset,
  },
  {
    num: '03',
    model: 'HC-920-PRO',
    name: 'Hydraulic Guillotine Cutter',
    specs: '920 mm · ±0.1 mm · Hydraulic Drive',
    anchor: '#cutter-sec',
    img: imgCutter,
  },
];

const MachinesStrip = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section className="ms-section" id="machines-strip" ref={ref}>
      <div className="ms-container">
        <motion.div
          className="ms-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div>
            <span className="ms-eyebrow">OUR MACHINES</span>
            <h2 className="ms-heading">
              Precision Engineering.<br />Interactive 3D Showcase.
            </h2>
          </div>
          <p className="ms-subtext">Scroll down to interact with our industrial machines in full 3D.</p>
        </motion.div>
        <div className="ms-cards">
          {machines.map((m, i) => (
            <motion.a
              key={m.num}
              href={m.anchor}
              className="ms-card"
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="ms-card-img-wrap">
                <img src={m.img} alt={m.name} className="ms-card-img" />
                <div className="ms-card-img-overlay" />
                <span className="ms-card-num">{m.num}</span>
              </div>
              <div className="ms-card-body">
                <span className="ms-card-model">{m.model}</span>
                <p className="ms-card-name">{m.name}</p>
                <p className="ms-card-specs">{m.specs}</p>
                <span className="ms-card-explore">VIEW IN 3D →</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MachinesStrip;
