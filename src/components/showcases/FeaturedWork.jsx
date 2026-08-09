import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import './FeaturedWork.css';

// Direct Image Imports (File path correct-a irukku nu confirm pannikonga)
import imgDarkImport from '../../assets/invite_dark_green.jpg';
import imgLightImport from '../../assets/invite_cream_floral.jpg';

// Fallback Unsplash image URLs (Import failure aagakoodadhu nu fallback structure)
const imgDark = imgDarkImport || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800";
const imgLight = imgLightImport || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800";

const sampleCards = [
  {
    id: 'forest-green',
    title: 'Forest Green Luxury',
    badge: 'DARK ELEGANCE',
    img: imgDark,
    date: '22.02.2024',
    names: 'Rohan & Priya'
  },
  {
    id: 'cream-floral',
    title: 'Cream Floral Ivory',
    badge: 'CLASSIC ROMANCE',
    img: imgLight,
    date: '17.11.2024',
    names: 'Alisha & Dheeraj'
  }
];

const FeaturedWork = () => {
  const [cards, setCards] = useState(sampleCards);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const cycleCards = () => {
    setCards((prev) => {
      const newArr = [...prev];
      const top = newArr.shift();
      newArr.push(top);
      return newArr;
    });
  };

  const activeCard = cards[0];

  return (
    <section className="fw3d-section" id="featured-work" ref={ref}>
      <div className="fw3d-container">
        
        {/* Left Side: Text Details */}
        <motion.div
          className="fw3d-info"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="fw3d-eyebrow">FEATURED SHOWCASE</span>
          <h2 className="fw3d-heading">
            Where Emotion<br />
            Meets Elegance.
          </h2>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="fw3d-meta"
            >
              <div className="fw3d-badge">{activeCard.badge}</div>
              <h3 className="fw3d-card-title">{activeCard.title}</h3>
              <p className="fw3d-names">{activeCard.names} • {activeCard.date}</p>
            </motion.div>
          </AnimatePresence>

          <p className="fw3d-desc">
            Click on the cards stack to cycle through printed invite variants. Every piece is crafted with metallic gold foiled precision.
          </p>

          <a href="/category/wedding-invitations" className="fw3d-cta">
            EXPLORE ALL COLLECTIONS →
          </a>
        </motion.div>

        {/* Right Side: Stack Interactive Cards */}
        <motion.div
          className="fw3d-stack-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={cycleCards}
        >
          <div className="fw3d-deck">
            {cards.map((card, index) => {
              const isTop = index === 0;
              const rotation = isTop ? (isHovered ? -8 : -3) : (isHovered ? 12 : 5);
              const translateX = isTop ? (isHovered ? -20 : 0) : (isHovered ? 30 : 15);
              const translateY = isTop ? (isHovered ? -10 : 0) : (isHovered ? 15 : 10);

              return (
                <motion.div
                  key={card.id}
                  className="fw3d-card"
                  layout
                  animate={{
                    rotate: rotation,
                    x: translateX,
                    y: translateY,
                    scale: isTop ? 1 : 0.94,
                    zIndex: cards.length - index,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  <img src={card.img} alt={card.title} className="fw3d-img" />
                  <div className="fw3d-card-overlay" />
                </motion.div>
              );
            })}
          </div>

          <span className="fw3d-hint">Click stack to flip</span>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedWork;