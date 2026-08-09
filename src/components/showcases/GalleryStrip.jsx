import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './GalleryStrip.css';

const items = [
  { label: 'Wedding Invitations', img: '/images/gallery_invitations.jpg' },
  { label: 'Business Cards',      img: '/images/gallery_business_cards.jpg' },
  { label: 'Flex & Banners',      img: '/images/gallery_flex_banner.jpg' },
  { label: 'Greeting Cards',      img: '/images/gallery_greeting_cards.jpg' },
  { label: 'Brochures',           img: '/images/machine_offset_press.jpg' },
  { label: 'Stationery',          img: '/images/invite_dark_green.jpg' },
];

const VISIBLE = 4;

const GalleryStrip = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8%' });
  const [offset, setOffset] = useState(0);
  const maxOffset = items.length - VISIBLE;

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));
  const visible = items.slice(offset, offset + VISIBLE);

  return (
    <section className="gs-section" id="gallery" ref={ref}>
      <div className="gs-container">
        <motion.div
          className="gs-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h2 className="gs-heading">Framed Perfection.</h2>
            <p className="gs-subtext">A glimpse of the work we are proud to put our name on.</p>
          </div>
          <div className="gs-arrows">
            <button className="gs-arrow" onClick={prev} disabled={offset === 0} aria-label="Previous">←</button>
            <button className="gs-arrow" onClick={next} disabled={offset >= maxOffset} aria-label="Next">→</button>
          </div>
        </motion.div>

        <div className="gs-grid">
          {visible.map((item, i) => (
            <motion.div
              key={item.label}
              className="gs-card"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div className="gs-card-img-wrap">
                <img src={item.img} alt={item.label} className="gs-card-img" />
              </div>
              <p className="gs-card-label">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryStrip;
