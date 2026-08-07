import React from 'react';
import { motion } from 'framer-motion';
import StoryCard from './StoryCard';
import FaithSystem from './FaithSystem';
import ExperienceGrid from './ExperienceGrid';
import CoreSystem from './CoreSystem';
import TimelineCards from './TimelineCards';
import './LegacySection.css';

const LegacySection = () => {
  return (
    <section className="legacy-section" id="legacy">
      <div className="legacy-container">
        <motion.div 
          className="legacy-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="legacy-label">// OUR STORY</span>
          <h2 className="legacy-title">A Legacy Built Through Machines & Generations</h2>
        </motion.div>

        <div className="legacy-content">
          <StoryCard />
          <FaithSystem />
          
          <div className="legacy-middle-row">
            <div className="legacy-experience">
              <ExperienceGrid />
            </div>
            <div className="legacy-core">
              <CoreSystem />
            </div>
          </div>
          
          <TimelineCards />
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
