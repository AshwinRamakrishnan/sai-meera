import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import imgFlex from '../../assets/machine_flex_printer.jpg';
import imgOffset from '../../assets/machine_offset_press.jpg';
import imgCutter from '../../assets/machine_paper_cutter.jpg';
import './MachinesStrip.css';

gsap.registerPlugin(ScrollTrigger);

const machines = [
  {
    num: '01',
    model: 'FX-3200 PRO',
    name: 'Large Format Eco-Solvent Flex Printer',
    specs: '3200 mm · 1440 DPI · 80 sqm/hr',
    specPills: ['3200 mm Width', '1440 DPI', '80 sqm/hr'],
    category: 'LARGE FORMAT FLEX',
    description: 'High-speed 8-colour piezo printing for billboards, hoarding wraps, backlits, and architectural signage.',
    anchor: '#flex-sec',
    img: imgFlex,
  },
  {
    num: '02',
    model: 'OS-SM74-6C',
    name: 'Industrial Offset Printing Press',
    specs: '6-Colour · 15K sheets/hr · Pantone',
    specPills: ['6-Colour + UV', '15,000 sph', 'Pantone Matching'],
    category: 'HEIDELBERG OFFSET',
    description: 'Precision continuous sheet-fed press for luxury corporate stationery, commercial packaging, and multi-page books.',
    anchor: '#offset-sec',
    img: imgOffset,
  },
  {
    num: '03',
    model: 'HC-920-PRO',
    name: 'Hydraulic Guillotine Cutter',
    specs: '920 mm · ±0.1 mm · Hydraulic Drive',
    specPills: ['920 mm Cut', '±0.1 mm Accuracy', 'Hydraulic Clamp'],
    category: 'PRECISION FINISHING',
    description: 'Micro-calibrated hydraulic cutting system with optical safety sensors for edge-perfect trimmed deliverables.',
    anchor: '#cutter-sec',
    img: imgCutter,
  },
];

