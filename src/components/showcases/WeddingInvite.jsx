import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Maximize, Layers, Scissors, ArrowRight } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import './WeddingInvite.css';

const WeddingInvite = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const specs = [
    { title: 'Gold Foil Stamping', desc: 'Premium metallic finish', icon: <Sparkles size={18} />, color: 'var(--gold)' },
    { title: '350gsm Premium Stock', desc: 'Heavyweight art card', icon: <Layers size={18} />, color: 'var(--cyan)' },
    { title: 'Letterpress Embossing', desc: 'Textured raised details', icon: <Maximize size={18} />, color: 'var(--green)' },
    { title: '5-Piece Suite', desc: 'Complete invitation set', icon: <Scissors size={18} />, color: 'var(--orange)' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="wedding-section" id="invitations-showcase">
      <div className="wedding-container" ref={ref}>
        
        {/* Left Side: Info & Specs */}
        <motion.div 
          className="wedding-info"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="wedding-header">
            <motion.div className="wedding-label" variants={itemVariants}>
              Output Showcase
            </motion.div>
            <motion.h2 className="wedding-title" variants={itemVariants}>
              Elegance In Every Detail.
            </motion.h2>
            <motion.p className="wedding-desc" variants={itemVariants}>
              Our flagship offset presses deliver uncompromised quality for life's most important moments. We combine traditional craftsmanship with precision engineering to produce luxury invitations that leave a lasting impression.
            </motion.p>
          </div>

          <motion.div className="wedding-specs-grid" variants={containerVariants}>
            {specs.map((spec, index) => (
              <motion.div key={index} className="wedding-spec-card" variants={itemVariants}>
                <div className="spec-icon-wrapper" style={{ color: spec.color }}>
                  {spec.icon}
                </div>
                <div className="spec-info">
                  <h4>{spec.title}</h4>
                  <p>{spec.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div variants={itemVariants} style={{ marginTop: '1rem' }}>
            <a href="/invitations" className="hero-btn-primary magnetic" style={{ display: 'inline-flex' }}>
              View Gallery <ArrowRight size={18} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side: 3D Tilt Card */}
        <motion.div
          className="tilt-wrapper"
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.4}
            glareColor="#ffffff"
            glarePosition="bottom"
            glareBorderRadius="8px"
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            scale={1.05}
            transitionSpeed={2500}
            perspective={2000}
          >
            <div className="wedding-invite-physical">
              <div className="wedding-invite-content">
                <p className="invite-intro">You are cordially invited to</p>
                <h3 className="invite-names">Arjun <span className="ampersand">&</span> Divya</h3>
                <div className="invite-details">
                  <p>Sunday, 24th October 2026</p>
                  <p>Grand Palace Venue, Main Hall</p>
                </div>
              </div>
            </div>
          </Tilt>
        </motion.div>

      </div>
    </section>
  );
};

export default WeddingInvite;
