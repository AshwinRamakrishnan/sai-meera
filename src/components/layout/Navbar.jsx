import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Main sections (Replacing 'Legacy' with 'Home')
  const mainLinks = [
    { name: 'Home', to: '/' },
    { name: 'Machines', to: '/#machines', hash: true },
    { name: 'Services', to: '/#services', hash: true },
    { name: 'Contact', to: '/contact', hash: false },
  ];

  // Product/Service page links
  const pageLinks = [
    { name: 'Invitations', to: '/invitations' },
    { name: 'Flex Banners', to: '/flex-banners' },
    { name: 'Greeting Cards', to: '/greeting-cards' },
  ];

  // Combine links for the mobile menu stagger
  const allLinks = [...mainLinks, ...pageLinks];

  // Determine active state for the pill animation
  const isActive = (path, hash) => {
    if (hash) {
      return location.pathname === '/' && location.hash === hash;
    }
    // If it's home (and no hash), it's active only if on '/' exactly and no hash is present
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-main">Sai Meera</span>
          <span className="logo-sub">INDUSTRIAL PRINTING</span>
        </Link>

        {/* Desktop Nav - Floating Glass Pill */}
        <div className="desktop-nav-container">
          {mainLinks.map((link) => {
            const active = isActive(link.to, link.hash ? link.to.substring(1) : false);
            return (
              <React.Fragment key={link.name}>
                {link.hash ? (
                  <a href={link.to} className={`nav-link ${active ? 'active' : ''} magnetic`}>
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="nav-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 2 }}>{link.name}</span>
                  </a>
                ) : (
                  <NavLink to={link.to} className={`nav-link ${active ? 'active' : ''} magnetic`}>
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="nav-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 2 }}>{link.name}</span>
                  </NavLink>
                )}
              </React.Fragment>
            );
          })}
          {/* Subtle separator */}
          <div style={{ width: 1, background: 'var(--glass-border)', margin: '8px 12px' }} />
          {pageLinks.map((link) => {
            const active = isActive(link.to, false);
            return (
              <NavLink key={link.name} to={link.to} className={`nav-link ${active ? 'active' : ''} magnetic`}>
                {active && (
                  <motion.div
                    layoutId="active-pill"
                    className="nav-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 2 }}>{link.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button className="mobile-menu-btn magnetic" onClick={toggleMenu} aria-label="Toggle menu">
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.div>
        </button>
      </div>

      {/* Cinematic Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { delay: 0.2, duration: 0.2 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {allLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.3, ease: "easeOut" }}
              >
                {link.hash ? (
                  <a
                    href={link.to}
                    className={`mobile-nav-link ${isActive(link.to, link.to.substring(1)) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <NavLink
                    to={link.to}
                    className={`mobile-nav-link ${isActive(link.to, false) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
