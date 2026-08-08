import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import './BusinessCards.css';

const BusinessCards = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const cards = [
    { name: 'Arjun Mehta', role: 'Creative Director', rotation: -12, x: -60, y: 10, zIndex: 1 },
    { name: 'Priya Nair', role: 'Graphic Designer', rotation: -6, x: -30, y: 5, zIndex: 2 },
    { name: 'Ravi Kumar', role: 'Print Specialist', rotation: 0, x: 0, y: 0, zIndex: 5 },
    { name: 'Divya Raj', role: 'Account Manager', rotation: 6, x: 30, y: 5, zIndex: 4 },
    { name: 'Karthik S', role: 'Operations Head', rotation: 12, x: 60, y: 10, zIndex: 3 }
  ];

  const tags = ['Matte Lam', 'Spot UV', 'Gold Foil', 'Embossing'];

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
    <section className="cards-section" id="business-cards">
      <div className="cards-container" ref={ref}>
        
        <motion.div 
          className="cards-header"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="cards-label" variants={itemVariants}>
            Output Showcase
          </motion.div>
          <motion.h2 className="cards-title" variants={itemVariants}>
            Premium Business Cards.
          </motion.h2>
        </motion.div>

        <div className="cards-wrapper">
          <Tilt
            glareEnable={false}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            scale={1.02}
            transitionSpeed={2500}
            perspective={2000}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <div className="cards-stack">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  className="biz-card"
                  initial={{ opacity: 0, x: 0, y: 50, rotate: 0 }}
                  animate={isInView ? { opacity: 1, x: card.x, y: card.y, rotate: card.rotation } : {}}
                  transition={{ 
                    duration: 1, 
                    delay: 0.2 + (index * 0.1),
                    ease: [0.175, 0.885, 0.32, 1.275] // backOut
                  }}
                  style={{ zIndex: card.zIndex }}
                >
                  <div className="biz-card-content">
                    <div className="biz-logo"></div>
                    <div className="biz-info">
                      <h3 className="biz-name">{card.name}</h3>
                      <p className="biz-role">{card.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Tilt>
        </div>

        <motion.div 
          className="cards-tags"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {tags.map((tag, index) => (
            <motion.span key={index} className="card-tag" variants={itemVariants}>
              {tag}
            </motion.span>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default BusinessCards;
