import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Star, Crown, Palette, Award, Phone } from 'lucide-react';
import './InvitationsPage.css';

const InvitationsPage = () => {
  return (
    <div className="invitations-page">
      {/* Hero Section */}
      <section className="hero">
        <h1>Wedding & Event Invitation Printing</h1>
        <p>Exquisite invitations crafted with premium papers, foil stamping, and traditional artistry</p>
      </section>

      {/* Category Cards */}
      <section className="section">
        <h2 className="section-title">Our Invitation Styles</h2>
        <div className="grid-3">
          <div className="glass-card category-card">
            <div className="icon-wrapper"><Heart size={32} /></div>
            <h3>Traditional Tamil Wedding</h3>
            <p>Ornate gold borders, auspicious symbols, and elegant Tamil typography honoring rich traditions.</p>
            <ul className="specs-list">
              <li>Paper: 300gsm Matte/Textured</li>
              <li>Finish: Gold Foil Borders</li>
              <li>Min Order: 100 cards</li>
            </ul>
          </div>
          
          <div className="glass-card category-card">
            <div className="icon-wrapper"><Star size={32} /></div>
            <h3>Hindu Wedding</h3>
            <p>Rich colors, intricate mandala motifs, and traditional Sanskrit slokas for a divine start.</p>
            <ul className="specs-list">
              <li>Paper: Premium Metallic</li>
              <li>Finish: Spot UV & Emboss</li>
              <li>Min Order: 100 cards</li>
            </ul>
          </div>
          
          <div className="glass-card category-card">
            <div className="icon-wrapper"><Sparkles size={32} /></div>
            <h3>Muslim Wedding</h3>
            <p>Stunning geometric patterns, beautiful Arabic calligraphy, and a luxurious green/gold palette.</p>
            <ul className="specs-list">
              <li>Paper: Velvet Touch</li>
              <li>Finish: Gold Foiling</li>
              <li>Min Order: 100 cards</li>
            </ul>
          </div>
          
          <div className="glass-card category-card">
            <div className="icon-wrapper"><Award size={32} /></div>
            <h3>Christian Wedding</h3>
            <p>Elegant crosses, delicate floral designs, and a beautiful pearl finish for a graceful ceremony.</p>
            <ul className="specs-list">
              <li>Paper: Shimmer Pearl</li>
              <li>Finish: Silver/Rose Gold Foil</li>
              <li>Min Order: 50 cards</li>
            </ul>
          </div>
          
          <div className="glass-card category-card">
            <div className="icon-wrapper"><Palette size={32} /></div>
            <h3>Modern Minimalist</h3>
            <p>Clean lines, contemporary fonts, and neutral tones for a chic and understated aesthetic.</p>
            <ul className="specs-list">
              <li>Paper: Heavyweight Cotton</li>
              <li>Finish: Letterpress</li>
              <li>Min Order: 50 cards</li>
            </ul>
          </div>
          
          <div className="glass-card category-card">
            <div className="icon-wrapper"><Crown size={32} /></div>
            <h3>Luxury Foil Stamped</h3>
            <p>Gold/silver foil, embossed textures, and premium cardstock for the ultimate luxurious feel.</p>
            <ul className="specs-list">
              <li>Paper: 350gsm Suede/Handmade</li>
              <li>Finish: Multi-foil & Die-cut</li>
              <li>Min Order: 200 cards</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section">
        <h2 className="section-title">Our Process</h2>
        <div className="process-grid">
          <div className="glass-card process-step">
            <div className="step-number">1</div>
            <h3>Design Consultation</h3>
            <p>Discuss themes, colors, and content with our expert designers.</p>
          </div>
          <div className="glass-card process-step">
            <div className="step-number">2</div>
            <h3>Digital Proof</h3>
            <p>Review and approve the digital preview before printing begins.</p>
          </div>
          <div className="glass-card process-step">
            <div className="step-number">3</div>
            <h3>Premium Printing</h3>
            <p>Offset or digital printing with exquisite foil and embossing options.</p>
          </div>
          <div className="glass-card process-step">
            <div className="step-number">4</div>
            <h3>Quality Delivery</h3>
            <p>Careful packaging and on-time delivery for your special day.</p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section">
        <h2 className="section-title">Pricing Packages</h2>
        <div className="grid-3">
          <div className="glass-card pricing-card">
            <h3>Classic</h3>
            <div className="price">From ₹8/card</div>
            <ul className="specs-list">
              <li>Standard offset printing</li>
              <li>Matte or gloss finish</li>
              <li>300gsm cardstock</li>
              <li>Standard envelopes</li>
            </ul>
          </div>
          <div className="glass-card pricing-card popular">
            <div className="popular-badge">Most Popular</div>
            <h3>Premium</h3>
            <div className="price">From ₹18/card</div>
            <ul className="specs-list">
              <li>Foil stamping options</li>
              <li>Premium textured paper</li>
              <li>350gsm thickness</li>
              <li>Matching custom envelopes</li>
            </ul>
          </div>
          <div className="glass-card pricing-card">
            <h3>Luxury</h3>
            <div className="price">From ₹35/card</div>
            <ul className="specs-list">
              <li>Multi-foil & embossing</li>
              <li>Premium handmade paper</li>
              <li>Box packaging available</li>
              <li>Custom inserts included</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Create Your Perfect Invitation?</h2>
        <p>Let's make your first impression unforgettable.</p>
        <Link to="/#contact" className="cta-button">Get a Free Quote</Link>
        <div className="phone">
          <Phone size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          +91 98765 43210
        </div>
      </section>
    </div>
  );
};

export default InvitationsPage;
