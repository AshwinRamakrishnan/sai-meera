import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Clock, MessageCircle, Upload } from 'lucide-react';
import './ContactSection.css';

const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <motion.div 
          className="contact-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <span className="contact-label">// GET IN TOUCH</span>
          <h2 className="contact-title">Ready to Print?</h2>
        </motion.div>

        <div className="contact-glass-card">
          <motion.div 
            className="contact-ctas"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
          >
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="cta-button whatsapp-btn">
              <MessageCircle size={24} />
              <span>WhatsApp Us</span>
            </a>
            
            <button className="cta-button upload-btn">
              <Upload size={24} />
              <span>Upload Design</span>
            </button>
          </motion.div>

          <motion.div 
            className="contact-info-grid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
          >
            <div className="info-item">
              <div className="info-icon">
                <MapPin size={24} />
              </div>
              <div className="info-content">
                <span className="info-label">Location</span>
                <span className="info-value">Chennai</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Mail size={24} />
              </div>
              <div className="info-content">
                <span className="info-label">Email</span>
                <span className="info-value">print@chromapress.in</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <Clock size={24} />
              </div>
              <div className="info-content">
                <span className="info-label">Hours</span>
                <span className="info-value">Mon-Sat 9AM-8PM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
