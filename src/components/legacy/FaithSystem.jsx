import React from 'react';
import { motion } from 'framer-motion';
import { Cross, Moon, Flower2 } from 'lucide-react';
import './FaithSystem.css';

const FaithSystem = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const lineVariants = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: { opacity: 1, scaleX: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="faith-system-wrapper">
      <motion.div 
        className="faith-system"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="faith-card faith-christian" variants={cardVariants}>
          <div className="faith-icon-wrapper">
            <Cross size={24} className="faith-icon" />
          </div>
          <h4 className="faith-title">Christian Origin</h4>
          <p className="faith-subtitle">Founded the press with vision and faith</p>
        </motion.div>

        <motion.div className="faith-connector" variants={lineVariants}></motion.div>

        <motion.div className="faith-card faith-muslim" variants={cardVariants}>
          <div className="faith-icon-wrapper">
            <Moon size={24} className="faith-icon" />
          </div>
          <h4 className="faith-title">Muslim Preservation</h4>
          <p className="faith-subtitle">Maintained and grew the legacy</p>
        </motion.div>

        <motion.div className="faith-connector" variants={lineVariants}></motion.div>

        <motion.div className="faith-card faith-hindu" variants={cardVariants}>
          <div className="faith-icon-wrapper">
            <span className="faith-icon om-symbol" style={{ fontSize: '24px', lineHeight: 1 }}>🕉</span>
          </div>
          <h4 className="faith-title">Hindu Continuation</h4>
          <p className="faith-subtitle">Carries the torch into the modern era</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FaithSystem;
