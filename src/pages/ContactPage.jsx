import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './ContactPage.css';

const ContactPage = () => {
    return (
        <div className="contact-container">
            <Helmet>
              <title>Contact Us — Sai Meera Printing</title>
              <meta name="description" content="Get in touch with Sai Meera for a free quote on offset printing, flex banners, invitations, greeting cards, or photoshop editing services in Chennai." />
              <meta property="og:title" content="Contact Sai Meera Printing" />
              <meta property="og:description" content="Reach out for a free quote on premium printing services — invitations, banners, cards, and more." />
            </Helmet>
            <section className="contact-hero">
                <h1 className="contact-title">Get in Touch</h1>
                <p className="contact-subtitle">Have a project in mind? Let's bring your ideas to life with our premium printing solutions.</p>
            </section>
            
            <section className="contact-content">
                <div className="contact-grid">
                    {/* Left: Contact Form */}
                    <div className="contact-form-wrapper">
                        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                            <h2 className="form-title">Send us a message</h2>
                            <div className="input-group">
                                <div className="input-field">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" placeholder="John Doe" required />
                                </div>
                                <div className="input-field">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" placeholder="john@example.com" required />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="input-field">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="tel" id="phone" placeholder="+91 98765 43210" required />
                                </div>
                                <div className="input-field">
                                    <label htmlFor="company">Company</label>
                                    <input type="text" id="company" placeholder="Your Company" />
                                </div>
                            </div>
                            <div className="input-field full-width">
                                <label htmlFor="service">Service Required</label>
                                <select id="service" defaultValue="" required>
                                    <option value="" disabled>Select a service</option>
                                    <option value="offset">Offset Printing</option>
                                    <option value="flex">Flex Printing</option>
                                    <option value="greeting">Greeting Cards</option>
                                    <option value="photoshop">Photoshop Editing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="input-field full-width">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" rows="5" placeholder="Tell us about your project..." required></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Send Message</button>
                        </form>
                    </div>

                    {/* Right: Info */}
                    <div className="contact-info-wrapper">
                        <div className="info-card">
                            <div className="icon-wrapper">
                                <MapPin size={24} />
                            </div>
                            <div className="card-content">
                                <h3>Office Location</h3>
                                <p>123 Industrial Estate, Print Hub, Chennai</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="icon-wrapper">
                                <Phone size={24} />
                            </div>
                            <div className="card-content">
                                <h3>Direct Lines</h3>
                                <p>Sales: +91 98765 43210<br />Support: +91 98765 43211</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="icon-wrapper">
                                <Mail size={24} />
                            </div>
                            <div className="card-content">
                                <h3>Email Us</h3>
                                <p>hello@saimeera.com<br />quotes@saimeera.com</p>
                            </div>
                        </div>

                        <div className="info-card business-hours">
                            <div className="icon-wrapper">
                                <Clock size={24} />
                            </div>
                            <div className="card-content">
                                <h3>Business Hours</h3>
                                <p>Monday - Saturday: 9:00 AM to 8:00 PM</p>
                                <p className="closed">Sunday: Closed</p>
                            </div>
                        </div>
                        
                        <div className="map-placeholder">
                            <div className="map-text">Interactive Map Here</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
