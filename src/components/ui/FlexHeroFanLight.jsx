import React, { useMemo, useEffect, useRef } from 'react';
import './FlexHeroFanLight.css';

/* =========================================================================
   FLEX & BANNERS — EXACT REFERENCE ROYAL GOLD CINEMATIC BACKDROP
   Faithfully reproduces reference screenshot (media_1791791238476_ac9299ba.png):
     1. Deep cinematic black canvas (#07060A)
     2. Sculpted left sweeping liquid gold wave with dense golden stardust spray
     3. Multi-layered right sweeping metallic gold ribbon/wing
     4. Downward architectural fluted fan pleats radiating from center horizon
     5. Central anamorphic horizontal gold light streak & horizon core flare
     6. High-contrast obsidian vignette for razor-sharp text legibility
     7. Zero-lag, hardware-accelerated cursor responsiveness via RAF
        - Cached bounding dimensions (ZERO getBoundingClientRect on mousemove)
        - Responsive 0.60 lerp tracking (instantaneous response, zero delay)
   ========================================================================= */

export default function FlexHeroFanLight() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  // 36 Downward architectural fluted fan rays radiating from horizon center
  const rays = useMemo(() => {
    const originX = 800;
    const originY = 485; // Vanishing point at the horizon line
    const bottomY = 1000;
    const totalRays = 36;
    const spreadStart = -260;
    const spreadEnd = 1860;
    const step = (spreadEnd - spreadStart) / totalRays;

    const list = [];
    for (let i = 0; i < totalRays; i++) {
      const x1 = spreadStart + i * step;
      const x2 = spreadStart + (i + 1) * step;

      // Distance from center (0 = center rays, 1 = outer edges)
      const distFromCenter = Math.abs(i - totalRays / 2) / (totalRays / 2);

      // Alternating 3D accordion facet pleating (illuminated face vs shadow crease)
      const isLitFacet = i % 2 === 0;

      list.push({
        id: i,
        points: `${originX},${originY} ${x1},${bottomY} ${x2},${bottomY}`,
        isLitFacet,
        facetType: i % 3, // 0 = champagne highlight, 1 = warm metallic gold, 2 = deep bronze shadow
        opacity: isLitFacet
          ? Math.max(0.68, 0.96 - distFromCenter * 0.28)
          : Math.max(0.32, 0.55 - distFromCenter * 0.22),
      });
    }
    return list;
  }, []);

  // Dense golden stardust glitter spray along the left sweeping wave crest
  const stardust = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 68; i++) {
      const t = i / 68; // progress along curve (0 to 1)
      // Clustered tightly along the upper crest of the wave
      const spread = (Math.sin(i * 3.7) * 22) + (Math.cos(i * 5.1) * 14);
      const baseX = 20 + t * 650 + (Math.sin(i * 2.1) * 18);
      const baseY = 190 + Math.pow(t, 1.35) * 290 + spread - 16;
      const size = 0.9 + (i % 5) * 0.5; // 0.9px to 2.9px
      const opacity = 0.35 + (i % 6) * 0.12; // 0.35 to 0.95

      stars.push({
        id: i,
        cx: Math.max(10, baseX),
        cy: Math.max(150, baseY),
        r: size,
        opacity,
        delay: `${(i % 8) * 0.45}s`,
        duration: `${2.2 + (i % 5) * 1.1}s`,
      });
    }
    return stars;
  }, []);

  // Ambient floating micro-stardust particles across the atmosphere
  const ambientParticles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${6 + (i * 4.2) % 88}%`,
      top: `${14 + (i * 6.8) % 72}%`,
      size: `${1.1 + (i % 3) * 0.8}px`,
      duration: `${4.5 + (i % 4) * 1.5}s`,
      delay: `${(i % 5) * 0.6}s`,
      opacity: 0.28 + (i % 3) * 0.22,
    }));
  }, []);

  // HorizonX-inspired subtle mouse parallax — STRICTLY confined to hero visual container
  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    // Skip on touch devices or reduced motion preference
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const heroSection = container.closest('.cat-hero') || container.parentElement || container;

    // CACHED DIMENSIONS: Never call getBoundingClientRect() on pointermove!
    const bounds = {
      width: heroSection.offsetWidth || window.innerWidth,
      height: heroSection.offsetHeight || 600,
      left: 0,
      top: 0,
    };

    const updateBounds = () => {
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        bounds.width = rect.width;
        bounds.height = rect.height;
        bounds.left = rect.left;
        bounds.top = rect.top;
      }
    };
    updateBounds();
    window.addEventListener('resize', updateBounds, { passive: true });
    window.addEventListener('scroll', updateBounds, { passive: true });

    let targetX = 0;
    let targetY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentX = 0;
    let currentY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let rafId = null;

    // Track mouse STRICTLY inside the hero visual area
    const handlePointerMove = (e) => {
      const nx = ((e.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const ny = ((e.clientY - bounds.top) / bounds.height - 0.5) * 2;

      // HorizonX subtle, natural micro-shift (max ±8px X, ±5px Y, ±0.8° tilt)
      targetX = Math.max(-1, Math.min(1, nx)) * 8;
      targetY = Math.max(-1, Math.min(1, ny)) * 5;
      targetRotY = Math.max(-1, Math.min(1, nx)) * 0.8;
      targetRotX = -Math.max(-1, Math.min(1, ny)) * 0.5;
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      targetRotX = 0;
      targetRotY = 0;
    };

    // Organic, silky-smooth lerp loop (0.42 lerp factor)
    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.42;
      currentY += (targetY - currentY) * 0.42;
      currentRotX += (targetRotX - currentRotX) * 0.42;
      currentRotY += (targetRotY - currentRotY) * 0.42;

      stage.style.transform = `perspective(1000px) translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      rafId = requestAnimationFrame(updateParallax);
    };

    rafId = requestAnimationFrame(updateParallax);
    heroSection.addEventListener('pointermove', handlePointerMove, { passive: true });
    heroSection.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
      heroSection.removeEventListener('pointermove', handlePointerMove);
      heroSection.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex-hero-fan-container" aria-hidden="true">
      {/* 1. Deep Ambient Base Canvas */}
      <div className="flex-fan-ambient-base" />

      {/* 2. Hardware-Accelerated Responsive Stage */}
      <div ref={stageRef} className="flex-fan-rays-stage">
        <svg
          className="flex-fan-svg"
          viewBox="0 0 1600 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* ── Pleated Fan Ray Gradients ── */}
            {/* Facet 0: Champagne Specular Highlight */}
            <linearGradient id="goldFacetChampagne" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF0" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#FFF4CC" stopOpacity="0.88" />
              <stop offset="55%" stopColor="#F5E6A8" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#D4AF37" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#8B6F2B" stopOpacity="0.15" />
            </linearGradient>

            {/* Facet 1: Warm Metallic 24K Gold Body */}
            <linearGradient id="goldFacetMetallic" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#E5C158" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#C69214" stopOpacity="0.6" />
              <stop offset="85%" stopColor="#875E06" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4A3102" stopOpacity="0.12" />
            </linearGradient>

            {/* Facet 2: Deep Bronze Shadow Crease (Accordion Depth) */}
            <linearGradient id="goldFacetShadow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#C49B28" stopOpacity="0.45" />
              <stop offset="35%" stopColor="#8A6312" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#483105" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#07060A" stopOpacity="0.05" />
            </linearGradient>

            {/* ── Left Sweeping Liquid Gold Wave Gradients ── */}
            <linearGradient id="leftWaveMainGrad" x1="0%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#FFFCE8" stopOpacity="0.92" />
              <stop offset="18%" stopColor="#F7E298" stopOpacity="0.88" />
              <stop offset="48%" stopColor="#D4AF37" stopOpacity="0.72" />
              <stop offset="78%" stopColor="#8C6615" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2E1D03" stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="leftWaveSecondaryGrad" x1="5%" y1="0%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#FFFDF0" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#E8CA72" stopOpacity="0.65" />
              <stop offset="75%" stopColor="#A67C1E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* ── Right Sweeping Metallic Ribbon Gradients ── */}
            <linearGradient id="rightWaveMainGrad" x1="10%" y1="90%" x2="100%" y2="10%">
              <stop offset="0%" stopColor="#543B06" stopOpacity="0.2" />
              <stop offset="25%" stopColor="#B38922" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#E5C568" stopOpacity="0.82" />
              <stop offset="80%" stopColor="#FFF2B2" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#FFFDF0" stopOpacity="0.98" />
            </linearGradient>

            <linearGradient id="rightWaveSecondaryGrad" x1="0%" y1="80%" x2="100%" y2="20%">
              <stop offset="0%" stopColor="#301F02" stopOpacity="0.15" />
              <stop offset="35%" stopColor="#8A6312" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#DDB54A" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#FFF6CC" stopOpacity="0.88" />
            </linearGradient>

            <linearGradient id="rightWaveTertiaryGrad" x1="0%" y1="70%" x2="100%" y2="30%">
              <stop offset="0%" stopColor="#1E1301" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#6E4D09" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#C49A29" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F5DC8C" stopOpacity="0.75" />
            </linearGradient>

            {/* ── Anamorphic Horizontal Light Streak Gradient ── */}
            <linearGradient id="horizontalBeamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="transparent" stopOpacity="0" />
              <stop offset="15%" stopColor="#D4AF37" stopOpacity="0.2" />
              <stop offset="32%" stopColor="#F7E298" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#FFFDF5" stopOpacity="0.98" />
              <stop offset="68%" stopColor="#F7E298" stopOpacity="0.65" />
              <stop offset="85%" stopColor="#D4AF37" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>

            {/* ── Horizon Vanishing Glow ── */}
            <radialGradient id="horizonCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFBF0" stopOpacity="0.8" />
              <stop offset="22%" stopColor="#F7E298" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="85%" stopColor="#8C6615" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── 3. Downward Fluted Fan Rays System ── */}
          <g className="flex-fan-downward-group">
            {rays.map((ray) => {
              const fillId =
                ray.facetType === 0
                  ? 'url(#goldFacetChampagne)'
                  : ray.facetType === 1
                  ? 'url(#goldFacetMetallic)'
                  : 'url(#goldFacetShadow)';

              return (
                <polygon
                  key={ray.id}
                  points={ray.points}
                  fill={fillId}
                  opacity={ray.opacity}
                  className={`flex-fan-blade ${ray.isLitFacet ? 'facet-lit' : 'facet-shadow'}`}
                />
              );
            })}
          </g>

          {/* ── 4. Left Sweeping Sculpted Gold Wave ── */}
          <g className="flex-wave-left-group">
            {/* Main body of left liquid gold wave */}
            <path
              d="M -70,220 C 180,260 420,350 720,490 C 560,530 280,470 -70,400 Z"
              fill="url(#leftWaveMainGrad)"
              className="flex-wave-left-main"
            />
            {/* Luminous upper crest rim reflection */}
            <path
              d="M -70,195 C 190,245 440,335 750,488 C 710,495 440,355 -70,235 Z"
              fill="url(#leftWaveSecondaryGrad)"
              className="flex-wave-left-rim"
            />
            {/* Thin specular edge line */}
            <path
              d="M -70,205 C 190,250 435,340 735,489"
              fill="none"
              stroke="#FFFDF0"
              strokeWidth="2.2"
              opacity="0.9"
            />
          </g>

          {/* ── 5. Stardust Glitter Trail on Left Wave Crest ── */}
          <g className="flex-wave-stardust-group">
            {stardust.map((star) => (
              <circle
                key={star.id}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="#FFFDF0"
                opacity={star.opacity}
                className="flex-stardust-sparkle"
                style={{
                  animationDuration: star.duration,
                  animationDelay: star.delay,
                }}
              />
            ))}
          </g>

          {/* ── 6. Right Sweeping Folded Metallic Gold Ribbon / Wing ── */}
          <g className="flex-wave-right-group">
            {/* Lower third fold */}
            <path
              d="M 920,545 C 1180,515 1420,440 1670,360 L 1670,460 C 1420,545 1180,585 920,570 Z"
              fill="url(#rightWaveTertiaryGrad)"
              className="flex-wave-right-tertiary"
            />
            {/* Secondary middle fold */}
            <path
              d="M 840,525 C 1110,495 1370,405 1670,300 L 1670,420 C 1370,510 1130,560 840,550 Z"
              fill="url(#rightWaveSecondaryGrad)"
              className="flex-wave-right-secondary"
            />
            {/* Main upper sculpted fold */}
            <path
              d="M 740,495 C 1020,470 1260,355 1670,140 L 1670,270 C 1320,455 1060,540 740,525 Z"
              fill="url(#rightWaveMainGrad)"
              className="flex-wave-right-main"
            />
            {/* Thin specular edge line along inner contour */}
            <path
              d="M 740,495 C 1020,470 1260,355 1670,140"
              fill="none"
              stroke="#FFF8D6"
              strokeWidth="2.5"
              opacity="0.92"
            />
          </g>

          {/* ── 7. Central Horizon Vanishing Light Flare & Anamorphic Beam ── */}
          {/* Broad horizon warm glow */}
          <ellipse cx="800" cy="485" rx="580" ry="115" fill="url(#horizonCoreGlow)" />

          {/* Anamorphic horizontal light beam shooting across horizon */}
          <rect
            x="0"
            y="481"
            width="1600"
            height="8"
            fill="url(#horizontalBeamGrad)"
            className="flex-anamorphic-beam"
          />

          {/* Intense central specular white-gold core */}
          <ellipse
            cx="800"
            cy="485"
            rx="200"
            ry="26"
            fill="#FFFDF5"
            opacity="0.82"
            filter="drop-shadow(0 0 16px rgba(255, 252, 235, 0.95))"
          />
        </svg>

        {/* ── 8. Dynamic Luster Sweep Shine across rays ── */}
        <div className="flex-fan-light-sweep" />
      </div>

      {/* ── 9. Ambient Floating Micro-Stardust Particles ── */}
      <div className="flex-fan-particles-layer">
        {ambientParticles.map((p) => (
          <span
            key={p.id}
            className="flex-fan-particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* ── 10. Text Protection Radial Obsidian Vignette ── */}
      <div className="flex-fan-text-protection-vignette" />

      {/* ── 11. Bottom Edge Seamless Fade into Section 2 ── */}
      <div className="flex-fan-bottom-fade" />

      {/* ── 12. HorizonX Architectural Editorial Frame & Corner Crosshairs ── */}
      <div className="flex-hero-horizonx-frame" aria-hidden="true">
        <div className="flex-frame-corner flex-frame-corner--tl">
          <span className="flex-frame-crosshair">+</span>
          <div className="flex-frame-bracket" />
        </div>
        <div className="flex-frame-corner flex-frame-corner--tr">
          <span className="flex-frame-crosshair">+</span>
          <div className="flex-frame-bracket" />
        </div>
        <div className="flex-frame-corner flex-frame-corner--bl">
          <span className="flex-frame-crosshair">+</span>
          <div className="flex-frame-bracket" />
        </div>
        <div className="flex-frame-corner flex-frame-corner--br">
          <span className="flex-frame-crosshair">+</span>
          <div className="flex-frame-bracket" />
        </div>
      </div>
    </div>
  );
}
