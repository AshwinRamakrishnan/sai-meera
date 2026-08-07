import React from 'react';
import { motion } from 'framer-motion';
import './TimelineCards.css';

const timelineEvents = [
  {
    id: 1,
    year: "1962",
    title: "The Beginning",
    description: "A small printing press was established, laying the foundation for decades of excellence."
  },
  {
    id: 2,
    year: "1965",
    title: "Industrial Press Era",
    description: "Upgraded to industrial-grade offset printing equipment."
  },
  {
    id: 3,
    year: "Dinamani Era",
    title: "Precision Culture",
    description: "Adopted the meticulous quality standards of the Dinamani press tradition."
  },
  {
    id: 4,
    year: "1988-1990",
    title: "Machine Apprenticeship",
    description: "Deep immersion into machine operation and maintenance."
  },
  {
    id: 5,
    year: "Present Day",
    title: "Next-Gen Production Hub",
    description: "A fully modernized facility with digital and traditional capabilities."
  }
];

const TimelineCards = () => {
  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      
      <div className="timeline-items">
        {timelineEvents.map((event, index) => (
          <motion.div 
            key={event.id}
            className="timeline-item"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <span className="timeline-year">{event.year}</span>
              <h4 className="timeline-title">{event.title}</h4>
              <p className="timeline-desc">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineCards;
