import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './ServicesGrid.css';

const ServicesGrid = () => {
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
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <section className="services-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label">// WHAT WE DO</span>
          <h2 className="title">Our Services</h2>
        </motion.div>

        <motion.div 
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
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
