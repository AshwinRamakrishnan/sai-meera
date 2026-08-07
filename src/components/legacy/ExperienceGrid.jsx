import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Factory, Zap, Film } from 'lucide-react';
import './ExperienceGrid.css';

const experiences = [
  {
    id: 1,
    title: "Dinamani Influence",
    description: "Precision standards inherited from Dinamani press culture",
    icon: <Crosshair size={24} />,
    colorClass: "exp-cyan"
  },
  {
    id: 2,
    title: "Industrial Roots",
    description: "60+ years of industrial-grade printing machinery",
    icon: <Factory size={24} />,
    colorClass: "exp-gold"
  },
  {
    id: 3,
    title: "Production Speed",
    description: "High-volume output without compromising quality",
    icon: <Zap size={24} />,
    colorClass: "exp-green"
  },
  {
    id: 4,
    title: "Cinematic Quality",
    description: "Every print treated as a work of art",
    icon: <Film size={24} />,
    colorClass: "exp-orange"
  }
];

const ExperienceGrid = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="experience-grid"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      {experiences.map((exp) => (
        <motion.div key={exp.id} className={`exp-card ${exp.colorClass}`} variants={item}>
          <div className="exp-icon">{exp.icon}</div>
          <h4 className="exp-title">{exp.title}</h4>
          <p className="exp-description">{exp.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ExperienceGrid;
