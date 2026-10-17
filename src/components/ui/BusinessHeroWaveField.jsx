import React, { useEffect, useRef } from 'react';
import './BusinessHeroWaveField.css';

/**
 * BusinessHeroWaveField
 * Exact HorizonX Digital Wave Field Hero recreation for SAI MEERA Business & Institutional pages.
 * Reference: https://horizonx.so/explore/digital-wave-field-hero
 *
 * Core Features:
 * - Complete, symmetric rectangular grid with ZERO missing boxes across all sides & corners.
 * - Dynamic high-contrast wave physics: dark obsidian resting tiles with living, continuous
 *   concentric ripple pulses and sweeping diagonal gold/champagne swells.
 * - Hardware-accelerated Canvas2D requestAnimationFrame render loop with zero React state re-renders.
 * - Silky smooth cursor excitation with natural ripple decay.
 * - Full reduced-motion and mobile responsive compliance.
 */
export default function BusinessHeroWaveField() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = null;

    // Pointer state
    const pointer = {
      targetX: -9999,
      targetY: -9999,
      currentX: -9999,
      currentY: -9999,
      isHovered: false,
      lastMoveTime: 0
    };

    // Grid configuration: all tiles exist across all columns and rows
    let COLS = 20;
    let ROWS = 11;
    const tiles = [];

    function initTiles() {
      tiles.length = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const nx = COLS > 1 ? c / (COLS - 1) : 0.5;
          const ny = ROWS > 1 ? r / (ROWS - 1) : 0.5;

          tiles.push({
            c,
            r,
            nx,
            ny,
            elevation: 0
          });
        }
      }
    }

    // Resize handler
    function handleResize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = Math.max(rect.width, 320);
      height = Math.max(rect.height, 400);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Responsive column and row sizing: every tile is kept complete and symmetric
      if (width < 600) {
        COLS = 12;
        ROWS = 12;
      } else if (width < 1024) {
        COLS = 16;
        ROWS = 11;
      } else {
        COLS = 20;
        ROWS = 11;
      }

      initTiles();

      if (!pointer.isHovered) {
        pointer.targetX = width * 0.50;
        pointer.targetY = height * 0.48;
        pointer.currentX = pointer.targetX;
        pointer.currentY = pointer.targetY;
      }
    }

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Mouse interaction handlers on hero section
    const heroSection = container.closest('.cat-hero') || container;

    function onPointerMove(e) {
      const rect = container.getBoundingClientRect();
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      pointer.isHovered = true;
      pointer.lastMoveTime = performance.now();
    }

    function onPointerLeave() {
      pointer.isHovered = false;
    }

    heroSection.addEventListener('pointermove', onPointerMove, { passive: true });
    heroSection.addEventListener('pointerleave', onPointerLeave, { passive: true });

    // Render loop
    let startTime = performance.now();

    function render(currentTime) {
      const elapsed = (currentTime - startTime) * 0.001; // seconds

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw structured fine coordinate grid / pixel matrix in background
      const finePitch = Math.max(22, Math.floor(width / 46));
      ctx.lineWidth = 1;

      // Fine hairline grid lines
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.035)';
      ctx.beginPath();
      for (let x = 0; x < width; x += finePitch) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += finePitch) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Matrix intersection dots
      ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
      for (let x = 0; x < width; x += finePitch * 2) {
        for (let y = 0; y < height; y += finePitch * 2) {
          ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
        }
      }

      // 2. Cursor smoothing (lerp)
      if (pointer.isHovered) {
        pointer.currentX += (pointer.targetX - pointer.currentX) * 0.14;
        pointer.currentY += (pointer.targetY - pointer.currentY) * 0.14;
      }

      // 3. Grid geometry: complete, symmetric rectangular coverage
      const gridW = width * 0.94;
      const gridH = height * 0.84;
      const cellW = gridW / COLS;
      const cellH = gridH / ROWS;
      const tileSize = Math.max(16, Math.min(cellW, cellH) - 6);

      const startX = (width - COLS * cellW) * 0.5;
      const startY = (height - ROWS * cellH) * 0.5;

      const influenceRadius = Math.min(width, height) * 0.36;

      // Subtle ambient cursor glow aura (only when hovered)
      if (pointer.isHovered && pointer.currentX > -500) {
        const auraGradient = ctx.createRadialGradient(
          pointer.currentX, pointer.currentY, 0,
          pointer.currentX, pointer.currentY, influenceRadius
        );
        auraGradient.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
        auraGradient.addColorStop(0.4, 'rgba(139, 111, 43, 0.03)');
        auraGradient.addColorStop(1, 'rgba(10, 10, 15, 0)');
        ctx.fillStyle = auraGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // 4. Autonomous Living Wave Field calculation
      // Wave time flows continuously from page load
      const waveTime = elapsed * 1.6;

      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];

        // Tile base center
        const tileCenterX = startX + (t.c + 0.5) * cellW;
        const tileCenterY = startY + (t.r + 0.5) * cellH;

        // Wave Component 1: Concentric expanding pulse ripple from center focal point
        const dxCenter = (t.nx - 0.50) * 1.45;
        const dyCenter = (t.ny - 0.48);
        const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        const ringWave = Math.sin(distCenter * 9.2 - waveTime * 2.3);
        const ringCrest = Math.pow(Math.max(0, ringWave), 2.0);

        // Wave Component 2: Sweeping diagonal undulating swell (top-left to bottom-right)
        const diagWave = Math.sin((t.nx * 3.6 + t.ny * 2.4) - waveTime * 1.5);
        const diagCrest = Math.pow(Math.max(0, diagWave), 1.6);

        // Wave Component 3: Counter-harmonic cross undulation
        const crossWave = Math.cos((t.nx * 2.2 - t.ny * 3.2) + waveTime * 1.1);
        const crossCrest = Math.pow(Math.max(0, crossWave), 2.0);

        // Combined autonomous wave (ranges from 0 at rest up to 1.0 at crests)
        const autoWave = ringCrest * 0.58 + diagCrest * 0.44 + crossCrest * 0.22;

        // Cursor influence: localized excitation that gently enhances the wave
        let cursorInfluence = 0;
        if (pointer.isHovered && pointer.currentX > -500) {
          const pDist = Math.hypot(tileCenterX - pointer.currentX, tileCenterY - pointer.currentY);
          if (pDist < influenceRadius) {
            const normDist = 1 - pDist / influenceRadius;
            const cursorGlow = Math.pow(normDist, 1.6) * 0.85;
            const ripple = Math.sin(pDist * 0.055 - elapsed * 4.2) * cursorGlow * 0.35;
            cursorInfluence = Math.max(0, cursorGlow + ripple);
          }
        }

        // Overall target elevation: [0.0 .. 1.15]
        const targetElev = Math.min(1.15, autoWave + cursorInfluence);
        t.elevation += (targetElev - t.elevation) * 0.14;

        // Visual position with subtle 3D lift
        const liftY = t.elevation * 10;
        const scale = 1.0 + t.elevation * 0.12;

        const currentSize = tileSize * scale;
        const x = tileCenterX - currentSize * 0.5;
        const y = tileCenterY - currentSize * 0.5 - liftY;

        // High-contrast color mapping matching HorizonX digital wave
        const elev = t.elevation;
        let fillColor;
        let strokeColor;
        let lineWidth = 1.0;

        if (elev < 0.12) {
          // Resting state: dark translucent obsidian glass
          fillColor = 'rgba(12, 11, 15, 0.55)';
          strokeColor = 'rgba(212, 175, 55, 0.12)';
          lineWidth = 1.0;
        } else if (elev < 0.45) {
          // Emerging warm gold wave
          const k = (elev - 0.12) / 0.33;
          fillColor = `rgba(165, 125, 42, ${(0.18 + k * 0.32).toFixed(3)})`;
          strokeColor = `rgba(215, 180, 75, ${(0.26 + k * 0.40).toFixed(3)})`;
          lineWidth = 1.2;
        } else if (elev < 0.72) {
          // Radiant primary gold crest
          const k = (elev - 0.45) / 0.27;
          fillColor = `rgba(212, 175, 55, ${(0.52 + k * 0.26).toFixed(3)})`;
          strokeColor = `rgba(245, 230, 168, ${(0.68 + k * 0.24).toFixed(3)})`;
          lineWidth = 1.6;
        } else {
          // Peak radiant champagne gold crest
          const k = Math.min(1, (elev - 0.72) / 0.35);
          fillColor = `rgba(245, 230, 168, ${(0.78 + k * 0.18).toFixed(3)})`;
          strokeColor = `rgba(255, 253, 240, 0.95)`;
          lineWidth = 2.0;
        }

        // Draw tile body with bloom for elevated crests
        if (elev > 0.50) {
          ctx.save();
          ctx.shadowColor = 'rgba(212, 175, 55, 0.55)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = fillColor;
          ctx.fillRect(x, y, currentSize, currentSize);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = lineWidth;
          ctx.strokeRect(x, y, currentSize, currentSize);
          ctx.restore();
        } else {
          ctx.fillStyle = fillColor;
          ctx.fillRect(x, y, currentSize, currentSize);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = lineWidth;
          ctx.strokeRect(x, y, currentSize, currentSize);
        }

        // Specular highlight line on high crests
        if (elev > 0.65) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.fillRect(x + 2, y + 2, currentSize - 4, 1.8);
        }
      }

      // Reduced motion: only run one frame
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    // Start loop
    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      heroSection.removeEventListener('pointermove', onPointerMove);
      heroSection.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div className="biz-wave-field-container" ref={containerRef} aria-hidden="true">
      {/* Interactive Canvas */}
      <canvas ref={canvasRef} className="biz-wave-field-canvas" />

      {/* Radial Obsidian Vignette for Perfect Typography Readability */}
      <div className="biz-wave-field-vignette" />

      {/* Architectural Framing Accents (Inspired by HorizonX reference) */}
      <div className="biz-frame-corner biz-frame-corner--tl">+</div>
      <div className="biz-frame-corner biz-frame-corner--tr">+</div>
      <div className="biz-frame-corner biz-frame-corner--bl">+</div>
      <div className="biz-frame-corner biz-frame-corner--br">+</div>

      {/* Top Meta Bar */}
      <div className="biz-field-top-meta">
        <span className="biz-meta-tag">◈ BUSINESS · INDUSTRIAL · INSTITUTIONAL</span>
      </div>

      {/* Bottom Technical Coordinates Strip */}
      <div className="biz-field-bottom-meta">
        <span className="biz-meta-coords">10.9602° N / 79.3845° E</span>
        <span className="biz-meta-hint">Move cursor to disturb the field</span>
        <span className="biz-meta-exp">Industrial Print Matrix</span>
      </div>
    </div>
  );
}
