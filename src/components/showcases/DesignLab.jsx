import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Monitor, Layers, Printer, Target, Palette, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DesignLab.css';

import designLabImg from '../../assets/design_lab_setup.png';
import landscapeImg from '../../assets/design_lab_landscape.png';
import leftScreenImg from '../../assets/design_lab_screen_left.png';
import artworkImg from '../../assets/design_lab_artwork.png';
import LivingNatureMonitor from './LivingNatureMonitor';

const capabilities = [
  { icon: <Monitor size={16} strokeWidth={2.2} />, label: 'Dual-screen colour-accurate workspace' },
  { icon: <Layers size={16} strokeWidth={2.2} />,  label: 'CMYK separation & ICC profile export' },
  { icon: <Target size={16} strokeWidth={2.2} />,  label: 'Print-ready bleed & margin setup' },
  { icon: <Printer size={16} strokeWidth={2.2} />, label: 'File preparation for offset & flex' },
  { icon: <Palette size={16} strokeWidth={2.2} />, label: 'Pantone matching & spot-colour design' },
];

const DesignLab = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-8%' });

  // Lightweight pointer-responsive parallax state
  const [mousePos, setMousePos] = useState({ tiltX: 0, tiltY: 0, glowX: 50, glowY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const handleMouseMove = (e) => {
    if (!canHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Restrained, smooth 3D tilt (max ±3.8deg)
    const tiltX = (y - 0.5) * -5.0;
    const tiltY = (x - 0.5) * 5.0;

    setMousePos({
      tiltX,
      tiltY,
      glowX: x * 100,
      glowY: y * 100,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ tiltX: 0, tiltY: 0, glowX: 50, glowY: 50 });
  };

  // Staggered reveal animations
  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  };

  return (
    <section className="dl-section" id="design-lab" ref={sectionRef}>
      {/* Background Studio Lighting Spotlight */}
      <div className="dl-ambient-spotlight" aria-hidden="true" />

      <div className="dl-container">
        {/* LEFT COLUMN: Interactive Living Design Workstation */}
        <motion.div
          className="dl-image-col"
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className={`dl-stage-wrapper ${isHovered ? 'is-hovered' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="dl-stage-inner"
              style={{
                transform: isHovered
                  ? `perspective(1200px) rotateX(${mousePos.tiltX}deg) rotateY(${mousePos.tiltY}deg) scale3d(1.015, 1.015, 1.015)`
                  : 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
              }}
            >
              {/* Base Workstation Image (1536 x 1024) */}
              <img
                src={designLabImg}
                alt="Sai Meera professional colour-calibrated design workstation"
                className="dl-base-image"
                loading="eager"
              />

              {/* 1. Illuminated Wall Sign Studio Lighting (Purple & Gold Backlights) */}
              <div className={`dl-wall-brand-zone ${isInView ? 'is-active' : ''}`} aria-hidden="true">
                <div className="dl-glow-violet" />
                <div className="dl-glow-gold" />
                <div className="dl-brand-sweep" />
              </div>

              {/* 2. Left Monitor: Graphic Design Prepress Screen (Pixel-Clipped inside Bezel) */}
              <div className={`dl-monitor-screen dl-screen-left ${isInView ? 'is-active' : ''}`} aria-hidden="true">
                <img
                  src={leftScreenImg}
                  alt=""
                  className="dl-screen-base-left"
                  loading="eager"
                />
                {/* Active Artwork Canvas with Subtle Prepress Proofing Dynamics */}
                <div className="dl-canvas-overlay">
                  <img
                    src={artworkImg}
                    alt=""
                    className="dl-canvas-art"
                    loading="eager"
                  />
                  {/* CMYK Soft Proof Pulse */}
                  <div className="dl-cmyk-proof-indicator" />
                </div>
                {/* Anti-reflective Glass & LCD Pixel Sheen */}
                <div className="dl-screen-glass" />
              </div>

              {/* 3. Right Monitor: Photorealistic Living 4K Nature Film (Strictly Clipped inside Screen Bezels) */}
              <div className={`dl-monitor-screen dl-screen-right ${isInView ? 'is-active' : ''}`} aria-hidden="true">
                <LivingNatureMonitor isActive={isInView} />
              </div>

              {/* Dynamic Cursor Ambient Spotlight */}
              <div
                className="dl-cursor-ambient-spot"
                style={{
                  background: isHovered
                    ? `radial-gradient(circle 340px at ${mousePos.glowX}% ${mousePos.glowY}%, rgba(168, 85, 247, 0.16) 0%, rgba(212, 175, 55, 0.12) 35%, transparent 70%)`
                    : 'transparent',
                }}
                aria-hidden="true"
              />

              {/* Fine Archival Corner Brackets */}
              <div className="dl-frame-bracket dl-bracket-tl" aria-hidden="true" />
              <div className="dl-frame-bracket dl-bracket-tr" aria-hidden="true" />
              <div className="dl-frame-bracket dl-bracket-bl" aria-hidden="true" />
              <div className="dl-frame-bracket dl-bracket-br" aria-hidden="true" />

              {/* Studio Edge Vignette */}
              <div className="dl-stage-vignette" aria-hidden="true" />
            </div>

            {/* In-House Design Lab Status Pill */}
            <div className="dl-image-caption">
              <span className="dl-caption-pulse" aria-hidden="true" />
              <span className="dl-caption-text">IN-HOUSE DESIGN LAB · COLOUR CALIBRATED (ΔE &lt; 1.5)</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Editorial Narrative & Studio Capabilities */}
        <motion.div
          className="dl-text-col"
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className="dl-eyebrow-wrap" variants={fadeUp}>
            <span className="dl-eyebrow-line" aria-hidden="true" />
            <span className="dl-eyebrow">DESIGN LAB</span>
          </motion.div>

          <motion.h2 className="dl-heading" variants={fadeUp}>
            Where Ideas<br />
            Take Form.
          </motion.h2>

          <motion.p className="dl-body" variants={fadeUp}>
            From concept to print-ready artwork, our in-house design lab ensures perfect colour, clarity and precision at every step — before a single sheet touches the press.
          </motion.p>

          {/* Preserved Feature Capabilities List */}
          <motion.ul className="dl-caps" variants={fadeUp}>
            {capabilities.map((cap, i) => (
              <li key={i} className="dl-cap-item">
                <span className="dl-cap-icon-box">
                  {cap.icon}
                </span>
                <span className="dl-cap-label">{cap.label}</span>
              </li>
            ))}
          </motion.ul>

          {/* Refined CTA Link */}
          <motion.div variants={fadeUp}>
            <Link to="/contact" className="dl-link">
              <span>TALK TO OUR DESIGN TEAM</span>
              <span className="dl-link-arrow">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DesignLab;
