import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Mail, Clock, MessageCircle, Upload } from 'lucide-react';
import './ContactSection.css';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

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
    <section className="contact-section" id="contact">
      <div className="contact-container" ref={ref}>
        
        <motion.div 
          className="contact-header"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="contact-label" variants={itemVariants}>
            Get In Touch
          </motion.div>
          <motion.h2 className="contact-title" variants={itemVariants}>
            Ready to Print?
          </motion.h2>
        </motion.div>

        <motion.div 
          className="contact-glass-card"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <motion.div 
            className="contact-ctas"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cta-button whatsapp-btn magnetic"
              variants={itemVariants}
            >
              <MessageCircle size={24} />
              <span>WhatsApp Us</span>
            </motion.a>
            
            <motion.button 
              className="cta-button upload-btn magnetic"
              variants={itemVariants}
            >
              <Upload size={24} />
              <span>Upload Design</span>
            </motion.button>
          </motion.div>

          <motion.div 
            className="contact-info-grid"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div className="info-item" variants={itemVariants}>
              <div className="info-icon">
                <MapPin size={24} />
              </div>
              <div className="info-content">
                <span className="info-label">Location</span>
                <span className="info-value">Kumbakonam, Tamil Nadu</span>
              </div>
            </motion.div>

            <motion.div className="info-item" variants={itemVariants}>
              <div className="info-icon">
                <Mail size={24} />
              </div>
              <div className="info-content">
                <span className="info-label">Email</span>
                <span className="info-value">saimeeradd@gmail.com</span>
              </div>
            </motion.div>

            <motion.div className="info-item" variants={itemVariants}>
              <div className="info-icon">
                <Clock size={24} />
              </div>
              <div className="info-content">
                <span className="info-label">Hours</span>
                <span className="info-value">Mon-Sat 9AM-8PM</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection;
