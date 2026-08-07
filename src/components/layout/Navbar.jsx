import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Main sections (some point to home page hashes)
  const mainLinks = [
    { name: 'Legacy', to: '/#legacy', hash: true },
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

  const handleHashClick = (e, to) => {
    if (location.pathname === '/') {
      return;
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-main">Sai Meera</span>
          <span className="logo-sub">INDUSTRIAL PRINTING</span>
        </Link>

        <div className="desktop-nav">
          {mainLinks.map((link) => (
            link.hash ? (
              <a key={link.name} href={link.to} className="nav-link">
                {link.name}
              </a>
            ) : (
              <NavLink key={link.name} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {link.name}
              </NavLink>
            )
          ))}
          {pageLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="mobile-menu-btn" onClick={toggleMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          {mainLinks.map((link) => (
            link.hash ? (
              <a
                key={link.name}
                href={link.to}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ) : (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            )
          ))}
          {pageLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
