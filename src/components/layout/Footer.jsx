import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top-divider"></div>
      <div className="footer-container">
        <div className="footer-brand">
          <span className="brand-text">ChromaPress</span>
        </div>
        
        <div className="cmyk-dots">
          <div className="dot dot-c"></div>
          <div className="dot dot-m"></div>
          <div className="dot dot-y"></div>
          <div className="dot dot-k"></div>
        </div>
        
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
