import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRINT_SERVICES_MENU } from '../../data/categories';
import smLogo from '../../assets/sm_logo.jpg';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const location = useLocation();

  // Scroll state detection — navbar remains visible continuously
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset states on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    setMobileExpandedGroup(null);
  }, [location.pathname]);

  // Close services mega-menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isServicesActive = PRINT_SERVICES_MENU.some((group) =>
    group.items.some((item) => location.pathname.startsWith(item.to))
  );

  const isServicesActive = PRINT_SERVICES_MENU.some((group) =>
    group.items.some((item) => location.pathname.startsWith(item.to))
  );

  return (
    <nav
      className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}
      aria-label="Main Navigation"
    >
      <div className="nav-container">
        {/* LEFT: Brand Identity & Logo */}
        <div className="nav-left">
          <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="nav-logo-wrap">
              <img src={smLogo} alt="Sai Meera Logo" className="nav-logo-img" />
            </div>
            <div className="nav-brand-text">
              <span className="logo-main">SAI MEERA DIGITAL DESIGN</span>
              <span className="logo-sub">Industrial Printing</span>
            </div>
          </Link>
        </div>

        {/* CENTER: Four Individual Navigation Boxes */}
        <div className="nav-center">
          <div className="nav-boxes-group">
            {/* Box 1: Home */}
            <NavLink
              to="/"
              end
              className={({ isActive: a }) => `nav-box ${a ? 'active' : ''}`}
            >
              {({ isActive: a }) => (
                <>
                  {a && <span className="nav-box-dot" aria-hidden="true" />}
                  <span className="nav-box-label">Home</span>
                </>
              )}
            </NavLink>

            {/* Box 2: Products Dropdown */}
            <div
              className={`nav-box nav-box-dropdown ${isServicesActive ? 'active' : ''} ${servicesOpen ? 'open' : ''}`}
              ref={servicesRef}
            >
              <button
                type="button"
                className="nav-box-btn"
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                {isServicesActive && <span className="nav-box-dot" aria-hidden="true" />}
                <span className="nav-box-label">Products</span>
                <motion.span
                  animate={{ rotate: servicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="nav-chevron-wrap"
                >
                  <ChevronDown size={13} strokeWidth={2.5} />
                </motion.span>
              </button>

              {/* Mega-Menu Dropdown */}
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    className="nav-mega-menu"
                    initial={{ opacity: 0, y: -8, x: '-50%', scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: -8, x: '-50%', scale: 0.985 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="mega-menu-inner">
                      <div className="mega-menu-columns">
                        {PRINT_SERVICES_MENU.map((group) => (
                          <div key={group.group} className="mega-menu-col">
                            <div className="mega-menu-group-header">
                              <span className="mega-group-gold-dot" aria-hidden="true" />
                              <span className="mega-group-title">{group.group}</span>
                            </div>
                            {group.items.map((item) => {
                              const itemActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                              return (
                                <NavLink
                                  key={item.to}
                                  to={item.to}
                                  className={`mega-menu-item ${itemActive ? 'mega-active' : ''}`}
                                  onClick={() => setServicesOpen(false)}
                                >
                                  <div className="mega-item-indicator" aria-hidden="true" />
                                  <div className="mega-item-text">
                                    <span className="mega-item-name">{item.name}</span>
                                    <span className="mega-item-desc">{item.desc}</span>
                                  </div>
                                </NavLink>
                              );
                            })}
                            {group.moreCount > 0 && (
                              <NavLink
                                to={group.moreLink}
                                className="mega-menu-more-link"
                                onClick={() => setServicesOpen(false)}
                              >
                                <span>+{group.moreCount} more</span>
                                <span className="mega-more-arrow" aria-hidden="true">→</span>
                              </NavLink>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mega-menu-cta-strip">
                        <Link to="/products" className="mega-cta-browse" onClick={() => setServicesOpen(false)}>
                          <span>Browse full catalogue</span>
                          <span className="mega-browse-arrow" aria-hidden="true">→</span>
                        </Link>
                        <span className="mega-footer-tag">Bespoke Foil & Bulk Offset Production</span>
                        <Link to="/contact" className="mega-cta-btn" onClick={() => setServicesOpen(false)}>
                          Get a Quote
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Box 3: Our Work */}
            <a href="/#machines-strip" className="nav-box">
              <span className="nav-box-label">Our Work</span>
            </a>

            {/* Box 4: Contact */}
            <NavLink
              to="/contact"
              className={({ isActive: a }) => `nav-box ${a ? 'active' : ''}`}
            >
              {({ isActive: a }) => (
                <>
                  {a && <span className="nav-box-dot" aria-hidden="true" />}
                  <span className="nav-box-label">Contact</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        {/* RIGHT: CTA & Mobile Menu Trigger */}
        <div className="nav-right">
          <Link to="/contact" className="nav-quote-btn">Get a Quote</Link>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { delay: 0.15, duration: 0.2 } }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <NavLink to="/" end className={({ isActive: a }) => `mobile-nav-link ${a ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="mobile-nav-group-label">Products</div>
              {PRINT_SERVICES_MENU.map((group) => (
                <div key={group.group} className="mobile-nav-accordion-group">
                  <button
                    className="mobile-nav-accordion-btn"
                    onClick={() => setMobileExpandedGroup(prev => prev === group.group ? null : group.group)}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>{group.group}</span>
                    <motion.div animate={{ rotate: mobileExpandedGroup === group.group ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileExpandedGroup === group.group && (
                      <motion.div
                        className="mobile-nav-accordion-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        {group.items.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className={`mobile-nav-sublink ${location.pathname.startsWith(item.to) ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>

            <a href="/#machines-strip" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Our Work</a>
            <NavLink to="/contact" className={({ isActive: a }) => `mobile-nav-link ${a ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
            <NavLink to="/contact" className="mobile-nav-link mobile-nav-contact" onClick={() => setMobileMenuOpen(false)}>Get a Quote</NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
