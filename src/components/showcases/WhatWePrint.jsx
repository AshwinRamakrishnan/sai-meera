import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './WhatWePrint.css';

import imgInvite from '../../assets/gallery_invitations.jpg';
import imgCorporate from '../../assets/gallery_business_cards.png';
import imgFlex from '../../assets/gallery_flex_banner.png';
import imgOffset from '../../assets/machine_offset_press.jpg';

const categories = [
  {
    num: '01',
    tabName: 'Invitations',
    tag: 'CEREMONIAL & HERITAGE',
    title: 'Invitations & Ceremonies',
    subtitle: 'Sacred Milestones · Tamil Tradition · Gold Foil',
    desc: 'Bespoke wedding invitations, Nikah cards, engagement announcements, and ceremonial stationery printed on 350gsm imported cardstock with metallic foiling, blind embossing, and authentic heritage typography.',
    specs: ['350gsm Board', 'Multi-Foil Stamping', 'Deep Emboss', 'Custom Boxes'],
    link: '/products?group=invitations',
    img: imgInvite,
    alt: 'Sai Meera Wedding & Ceremonial Invitations Collection',
  },
  {
    num: '02',
    tabName: 'Corporate',
    tag: 'CORPORATE IDENTITY',
    title: 'Corporate Printing',
    subtitle: 'Executive Stationery · Velvet Touch · Spot UV',
    desc: 'Distinguished business cards, corporate letterheads, presentation folders, and brand brochures engineered with velvety soft-touch laminations and precision spot UV for enterprise presence.',
    specs: ['400gsm Velvet', 'Spot UV Lamination', 'Die-Cut Edges', 'Pantone CMYK'],
    link: '/products/visiting-card',
    img: imgCorporate,
    alt: 'Sai Meera Luxury Corporate Business Cards and Stationery',
  },
  {
    num: '03',
    tabName: 'Large Format',
    tag: 'LARGE FORMAT ARCHITECTURE',
    title: 'Large Format',
    subtitle: 'Eco-Solvent · 1440 DPI · Outdoor Scale',
    desc: 'High-impact outdoor flex banners, backlit signboards, event hoardings, and roll-up standees rendered with UV-stabilized industrial inks resistant to intense weather and sun exposure.',
    specs: ['1440 DPI Piezo', 'UV-Resistant Inks', '440gsm Star Flex', 'Seamless Roll Width'],
    link: '/products/flex-banner',
    img: imgFlex,
    alt: 'Large Format Eco-Solvent Flex Banners and Outdoor Signage',
  },
  {
    num: '04',
    tabName: 'Offset Press',
    tag: 'INDUSTRIAL PRESS PRODUCTION',
    title: 'Offset & Industrial',
    subtitle: 'Continuous Sheet-Fed · 15,000 SPH · Bulk Volume',
    desc: 'Commercial high-volume printing powered by multi-colour offset presses delivering razor-sharp halftone reproduction, perfect binding, and consistent pantone calibration at scale.',
    specs: ['15,000 Sheets/hr', '6-Colour + Inline UV', 'Full Book Binding', 'Pantone Matching'],
    link: '/products',
    img: imgOffset,
    alt: 'Industrial Offset Printing Press Production',
  },
];

const AUTOPLAY_DURATION = 3000; // 3 seconds per slide

