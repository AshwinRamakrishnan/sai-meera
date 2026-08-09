import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './FeaturedWork.css';
import imgInviteDark from '../../assets/invite_dark_green.jpg';
import imgInviteLight from '../../assets/invite_cream_floral.jpg';

// TODO: Replace with real printed invitation sample photos from client
const slides = [
  {
    num: '01',
    leftBg: '#1a2e1a',  /* deep forest green */
    leftText: { bride: 'Rohan', groom: 'Priya', date: '22.02.2024', style: 'dark' },
    rightBg: '#f5f0e8', /* cream ivory */
    rightText: { bride: 'Alisha', groom: 'Dheeraj', date: '17.11.2024', style: 'light' }
  }
];

const FeaturedWork = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  return (
    <section className="fw-section" id="featured-work" ref={ref}>
      <div className="fw-split">

        {/* Left panel: dark invitation */}
        <motion.div
          className="fw-panel fw-panel-dark"
          style={{ background: slide.leftBg }}
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="fw-invite-image">
            <img src={imgInviteDark} alt="Dark green wedding invitation" style={{ width: '100%', maxWidth: '280px', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
          </div>
          {/* Prev arrow */}
          <button
            className="fw-arrow fw-arrow-left"
            onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            aria-label="Previous"
          >
            ←
          </button>
        </motion.div>

        {/* Right panel: light invitation + overlay text */}
        <motion.div
          className="fw-panel fw-panel-light"
          style={{ background: slide.rightBg }}
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          {/* Overlay text block */}
          <div className="fw-overlay-text">
            <span className="fw-slide-label">{slide.num} / FEATURED WORK</span>
            <h2 className="fw-overlay-heading">Where Emotion<br />Meets Elegance.</h2>
            <p className="fw-overlay-desc">
              Every invitation we print carries the beauty of the moment and the precision of our craft.
            </p>
            <a href="/category/wedding-invitations" className="fw-overlay-link">VIEW INVITATIONS →</a>
          </div>

          <div className="fw-invite-image" style={{ zIndex: 2 }}>
            <img src={imgInviteLight} alt="Cream floral wedding invitation" style={{ width: '100%', maxWidth: '280px', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} />
          </div>

          {/* Next arrow */}
          <button
            className="fw-arrow fw-arrow-right"
            onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            aria-label="Next"
          >
            →
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedWork;
