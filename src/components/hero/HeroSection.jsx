import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './HeroSection.css';
import heroImg from '../../assets/hero_printing_press.png';

const HeroSection = () => {
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section className="hero-section">
      <div className="hero-grid">

        {/* =========================================
            LEFT — TEXT CONTENT
           ========================================= */}

        <motion.div
          className="hero-text-col"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* EST. 1962 */}
          <motion.div
            className="hero-est-label"
            variants={itemVariants}
          >
            <span className="hero-est-rule"></span>
            <span>EST. 1962</span>
          </motion.div>


          {/* HERO HEADLINE */}
          <motion.h1
            className="hero-heading"
            variants={itemVariants}
          >
            <span className="hero-heading-white">
              PRINTING
            </span>

            <span className="hero-heading-white">
              THAT
            </span>

            <span className="hero-heading-gold">
              LEAVES A
            </span>

            <span className="hero-heading-gold">
              MARK.
            </span>
          </motion.h1>


          {/* DESCRIPTION */}
          <motion.p
            className="hero-description"
            variants={itemVariants}
          >
            From premium invitations to large-format industrial
            production — precision printed for businesses, brands
            and celebrations.
          </motion.p>


          {/* CTA BUTTONS */}
          <motion.div
            className="hero-cta-row"
            variants={itemVariants}
          >

            <a
              href="#machines-strip"
              className="hero-btn-primary"
            >
              EXPLORE OUR WORK
              <span className="hero-btn-arrow">→</span>
            </a>

            <Link
              to="/contact"
              className="hero-btn-outline"
            >
              GET A QUOTE
            </Link>

          </motion.div>


          {/* STATS */}
          <motion.div
            className="hero-stats-strip"
            variants={itemVariants}
          >

            <span className="hero-stat">
              EST. 1962
            </span>

            <span className="hero-stat-dot">
              •
            </span>

            <span className="hero-stat">
              60+ YEARS OF CRAFT
            </span>

            <span className="hero-stat-dot">
              •
            </span>

            <span className="hero-stat">
              3.2M PRINT WIDTH
            </span>

            <span className="hero-stat-dot">
              •
            </span>

            <span className="hero-stat">
              1440 DPI PRECISION
            </span>

          </motion.div>

        </motion.div>


        {/* =========================================
            RIGHT — MACHINE IMAGE
           ========================================= */}

        <motion.div
          className="hero-image-col"
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.3,
          }}
        >

          <img
            src={heroImg}
            alt="Sai Meera Industrial Printing Machine"
            className="hero-machine-img"
          />

        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;