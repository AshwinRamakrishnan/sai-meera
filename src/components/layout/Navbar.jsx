import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRINT_SERVICES_MENU } from '../../data/categories';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    return location.pathname.startsWith(path);
  };

  // Check if any Print Services route is active (for dropdown trigger highlight)
  const isServicesActive = PRINT_SERVICES_MENU.some((group) =>
    group.items.some((item) => location.pathname.startsWith(item.to))
  );

  const mainLinks = [
    { name: 'Home', to: '/' },
    { name: 'Machines', to: '/#machines', hash: true },
    { name: 'Our Work', to: '/#services', hash: true },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-main">Sai Meera</span>
          <span className="logo-sub">INDUSTRIAL PRINTING</span>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="desktop-nav-container">
          {/* Static links */}
          {mainLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <React.Fragment key={link.name}>
                {link.hash ? (
                  <a href={link.to} className={`nav-link ${active ? 'active' : ''}`}>
                    <span style={{ position: 'relative', zIndex: 2 }}>{link.name}</span>
                  </a>
                ) : (
                  <NavLink to={link.to} className={`nav-link ${active ? 'active' : ''}`}>
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="nav-active-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 2 }}>{link.name}</span>
                  </NavLink>
                )}
              </React.Fragment>
            );
          })}

          {/* Divider */}
          <div className="nav-divider" />

            {/* ── Print Services Mega-Menu Trigger ── */}
          <div
            className={`nav-services-trigger ${isServicesActive ? 'active' : ''} ${servicesOpen ? 'open' : ''}`}
            ref={servicesRef}
          >
            <button
              className="nav-link nav-services-btn"
              onClick={() => setServicesOpen((v) => !v)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              {isServicesActive && (
                <motion.div
                  layoutId="active-pill"
                  className="nav-active-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Print Services
                <motion.span
                  animate={{ rotate: servicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', lineHeight: 0 }}
                >
                  <ChevronDown size={14} strokeWidth={2.5} />
                </motion.span>
              </span>
            </button>

            {/* ── 4-Column Mega-Menu Dropdown ── */}
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  className="nav-mega-menu"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
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
                            <span
                              className="mega-group-dot"
                              style={{ background: group.accentColor }}
                            />
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

                    {/* Bottom CTA strip */}
                    <div className="mega-menu-cta-strip">
                      <Link
                        to="/products"
                        className="mega-cta-browse"
                        onClick={() => setServicesOpen(false)}
                      >
                        Browse full catalogue →
                      </Link>
                      <Link
                        to="/contact"
                        className="mega-cta-btn"
                        onClick={() => setServicesOpen(false)}
                      >
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact link */}
          <NavLink
            to="/contact"
            className={`nav-link nav-contact-btn ${isActive('/contact') ? 'active' : ''}`}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>Contact</span>
          </NavLink>
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
            {/* Static links */}
            {mainLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.28 }}
              >
                {link.hash ? (
                  <a
                    href={link.to}
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <NavLink
                    to={link.to}
                    className={`mobile-nav-link ${isActive(link.to) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                )}
              </motion.div>
            ))}

            {/* Print Services section in mobile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: mainLinks.length * 0.05 + 0.1, duration: 0.28 }}
            >
              <div className="mobile-nav-group-label">Print Services</div>
              {PRINT_SERVICES_MENU.map((group) =>
                group.items.map((item, gi) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`mobile-nav-link mobile-nav-sublink ${location.pathname.startsWith(item.to) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ))
              )}
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: mainLinks.length * 0.05 + 0.25, duration: 0.28 }}
            >
              <NavLink
                to="/contact"
                className="mobile-nav-link mobile-nav-contact"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </NavLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
