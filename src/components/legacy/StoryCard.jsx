import React from 'react';
import { motion } from 'framer-motion';
import './StoryCard.css';

const StoryCard = () => {
  return (
    <motion.div 
      className="story-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h3 className="story-title">The Name That Never Changed</h3>
      <p className="story-body">
        Through three different ownerships spanning religious and cultural lines — from its Christian founder, to a Muslim custodian, to its current Hindu proprietor — the name 'Sai Meera' has endured. It's not just a brand; it's a testament to the trust each owner placed in the legacy of the machines and the community they served.
      </p>
      <div className="story-glow"></div>
    </motion.div>
  );
};

export default StoryCard;