const WhatWePrint = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  // Live cursor interaction state (subtle 3D tilt and specular sheen only)
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [peekOffset, setPeekOffset] = useState(0); // subtle horizontal peek (-14px to +14px)
  const [tilt, setTilt] = useState({ x: 0, y: 0 }); // subtle 3D tilt (-3deg to +3deg)
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50 });

  const isCoarsePointerRef = useRef(false);

  // Touch swipe refs
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchEndXRef = useRef(0);
  const touchEndYRef = useRef(0);

  // Accessibility: prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);

  // Autoplay timer tracking (tracks remaining duration when paused on hover)
  const timerRef = useRef(null);
  const remainingTimeRef = useRef(AUTOPLAY_DURATION);
  const startTimeRef = useRef(Date.now());
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    isCoarsePointerRef.current = window.matchMedia('(pointer: coarse)').matches;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const motionHandler = (e) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);
    return () => motionQuery.removeEventListener('change', motionHandler);
  }, []);

  // Page visibility listener
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState !== 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Advance to next slide (with cyclic wrap)
  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    remainingTimeRef.current = AUTOPLAY_DURATION;
    startTimeRef.current = Date.now();
  }, []);

  // Back to previous slide (with cyclic wrap)
  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    remainingTimeRef.current = AUTOPLAY_DURATION;
    startTimeRef.current = Date.now();
  }, []);

  // Jump to specific slide (e.g. from bottom tabs)
  const goToSlide = useCallback((index) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    remainingTimeRef.current = AUTOPLAY_DURATION;
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  // Autoplay: runs automatically every 3 seconds, paused when hovered or tab is backgrounded
  useEffect(() => {
    if (reducedMotion) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const shouldPause = !isInView || isHovered || !isTabVisible;

    if (shouldPause) {
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      return;
    }

    startTimeRef.current = Date.now();
    const delay = remainingTimeRef.current > 50 ? remainingTimeRef.current : AUTOPLAY_DURATION;

    timerRef.current = setTimeout(() => {
      handleNext();
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentIndex, isInView, isHovered, isTabVisible, reducedMotion, handleNext]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    }
  };

  // Aesthetic cursor-responsive tilt & specular sheen (does NOT advance slides)
  const handleStageMouseMove = (e) => {
    if (isCoarsePointerRef.current || reducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0) return;

    // Normalised position: 0 (left edge) to 1 (right edge)
    const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Distance from center: -1.0 (far left) to +1.0 (far right)
    const centerDist = (normX - 0.5) * 2;

    // Foil specular reflection coordinates
    setSpecularPos({ x: normX * 100, y: normY * 100 });

    // Subtle, restrained visual peek and 3D tilt
    const DEAD_ZONE = 0.15;
    let peek = 0;
    if (Math.abs(centerDist) > DEAD_ZONE) {
      const sign = Math.sign(centerDist);
      const intensity = (Math.abs(centerDist) - DEAD_ZONE) / (1 - DEAD_ZONE);
      peek = sign * intensity * 14; // max 14px restrained peek
    }
    setPeekOffset(peek);

    const tiltX = (0.5 - normY) * 3; // max ±3deg tilt
    const tiltY = centerDist * 3;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleStageMouseEnter = () => {
    if (isCoarsePointerRef.current) return;
    setIsPointerInside(true);
    setIsHovered(true);
  };

  const handleStageMouseLeave = () => {
    setIsPointerInside(false);
    setIsHovered(false);
    setPeekOffset(0);
    setTilt({ x: 0, y: 0 });
  };

  // Mobile Touch Swipe: preserves natural vertical scrolling
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const dx = touchStartXRef.current - touchEndXRef.current;
    const dy = touchStartYRef.current - touchEndYRef.current;

    // Only trigger horizontal swipe if displacement is primarily horizontal
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) {
        // Swipe left -> advance to next
        handleNext();
      } else {
        // Swipe right -> return to previous
        handlePrev();
      }
    }

    touchStartXRef.current = 0;
    touchStartYRef.current = 0;
    touchEndXRef.current = 0;
    touchEndYRef.current = 0;
  };

  const currentCat = categories[currentIndex];

  // Synchronized Framer Motion variants
  const imageVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 32 : -32,
      scale: 1.02,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1.0,
      transition: {
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -32 : 32,
      scale: 0.98,
      transition: {
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const textVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 22 : -22,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -22 : 22,
      transition: {
        duration: 0.26,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section
      className="wwp-section"
      id="what-we-print"
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="What We Print - Category Spotlight Showcase"
    >
      <div className="wwp-container">
        {/* Section Header */}
        <div className="wwp-header">
          <div className="wwp-header-left">
            <span className="wwp-eyebrow">WHAT WE PRINT</span>
            <h2 className="wwp-heading">
              Solutions for Every<br />
              Printing Need.
            </h2>
          </div>
          <Link to="/products" className="wwp-explore-link">
            <span>EXPLORE ALL SERVICES</span>
            <span className="wwp-explore-arrow">→</span>
          </Link>
        </div>

        {/* ── CINEMATIC SPOTLIGHT STAGE (Designated Cursor Interaction Area) ── */}
        <div
          className="wwp-spotlight-stage"
          ref={stageRef}
          onMouseMove={handleStageMouseMove}
          onMouseEnter={handleStageMouseEnter}
          onMouseLeave={handleStageMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* LEFT WING: Photography Frame with Cursor Peek & Tilt */}
          <div className="wwp-visual-wing">
            <div
              className={`wwp-image-frame ${isPointerInside ? 'is-hovered' : ''}`}
              style={{
                transform: isPointerInside && !reducedMotion
                  ? `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) translateX(${peekOffset.toFixed(1)}px)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateX(0px)',
                transition: isPointerInside ? 'transform 0.12s ease-out' : 'transform 0.35s ease-out',
              }}
            >
              {/* Archival Gold Corner Brackets */}
              <div className="wwp-frame-corner wwp-corner-tl" aria-hidden="true" />
              <div className="wwp-frame-corner wwp-corner-tr" aria-hidden="true" />
              <div className="wwp-frame-corner wwp-corner-bl" aria-hidden="true" />
              <div className="wwp-frame-corner wwp-corner-br" aria-hidden="true" />

              {/* Crossfade Image Stack */}
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={currentCat.num}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="wwp-image-layer"
                >
                  <img
                    src={currentCat.img}
                    alt={currentCat.alt}
                    className="wwp-image-media"
                    loading="eager"
                    draggable="false"
                  />
                  <div className="wwp-image-overlay" />
                </motion.div>
              </AnimatePresence>

              {/* Gold Light Sweep Accent on Slide Change */}
              <div key={`sweep-${currentCat.num}`} className="wwp-light-sweep" aria-hidden="true" />

              {/* Specular Gold Foil Sheen tracking Cursor */}
              <div
                className={`wwp-cursor-specular ${isPointerInside ? 'is-active' : ''}`}
                style={{
                  background: isPointerInside && !reducedMotion
                    ? `radial-gradient(circle 380px at ${specularPos.x}% ${specularPos.y}%, rgba(212, 175, 55, 0.32) 0%, rgba(255, 255, 255, 0.16) 18%, rgba(212, 175, 55, 0.05) 45%, transparent 70%)`
                    : 'transparent',
                }}
                aria-hidden="true"
              />


              {/* Category Identifier Tag on Image */}
              <div className="wwp-image-badge">
                <span className="wwp-badge-dot" aria-hidden="true" />
                <span className="wwp-badge-text">{currentCat.tag}</span>
              </div>
            </div>
          </div>

          {/* RIGHT WING: Editorial Narrative & Controls */}
          <div className="wwp-narrative-wing">
            {/* Top Bar: Progress Indicator & Compact Nav Buttons */}
            <div className="wwp-meta-bar">
              <div className="wwp-counter" aria-live="polite">
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                  <motion.span
                    key={currentCat.num}
                    initial={{ opacity: 0, y: direction > 0 ? 8 : -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: direction > 0 ? -8 : 8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="wwp-counter-current"
                  >
                    {currentCat.num}
                  </motion.span>
                </AnimatePresence>
                <span className="wwp-counter-divider">/</span>
                <span className="wwp-counter-total">{`0${categories.length}`}</span>
              </div>

              {/* Compact Prev / Next Buttons */}
              <div className="wwp-nav-btns" aria-label="Slider navigation">
                <button
                  type="button"
                  className="wwp-nav-btn"
                  onClick={handlePrev}
                  aria-label="Previous category"
                >
                  <ChevronLeft size={16} strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  className="wwp-nav-btn"
                  onClick={handleNext}
                  aria-label="Next category"
                >
                  <ChevronRight size={16} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Synchronized Narrative Body */}
            <div className="wwp-narrative-body">
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={currentCat.num}
                  custom={direction}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="wwp-narrative-content"
                >
                  <div className="wwp-narrative-kicker">
                    <span className="wwp-kicker-dot" />
                    <span>{currentCat.subtitle}</span>
                  </div>

                  <h3 className="wwp-narrative-title">
                    {currentCat.title}
                  </h3>

                  <p className="wwp-narrative-desc">
                    {currentCat.desc}
                  </p>

                  {/* Specification Pills */}
                  <div className="wwp-narrative-pills">
                    {currentCat.specs.map((sp, idx) => (
                      <span key={idx} className="wwp-spec-pill">
                        {sp}
                      </span>
                    ))}
                  </div>

                  {/* Explore Category CTA */}
                  <div className="wwp-narrative-cta">
                    <Link to={currentCat.link} className="wwp-cta-btn">
                      <span className="wwp-cta-text">EXPLORE CATEGORY</span>
                      <span className="wwp-cta-icon" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* BOTTOM: 4-Category Progress Bar Track */}
        <div
          className="wwp-track-bar"
          role="tablist"
          aria-label="Printing categories"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {categories.map((cat, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={cat.num}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`wwp-track-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => goToSlide(idx)}
              >
                <div className="wwp-tab-info">
                  <span className="wwp-tab-num">{cat.num}</span>
                  <span className="wwp-tab-name">{cat.tabName}</span>
                </div>
                <div className="wwp-tab-progress-rail">
                  <div
                    key={`rail-${cat.num}-${isActive ? currentIndex : 'idle'}`}
                    className={`wwp-tab-progress-fill ${isActive ? 'animating' : ''}`}
                    style={{
                      animationDuration: `${AUTOPLAY_DURATION}ms`,
                      animationPlayState: isHovered ? 'paused' : 'running',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatWePrint;
