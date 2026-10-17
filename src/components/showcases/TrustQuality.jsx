import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, Cog, Leaf, Package } from 'lucide-react';
import './TrustQuality.css';
import inkImg from '../../assets/printing_ink_rollers.jpg';

const pillars = [
  {
    num: '01',
    iconType: 'clock',
    icon: <Clock size={22} strokeWidth={2.2} />,
    title: '60+ Years in Business',
    desc: 'Three generations of printing experience. Every machine, every process, every print refined over decades.',
    tag: 'EST. 1962',
  },
  {
    num: '02',
    iconType: 'cog',
    icon: <Cog size={22} strokeWidth={2.2} />,
    title: 'In-House Production',
    desc: 'From design preparation to cutting and finishing, every step happens under one roof — no outsourcing.',
    tag: 'END-TO-END',
  },
  {
    num: '03',
    iconType: 'leaf',
    icon: <Leaf size={22} strokeWidth={2.2} />,
    title: 'Eco-Solvent Inks',
    desc: 'Our large-format press uses eco-solvent inks — lower VOC emissions and UV-resistant outdoor durability.',
    tag: 'SUSTAINABLE',
  },
  {
    num: '04',
    iconType: 'package',
    icon: <Package size={22} strokeWidth={2.2} />,
    title: 'Offset to Large Format',
    desc: 'Whether it is 100 business cards or a 3.2m hoarding, we have the press, process and precision to deliver.',
    tag: 'FULL SPECTRUM',
  },
];

// Individual Interactive Heritage Card with subtle 3D tilt and cursor spotlight
const HeritageCard = ({ pillar, index, isInView, canHover }) => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, tiltX: 0, tiltY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!canHover || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const tiltX = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -4.5;
    const tiltY = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 4.5;

    setMousePos({ x, y, tiltX, tiltY });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 50, y: 50, tiltX: 0, tiltY: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`tq-card ${isHovered ? 'is-hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(900px) rotateX(${mousePos.tiltX}deg) rotateY(${mousePos.tiltY}deg) translateY(-6px)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      }}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Archival Gold Corner Accents */}
      <div className="tq-card-corner tq-corner-tl" aria-hidden="true" />
      <div className="tq-card-corner tq-corner-br" aria-hidden="true" />

      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="tq-card-spotlight"
        style={{
          background: isHovered
            ? `radial-gradient(circle 240px at ${mousePos.x}% ${mousePos.y}%, rgba(212, 175, 55, 0.16) 0%, rgba(168, 85, 247, 0.08) 35%, transparent 70%)`
            : 'transparent',
        }}
        aria-hidden="true"
      />

      {/* Top Header Row with Animated Icon and Num Badge */}
      <div className="tq-card-top">
        <div className={`tq-icon tq-icon-${pillar.iconType}`}>
          {pillar.icon}
        </div>
        <div className="tq-card-badge">
          <span className="tq-card-num">{pillar.num}</span>
          <span className="tq-card-tag">{pillar.tag}</span>
        </div>
      </div>

      {/* Content */}
      <div className="tq-card-content">
        <h3 className="tq-title">{pillar.title}</h3>
        <p className="tq-desc">{pillar.desc}</p>
      </div>

      {/* Bottom Gold Edge Highlight Line */}
      <div className="tq-card-bottom-line" aria-hidden="true" />
    </motion.div>
  );
};

const TrustQuality = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-8%' });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  return (
    <section className="tq-section" id="trust-quality" ref={sectionRef}>
      {/* Layered Cinematic Printing Press Background with Slow Zoom */}
      <div
        className={`tq-bg ${isInView ? 'is-active' : ''}`}
        style={{ backgroundImage: `url(${inkImg})` }}
        aria-hidden="true"
      />
      {/* Golden Machinery Light Drift Overlay */}
      <div className={`tq-bg-gold-light ${isInView ? 'is-active' : ''}`} aria-hidden="true" />
      {/* Dark Ambient Vignette Overlays */}
      <div className="tq-bg-overlay" aria-hidden="true" />
      {/* Purple-Gold Studio Ambient Glow on Edges */}
      <div className="tq-bg-ambient-glow" aria-hidden="true" />

      <div className="tq-container">
        {/* Editorial Heading Reveal with Line-by-Line Masks */}
        <div className="tq-header">
          <motion.div
            className="tq-eyebrow-wrap"
            initial={{ opacity: 0, letterSpacing: '0.12em', y: 10 }}
            animate={isInView ? { opacity: 1, letterSpacing: '0.24em', y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="tq-eyebrow-dash" aria-hidden="true" />
            <span className="tq-eyebrow">WHY CHOOSE SAI MEERA</span>
          </motion.div>

          <h2 className="tq-heading">
            <div className="tq-heading-line-wrap">
              <motion.span
                className="tq-heading-line"
                initial={{ y: '100%', opacity: 0 }}
                animate={isInView ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Built on Craft.
              </motion.span>
            </div>
            <div className="tq-heading-line-wrap">
              <motion.span
                className="tq-heading-line"
                initial={{ y: '100%', opacity: 0 }}
                animate={isInView ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                Delivered with Pride.
              </motion.span>
            </div>
            {/* Single Entry Gold Light Sweep across the Heading */}
            <div className={`tq-heading-sweep ${isInView ? 'is-active' : ''}`} aria-hidden="true" />
          </h2>
        </div>

        {/* Four Interactive Heritage Cards Grid */}
        <div className="tq-grid">
          {pillars.map((pillar, i) => (
            <HeritageCard
              key={pillar.num}
              pillar={pillar}
              index={i}
              isInView={isInView}
              canHover={canHover}
            />
          ))}
        </div>

        {/* Heritage Gold Light Trail Traveling Along Lower Edge of Card Group */}
        <div className="tq-gold-trail-rail" aria-hidden="true">
          <div className={`tq-gold-trail-glow ${isInView ? 'is-active' : ''}`} />
        </div>
      </div>
    </section>
  );
};

export default TrustQuality;
