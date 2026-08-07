import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Layers, MonitorPlay, Clock } from 'lucide-react';
import './FlexBanner.css';

const FlexBanner = () => {
  const specs = [
    { title: 'Eco-Solvent Ink', desc: 'Vibrant, long-lasting colors', icon: <Droplet size={20} /> },
    { title: 'PVC Flex Media', desc: 'Durable weather-resistant', icon: <Layers size={20} /> },
    { title: '4K Resolution', desc: 'Ultra-sharp print quality', icon: <MonitorPlay size={20} /> },
    { title: 'Same-Day Service', desc: 'Rapid turnaround times', icon: <Clock size={20} /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section className="banner-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label">// OUTPUT SHOWCASE</span>
          <h2 className="title">Your Design, Perfectly Printed</h2>
        </motion.div>

        <motion.div 
          className="banner-preview-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="banner-preview">
            <div className="scanline"></div>
            <div className="banner-content">
              <h3 className="banner-main-text">GRAND OPENING</h3>
              <p className="banner-sub-text">★ MEGA EVENT ★</p>
            </div>
            <div className="cmyk-bar">
              <div className="cmyk-c"></div>
              <div className="cmyk-m"></div>
              <div className="cmyk-y"></div>
              <div className="cmyk-k"></div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="specs-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {specs.map((spec, index) => (
            <motion.div 
              key={index} 
              className="spec-card"
              variants={itemVariants}
            >
              <div className="spec-icon">
                {spec.icon}
              </div>
              <div className="spec-info">
                <h4>{spec.title}</h4>
                <p>{spec.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FlexBanner;
