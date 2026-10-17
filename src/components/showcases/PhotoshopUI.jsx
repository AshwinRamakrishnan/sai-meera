import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MousePointer2, Brush, Target, Printer, MonitorUp } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import './PhotoshopUI.css';

const PhotoshopUI = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const capabilities = [
    { title: 'Selection & Masking', icon: <MousePointer2 size={20} /> },
    { title: 'Retouching & Healing', icon: <Brush size={20} /> },
    { title: 'CMYK Color Separation', icon: <Target size={20} /> },
    { title: 'Print-Ready Bleed Setup', icon: <Printer size={20} /> },
    { title: 'ICC Profile Export', icon: <MonitorUp size={20} /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="ps-section" id="design-lab">
      <div className="ps-container" ref={ref}>
        
        <motion.div 
          className="ps-header"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="ps-label" variants={itemVariants}>
            Design Lab
          </motion.div>
          <motion.h2 className="ps-title" variants={itemVariants}>
            Where Ideas Take Form.
          </motion.h2>
        </motion.div>

        <motion.div 
          className="ps-tilt-wrapper"
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.15}
            glareColor="#ffffff"
            glarePosition="all"
            glareBorderRadius="8px"
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            scale={1.02}
            transitionSpeed={3000}
            perspective={2000}
          >
            <div className="ps-window">
              <div className="ps-menubar">
                <span className="ps-logo">Ps</span>
                <div className="menu-items">
                  <span>File</span>
                  <span>Edit</span>
                  <span>Image</span>
                  <span>Layer</span>
                  <span>Type</span>
                  <span>Select</span>
                  <span>Filter</span>
                </div>
              </div>
              <div className="ps-main">
                <div className="ps-toolbar">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`tool-icon ${i === 1 ? 'active' : ''}`}></div>
                  ))}
                </div>
                <div className="ps-workspace">
                  <div className="canvas">
                    <div className="canvas-gradient"></div>
                    <div className="canvas-wireframe"></div>
                  </div>
                </div>
                <div className="ps-panels">
                  <div className="panel-header">Layers</div>
                  <div className="layers-list">
                    <div className="layer-item active">
                      <div className="layer-eye"></div>
                      <div className="layer-thumb"></div>
                      <span>Color Correction</span>
                    </div>
                    <div className="layer-item">
                      <div className="layer-eye"></div>
                      <div className="layer-thumb"></div>
                      <span>Retouching Group</span>
                    </div>
                    <div className="layer-item">
                      <div className="layer-eye"></div>
                      <div className="layer-thumb"></div>
                      <span>Artwork Plate</span>
                    </div>
                    <div className="layer-item">
                      <div className="layer-eye"></div>
                      <div className="layer-thumb"></div>
                      <span>CMYK Background</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tilt>
        </motion.div>

        <motion.div 
          className="caps-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {capabilities.map((cap, index) => (
            <motion.div key={index} className="cap-card" variants={itemVariants}>
              <div className="cap-icon">{cap.icon}</div>
              <h4 className="cap-title">{cap.title}</h4>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default PhotoshopUI;
