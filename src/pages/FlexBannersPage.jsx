import React from 'react';
import { Link } from 'react-router-dom';
import { Store, PartyPopper, Car, Presentation, Eye, Megaphone, CheckCircle, Shield, Zap, Wrench } from 'lucide-react';
import './FlexBannersPage.css';

const FlexBannersPage = () => {
  const products = [
    {
      id: 1,
      title: "Shop Sign Boards",
      description: "Flex board with backlit or frontlit options for high visibility.",
      icon: <Store className="product-icon" />,
      size: "Custom up to 10ft width",
      material: "Star Flex / Backlit Flex"
    },
    {
      id: 2,
      title: "Event Banners",
      description: "Stage backdrops, birthday, and conference banners printed in vibrant colors.",
      icon: <PartyPopper className="product-icon" />,
      size: "Any custom size",
      material: "Star Flex"
    },
    {
      id: 3,
      title: "Vehicle Wraps",
      description: "Full or partial vinyl wraps for cars, vans, and commercial trucks.",
      icon: <Car className="product-icon" />,
      size: "Custom per vehicle",
      material: "Premium Vinyl"
    },
    {
      id: 4,
      title: "Exhibition Stalls",
      description: "Pop-up displays, roll-up standees, and custom backdrop walls.",
      icon: <Presentation className="product-icon" />,
      size: "Standard & Custom sizes",
      material: "Vinyl / Canvas / Flex"
    },
    {
      id: 5,
      title: "One-Way Vision",
      description: "Perforated vinyl for glass storefronts providing privacy and advertising.",
      icon: <Eye className="product-icon" />,
      size: "Custom roll width",
      material: "One-Way Vision Vinyl"
    },
    {
      id: 6,
      title: "Hoardings & Billboards",
      description: "Large outdoor advertising flex for maximum reach.",
      icon: <Megaphone className="product-icon" />,
      size: "Large format",
      material: "Heavy-duty Flex"
    }
  ];

  const features = [
    {
      title: "UV-Resistant Inks",
      description: "3-5 year outdoor durability against sun fading.",
      icon: <Shield className="feature-icon" />
    },
    {
      title: "Eco-Solvent Technology",
      description: "Low VOC, environmentally friendly printing process.",
      icon: <CheckCircle className="feature-icon" />
    },
    {
      title: "Same-Day Printing",
      description: "Rush orders handled efficiently for your urgent events.",
      icon: <Zap className="feature-icon" />
    },
    {
      title: "Free Installation",
      description: "Professional mounting team for large-scale outdoor projects.",
      icon: <Wrench className="feature-icon" />
    }
  ];

  return (
    <div className="flex-banners-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Large Format Flex <span className="accent-text">& Vinyl Printing</span></h1>
          <p className="hero-subtitle">Eye-catching outdoor advertising that withstands sun, rain, and wind</p>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Our Printing Solutions</h2>
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card glass-card">
                <div className="icon-wrapper">{product.icon}</div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div className="product-meta">
                  <span><strong>Size:</strong> {product.size}</span>
                  <span><strong>Material:</strong> {product.material}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs Table Section */}
      <section className="specs-section">
        <div className="container">
          <h2 className="section-title">Material Specifications</h2>
          <div className="table-responsive glass-card">
            <table className="specs-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>GSM</th>
                  <th>Weather Rating</th>
                  <th>Indoor/Outdoor</th>
                  <th>Price Range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Star Flex</td>
                  <td>280gsm</td>
                  <td className="accent-text">★★★★★</td>
                  <td>Outdoor</td>
                  <td>₹12/sqft</td>
                </tr>
                <tr>
                  <td>Vinyl</td>
                  <td>120gsm</td>
                  <td className="accent-text">★★★★☆</td>
                  <td>Both</td>
                  <td>₹18/sqft</td>
                </tr>
                <tr>
                  <td>Backlit Flex</td>
                  <td>440gsm</td>
                  <td className="accent-text">★★★★★</td>
                  <td>Outdoor</td>
                  <td>₹22/sqft</td>
                </tr>
                <tr>
                  <td>Canvas</td>
                  <td>380gsm</td>
                  <td className="accent-text">★★★☆☆</td>
                  <td>Indoor</td>
                  <td>₹35/sqft</td>
                </tr>
                <tr>
                  <td>One-Way Vision</td>
                  <td>140gsm</td>
                  <td className="accent-text">★★★★☆</td>
                  <td>Outdoor</td>
                  <td>₹28/sqft</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container glass-card cta-content">
          <h2>Need a Banner That Makes an Impact?</h2>
          <p>Get in touch with our team today and let's bring your outdoor advertising to life.</p>
          <div className="cta-actions">
            <Link to="/#contact" className="btn btn-primary">Contact Us</Link>
            <span className="phone-number">+91 98765 43210</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FlexBannersPage;
