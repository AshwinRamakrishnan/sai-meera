import React from 'react';
import { motion } from 'framer-motion';
import './SectionHeading.css';

const SectionHeading = ({ label, title, subtitle }) => {
  return (
    <motion.div 
      className="section-heading-container"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="section-label">
        <span className="dash">-</span>
        {label}
        <span className="dash">-</span>
      </div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
};

export default SectionHeading;
