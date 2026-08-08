import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Droplet, Layers, MonitorPlay, Clock, ArrowRight } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import './FlexBanner.css';

const FlexBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const specs = [
    { title: 'Eco-Solvent Ink', desc: 'Vibrant, long-lasting colors', icon: <Droplet size={18} /> },
    { title: 'PVC Flex Media', desc: 'Durable weather-resistant', icon: <Layers size={18} /> },
    { title: '4K Resolution', desc: 'Ultra-sharp print quality', icon: <MonitorPlay size={18} /> },
    { title: 'Same-Day Service', desc: 'Rapid turnaround times', icon: <Clock size={18} /> }
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
    <section className="flexbanner-section" id="flex-showcase">
      <div className="flexbanner-container" ref={ref}>
        
        {/* Info & Specs */}
        <motion.div 
          className="flexbanner-info"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="flexbanner-header">
            <motion.div className="flexbanner-label" variants={itemVariants}>
              Output Showcase
            </motion.div>
            <motion.h2 className="flexbanner-title" variants={itemVariants}>
              Monumental Scale. <br/> Microscopic Detail.
            </motion.h2>
            <motion.p className="flexbanner-desc" variants={itemVariants}>
              Our large-format division handles everything from retail hoardings to political campaigns. Weather-resistant inks and ultra-durable PVC flex guarantee your message stands out in any environment.
            </motion.p>
          </div>

          <motion.div className="flexbanner-specs-grid" variants={containerVariants}>
            {specs.map((spec, index) => (
              <motion.div key={index} className="flexbanner-spec-card" variants={itemVariants}>
                <div className="spec-icon-wrapper" style={{ color: 'var(--cyan)' }}>
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
            <a href="/flex-banners" className="hero-btn-primary magnetic" style={{ display: 'inline-flex', background: 'var(--cyan)' }}>
              View Gallery <ArrowRight size={18} />
            </a>
          </motion.div>
        </motion.div>

        {/* 3D Tilt Card (Wide Banner) */}
        <motion.div
          className="flexbanner-tilt-wrapper"
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <Tilt
            glareEnable={true}
            glareMaxOpacity={0.3}
            glareColor="#00d4ff"
            glarePosition="all"
            glareBorderRadius="4px"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            scale={1.05}
            transitionSpeed={2500}
            perspective={1500}
          >
            <div className="flexbanner-physical">
              <div className="flexbanner-scanline" />
              <div className="flexbanner-content">
                <h3 className="flexbanner-main-text">GRAND OPENING</h3>
                <p className="flexbanner-sub-text">★ MEGA EVENT ★</p>
              </div>
              <div className="flexbanner-cmyk">
                <div className="cmyk-block" />
                <div className="cmyk-block" />
                <div className="cmyk-block" />
                <div className="cmyk-block" />
              </div>
            </div>
          </Tilt>
        </motion.div>

      </div>
    </section>
  );
};

export default FlexBanner;
