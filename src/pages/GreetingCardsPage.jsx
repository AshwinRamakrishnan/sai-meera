import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PartyPopper,
  Sparkles,
  Wheat,
  Trees,
  HeartHandshake,
  Briefcase,
  Rocket,
  Heart,
  Palette,
  Droplets,
  Wand2,
  Maximize,
  ArrowRight
} from 'lucide-react';
import './GreetingCardsPage.css';

const GreetingCardsPage = () => {
  const cards = [
    {
      title: "Birthday Celebration",
      icon: <PartyPopper size={48} />,
      frontDesc: "Colorful balloons design",
      backDesc: "Custom message inside, 300gsm art paper"
    },
    {
      title: "Diwali Festival",
      icon: <Sparkles size={48} />,
      frontDesc: "Diyas and rangoli design",
      backDesc: "Gold foil accents, premium finish"
    },
    {
      title: "Pongal Harvest",
      icon: <Wheat size={48} />,
      frontDesc: "Pots and sugarcane design",
      backDesc: "Traditional Tamil artwork, eco-friendly inks"
    },
    {
      title: "Christmas Joy",
      icon: <Trees size={48} />,
      frontDesc: "Tree and stars design",
      backDesc: "Glitter finish available, envelope included"
    },
    {
      title: "Thank You",
      icon: <HeartHandshake size={48} />,
      frontDesc: "Elegant floral design",
      backDesc: "Matte/gloss options, custom sizes"
    },
    {
      title: "Corporate Greetings",
      icon: <Briefcase size={48} />,
      frontDesc: "Professional branded design",
      backDesc: "Bulk orders from 100pcs, logo printing"
    },
    {
      title: "New Year",
      icon: <Rocket size={48} />,
      frontDesc: "Fireworks design",
      backDesc: "Metallic ink available, A5/A6 sizes"
    },
    {
      title: "Anniversary",
      icon: <Heart size={48} />,
      frontDesc: "Heart and roses design",
      backDesc: "Embossed finish, couple photo printing"
    }
  ];

  const customizationOptions = [
    {
      title: "Paper Types",
      icon: <Palette size={32} />,
      desc: "Art paper, textured, handmade, recycled"
    },
    {
      title: "Finishes",
      icon: <Droplets size={32} />,
      desc: "Matte, glossy, soft-touch, spot UV"
    },
    {
      title: "Special Effects",
      icon: <Wand2 size={32} />,
      desc: "Foil stamping, embossing, die-cut, glitter"
    },
    {
      title: "Sizes",
      icon: <Maximize size={32} />,
      desc: "A4, A5, A6, square, custom"
    }
  ];

  const pricingTiers = [
    {
      name: "Standard",
      price: "₹15",
      desc: "From ₹15/card (min 50)"
    },
    {
      name: "Premium",
      price: "₹30",
      desc: "From ₹30/card (min 25)"
    },
    {
      name: "Luxury",
      price: "₹60",
      desc: "From ₹60/card (min 10)"
    }
  ];

  return (
    <div className="greeting-cards-page">
      <section className="hero-section">
        <h1 className="hero-title">Custom Greeting Card Printing</h1>
        <p className="hero-subtitle">Beautiful cards for every occasion — birthdays, festivals, corporate events, and more</p>
      </section>

      <section className="gallery-section">
        <div className="gallery-grid">
          {cards.map((card, index) => (
            <div key={index} className="card-flip">
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-front-icon">
                    {card.icon}
                  </div>
                  <h3 className="card-front-title">{card.title}</h3>
                  <p className="card-desc">{card.frontDesc}</p>
                </div>
                <div className="card-back">
                  <p className="card-back-desc">{card.backDesc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="customization-section">
        <div className="customization-container">
          <h2 className="section-title">Customization Options</h2>
          <div className="options-grid">
            {customizationOptions.map((option, index) => (
              <div key={index} className="option-card">
                <div className="option-icon">{option.icon}</div>
                <h3 className="option-title">{option.title}</h3>
                <p className="option-desc">{option.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <h2 className="section-title">Pricing</h2>
        <div className="pricing-grid">
          {pricingTiers.map((tier, index) => (
            <div key={index} className="pricing-card">
              <h3 className="pricing-tier">{tier.name}</h3>
              <div className="pricing-price">{tier.price}</div>
              <p className="pricing-desc">{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Create Cards That Leave a Lasting Impression</h2>
        <Link to="/#contact" className="cta-button">
          Get Started <ArrowRight size={20} />
        </Link>
        <span className="cta-phone">Phone: +91 98765 43210</span>
      </section>
    </div>
  );
};

export default GreetingCardsPage;
