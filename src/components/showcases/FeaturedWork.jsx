import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './FeaturedWork.css';

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
          <div className="fw-invite fw-invite-dark">
            {/* TODO: replace with actual invitation mockup image */}
            <div className="fw-invite-border" />
            <p className="fw-invite-script">{slide.leftText.bride}</p>
            <p className="fw-invite-weds">weds</p>
            <p className="fw-invite-script">{slide.leftText.groom}</p>
            <p className="fw-invite-date">{slide.leftText.date}</p>
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

          <div className="fw-invite fw-invite-light">
            {/* TODO: replace with real cream invitation mockup */}
            <div className="fw-floral-corner fw-floral-tl" />
            <div className="fw-floral-corner fw-floral-br" />
            <p className="fw-invite-initials">
              {slide.rightText.bride[0]} <span className="fw-ampersand">&</span> {slide.rightText.groom[0]}
            </p>
            <p className="fw-invite-script fw-invite-dark-text">{slide.rightText.bride}</p>
            <p className="fw-invite-weds fw-invite-dark-text">&amp;</p>
            <p className="fw-invite-script fw-invite-dark-text">{slide.rightText.groom}</p>
            <p className="fw-invite-date fw-invite-date-dark">{slide.rightText.date}</p>
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
