import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './MachinesStrip.css';

const machines = [
  {
    num: '01',
    model: 'FX-3200 PRO',
    name: 'Large Format Eco-Solvent Flex Printer',
    specs: '3200mm | 1440 DPI | 80 sqm/hr',
    anchor: '#flex-sec',
    img: '/src/assets/machine_flex_printer.jpg'
  },
  {
    num: '02',
    model: 'OS-SM74-6C',
    name: 'Industrial Offset Printing Machine',
    specs: '6 Color | 15K sheets/hr | Pantone',
    anchor: '#offset-sec',
    img: '/src/assets/machine_offset_press.jpg'
  },
  {
    num: '03',
    model: 'SM-HC130',
    name: 'Hydraulic Paper Cutting Machine',
    specs: '920mm | Hydraulic | Precise Cut',
    anchor: '#cutter-sec',
    img: '/src/assets/machine_paper_cutter.jpg'
  },
  {
    num: '04',
    model: 'PS-EDIT PRO',
    name: 'Photoshop Editing Workstation',
    specs: 'Dual Monitor | Color Accurate',
    anchor: '#ps-sec',
    img: '/src/assets/machine_workstation.jpg'
  }
];

const MachinesStrip = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="machines-strip" id="machines-strip">
      <div className="ms-container" ref={ref}>

        {/* Header row */}
        <motion.div
          className="ms-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="ms-header-left">
            <span className="ms-gold-label">OUR MACHINES</span>
            <h2 className="ms-heading">
              Powering Precision.<br />Delivering Excellence.
            </h2>
          </div>
          <a href="#offset-sec" className="ms-view-all">VIEW ALL MACHINES →</a>
        </motion.div>

        {/* Cards row */}
        <motion.div
          className="ms-cards"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
        >
          {machines.map((m) => (
            <motion.a
              key={m.num}
              href={m.anchor}
              className="ms-card"
              variants={fadeUp}
            >
              <div className="ms-card-img-wrap">
                {/* TODO: Replace with real machine thumbnail photos from client */}
                <img src={m.img} alt={m.name} className="ms-card-img" />
                <div className="ms-card-img-overlay" />
              </div>
              <div className="ms-card-body">
                <span className="ms-card-num">{m.num}</span>
                <span className="ms-card-model">{m.model}</span>
                <p className="ms-card-name">{m.name}</p>
                <p className="ms-card-specs">{m.specs}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default MachinesStrip;
