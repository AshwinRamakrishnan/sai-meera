import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Store, PartyPopper, Car, Presentation, Eye, Megaphone, CheckCircle, Shield, Zap, Wrench, Phone } from 'lucide-react';
import './FlexBannersPage.css';

const FlexBannersPage = () => {
  const products = [
    { id: 1, icon: <Store size={26} />, title: 'Shop Sign Boards', description: 'Flex board with backlit or frontlit options for maximum high-visibility impact on busy streets.', size: 'Custom up to 10ft width', material: 'Star Flex / Backlit Flex' },
    { id: 2, icon: <PartyPopper size={26} />, title: 'Event Banners', description: 'Stage backdrops, birthday banners, and conference backdrops in brilliant, vibrant colors.', size: 'Any custom size', material: 'Star Flex' },
    { id: 3, icon: <Car size={26} />, title: 'Vehicle Wraps', description: 'Full or partial vinyl wraps for cars, vans, autos, and commercial trucks that command attention.', size: 'Custom per vehicle', material: 'Premium Cast Vinyl' },
    { id: 4, icon: <Presentation size={26} />, title: 'Exhibition Stalls', description: 'Pop-up displays, roll-up standees, and custom backdrop walls for trade fairs and expos.', size: 'Standard & Custom sizes', material: 'Vinyl / Canvas / Flex' },
    { id: 5, icon: <Eye size={26} />, title: 'One-Way Vision', description: 'Perforated vinyl for glass storefronts — full privacy inside, full advertising outside.', size: 'Custom roll width', material: 'One-Way Vision Vinyl' },
    { id: 6, icon: <Megaphone size={26} />, title: 'Hoardings & Billboards', description: 'Massive outdoor advertising flex for maximum reach, visibility, and brand recognition.', size: 'Large format (any)', material: 'Heavy-duty 480gsm Flex' },
  ];

  const features = [
    { icon: <Shield size={22} />, title: 'UV-Resistant Inks', description: '3–5 year outdoor durability. Zero colour fading in harsh Tamil Nadu sunlight.' },
    { icon: <CheckCircle size={22} />, title: 'Eco-Solvent Technology', description: 'Low VOC, environmentally responsible printing process for every job.' },
    { icon: <Zap size={22} />, title: 'Same-Day Printing', description: 'Rush orders handled efficiently. Urgent events are our specialty.' },
    { icon: <Wrench size={22} />, title: 'Free Installation', description: 'Professional mounting team for all large-scale outdoor hoarding projects.' },
  ];

  return (
    <div className="flex-page">
      <Helmet>
        <title>Flex Banner & Vinyl Printing — Sai Meera</title>
        <meta name="description" content="Large format eco-solvent flex and vinyl printing in Chennai. Shop boards, event banners, vehicle wraps, hoardings, and one-way vision. UV-resistant, same-day printing available." />
        <meta property="og:title" content="Flex Banner Printing — Sai Meera" />
        <meta property="og:description" content="Eye-catching outdoor advertising that withstands sun, rain, and wind. Industrial-grade eco-solvent inks for maximum longevity." />
      </Helmet>
      {/* Hero */}
      <section className="flex-hero">
        <div className="flex-hero-label">// LARGE FORMAT PRINTING</div>
        <h1>Flex & Vinyl<br />Printing Solutions</h1>
        <p>Eye-catching outdoor advertising that withstands sun, rain, and wind. Printed with industrial-grade eco-solvent inks for maximum longevity.</p>
        <Link to="/contact" className="flex-hero-cta">Get an Instant Quote →</Link>
      </section>

      {/* Products */}
      <section className="flex-section">
        <h2 className="flex-section-title">Our Printing <span>Solutions</span></h2>
        <p className="flex-section-sub">From shop boards to stadium hoardings — we print every scale.</p>
        <div className="flex-grid-3">
          {products.map(p => (
            <div key={p.id} className="flex-glass-card flex-category-card">
              <div className="flex-icon-wrapper">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <ul className="flex-specs-list">
                <li>Size: {p.size}</li>
                <li>Material: {p.material}</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Material Specs Table */}
      <section className="flex-section">
        <h2 className="flex-section-title">Material <span>Specifications</span></h2>
        <p className="flex-section-sub">Choose the right material for your specific use case.</p>
        <div className="flex-table-scroll">
          <div className="flex-glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <table className="flex-size-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>GSM</th>
                  <th>Weather Rating</th>
                  <th>Usage</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Star Flex', '280gsm', '★★★★★', 'Outdoor', '₹12/sqft'],
                  ['Vinyl', '120gsm', '★★★★☆', 'Indoor & Outdoor', '₹18/sqft'],
                  ['Backlit Flex', '440gsm', '★★★★★', 'Outdoor (LED)', '₹22/sqft'],
                  ['Canvas', '380gsm', '★★★☆☆', 'Indoor / Decor', '₹35/sqft'],
                  ['One-Way Vision', '140gsm', '★★★★☆', 'Glass Windows', '₹28/sqft'],
                ].map(([mat, gsm, rating, use, price]) => (
                  <tr key={mat}>
                    <td style={{ color: '#fff', fontWeight: 600 }}>{mat}</td>
                    <td>{gsm}</td>
                    <td style={{ color: '#00d4ff' }}>{rating}</td>
                    <td>{use}</td>
                    <td style={{ color: '#00d4ff', fontWeight: 600 }}>{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="flex-section">
        <h2 className="flex-section-title">Why Choose <span>Us</span></h2>
        <p className="flex-section-sub">Industry-leading quality backed by 20+ years of experience.</p>
        <div className="flex-grid-2">
          {features.map((f, i) => (
            <div key={i} className="flex-glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div className="flex-icon-wrapper" style={{ flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex-cta-section">
        <h2>Need a Banner That Makes an Impact?</h2>
        <p>Let's bring your outdoor advertising to life — fast, bold, and durable.</p>
        <Link to="/contact" className="flex-cta-btn">
          <Phone size={16} /> Contact Us Today
        </Link>
        <span className="flex-phone">+91 98765 43210</span>
      </section>
    </div>
  );
};

export default FlexBannersPage;
