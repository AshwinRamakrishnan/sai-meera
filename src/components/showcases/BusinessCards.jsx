import React from 'react';
import { motion } from 'framer-motion';
import './BusinessCards.css';

const BusinessCards = () => {
  const cards = [
    { name: 'Arjun Mehta', role: 'Creative Director', rotation: -10, y: 10 },
    { name: 'Priya Nair', role: 'Graphic Designer', rotation: -5, y: 5 },
    { name: 'Ravi Kumar', role: 'Print Specialist', rotation: 0, y: 0 },
    { name: 'Divya Raj', role: 'Account Manager', rotation: 5, y: 5 },
    { name: 'Karthik S', role: 'Operations Head', rotation: 10, y: 10 }
  ];

  const tags = ['Matte Lam', 'Spot UV', 'Gold Foil', 'Embossing'];

  return (
    <section className="cards-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label">// VISITING CARDS</span>
          <h2 className="title">Premium Business Cards</h2>
        </motion.div>

        <div className="cards-wrapper">
          <div className="cards-stack">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                className="biz-card"
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                whileInView={{ opacity: 1, y: card.y, rotate: card.rotation }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.175, 0.885, 0.32, 1.275] // back.out
                }}
                style={{ zIndex: index }}
              >
                <div className="biz-card-content">
                  <div className="biz-logo"></div>
                  <div className="biz-info">
                    <h3 className="biz-name">{card.name}</h3>
                    <p className="biz-role">{card.role}</p>
                    <div className="biz-line"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="cards-tags"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {tags.map((tag, index) => (
            <span key={index} className="card-tag">{tag}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessCards;
