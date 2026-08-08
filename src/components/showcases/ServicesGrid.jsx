import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './ServicesGrid.css';

const ServicesGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const services = [
    { title: 'Flex Printing', desc: 'Large format outdoor & indoor banners', color: 'var(--cyan)' },
    { title: 'Offset Press', desc: 'High-volume commercial printing', color: 'var(--gold)' },
    { title: 'Design Studio', desc: 'Creative graphic design solutions', color: 'var(--green)' },
    { title: 'Banner Printing', desc: 'Custom vinyl and fabric banners', color: 'var(--orange)' },
    { title: 'Photo Frames', desc: 'Premium custom framing services', color: 'var(--cyan)' },
    { title: 'Visiting Cards', desc: 'Luxury and standard business cards', color: 'var(--gold)' },
    { title: 'Vinyl Printing', desc: 'High-quality adhesive vinyl graphics', color: 'var(--green)' },
    { title: 'Sticker Printing', desc: 'Custom die-cut labels and stickers', color: 'var(--orange)' }
  ];

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
    <section className="services-section" id="services">
      <div className="services-container" ref={ref}>
        
        <motion.div 
          className="services-header"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="services-label" variants={itemVariants}>
            What We Do
          </motion.div>
          <motion.h2 className="services-title" variants={itemVariants}>
            Full-Spectrum Production.
          </motion.h2>
        </motion.div>

        <motion.div 
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            return (
              <motion.div 
                key={index} 
                className="service-card"
                variants={itemVariants}
                style={{ '--service-color': service.color }}
              >
                <div className="service-number">{num}</div>
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.desc}</p>
                </div>
                <div className="service-arrow">
                  <ArrowRight size={24} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesGrid;