const MachinesStrip = () => {
  const sectionRef = useRef(null);
  const pinWrapperRef = useRef(null);
  const trackRef = useRef(null);
  const progressFillRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const mm = gsap.matchMedia();

    // ── Desktop Pin & Horizontal Scroll (>= 901px) ──
    mm.add('(min-width: 901px)', () => {
      const section = sectionRef.current;
      const pinWrapper = pinWrapperRef.current;
      const track = trackRef.current;
      const validCards = cardsRef.current.filter(Boolean);

      if (!section || !pinWrapper || !track || validCards.length === 0) return;

      // Card geometry
      const cardEl = validCards[0];
      const cardWidth = cardEl.offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 36;
      const step = cardWidth + gap;
      const totalTravel = (validCards.length - 1) * step;

      // Center initial card in viewport
      const viewportWidth = window.innerWidth;
      const initialPadding = Math.max(0, (viewportWidth - cardWidth) / 2);
      gsap.set(track, { paddingLeft: initialPadding, paddingRight: initialPadding });

      // Create master pinned timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pinWrapper,
          start: 'top top',
          end: () => `+=${Math.max(1600, totalTravel * 1.35)}`,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Smooth progress bar update
            if (progressFillRef.current) {
              progressFillRef.current.style.width = `${self.progress * 100}%`;
            }

            // Active card calculation
            const rawIndex = self.progress * (validCards.length - 1);
            const activeIdx = Math.min(
              validCards.length - 1,
              Math.max(0, Math.round(rawIndex))
            );
            setActiveCard(activeIdx);
          },
        },
      });

      // Animate track horizontal translation
      tl.to(track, {
        x: -totalTravel,
        ease: 'none',
      });

      // Micro focus transitions on individual cards
      validCards.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { scale: 1.02 });
          tl.to(card, {
            scale: 0.96,
            duration: 0.45,
            ease: 'power2.inOut',
          }, 0.2);
        } else if (i === validCards.length - 1) {
          gsap.set(card, { scale: 0.96 });
          tl.to(card, {
            scale: 1.02,
            duration: 0.45,
            ease: 'power2.inOut',
          }, 0.55);
        } else {
          gsap.set(card, { scale: 0.96 });
          tl.to(card, {
            scale: 1.02,
            duration: 0.35,
            ease: 'power2.inOut',
          }, 0.15);
          tl.to(card, {
            scale: 0.96,
            duration: 0.35,
            ease: 'power2.inOut',
          }, 0.65);
        }
      });

      return () => {
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const handleCardClick = (e, anchor) => {
    e.preventDefault();
    const target = document.querySelector(anchor);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="ms-section" id="machines-strip" ref={sectionRef}>
      <div className="ms-pin-wrapper" ref={pinWrapperRef}>

        {/* Section Header */}
        <div className="ms-container ms-header-container">
          <div className="ms-header">
            <div className="ms-header-left">
              <span className="ms-eyebrow">OUR MACHINES</span>
              <h2 className="ms-heading">
                Precision Engineering.<br />
                Interactive 3D Showcase.
              </h2>
            </div>

            <div className="ms-header-right">
              {/* Scroll-linked progress indicator */}
              <div className="ms-progress-wrap" aria-label="Showcase scroll progress">
                <div className="ms-progress-info">
                  <span className="ms-progress-label">SHOWCASE FOCUS</span>
                  <span className="ms-progress-counter">{`0${activeCard + 1} / 03`}</span>
                </div>
                <div className="ms-progress-track">
                  <div className="ms-progress-fill" ref={progressFillRef} />
                </div>
              </div>
              <p className="ms-subtext">
                Scroll to navigate our machinery. Select any machine to inspect in full 3D.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll-Driven Horizontal Track */}
        <div className="ms-track-viewport">
          <div className="ms-track" ref={trackRef}>
            {machines.map((m, i) => {
              const isActive = activeCard === i;
              return (
                <div
                  key={m.num}
                  className={`ms-card ${isActive ? 'is-active' : ''}`}
                  ref={(el) => (cardsRef.current[i] = el)}
                >
                  {/* Subtle Archival Gold Corner Accents */}
                  <div className="ms-card-corner ms-card-corner-tl" aria-hidden="true" />
                  <div className="ms-card-corner ms-card-corner-tr" aria-hidden="true" />
                  <div className="ms-card-corner ms-card-corner-bl" aria-hidden="true" />
                  <div className="ms-card-corner ms-card-corner-br" aria-hidden="true" />

                  {/* Machine Image Wrap */}
                  <div className="ms-card-img-wrap">
                    <img src={m.img} alt={m.name} className="ms-card-img" loading="lazy" />
                    <div className="ms-card-img-overlay" />
                    <span className="ms-card-num">{m.num}</span>
                    <span className="ms-card-category">{m.category}</span>
                  </div>

                  {/* Card Content & Specs */}
                  <div className="ms-card-body">
                    <span className="ms-card-model">{m.model}</span>
                    <h3 className="ms-card-name">{m.name}</h3>
                    <p className="ms-card-desc">{m.description}</p>

                    {/* Specification Pills */}
                    <div className="ms-card-pills" aria-label="Machine specifications">
                      {m.specPills.map((pill, idx) => (
                        <span key={idx} className="ms-spec-pill">
                          {pill}
                        </span>
                      ))}
                    </div>

                    {/* Interactive 3D Anchor */}
                    <a
                      href={m.anchor}
                      className="ms-card-explore"
                      onClick={(e) => handleCardClick(e, m.anchor)}
                    >
                      <span>INSPECT IN 3D</span>
                      <span className="ms-explore-arrow">→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Bottom Scroll Hint */}
        <div className="ms-bottom-bar">
          <div className="ms-dots-indicator" aria-hidden="true">
            {machines.map((_, i) => (
              <span
                key={i}
                className={`ms-dot ${activeCard === i ? 'active' : ''}`}
              />
            ))}
          </div>
          <span className="ms-scroll-hint">SCROLL DOWN TO PROGRESS · SMOOTH REVERSE ON SCROLL UP</span>
        </div>

      </div>
    </section>
  );
};

export default MachinesStrip;
