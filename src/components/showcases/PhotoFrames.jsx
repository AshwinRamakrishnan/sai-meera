import React from 'react';
import { motion } from 'framer-motion';
import './PhotoFrames.css';

const PhotoFrames = () => {
  const frames = [
    { name: 'Canvas Print', color: '#ff6a00' },
    { name: 'Crystal Acrylic', color: '#00d4ff' },
    { name: 'Aluminium Frame', color: '#a0a0a0' },
    { name: 'Fine Art Print', color: '#f5a623' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section className="frames-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label">// PRODUCTS</span>
          <h2 className="title">Premium Photo Frames</h2>
        </motion.div>

        <motion.div 
          className="frames-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {frames.map((frame, index) => (
            <motion.div 
              key={index} 
              className="frame-card"
              variants={itemVariants}
              style={{ '--frame-color': frame.color }}
            >
              <div className="frame-preview">
                <div className="frame-gradient"></div>
              </div>
              <h4 className="frame-name">{frame.name}</h4>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PhotoFrames;
