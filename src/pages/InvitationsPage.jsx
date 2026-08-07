import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Star, Crown, Palette, Award, Phone } from 'lucide-react';
import './InvitationsPage.css';

const InvitationsPage = () => {
  return (
    <div className="invitations-page">
      {/* Hero */}
      <section className="inv-hero">
        <div className="inv-hero-label">// PREMIUM INVITATION PRINTING</div>
        <h1>Wedding & Event<br />Invitation Printing</h1>
        <p>Exquisite invitations crafted with premium papers, foil stamping, and traditional artistry for your most special moments.</p>
        <Link to="/contact" className="inv-hero-cta">Get a Free Quote →</Link>
      </section>

      {/* Category Cards */}
      <section className="inv-section">
        <h2 className="inv-section-title">Our <span>Invitation</span> Styles</h2>
        <p className="inv-section-sub">Every culture, every tradition — beautifully represented in print.</p>
        <div className="inv-grid-3">
          <div className="inv-glass-card inv-category-card">
            <div className="inv-icon-wrapper"><Heart size={26} /></div>
            <h3>Traditional Tamil Wedding</h3>
            <p>Ornate gold borders, auspicious Ganesha symbols, and elegant Tamil typography honoring rich Dravidian traditions.</p>
            <ul className="inv-specs-list">
              <li>Paper: 300gsm Matte / Textured</li>
              <li>Finish: Gold Foil Borders</li>
              <li>Min Order: 100 cards</li>
            </ul>
          </div>

          <div className="inv-glass-card inv-category-card">
            <div className="inv-icon-wrapper"><Star size={26} /></div>
            <h3>Hindu Wedding</h3>
            <p>Rich colors, intricate mandala motifs, and traditional Sanskrit slokas for a divine and auspicious start.</p>
            <ul className="inv-specs-list">
              <li>Paper: Premium Metallic</li>
              <li>Finish: Spot UV & Emboss</li>
              <li>Min Order: 100 cards</li>
            </ul>
          </div>

          <div className="inv-glass-card inv-category-card">
            <div className="inv-icon-wrapper"><Sparkles size={26} /></div>
            <h3>Muslim Nikah</h3>
            <p>Stunning Islamic geometric patterns, beautiful Arabic Bismillah calligraphy, and a luxurious green and gold palette.</p>
            <ul className="inv-specs-list">
              <li>Paper: Velvet Touch Finish</li>
              <li>Finish: Gold Foiling</li>
              <li>Min Order: 100 cards</li>
            </ul>
          </div>

          <div className="inv-glass-card inv-category-card">
            <div className="inv-icon-wrapper"><Award size={26} /></div>
            <h3>Christian Wedding</h3>
            <p>Elegant crosses, delicate floral designs, and a beautiful pearl finish for a graceful and timeless ceremony.</p>
            <ul className="inv-specs-list">
              <li>Paper: Shimmer Pearl</li>
              <li>Finish: Silver / Rose Gold Foil</li>
              <li>Min Order: 50 cards</li>
            </ul>
          </div>

          <div className="inv-glass-card inv-category-card">
            <div className="inv-icon-wrapper"><Palette size={26} /></div>
            <h3>Modern Minimalist</h3>
            <p>Clean lines, contemporary fonts, and neutral tones for a chic and understated modern aesthetic.</p>
            <ul className="inv-specs-list">
              <li>Paper: Heavyweight Cotton</li>
              <li>Finish: Letterpress</li>
              <li>Min Order: 50 cards</li>
            </ul>
          </div>

          <div className="inv-glass-card inv-category-card">
            <div className="inv-icon-wrapper"><Crown size={26} /></div>
            <h3>Luxury Foil Stamped</h3>
            <p>Gold and silver foil, embossed textures, and premium cardstock for the ultimate luxurious first impression.</p>
            <ul className="inv-specs-list">
              <li>Paper: 350gsm Suede / Handmade</li>
              <li>Finish: Multi-foil & Die-cut</li>
              <li>Min Order: 200 cards</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="inv-section">
        <h2 className="inv-section-title">Our <span>Process</span></h2>
        <p className="inv-section-sub">From concept to delivery — a seamless, premium experience.</p>
        <div className="inv-process-grid">
          {[
            { n: '1', title: 'Design Consultation', desc: 'Discuss themes, colors, and content with our expert designers.' },
            { n: '2', title: 'Digital Proof', desc: 'Review and approve the digital preview before any printing begins.' },
            { n: '3', title: 'Premium Printing', desc: 'Offset or digital printing with exquisite foil and embossing options.' },
            { n: '4', title: 'Quality Delivery', desc: 'Careful packaging and on-time delivery for your special day.' },
          ].map(step => (
            <div key={step.n} className="inv-glass-card inv-process-step">
              <div className="inv-step-number">{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="inv-section">
        <h2 className="inv-section-title">Pricing <span>Packages</span></h2>
        <p className="inv-section-sub">Transparent, quality-first pricing for every budget.</p>
        <div className="inv-pricing-grid">
          <div className="inv-glass-card inv-pricing-card">
            <h3>Classic</h3>
            <div className="inv-price">From ₹8/card</div>
            <ul className="inv-specs-list" style={{ textAlign: 'left', width: '100%' }}>
              <li>Standard offset printing</li>
              <li>Matte or gloss finish</li>
              <li>300gsm cardstock</li>
              <li>Standard envelopes</li>
            </ul>
          </div>
          <div className="inv-glass-card inv-pricing-card popular">
            <div className="inv-popular-badge">Most Popular</div>
            <h3>Premium</h3>
            <div className="inv-price">From ₹18/card</div>
            <ul className="inv-specs-list" style={{ textAlign: 'left', width: '100%' }}>
              <li>Foil stamping options</li>
              <li>Premium textured paper</li>
              <li>350gsm thickness</li>
              <li>Matching custom envelopes</li>
            </ul>
          </div>
          <div className="inv-glass-card inv-pricing-card">
            <h3>Luxury</h3>
            <div className="inv-price">From ₹35/card</div>
            <ul className="inv-specs-list" style={{ textAlign: 'left', width: '100%' }}>
              <li>Multi-foil & embossing</li>
              <li>Premium handmade paper</li>
              <li>Box packaging available</li>
              <li>Custom inserts included</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="inv-cta-section">
        <h2>Ready to Create Your Perfect Invitation?</h2>
        <p>Let's make your first impression unforgettable.</p>
        <Link to="/contact" className="inv-cta-btn">
          <Phone size={16} /> Get a Free Quote
        </Link>
        <span className="inv-phone">+91 98765 43210</span>
      </section>
    </div>
  );
};

export default InvitationsPage;
