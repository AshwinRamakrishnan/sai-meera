import React, { useMemo, useEffect, useRef } from 'react';
import './CardsHeroHorizonX.css';

/* =========================================================================
   HORIZONX MOVEMENT BEYOND HERO — ROYAL GOLD ARCHITECTURAL BACKDROP
   Target: All Cards & Stationery Category Pages Only
   Faithfully reproduces reference (https://horizonx.so/explore/movement-beyond-hero):
     1. Repeating curved architectural panels/fins creating a layered sculptural colonnade
     2. Stepped concentric circular floor dais / podium rings with perspective depth
     3. Horizon vanishing-point glow and warm champagne ambient lighting
     4. Premium black, gold, and champagne-gold palette (#07060A, #D4AF37, #FFFDF0)
     5. Architectural editorial frame with corner crosshair glyphs (+)
     6. Restrained, silky-smooth mouse-responsive parallax strictly confined to hero
   ========================================================================= */

export default function CardsHeroHorizonX() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const leftColonnadeRef = useRef(null);
  const rightColonnadeRef = useRef(null);
  const floorDaisRef = useRef(null);

  // Symmetrical curved architectural colonnades: 12 fins per side
  const { leftFins, rightFins } = useMemo(() => {
    const leftList = [];
    const rightList = [];
    const totalFins = 12;

    for (let i = 0; i < totalFins; i++) {
      const t = i / (totalFins - 1); // 0 (outer foreground) to 1 (near horizon)

      // Outer fins start high and wide; inner fins recede toward center horizon (800, 520)
      const xTop = 30 + Math.pow(t, 0.9) * 580;
      const yTop = 30 + t * 290;

      // Control points for majestic architectural curved panel
      const cp1X = xTop + 55 - t * 18;
      const cp1Y = yTop + 240 - t * 80;
      const cp2X = xTop + 130 - t * 35;
      const cp2Y = yTop + 390 - t * 90;

      const xBase = 120 + Math.pow(t, 0.82) * 560;
      const yBase = 760 - t * 110;

      // 3D thickness for sculptural panel extrusion
      const thickness = Math.max(9, 28 - t * 19);
      const xTopOuter = xTop - thickness;
      const cp1XOuter = cp1X - thickness * 0.88;
      const cp2XOuter = cp2X - thickness * 0.82;
      const xBaseOuter = xBase - thickness * 0.75;

      // Left panel closed polygon
      const leftPath = `
        M ${xTop},${yTop}
        C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${xBase},${yBase}
        L ${xBaseOuter},${yBase}
        C ${cp2XOuter},${cp2Y} ${cp1XOuter},${cp1Y} ${xTopOuter},${yTop}
        Z
      `;

      // Left leading illuminated edge spine
      const leftSpine = `
        M ${xTop},${yTop}
        C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${xBase},${yBase}
      `;

      // Right panel: exact symmetrical reflection across X = 800 (native coordinates)
      const rxTop = 1600 - xTop;
      const rcp1X = 1600 - cp1X;
      const rcp2X = 1600 - cp2X;
      const rxBase = 1600 - xBase;

      const rxTopOuter = 1600 - xTopOuter;
      const rcp1XOuter = 1600 - cp1XOuter;
      const rcp2XOuter = 1600 - cp2XOuter;
      const rxBaseOuter = 1600 - xBaseOuter;

      const rightPath = `
        M ${rxTop},${yTop}
        C ${rcp1X},${cp1Y} ${rcp2X},${cp2Y} ${rxBase},${yBase}
        L ${rxBaseOuter},${yBase}
        C ${rcp2XOuter},${cp2Y} ${rcp1XOuter},${cp1Y} ${rxTopOuter},${yTop}
        Z
      `;

      const rightSpine = `
        M ${rxTop},${yTop}
        C ${rcp1X},${cp1Y} ${rcp2X},${cp2Y} ${rxBase},${yBase}
      `;

      const opacity = Math.max(0.42, 0.96 - t * 0.36);
      const strokeWidth = Math.max(1.2, 2.6 - t * 1.4);

      leftList.push({
        id: i,
        t,
        pathData: leftPath,
        spineData: leftSpine,
        opacity,
        strokeWidth,
        delay: `${i * 0.05}s`,
      });

      rightList.push({
        id: i,
        t,
        pathData: rightPath,
        spineData: rightSpine,
        opacity,
        strokeWidth,
        delay: `${i * 0.05}s`,
      });
    }

    return { leftFins: leftList, rightFins: rightList };
  }, []);

  // Concentric stepped circular dais rings on floor platform
  const daisRings = useMemo(() => {
    return [
      { id: 'ring-4', rx: 380, ry: 68, cy: 690, height: 18, strokeWidth: 1.8, opacity: 0.70 },
      { id: 'ring-3', rx: 290, ry: 52, cy: 685, height: 15, strokeWidth: 1.6, opacity: 0.80 },
      { id: 'ring-2', rx: 200, ry: 36, cy: 680, height: 13, strokeWidth: 1.5, opacity: 0.90 },
      { id: 'ring-1', rx: 110, ry: 20, cy: 675, height: 11, strokeWidth: 1.4, opacity: 0.98 },
    ];
  }, []);

  // Restrained, silky-smooth mouse-responsive movement strictly within hero
  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const heroSection = container.closest('.cat-hero') || container.parentElement || container;

    // Cached dimensions
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

    // Track mouse strictly within hero bounds
    const handlePointerMove = (e) => {
      const nx = ((e.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const ny = ((e.clientY - bounds.top) / bounds.height - 0.5) * 2;

      // HorizonX subtle, natural micro-shift (max ±8px X, ±5px Y, ±0.75° tilt)
      targetX = Math.max(-1, Math.min(1, nx)) * 8;
      targetY = Math.max(-1, Math.min(1, ny)) * 5;
      targetRotY = Math.max(-1, Math.min(1, nx)) * 0.75;
      targetRotX = -Math.max(-1, Math.min(1, ny)) * 0.5;
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
      targetRotX = 0;
      targetRotY = 0;
    };

    // Organic, silky-smooth lerp loop (0.40 lerp factor)
    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.40;
      currentY += (targetY - currentY) * 0.40;
      currentRotX += (targetRotX - currentRotX) * 0.40;
      currentRotY += (targetRotY - currentRotY) * 0.40;

      stage.style.transform = `perspective(1000px) translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;

      // Subtle differential colonnade depth
      if (leftColonnadeRef.current) {
        leftColonnadeRef.current.style.transform = `translate3d(${(currentX * 0.35).toFixed(2)}px, 0, 0)`;
      }
      if (rightColonnadeRef.current) {
        rightColonnadeRef.current.style.transform = `translate3d(${(-currentX * 0.35).toFixed(2)}px, 0, 0)`;
      }
      if (floorDaisRef.current) {
        floorDaisRef.current.style.transform = `translate3d(${(currentX * 0.22).toFixed(2)}px, ${(currentY * 0.18).toFixed(2)}px, 0)`;
      }

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
    <div ref={containerRef} className="cards-hero-horizonx-container" aria-hidden="true">
      {/* 1. Deep Ambient Base Canvas */}
      <div className="cards-horizonx-ambient-base" />

      {/* 2. Hardware-Accelerated Responsive Stage */}
      <div ref={stageRef} className="cards-horizonx-stage">
        <svg
          className="cards-horizonx-svg"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* ── Fin 3D Panel Surface Gradients ── */}
            <linearGradient id="finFaceGoldGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF0" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#F5E6A8" stopOpacity="0.72" />
              <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#8B6F2B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#07060A" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="finFaceGoldGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF0" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#F5E6A8" stopOpacity="0.72" />
              <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#8B6F2B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#07060A" stopOpacity="0.08" />
            </linearGradient>

            {/* ── Leading Illuminated Spine Edge Gradients ── */}
            <linearGradient id="finSpineGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF5" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#F5E6A8" stopOpacity="0.90" />
              <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#8B6F2B" stopOpacity="0.15" />
            </linearGradient>

            {/* ── Floor Dais Stepped Ring Gradients ── */}
            <linearGradient id="daisRimGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B6F2B" stopOpacity="0.3" />
              <stop offset="20%" stopColor="#D4AF37" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FFFDF0" stopOpacity="0.98" />
              <stop offset="80%" stopColor="#D4AF37" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#8B6F2B" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="daisRiserGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2A2113" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#18130B" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#07060A" stopOpacity="0.98" />
            </linearGradient>

            {/* ── Central Horizon Atmosphere Bloom ── */}
            <radialGradient id="horizonCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.75" />
              <stop offset="25%" stopColor="#F5E6A8" stopOpacity="0.45" />
              <stop offset="55%" stopColor="#D4AF37" stopOpacity="0.22" />
              <stop offset="80%" stopColor="#8B6F2B" stopOpacity="0.08" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* ── Floor Reflection Shimmer ── */}
            <radialGradient id="floorDaisShimmer" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5E6A8" stopOpacity="0.35" />
              <stop offset="45%" stopColor="#D4AF37" stopOpacity="0.15" />
              <stop offset="75%" stopColor="#8B6F2B" stopOpacity="0.05" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* ── Soft Edge Glow Filters ── */}
            <filter id="finGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="daisGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── 3. Central Horizon Atmospheric Light Flare ── */}
          <ellipse
            cx="800"
            cy="540"
            rx="460"
            ry="260"
            fill="url(#horizonCoreGlow)"
          />

          {/* ── 4. Concentric Floor Dais / Stepped Podium Rings ── */}
          <g ref={floorDaisRef} className="cards-horizonx-dais-group" filter="url(#daisGlow)">
            {/* Ground reflection under podium */}
            <ellipse
              cx="800"
              cy="690"
              rx="440"
              ry="85"
              fill="url(#floorDaisShimmer)"
            />

            {daisRings.map((ring) => (
              <g key={ring.id} className="cards-horizonx-ring">
                {/* 3D Vertical Cylinder Extrusion Riser */}
                <path
                  d={`
                    M ${800 - ring.rx},${ring.cy}
                    A ${ring.rx} ${ring.ry} 0 0 0 ${800 + ring.rx},${ring.cy}
                    L ${800 + ring.rx},${ring.cy + ring.height}
                    A ${ring.rx} ${ring.ry} 0 0 1 ${800 - ring.rx},${ring.cy + ring.height}
                    Z
                  `}
                  fill="url(#daisRiserGrad)"
                  stroke="rgba(212, 175, 55, 0.22)"
                  strokeWidth="0.8"
                />

                {/* Top Ring Disc */}
                <ellipse
                  cx="800"
                  cy={ring.cy}
                  rx={ring.rx}
                  ry={ring.ry}
                  fill="rgba(14, 11, 8, 0.82)"
                  stroke="url(#daisRimGoldGrad)"
                  strokeWidth={ring.strokeWidth}
                  opacity={ring.opacity}
                />
              </g>
            ))}

            {/* Specular center point on the inner core dais */}
            <ellipse
              cx="800"
              cy="675"
              rx="50"
              ry="9"
              fill="#FFFDF0"
              opacity="0.85"
            />
          </g>

          {/* ── 5. Left Architectural Colonnade of Curved Panels ── */}
          <g ref={leftColonnadeRef} className="cards-horizonx-colonnade-left">
            {leftFins.map((fin) => (
              <g key={`left-${fin.id}`} className="cards-horizonx-fin" style={{ animationDelay: fin.delay }}>
                {/* 3D Panel Body */}
                <path
                  d={fin.pathData}
                  fill="url(#finFaceGoldGradLeft)"
                  opacity={fin.opacity * 0.75}
                />
                {/* Leading Illuminated Champagne Edge */}
                <path
                  d={fin.spineData}
                  fill="none"
                  stroke="url(#finSpineGoldGrad)"
                  strokeWidth={fin.strokeWidth}
                  opacity={fin.opacity}
                  filter="url(#finGlow)"
                />
              </g>
            ))}
          </g>

          {/* ── 6. Right Architectural Colonnade of Curved Panels (Native Symmetrical Geometry) ── */}
          <g ref={rightColonnadeRef} className="cards-horizonx-colonnade-right">
            {rightFins.map((fin) => (
              <g key={`right-${fin.id}`} className="cards-horizonx-fin" style={{ animationDelay: fin.delay }}>
                {/* 3D Panel Body */}
                <path
                  d={fin.pathData}
                  fill="url(#finFaceGoldGradRight)"
                  opacity={fin.opacity * 0.75}
                />
                {/* Leading Illuminated Champagne Edge */}
                <path
                  d={fin.spineData}
                  fill="none"
                  stroke="url(#finSpineGoldGrad)"
                  strokeWidth={fin.strokeWidth}
                  opacity={fin.opacity}
                  filter="url(#finGlow)"
                />
              </g>
            ))}
          </g>
        </svg>

        {/* ── 7. Dynamic Architectural Luster Light Sweep ── */}
        <div className="cards-horizonx-luster-sweep" />
      </div>

      {/* ── 8. Text Protection Radial Obsidian Vignette ── */}
      <div className="cards-horizonx-text-vignette" />

      {/* ── 9. Bottom Edge Seamless Fade into Section 2 ── */}
      <div className="cards-horizonx-bottom-fade" />

      {/* ── 10. HorizonX Architectural Editorial Frame & Corner Crosshairs ── */}
      <div className="cards-hero-horizonx-frame" aria-hidden="true">
        {/* Top subtle metadata label inspired by HorizonX */}
        <div className="cards-frame-top-bar">
          <span className="cards-frame-emblem">❖</span>
          <span className="cards-frame-tag">A STUDY IN UNRESTRICTED MOTION · CARDS &amp; STATIONERY</span>
          <span className="cards-frame-index">01 / 05</span>
        </div>

        {/* Four corner crosshairs (+) */}
        <div className="cards-frame-corner cards-frame-corner--tl">
          <span className="cards-frame-crosshair">+</span>
        </div>
        <div className="cards-frame-corner cards-frame-corner--tr">
          <span className="cards-frame-crosshair">+</span>
        </div>
        <div className="cards-frame-corner cards-frame-corner--bl">
          <span className="cards-frame-crosshair">+</span>
        </div>
        <div className="cards-frame-corner cards-frame-corner--br">
          <span className="cards-frame-crosshair">+</span>
        </div>
      </div>
    </div>
  );
}
