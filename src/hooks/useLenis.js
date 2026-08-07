import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useLenis — Buttery smooth scrolling with proper GSAP ScrollTrigger sync.
 * - Uses a persistent RAF callback reference for clean teardown.
 * - Disables GSAP lag smoothing so animations stay synchronized.
 * - Returns the Lenis instance for external use if needed.
 */
export const useLenis = () => {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });
    lenisRef.current = lenis;

    // Sync Lenis scroll events → GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Bind Lenis RAF to GSAP ticker for perfectly synchronized updates
    rafRef.current = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafRef.current);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (rafRef.current) {
        gsap.ticker.remove(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef.current;
};
