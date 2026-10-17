import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RotateCw, Sparkles } from 'lucide-react';
import './FeaturedWork.css';

// Direct Image Imports
import imgDarkImport from '../../assets/invite_dark_green.jpg';
import imgLightImport from '../../assets/invite_cream_floral.jpg';

// Fallback Unsplash image URLs
const imgDark = imgDarkImport || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800";
const imgLight = imgLightImport || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800";

const sampleCards = [
  {
    id: 'forest-green',
    title: 'Forest Green Luxury',
    badge: 'DARK ELEGANCE',
    img: imgDark,
    date: '22.02.2024',
    names: 'Rohan & Priya',
    alt: 'Forest Green Luxury Wedding Invitation Suite with Gold Foil'
  },
  {
    id: 'cream-floral',
    title: 'Cream Floral Ivory',
    badge: 'CLASSIC ROMANCE',
    img: imgLight,
    date: '17.11.2024',
    names: 'Alisha & Dheeraj',
    alt: 'Cream Floral Ivory Wedding Invitation Card with Embossed Detailing'
  }
];

const FeaturedWork = () => {
  const [cards, setCards] = useState(sampleCards);
  const [isHovered, setIsHovered] = useState(false);
  const [isCycling, setIsCycling] = useState(false);
  const touchStartXRef = useRef(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  // Cycle the card deck (top card moves to bottom)
  const cycleCards = useCallback(() => {
    setIsCycling(true);
    setCards((prev) => {
      const newArr = [...prev];
      const top = newArr.shift();
      newArr.push(top);
      return newArr;
    });
    setTimeout(() => setIsCycling(false), 500);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cycleCards();
    }
  };

  // Mobile touch swipe
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      cycleCards();
    }
  };

  const activeCard = cards[0];
  const activeCardIndex = sampleCards.findIndex((c) => c.id === activeCard.id);

  return (
    <section
      className={`fw3d-section ${isInView ? 'is-in-view' : ''}`}
      id="featured-work"
      ref={sectionRef}
      aria-label="Featured Showcase - Where Emotion Meets Elegance"
    >
      {/* ── CINEMATIC STUDIO BACKGROUND ELEMENTS ── */}
      {/* Print-inspired paper grain texture overlay */}
      <div className="fw3d-paper-texture" aria-hidden="true" />

      {/* Layered studio background gradients */}
      <div className="fw3d-bg-ambient" aria-hidden="true" />

      {/* Radial Gold Spotlight behind the Card Deck */}
      <div className="fw3d-radial-spotlight" aria-hidden="true" />

      {/* Restrained gentle light sweep at long intervals */}
      <div className="fw3d-bg-sweep" aria-hidden="true" />

      {/* Drifting blurred gold light particles */}
      <div className="fw3d-particles-layer" aria-hidden="true">
        <div className="fw3d-particle fw3d-particle-1" />
        <div className="fw3d-particle fw3d-particle-2" />
        <div className="fw3d-particle fw3d-particle-3" />
        <div className="fw3d-particle fw3d-particle-4" />
      </div>

      <div className="fw3d-container">
        
        {/* ── LEFT COLUMN: EDITORIAL TYPOGRAPHY & DETAILS ── */}
        <motion.div
          className="fw3d-info"
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow Label */}
          <div className="fw3d-eyebrow-row">
            <span className="fw3d-eyebrow-accent" aria-hidden="true" />
            <span className="fw3d-eyebrow">FEATURED SHOWCASE</span>
          </div>

          {/* Headline */}
          <h2 className="fw3d-heading">
            Where Emotion<br />
            Meets Elegance.
          </h2>
          
          {/* Active Design Meta Block */}
          <div className="fw3d-meta-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="fw3d-meta"
              >
                <div className="fw3d-badge-row">
                  <span className="fw3d-badge-dot" aria-hidden="true" />
                  <span className="fw3d-badge">{activeCard.badge}</span>
                </div>
                <h3 className="fw3d-card-title">{activeCard.title}</h3>
                <p className="fw3d-names">{activeCard.names} • {activeCard.date}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Descriptive Content */}
          <p className="fw3d-desc">
            Click on the cards stack to cycle through printed invite variants. Every piece is crafted with metallic gold foiled precision.
          </p>

          {/* Explore Link */}
          <div className="fw3d-cta-row">
            <Link to="/category/wedding-invitations" className="fw3d-cta">
              <span>EXPLORE ALL COLLECTIONS</span>
              <span className="fw3d-cta-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN: INTERACTIVE INVITATION CARD STACK ── */}
        <motion.div
          className="fw3d-stack-wrapper"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={cycleCards}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-label={`Interactive invitation cards stack. Current design: ${activeCard.title}. Click or press Enter to cycle.`}
        >
          {/* Ambient card halo glow to separate from background */}
          <div className="fw3d-deck-glow" aria-hidden="true" />

          {/* Floating Deck Container */}
          <div className={`fw3d-deck ${isHovered ? 'is-deck-hovered' : ''} ${isCycling ? 'is-deck-cycling' : ''}`}>
            {cards.map((card, index) => {
              const isTop = index === 0;
              // Controlled resting angles vs hovered fan-out angles
              const rotation = isTop
                ? (isHovered ? -7 : -3)
                : (isHovered ? 10 : 4.5);
              const translateX = isTop
                ? (isHovered ? -18 : 0)
                : (isHovered ? 26 : 14);
              const translateY = isTop
                ? (isHovered ? -12 : 0)
                : (isHovered ? 14 : 10);
              const translateZ = isTop ? (isHovered ? 30 : 15) : (isHovered ? -10 : -25);

              return (
                <motion.div
                  key={card.id}
                  className={`fw3d-card ${isTop ? 'is-top-card' : 'is-back-card'}`}
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
                    stiffness: 240,
                    damping: 22,
                    mass: 0.8,
                  }}
                  style={{
                    transform: `translateZ(${translateZ}px)`,
                  }}
                >
                  {/* Real Invitation Artwork Image */}
                  <img
                    src={card.img}
                    alt={card.alt || card.title}
                    className="fw3d-img"
                    loading="eager"
                  />

                  {/* Archival Gold Corner Brackets for physical craft framing */}
                  <div className="fw3d-card-corner fw3d-corner-tl" aria-hidden="true" />
                  <div className="fw3d-card-corner fw3d-corner-tr" aria-hidden="true" />
                  <div className="fw3d-card-corner fw3d-corner-bl" aria-hidden="true" />
                  <div className="fw3d-card-corner fw3d-corner-br" aria-hidden="true" />

                  {/* Surface Foil Shine Glare */}
                  <div className="fw3d-foil-glare" aria-hidden="true" />

                  {/* Realistic card bottom vignette for lighting depth */}
                  <div className="fw3d-card-overlay" aria-hidden="true" />
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Stack Cue & Micro-Indicator */}
          <div className="fw3d-controls-bar">
            <div className="fw3d-counter-pill" aria-live="polite">
              <span className="fw3d-counter-current">{`0${activeCardIndex + 1}`}</span>
              <span className="fw3d-counter-divider">/</span>
              <span className="fw3d-counter-total">{`0${sampleCards.length}`}</span>
            </div>

            <div className="fw3d-hint-pill">
              <RotateCw className="fw3d-hint-icon" size={12} strokeWidth={2.4} aria-hidden="true" />
              <span className="fw3d-hint-text">CLICK STACK TO FLIP</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedWork;