import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

/**
 * Ultra-smooth, lightweight hardware-accelerated CustomCursor
 * Uses direct transform: translate3d() and requestAnimationFrame
 * Zero React state updates on mousemove, zero layout thrashing
 */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device to disable cursor
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = null;
    let isHovered = false;

    // Direct hardware-accelerated transform updates
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update dot instantaneously with zero delay
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Smooth, responsive lerp loop for the trailing ring
    const render = () => {
      // 0.55 factor ensures immediate, snappy response without any lag or delayed follow-through
      ringX += (mouseX - ringX) * 0.55;
      ringY += (mouseY - ringY) * 0.55;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, select, [role="button"], .magnetic');
      if (target && !isHovered) {
        isHovered = true;
        if (ringRef.current) ringRef.current.classList.add('is-hovered');
        if (dotRef.current) dotRef.current.classList.add('is-hovered');
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest('a, button, input, textarea, select, [role="button"], .magnetic');
      if (target && isHovered) {
        isHovered = false;
        if (ringRef.current) ringRef.current.classList.remove('is-hovered');
        if (dotRef.current) dotRef.current.classList.remove('is-hovered');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div className="cursor-wrapper" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};

export default CustomCursor;
