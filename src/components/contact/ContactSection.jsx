import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Clock, MessageCircle, Upload, ArrowUpRight } from 'lucide-react';
import './ContactSection.css';

const ContactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8%' });

  // Interactive Card Cursor Spotlight
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setSpotlight(prev => ({ ...prev, active: false }));
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      {/* Background Subtle Diffused Golden Movement & Radial Spotlight */}
      <div className={`contact-bg-spotlight ${isInView ? 'is-active' : ''}`} aria-hidden="true" />
      <div className="contact-bg-radial-grid" aria-hidden="true" />

      <div className="contact-container">
        {/* Section B Heading with Upward Text Reveal & Animated Gold Accent */}
        <div className="contact-header">
          <motion.div
            className="contact-eyebrow-wrap"
            initial={{ opacity: 0, y: -12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="contact-eyebrow-dash" aria-hidden="true" />
            <span className="contact-eyebrow">GET IN TOUCH</span>
          </motion.div>

          <motion.h2
            className="contact-title"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Ready to Print?
          </motion.h2>

          {/* Thin Animated Gold Accent Line */}
          <motion.div
            className="contact-header-accent-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          />
        </div>

        {/* Section B & C: Main Dark-Glass Contact Experience Card */}
        <motion.div
          className={`contact-glass-card ${spotlight.active ? 'is-hovered' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Corner Framing Brackets */}
          <div className="contact-corner contact-corner-tl" aria-hidden="true" />
          <div className="contact-corner contact-corner-br" aria-hidden="true" />

          {/* Cursor Interactive Spotlight Glow */}
          <div
            className="contact-card-spotlight"
            style={{
              background: spotlight.active
                ? `radial-gradient(circle 320px at ${spotlight.x}% ${spotlight.y}%, rgba(212, 175, 55, 0.14) 0%, rgba(168, 85, 247, 0.06) 40%, transparent 70%)`
                : 'transparent',
            }}
            aria-hidden="true"
          />

          {/* SECTION B: Interactive Contact Actions (WhatsApp & Upload Design) */}
          <motion.div
            className="contact-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* WhatsApp Us Button */}
            <a
              href="https://wa.me/919597072660"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button whatsapp-btn magnetic"
              aria-label="WhatsApp Us at +91 95970 72660"
            >
              <div className="cta-btn-icon-wrap wa-icon-wrap">
                <MessageCircle size={22} className="wa-icon" />
              </div>
              <div className="cta-btn-text-wrap">
                <span className="cta-btn-main">WhatsApp Us</span>
                <span className="cta-btn-sub">+91 95970 72660 · Instant Reply</span>
              </div>
            </a>

            {/* Upload Design Button */}
            <Link
              to="/contact#upload"
              className="cta-button upload-btn magnetic"
              aria-label="Upload Design Files"
            >
              <div className="cta-btn-shimmer" aria-hidden="true" />
              <div className="cta-btn-icon-wrap upload-icon-wrap">
                <Upload size={22} className="upload-icon" />
              </div>
              <div className="cta-btn-text-wrap">
                <span className="cta-btn-main">Upload Design</span>
                <span className="cta-btn-sub">Attach Artwork & Specs</span>
              </div>
            </Link>
          </motion.div>

          {/* Gold Decorative Inner Divider */}
          <div className="contact-card-divider" aria-hidden="true">
            <span className="divider-line" />
            <span className="divider-gem" />
            <span className="divider-line" />
          </div>

          {/* SECTION C: Three Distinct Elegant Contact Information Tiles */}
          <motion.div
            className="contact-tiles-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Tile 1: Location */}
            <a
              href="https://maps.app.goo.gl/79SY4jFrrAU4GH388"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-tile contact-tile-link location-tile"
              aria-label="View SAI MEERA location on Google Maps"
            >
              <div className="tile-icon-box">
                <MapPin size={22} className="tile-icon pin-icon" />
              </div>
              <div className="tile-content">
                <div className="tile-label-row">
                  <span className="tile-label">Location</span>
                  <ArrowUpRight size={14} className="tile-ext-arrow" aria-hidden="true" />
                </div>
                <p className="tile-value">
                  60, Thukkampalayam St, Karna Kollai Agraharam, Kumbakonam, TN 612001
                </p>
                <span className="tile-action-hint">Open in Google Maps →</span>
              </div>
            </a>

            {/* Tile 2: Email */}
            <a
              href="mailto:saimeeradd@gmail.com"
              className="contact-tile contact-tile-link email-tile"
              aria-label="Email saimeeradd@gmail.com"
            >
              <div className="tile-icon-box">
                <Mail size={22} className="tile-icon mail-icon" />
              </div>
              <div className="tile-content">
                <div className="tile-label-row">
                  <span className="tile-label">Email</span>
                  <ArrowUpRight size={14} className="tile-ext-arrow" aria-hidden="true" />
                </div>
                <p className="tile-value email-value">
                  saimeeradd@gmail.com
                </p>
                <span className="tile-action-hint">Send Email Inquiry →</span>
              </div>
            </a>

            {/* Tile 3: Working Hours */}
            <div className="contact-tile hours-tile">
              <div className="tile-icon-box">
                <Clock size={22} className="tile-icon clock-icon" />
              </div>
              <div className="tile-content">
                <div className="tile-label-row">
                  <span className="tile-label">Hours</span>
                  <span className="tile-status-badge">Open Today</span>
                </div>
                <p className="tile-value">
                  Mon – Sat: 9:00 AM – 8:00 PM
                </p>
                <span className="tile-subtext">Sunday: Closed</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
