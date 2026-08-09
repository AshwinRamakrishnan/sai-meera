import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRINT_SERVICES_MENU } from '../../data/categories';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    setMobileExpandedGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    return location.pathname.startsWith(path);
  };

  const isServicesActive = PRINT_SERVICES_MENU.some((group) =>
    group.items.some((item) => location.pathname.startsWith(item.to))
  );

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-main">SAI MEERA DIGITAL DESIGN</span>
          <span className="logo-sub">Industrial Printing</span>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="desktop-nav-container">
          {/* Home */}
          <NavLink to="/" end className={({ isActive: a }) => `nav-link ${a ? 'active' : ''}`}>
            {({ isActive: a }) => (
              <>
                {a && (
                  <motion.div
                    layoutId="nav-underline"
                    className="nav-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>Home</span>
              </>
            )}
          </NavLink>

          {/* Products mega-menu */}
          <div
            className={`nav-services-trigger ${isServicesActive ? 'active' : ''} ${servicesOpen ? 'open' : ''}`}
            ref={servicesRef}
          >
            <button
              className={`nav-link nav-services-btn ${isServicesActive ? 'active' : ''}`}
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              {isServicesActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="nav-active-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Products
                <motion.span
                  animate={{ rotate: servicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', lineHeight: 0 }}
                >
                  <ChevronDown size={14} strokeWidth={2.5} />
                </motion.span>
              </span>
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  className="nav-mega-menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mega-menu-inner">
                    <div className="mega-menu-columns">
                      {PRINT_SERVICES_MENU.map((group) => (
                        <div key={group.group} className="mega-menu-col">
                          <div
                            className="mega-menu-group-label"
                            style={{ '--group-accent': group.accentColor }}
                          >
                            <span className="mega-group-dot" style={{ background: group.accentColor }} />
                            {group.group}
                          </div>
                          {group.items.map((item) => {
                            const itemActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                            return (
                              <NavLink
                                key={item.to}
                                to={item.to}
                                className={`mega-menu-item ${itemActive ? 'mega-active' : ''}`}
                                style={{ '--group-accent': group.accentColor }}
                                onClick={() => setServicesOpen(false)}
                              >
                                <span className="mega-item-name">{item.name}</span>
                                <span className="mega-item-desc">{item.desc}</span>
                              </NavLink>
                            );
                          })}
                          {group.moreCount > 0 && (
                            <NavLink
                              to={group.moreLink}
                              className="mega-menu-more-link"
                              style={{ color: group.accentColor }}
                              onClick={() => setServicesOpen(false)}
                            >
                              +{group.moreCount} more →
                            </NavLink>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mega-menu-cta-strip">
                      <Link to="/products" className="mega-cta-browse" onClick={() => setServicesOpen(false)}>
                        Browse full catalogue →
                      </Link>
                      <Link to="/contact" className="mega-cta-btn" onClick={() => setServicesOpen(false)}>
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Our Work */}
          <a href="/#machines-strip" className="nav-link">
            <span style={{ position: 'relative', zIndex: 2 }}>Our Work</span>
          </a>

          {/* Contact */}
          <NavLink
            to="/contact"
            className={({ isActive: a }) => `nav-link ${a ? 'active' : ''}`}
          >
            {({ isActive: a }) => (
              <>
                {a && (
                  <motion.div
                    layoutId="nav-underline"
                    className="nav-active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>Contact</span>
              </>
            )}
          </NavLink>

          {/* GET A QUOTE button */}
          <Link to="/contact" className="nav-quote-btn">Get a Quote</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </button>
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
