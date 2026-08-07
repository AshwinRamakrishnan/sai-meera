import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Maximize, Scissors, Layers } from 'lucide-react';
import './WeddingInvite.css';

const WeddingInvite = () => {
  const specs = [
    { title: 'Gold Foil Stamping', desc: 'Premium metallic finish', icon: <Sparkles size={20} />, color: 'var(--gold)' },
    { title: '350gsm Premium Stock', desc: 'Heavyweight art card', icon: <Layers size={20} />, color: 'var(--cyan)' },
    { title: 'Letterpress Embossing', desc: 'Textured raised details', icon: <Maximize size={20} />, color: 'var(--green)' },
    { title: '5-Piece Suite', desc: 'Complete invitation set', icon: <Scissors size={20} />, color: 'var(--orange)' }
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
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <section className="wedding-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label">// OUTPUT SHOWCASE</span>
          <h2 className="title">Elegance In Every Detail</h2>
        </motion.div>

        <motion.div 
          className="invite-card-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="invite-card">
            <div className="shimmer-effect"></div>
            <div className="invite-border">
              <div className="invite-content">
                <p className="invite-intro">You are cordially invited to the wedding of</p>
                <h3 className="invite-names">Arjun <span className="ampersand">&</span> Divya</h3>
                <div className="divider">
                  <span className="diamond"></span>
                </div>
                <div className="invite-details">
                  <p>Sunday, 24th October 2026</p>
                  <p>Grand Palace Venue, Main Hall</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="specs-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {specs.map((spec, index) => (
            <motion.div 
              key={index} 
              className="spec-card"
              variants={itemVariants}
              style={{ '--accent-color': spec.color }}
            >
              <div className="spec-icon" style={{ color: spec.color }}>
                {spec.icon}
              </div>
              <div className="spec-info">
                <h4>{spec.title}</h4>
                <p>{spec.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WeddingInvite;
