import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Brush, Target, Printer, MonitorUp } from 'lucide-react';
import './PhotoshopUI.css';

const PhotoshopUI = () => {
  const capabilities = [
    { title: 'Selection & Masking', icon: <MousePointer2 size={24} /> },
    { title: 'Retouching & Healing', icon: <Brush size={24} /> },
    { title: 'CMYK Color Separation', icon: <Target size={24} /> },
    { title: 'Print-Ready Bleed Setup', icon: <Printer size={24} /> },
    { title: 'ICC Profile Export', icon: <MonitorUp size={24} /> }
  ];

  return (
    <section className="ps-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label">// DESIGN LAB</span>
          <h2 className="title">Where Ideas Take Form</h2>
        </motion.div>

        <motion.div 
          className="ps-ui-wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
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
                  <div key={i} className="tool-icon"></div>
                ))}
              </div>
              <div className="ps-workspace">
                <div className="canvas">
                  <div className="canvas-gradient"></div>
                </div>
              </div>
              <div className="ps-panels">
                <div className="panel-header">Layers</div>
                <div className="layers-list">
                  <div className="layer-item active">
                    <div className="layer-eye"></div>
                    <div className="layer-thumb"></div>
                    <span>Text Layer</span>
                  </div>
                  <div className="layer-item">
                    <div className="layer-eye"></div>
                    <div className="layer-thumb"></div>
                    <span>Effects</span>
                  </div>
                  <div className="layer-item">
                    <div className="layer-eye"></div>
                    <div className="layer-thumb"></div>
                    <span>Background Copy</span>
                  </div>
                  <div className="layer-item">
                    <div className="layer-eye"></div>
                    <div className="layer-thumb"></div>
                    <span>Background</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="caps-grid">
          {capabilities.map((cap, index) => (
            <motion.div 
              key={index} 
              className="cap-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="cap-icon">{cap.icon}</div>
              <h4 className="cap-title">{cap.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoshopUI;
