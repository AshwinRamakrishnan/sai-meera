import React, { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import './GalleryStrip.css';

// 12 Authentic project image assets
import imgInvites from '../../assets/gallery_invitations.jpg';
import imgCards from '../../assets/gallery_business_cards.png';
import imgBanners from '../../assets/gallery_flex_banner.png';
import imgGreetings from '../../assets/gallery_greeting_cards.jpg';
import imgOffset from '../../assets/machine_offset_press.jpg';
import imgInviteDark from '../../assets/invite_dark_green.jpg';
import imgInviteCream from '../../assets/invite_cream_floral.jpg';
import imgNikah from '../../assets/nikah_card_1786113155635.jpg';
import imgTamilInvite from '../../assets/tamil_wedding_invite_1786113128894.jpg';
import imgPlates from '../../assets/offset_printing_plates.jpg';
import imgRollers from '../../assets/printing_ink_rollers.jpg';
import imgWorkshop from '../../assets/legacy_workshop.jpg';

// Row 1: Ceremonial & Luxury Invitations
const row1Items = [
  { label: 'Wedding Invitations', tag: 'ROYAL SUITE', img: imgInvites, link: '/products?group=invitations' },
  { label: 'Forest Green Luxury', tag: 'GOLD FOIL', img: imgInviteDark, link: '/products?group=invitations' },
  { label: 'Traditional Tamil Invite', tag: 'HERITAGE EMBOSS', img: imgTamilInvite, link: '/products?group=invitations' },
  { label: 'Cream Floral Ivory', tag: 'CLASSIC ROMANCE', img: imgInviteCream, link: '/products?group=invitations' },
  { label: 'Nikah Ceremonial Card', tag: 'DIE-CUT FOIL', img: imgNikah, link: '/products?group=invitations' },
];

// Row 2: Commercial, Corporate & Large Format
const row2Items = [
  { label: 'Corporate Business Cards', tag: 'VELVET SPOT UV', img: imgCards, link: '/products/visiting-card' },
  { label: 'Large Format Flex Banners', tag: '1440 DPI UV', img: imgBanners, link: '/products/flex-banner' },
  { label: 'Festive Greeting Cards', tag: 'GOLD METALLIC', img: imgGreetings, link: '/products' },
  { label: 'Offset Press Catalogues', tag: 'BULK PRODUCTION', img: imgOffset, link: '/products' },
  { label: 'CTP Aluminium Plates', tag: 'PRECISION CTP', img: imgPlates, link: '/products' },
];

// Row 3: Craftsmanship & Industrial Press Production
const row3Items = [
  { label: 'Heidelberg Ink Rollers', tag: 'PANTONE CMYK', img: imgRollers, link: '/products' },
  { label: 'Legacy Press Workshop', tag: 'SINCE 1962', img: imgWorkshop, link: '/legacy' },
  { label: 'Executive Visiting Cards', tag: '400GSM VELVET', img: imgCards, link: '/products/visiting-card' },
  { label: 'Bespoke Ceremonial Suite', tag: 'BLIND DEBOSS', img: imgInvites, link: '/products?group=invitations' },
  { label: 'Outdoor Architecture Flex', tag: 'WEATHER PROOF', img: imgBanners, link: '/products/flex-banner' },
];

const GalleryStrip = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: '-8%' });
  const [isPlaying, setIsPlaying] = useState(true);
  const [manualOffset, setManualOffset] = useState(0);

  // Mouse pointer parallax tracking
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    // Normalized coordinates between -1 and 1
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointer({ x, y });
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPointer({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  // Previous / Next nudge buttons
  const nudgeLeft = () => setManualOffset((prev) => prev + 160);
  const nudgeRight = () => setManualOffset((prev) => prev - 160);
  const togglePlay = () => setIsPlaying((p) => !p);

  // Dynamic 3D perspective tilt values based on pointer
  const tiltX = 10 + pointer.y * -4.5; // Base 10deg curved tilt
  const tiltY = pointer.x * 5.5;       // Dynamic yaw
  const tiltZ = -2.5 + pointer.x * -1.8; // Subtle roll
  const parallaxShift = pointer.x * -35 + manualOffset;

  return (
    <section
      className={`gs-section ${isInView ? 'is-in-view' : ''}`}
      id="gallery"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Framed Perfection - Interactive Tilted Portfolio Gallery"
    >
      {/* Subtle Ambient Gold Spotlight behind the Gallery */}
      <div className="gs-ambient-spotlight" aria-hidden="true" />
      <div className="gs-paper-grain" aria-hidden="true" />

      <div className="gs-container">
        {/* Section Header */}
        <motion.div
          className="gs-header"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="gs-header-text">
            <div className="gs-eyebrow-row">
              <span className="gs-eyebrow-line" aria-hidden="true" />
              <span className="gs-eyebrow">PORTFOLIO ARCHIVE</span>
            </div>
            <h2 className="gs-heading">Framed Perfection.</h2>
            <p className="gs-subtext">A glimpse of the work we are proud to put our name on.</p>
          </div>

          {/* Interactive Navigation & Playback Controls */}
          <div className="gs-controls" aria-label="Gallery motion controls">
            <button
              type="button"
              className="gs-ctrl-btn"
              onClick={nudgeLeft}
              aria-label="Nudge gallery backward"
            >
              <ChevronLeft size={16} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              className={`gs-ctrl-btn ${!isPlaying ? 'is-paused' : ''}`}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause gallery motion' : 'Resume gallery motion'}
            >
              {isPlaying ? <Pause size={14} strokeWidth={2.4} /> : <Play size={14} strokeWidth={2.4} />}
            </button>
            <button
              type="button"
              className="gs-ctrl-btn"
              onClick={nudgeRight}
              aria-label="Nudge gallery forward"
            >
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── INTERACTIVE TILTED GALLERY STAGE ── */}
      <div className="gs-stage-viewport">
        {/* Soft edge fades blending into dark graphite background */}
        <div className="gs-edge-vignette gs-edge-left" aria-hidden="true" />
        <div className="gs-edge-vignette gs-edge-right" aria-hidden="true" />

        {/* 3D Tilted Perspective Canvas */}
        <div
          className="gs-tilted-canvas"
          style={{
            transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) translateX(${parallaxShift}px)`,
            transition: isHovered
              ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* ROW 1: Continuous Left Stream (Ceremonial & Luxury Invitations) */}
          <div className="gs-row-track">
            <div
              className={`gs-marquee-strip gs-strip-left ${!isPlaying || !isInView ? 'is-paused' : ''}`}
            >
              {[...row1Items, ...row1Items].map((item, idx) => (
                <Link
                  key={`r1-${idx}`}
                  to={item.link}
                  className="gs-tile"
                  tabIndex={0}
                  aria-label={`${item.label} - ${item.tag}`}
                >
                  <div className="gs-tile-corner gs-corner-tl" aria-hidden="true" />
                  <div className="gs-tile-corner gs-corner-tr" aria-hidden="true" />
                  <div className="gs-tile-corner gs-corner-bl" aria-hidden="true" />
                  <div className="gs-tile-corner gs-corner-br" aria-hidden="true" />

                  <img
                    src={item.img}
                    alt={item.label}
                    className="gs-tile-img"
                    loading="lazy"
                    draggable="false"
                  />
                  <div className="gs-tile-overlay" />
                  <div className="gs-tile-badge">
                    <span className="gs-badge-dot" aria-hidden="true" />
                    <span className="gs-badge-text">{item.tag}</span>
                  </div>
                  <div className="gs-tile-footer">
                    <span className="gs-tile-title">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ROW 2: Continuous Right Stream (Commercial, Corporate & Large Format) */}
          <div className="gs-row-track">
            <div
              className={`gs-marquee-strip gs-strip-right ${!isPlaying || !isInView ? 'is-paused' : ''}`}
            >
              {[...row2Items, ...row2Items].map((item, idx) => (
                <Link
                  key={`r2-${idx}`}
                  to={item.link}
                  className="gs-tile"
                  tabIndex={0}
                  aria-label={`${item.label} - ${item.tag}`}
                >
                  <div className="gs-tile-corner gs-corner-tl" aria-hidden="true" />
                  <div className="gs-tile-corner gs-corner-tr" aria-hidden="true" />
                  <div className="gs-tile-corner gs-corner-bl" aria-hidden="true" />
                  <div className="gs-tile-corner gs-corner-br" aria-hidden="true" />

                  <img
                    src={item.img}
                    alt={item.label}
                    className="gs-tile-img"
                    loading="lazy"
                    draggable="false"
                  />
                  <div className="gs-tile-overlay" />
                  <div className="gs-tile-badge">
                    <span className="gs-badge-dot" aria-hidden="true" />
                    <span className="gs-badge-text">{item.tag}</span>
                  </div>
                  <div className="gs-tile-footer">
                    <span className="gs-tile-title">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ROW 3: Continuous Left Stream (Craftsmanship & Press Heritage) */}
          <div className="gs-row-track gs-row-desktop-only">
            <div
              className={`gs-marquee-strip gs-strip-left-slow ${!isPlaying || !isInView ? 'is-paused' : ''}`}
            >
              {[...row3Items, ...row3Items].map((item, idx) => (
                <Link
                  key={`r3-${idx}`}
                  to={item.link}
                  className="gs-tile"
                  tabIndex={0}
                  aria-label={`${item.label} - ${item.tag}`}
                >
                  <div className="gs-tile-corner gs-corner-tl" aria-hidden="true" />
                  <div className="gs-tile-corner gs-corner-tr" aria-hidden="true" />
                  <div className="gs-tile-corner gs-corner-bl" aria-hidden="true" />
                  <div className="gs-tile-corner gs-corner-br" aria-hidden="true" />

                  <img
                    src={item.img}
                    alt={item.label}
                    className="gs-tile-img"
                    loading="lazy"
                    draggable="false"
                  />
                  <div className="gs-tile-overlay" />
                  <div className="gs-tile-badge">
                    <span className="gs-badge-dot" aria-hidden="true" />
                    <span className="gs-badge-text">{item.tag}</span>
                  </div>
                  <div className="gs-tile-footer">
                    <span className="gs-tile-title">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryStrip;