import React from 'react';
import { Link } from 'react-router-dom';
import './CtaBanner.css';

const CtaBanner = () => (
  <section className="cta-banner" id="cta-banner">
    <div className="cta-banner-inner">
      <div className="cta-banner-left">
        <h2 className="cta-banner-heading">HAVE A PROJECT IN MIND?</h2>
        <p className="cta-banner-sub">Let's bring your ideas to life with precision printing.</p>
      </div>
      <Link to="/contact" className="cta-banner-btn">GET A FREE QUOTE →</Link>
    </div>
  </section>
);

export default CtaBanner;
