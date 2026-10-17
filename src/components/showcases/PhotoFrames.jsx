import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import './PhotoFrames.css';

const PhotoFrames = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const frames = [
    { name: 'Canvas Print', color: 'var(--orange)' },
    { name: 'Crystal Acrylic', color: 'var(--cyan)' },
    { name: 'Aluminium Frame', color: '#888888' },
    { name: 'Fine Art Print', color: 'var(--gold)' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="frames-section" id="photo-frames">
      <div className="frames-container" ref={ref}>
        
        <motion.div 
          className="frames-header"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="frames-label" variants={itemVariants}>
            Output Showcase
          </motion.div>
          <motion.h2 className="frames-title" variants={itemVariants}>
            Framed Perfection.
          </motion.h2>
        </motion.div>

        <motion.div 
          className="frames-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {frames.map((frame, index) => (
            <motion.div key={index} className="frame-card" variants={itemVariants}>
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.3}
                glareColor="#ffffff"
                glarePosition="all"
                glareBorderRadius="4px"
                tiltMaxAngleX={15}
                tiltMaxAngleY={15}
                scale={1.05}
                transitionSpeed={2000}
                perspective={1000}
                style={{ width: '100%', maxWidth: '300px' }}
              >
                <div className="frame-preview" style={{ '--frame-color': frame.color }}>
                  <div className="frame-gradient"></div>
                </div>
              </Tilt>
              <h4 className="frame-name">{frame.name}</h4>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default PhotoFrames;
