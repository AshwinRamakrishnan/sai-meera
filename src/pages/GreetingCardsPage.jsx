import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PartyPopper, Sparkles, Wheat, Trees, HeartHandshake, Briefcase, Rocket, Heart, Palette, Droplets, Wand2, Maximize, ArrowRight, Phone } from 'lucide-react';
import './GreetingCardsPage.css';

const GreetingCardsPage = () => {
  const cards = [
    { title: 'Birthday Celebration', emoji: '🎂', icon: <PartyPopper size={26} />, desc: 'Colorful balloons & confetti design.', spec: 'Custom message inside, 300gsm art paper', price: 'From ₹15/card' },
    { title: 'Diwali Festival', emoji: '🪔', icon: <Sparkles size={26} />, desc: 'Diyas, rangoli, and Lakshmi illustration.', spec: 'Gold foil accents, premium silk finish', price: 'From ₹22/card' },
    { title: 'Pongal Harvest', emoji: '🌾', icon: <Wheat size={26} />, desc: 'Traditional pots, sugarcane, and kolam.', spec: 'Authentic Tamil artwork, eco-friendly inks', price: 'From ₹18/card' },
    { title: 'Christmas Joy', emoji: '🎄', icon: <Trees size={26} />, desc: 'Christmas tree, stars, and snow design.', spec: 'Glitter finish, premium envelope included', price: 'From ₹20/card' },
    { title: 'Thank You Cards', emoji: '🙏', icon: <HeartHandshake size={26} />, desc: 'Elegant floral and gratitude typography.', spec: 'Matte or gloss, custom sizes available', price: 'From ₹12/card' },
    { title: 'Corporate Greetings', emoji: '🏢', icon: <Briefcase size={26} />, desc: 'Professional branded stationery design.', spec: 'Bulk orders from 100pcs, logo printing', price: 'From ₹10/card' },
    { title: 'New Year Wishes', emoji: '🎆', icon: <Rocket size={26} />, desc: 'Fireworks and festive celebration design.', spec: 'Metallic ink, A5 / A6 sizes available', price: 'From ₹15/card' },
    { title: 'Anniversary Cards', emoji: '💍', icon: <Heart size={26} />, desc: 'Romantic hearts, roses, and couple design.', spec: 'Embossed finish, photo printing available', price: 'From ₹18/card' },
  ];

  const customizationOptions = [
    { icon: <Palette size={26} />, title: 'Paper Types', desc: 'Art paper, textured, handmade, recycled, and metallic options.' },
    { icon: <Droplets size={26} />, title: 'Finishes', desc: 'Matte, high-gloss, soft-touch velvet, and raised Spot UV.' },
    { icon: <Wand2 size={26} />, title: 'Special Effects', desc: 'Hot foil stamping, blind embossing, die-cut, and glitter print.' },
    { icon: <Maximize size={26} />, title: 'Sizes', desc: 'A4, A5, A6, square DL, and any fully custom dimensions.' },
  ];

  const pricingTiers = [
    { name: 'Standard', price: '₹15', desc: 'From ₹15/card · Min 50 pieces', features: ['Offset CMYK Print', 'Matte or Gloss', '300gsm Art Paper', 'Standard Envelope'] },
    { name: 'Premium', price: '₹30', desc: 'From ₹30/card · Min 25 pieces', features: ['Foil Stamping', 'Textured Paper', '350gsm Board', 'Custom Envelope'], popular: true },
    { name: 'Luxury', price: '₹60', desc: 'From ₹60/card · Min 10 pieces', features: ['Multi-Foil & Emboss', 'Handmade Paper', 'Box Packaging', 'Custom Inserts'] },
  ];

  return (
    <div className="greet-page">
      <Helmet>
        <title>Premium Wedding & Greeting Cards | SAI MEERA DIGITAL DESIGN</title>
        <meta name="description" content="Custom designed luxury wedding invitations, business cards, and greeting cards printed with precision in Kumbakonam." />
        <meta property="og:title" content="Premium Wedding & Greeting Cards | SAI MEERA DIGITAL DESIGN" />
        <meta property="og:description" content="Custom designed luxury wedding invitations, business cards, and greeting cards printed with precision in Kumbakonam." />
      </Helmet>
      {/* Hero */}
      <section className="greet-hero">
        <div className="greet-hero-label">// GREETING CARD PRINTING</div>
        <h1>Custom Greeting<br />Card Printing</h1>
        <p>Beautiful cards for every occasion — birthdays, Tamil festivals, corporate events, and personal milestones.</p>
        <Link to="/contact" className="greet-hero-cta">Design Your Cards →</Link>
      </section>

      {/* Card Gallery */}
      <section className="greet-section">
        <h2 className="greet-section-title">Occasions We <span>Cover</span></h2>
        <p className="greet-section-sub">Every festival, every milestone — printed to perfection.</p>
        <div className="greet-grid-4">
          {cards.map((card, i) => (
            <div key={i} className="greet-glass-card greet-category-card">
              <div className="greet-icon-wrapper">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}<br /><small style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{card.spec}</small></p>
              <div className="greet-price-tag">{card.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Customization */}
      <section className="greet-section">
        <h2 className="greet-section-title">Customization <span>Options</span></h2>
        <p className="greet-section-sub">Every detail of your card tailored exactly to your vision.</p>
        <div className="greet-grid-4">
          {customizationOptions.map((opt, i) => (
            <div key={i} className="greet-glass-card greet-category-card">
              <div className="greet-icon-wrapper">{opt.icon}</div>
              <h3>{opt.title}</h3>
              <p>{opt.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="greet-section">
        <h2 className="greet-section-title">Pricing <span>Packages</span></h2>
        <p className="greet-section-sub">Transparent pricing, no hidden costs.</p>
        <div className="greet-grid-3">
          {pricingTiers.map((tier, i) => (
            <div key={i} className={`greet-glass-card greet-category-card${tier.popular ? ' popular-tier' : ''}`} style={tier.popular ? { borderColor: 'rgba(0,255,148,0.35)', background: 'rgba(0,255,148,0.04)' } : {}}>
              {tier.popular && <div style={{ background: 'linear-gradient(135deg,#00ff94,#7fffd4)', color: '#0a0a0f', borderRadius: '100px', padding: '0.3rem 1rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem', alignSelf: 'flex-start' }}>Most Popular</div>}
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{tier.name}</h3>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'Outfit', color: '#00ff94', margin: '0.5rem 0 0.25rem' }}>{tier.price}</div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>{tier.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
                {tier.features.map((f, fi) => (
                  <li key={fi} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: '#00ff94', fontSize: '0.6rem' }}>▸</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="greet-cta-section">
        <h2>Create Cards That Leave a Lasting Impression</h2>
        <p>Let's design something truly memorable for your occasion.</p>
        <Link to="/contact" className="greet-cta-btn">
          <Phone size={16} /> Get Started Today
        </Link>
        <span className="greet-phone">+91 95970 72660</span>
      </section>
    </div>
  );
};

export default GreetingCardsPage;
