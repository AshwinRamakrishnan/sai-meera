import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bg-glow" />
      
      <div className="footer-container">
        {/* Brand & Newsletter */}
        <div className="footer-brand">
          <h2>Sai Meera</h2>
          <p>World-class industrial printing solutions. Precision, speed, and uncompromising quality for every scale.</p>
          
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Subscribe to our newsletter" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-btn magnetic">Subscribe</button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="footer-links-col">
          <h4>Products</h4>
          <ul className="footer-links-list">
            <li><Link to="/invitations" className="footer-link magnetic">Premium Invitations</Link></li>
            <li><Link to="/flex-banners" className="footer-link magnetic">Flex Banners</Link></li>
            <li><Link to="/greeting-cards" className="footer-link magnetic">Greeting Cards</Link></li>
            <li><Link to="/#machines" className="footer-link magnetic">Our Machinery</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Company</h4>
          <ul className="footer-links-list">
            <li><Link to="/#services" className="footer-link magnetic">Services</Link></li>
            <li><Link to="/contact" className="footer-link magnetic">Contact Us</Link></li>
            <li><a href="#" className="footer-link magnetic">Privacy Policy</a></li>
            <li><a href="#" className="footer-link magnetic">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Sai Meera Industrial Printing. All rights reserved.
        </div>
        
        <div className="footer-social">
          <a href="#" className="social-icon magnetic" aria-label="Instagram"><FaInstagram size={20} /></a>
          <a href="#" className="social-icon magnetic" aria-label="Twitter"><FaTwitter size={20} /></a>
          <a href="#" className="social-icon magnetic" aria-label="LinkedIn"><FaLinkedin size={20} /></a>
          <a href="#" className="social-icon magnetic" aria-label="Facebook"><FaFacebook size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
