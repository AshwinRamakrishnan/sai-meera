import React, { useEffect, useRef } from 'react';
import './HeroParticles.css';

/**
 * High-performance Canvas 2D Gold Particle System
 * Recreates the luxury gold floating particles, bokeh orbs,
 * and delicate star sparkle glints shown in the reference screenshots.
 */
const HeroParticles = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let isVisible = true;
    let reducedMotion = false;

    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = motionQuery.matches;
    const handleMotionChange = (e) => {
      reducedMotion = e.matches;
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Mouse parallax tracking (subtle and restrained)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouse.targetX = Math.max(-1, Math.min(1, nx));
      mouse.targetY = Math.max(-1, Math.min(1, ny));
    };

    const handlePointerLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Handle canvas resizing with Device Pixel Ratio
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Particle Palette
    const GOLD_COLORS = [
      { r: 255, g: 215, b: 115 }, // Warm Pale Gold
      { r: 245, g: 197, b: 66 },  // Brilliant Gold
      { r: 220, g: 165, b: 50 },  // Amber Gold
      { r: 255, g: 235, b: 175 }, // Champagne Highlight
      { r: 212, g: 168, b: 67 },  // Sai Meera Classic Gold
    ];

    // Determine particle count based on screen width
    const particleCount = width < 768 ? 48 : 80;

    // Initialize particles across 3 distinct depth layers
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      // Depth factor z: 0 (deep background) to 1 (near foreground)
      const z = Math.random();
      const color = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];

      let baseRadius;
      let vy;
      let baseAlpha;
      let hasSparkle = false;

      if (z < 0.4) {
        // Deep background dust: tiny, numerous, slow
        baseRadius = 0.7 + Math.random() * 0.8;
        vy = -(0.12 + Math.random() * 0.18);
        baseAlpha = 0.2 + Math.random() * 0.25;
      } else if (z < 0.8) {
        // Midground glowing embers
        baseRadius = 1.6 + Math.random() * 1.4;
        vy = -(0.25 + Math.random() * 0.35);
        baseAlpha = 0.4 + Math.random() * 0.35;
        hasSparkle = Math.random() < 0.25; // 25% have periodic star sparkle glints
      } else {
        // Foreground bokeh orbs: soft, larger, translucent
        baseRadius = 3.6 + Math.random() * 3.2;
        vy = -(0.45 + Math.random() * 0.4);
        baseAlpha = 0.3 + Math.random() * 0.35;
        hasSparkle = Math.random() < 0.35;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        baseRadius,
        radius: baseRadius,
        vy,
        vxBase: (Math.random() - 0.5) * 0.15,
        color,
        baseAlpha,
        alpha: baseAlpha,
        pulseFreq: 0.8 + Math.random() * 1.6,
        pulsePhase: Math.random() * Math.PI * 2,
        swayFreq: 0.4 + Math.random() * 0.8,
        swayAmp: 0.3 + Math.random() * 0.6,
        swayPhase: Math.random() * Math.PI * 2,
        hasSparkle,
        sparkleCycle: 3 + Math.random() * 6,
        sparkleTimer: Math.random() * 10,
        sparkleIntensity: 0,
      });
    }

    // Helper: draw 4-pointed diamond star sparkle glint (✦)
    const drawSparkle = (cx, cy, radius, alpha, rgb) => {
      const armLength = radius * 4.5;
      const innerLength = radius * 0.8;

      ctx.save();
      ctx.translate(cx, cy);

      // Central glow disc
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, armLength * 1.2);
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.8})`);
      grad.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, armLength * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal and vertical tapered star rays
      ctx.fillStyle = `rgba(255, 250, 220, ${alpha * 0.95})`;
      ctx.beginPath();
      // 4-point diamond star polygon
      ctx.moveTo(0, -armLength);
      ctx.quadraticCurveTo(0, -innerLength, innerLength, 0);
      ctx.quadraticCurveTo(0, innerLength, 0, armLength);
      ctx.quadraticCurveTo(0, innerLength, -innerLength, 0);
      ctx.quadraticCurveTo(0, -innerLength, 0, -armLength);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    let lastTime = performance.now();

    // Main Animation Loop
    const render = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reducedMotion) {
          // Upward motion
          p.y += p.vy;

          // Gentle sinusoidal horizontal sway
          p.x += Math.sin(currentTime * 0.001 * p.swayFreq + p.swayPhase) * p.swayAmp + p.vxBase;

          // Parallax offset proportional to depth z
          const parallaxX = mouse.x * p.z * 18;
          const parallaxY = mouse.y * p.z * 14;

          // Twinkle / gentle breathing of alpha
          const pulse = Math.sin(currentTime * 0.001 * p.pulseFreq + p.pulsePhase);
          p.alpha = Math.max(0.1, Math.min(1, p.baseAlpha + pulse * 0.18));

          // Star sparkle cycle
          if (p.hasSparkle) {
            p.sparkleTimer += dt;
            if (p.sparkleTimer > p.sparkleCycle) {
              p.sparkleIntensity = 1.0;
              p.sparkleTimer = 0;
            }
            if (p.sparkleIntensity > 0) {
              p.sparkleIntensity -= dt * 1.2; // fade sparkle over ~0.8s
              if (p.sparkleIntensity < 0) p.sparkleIntensity = 0;
            }
          }

          // Respawn at bottom when leaving top boundary
          if (p.y < -30) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          if (p.x < -30) p.x = width + 20;
          if (p.x > width + 30) p.x = -20;
        }

        const renderX = p.x + (!reducedMotion ? mouse.x * p.z * 18 : 0);
        const renderY = p.y + (!reducedMotion ? mouse.y * p.z * 14 : 0);
        const { r, g, b } = p.color;

        ctx.save();

        if (p.z > 0.75) {
          // Foreground bokeh orbs: soft radial gradient with glowing halo
          const grad = ctx.createRadialGradient(
            renderX,
            renderY,
            0,
            renderX,
            renderY,
            p.radius * 2.2
          );
          grad.addColorStop(0, `rgba(255, 250, 220, ${p.alpha * 0.95})`);
          grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.65})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.z > 0.35) {
          // Midground glowing embers
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
          ctx.shadowBlur = p.radius * 3.5;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;

          ctx.beginPath();
          ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Deep background tiny dust
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw star sparkle glint if active
        if (p.hasSparkle && p.sparkleIntensity > 0) {
          drawSparkle(renderX, renderY, p.radius * 1.5, p.sparkleIntensity, p.color);
        }

        ctx.restore();
      }

      if (isVisible) {
        animId = requestAnimationFrame(render);
      }
    };

    // Pause rendering when hero is scrolled out of viewport (0% GPU waste)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          lastTime = performance.now();
          animId = requestAnimationFrame(render);
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      observer.disconnect();
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-particles-canvas-wrap" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-particles-canvas" />
    </div>
  );
};

export default HeroParticles;
