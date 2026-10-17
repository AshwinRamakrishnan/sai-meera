import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';
import smLogo from '../../assets/sm_logo.jpg';
import './Footer.css';

const Footer = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: '-6%' });
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmailInput('');
    }
  };

  return (
    <footer className="footer" ref={footerRef}>
      {/* Background Lighting & Ambient Glow */}
      <div className="footer-bg-glow" aria-hidden="true" />
      <div className="footer-gold-drift" aria-hidden="true" />

      {/* ─────────────────────────────────────────────────────────
         FOOTER UPPER CTA BANNER: "Every Great Print Begins With an Idea."
         ───────────────────────────────────────────────────────── */}
      <div className="footer-cta-wrapper">
        <motion.div
          className="footer-cta-banner"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="footer-cta-corner footer-cta-corner-tl" aria-hidden="true" />
          <div className="footer-cta-corner footer-cta-corner-br" aria-hidden="true" />
          <div className="footer-cta-sweep" aria-hidden="true" />

          <div className="footer-cta-content">
            <div className="footer-cta-text">
              <div className="footer-cta-badge">
                <Sparkles size={13} className="footer-badge-icon" />
                <span>START YOUR PRINT PROJECT</span>
              </div>
              <h3 className="footer-cta-heading">
                Every Great Print Begins With an Idea.
              </h3>
              <p className="footer-cta-sub">
                From invitations to large-format printing, let's bring your next project to life.
              </p>
            </div>

            <div className="footer-cta-action">
              <Link to="/contact" className="footer-cta-btn magnetic">
                <span>Start Your Project</span>
                <ArrowRight size={16} className="footer-btn-arrow" strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Gold Divider Rail */}
      <div className="footer-rail-divider" aria-hidden="true">
        <div className={`footer-rail-glow ${isInView ? 'is-active' : ''}`} />
      </div>

      {/* ─────────────────────────────────────────────────────────
         MAIN FOUR-COLUMN GRID
         ───────────────────────────────────────────────────────── */}
      <div className="footer-container">
        {/* COLUMN 1: Brand & Identity & Newsletter */}
        <motion.div
          className="footer-col footer-col-brand"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Brand Header with Compact Logo on the LEFT */}
          <Link to="/" className="footer-brand-header">
            <div className="footer-logo-wrap">
              <img
                src={smLogo}
                alt="Sai Meera Digital Design Logo"
                className="footer-logo-img"
              />
            </div>
            <div className="footer-brand-titles">
              <span className="footer-brand-name">SAI MEERA DIGITAL DESIGN</span>
              <span className="footer-brand-subtitle">INDUSTRIAL PRINTING · EST. 1962</span>
            </div>
          </Link>

          <p className="footer-brand-desc">
            World-class digital design and industrial printing solutions since 1962.
            Precision, speed, and uncompromising craftsmanship for every scale.
          </p>

          {/* Newsletter Form */}
          <div className="footer-newsletter-block">
            <span className="newsletter-label">Stay Updated with Print Innovation</span>
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="footer-newsletter-input"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="footer-newsletter-btn"
                aria-label="Subscribe to newsletter"
              >
                <span>Subscribe</span>
                <ArrowRight size={14} className="nl-btn-arrow" />
              </button>
            </form>
            {subscribed && (
              <div className="newsletter-success">
                <CheckCircle2 size={14} />
                <span>Thank you for subscribing!</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* COLUMN 2: Explore Navigation */}
        <motion.div
          className="footer-col footer-col-explore"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <h4 className="footer-col-title">Explore</h4>
          <ul className="footer-nav-list">
            <li>
              <Link to="/" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/products" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Products Catalogue</span>
              </Link>
            </li>
            <li>
              <a href="/#featured" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Featured Showcase</span>
              </a>
            </li>
            <li>
              <a href="/#machines" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Our Machinery</span>
              </a>
            </li>
            <li>
              <a href="/#design-lab" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Design Lab</span>
              </a>
            </li>
            <li>
              <a href="/#trust-quality" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Why Choose Sai Meera</span>
              </a>
            </li>
            <li>
              <Link to="/contact" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Contact & Studio</span>
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* COLUMN 3: Printing Solutions */}
        <motion.div
          className="footer-col footer-col-solutions"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
          <h4 className="footer-col-title">Printing Solutions</h4>
          <ul className="footer-nav-list">
            <li>
              <Link to="/products?group=invitations" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Premium Invitations</span>
              </Link>
            </li>
            <li>
              <Link to="/products/flex-banner" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Flex Banners & Outdoor</span>
              </Link>
            </li>
            <li>
              <Link to="/products/wedding-flex" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Wedding Stage Backdrops</span>
              </Link>
            </li>
            <li>
              <Link to="/products/greeting-card" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Greeting & Festival Cards</span>
              </Link>
            </li>
            <li>
              <Link to="/products/visiting-card" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Visiting & Business Cards</span>
              </Link>
            </li>
            <li>
              <Link to="/products/bill-book" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Bill Books & Stationery</span>
              </Link>
            </li>
            <li>
              <Link to="/products/custom-print" className="footer-nav-link">
                <span className="nav-link-dot" aria-hidden="true" />
                <span>Custom Industrial Print</span>
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* COLUMN 4: Get in Touch */}
        <motion.div
          className="footer-col footer-col-contact"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
        >
          <h4 className="footer-col-title">Get in Touch</h4>
          <div className="footer-contact-list">
            {/* Address */}
            <a
              href="https://maps.app.goo.gl/79SY4jFrrAU4GH388"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-item"
              aria-label="View location on Google Maps"
            >
              <div className="footer-contact-icon">
                <MapPin size={16} />
              </div>
              <div className="footer-contact-text">
                <span className="footer-contact-label">Our Printworks</span>
                <p className="footer-contact-val">
                  60, Thukkampalayam St, Karna Kollai Agraharam, Kumbakonam, TN 612001
                </p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:saimeeradd@gmail.com"
              className="footer-contact-item"
              aria-label="Email saimeeradd@gmail.com"
            >
              <div className="footer-contact-icon">
                <Mail size={16} />
              </div>
              <div className="footer-contact-text">
                <span className="footer-contact-label">Email Inquiries</span>
                <p className="footer-contact-val footer-val-mono">saimeeradd@gmail.com</p>
              </div>
            </a>

            {/* Telephone & WhatsApp */}
            <a
              href="tel:+919597072660"
              className="footer-contact-item"
              aria-label="Call +91 95970 72660"
            >
              <div className="footer-contact-icon">
                <Phone size={16} />
              </div>
              <div className="footer-contact-text">
                <span className="footer-contact-label">Phone & Support</span>
                <p className="footer-contact-val footer-val-mono">+91 95970 72660</p>
              </div>
            </a>

            {/* Hours */}
            <div className="footer-contact-item non-interactive">
              <div className="footer-contact-icon">
                <Clock size={16} />
              </div>
              <div className="footer-contact-text">
                <span className="footer-contact-label">Studio Hours</span>
                <p className="footer-contact-val">Mon – Sat: 9:00 AM – 8:00 PM</p>
                <span className="footer-contact-subval">Sunday: Closed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────
         PREMIUM BOTTOM BAR
         ───────────────────────────────────────────────────────── */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          {/* Copyright Text */}
          <div className="footer-bottom-left">
            <span className="footer-copyright">
              &copy; {new Date().getFullYear()} SAI MEERA DIGITAL DESIGN. Industrial Printing Since 1962. All rights reserved.
            </span>
          </div>

          {/* Heritage Tag & Town */}
          <div className="footer-bottom-center">
            <span className="footer-heritage-tag">
              Crafted with Precision in Kumbakonam, Tamil Nadu
            </span>
          </div>

          {/* Social Links */}
          <div className="footer-bottom-right">
            <div className="footer-social-row">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Follow Sai Meera on Instagram"
              >
                <FaInstagram size={15} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Follow Sai Meera on Twitter"
              >
                <FaTwitter size={15} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Connect with Sai Meera on LinkedIn"
              >
                <FaLinkedin size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label="Follow Sai Meera on Facebook"
              >
                <FaFacebook size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
