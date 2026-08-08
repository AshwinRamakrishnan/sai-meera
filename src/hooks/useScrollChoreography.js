/**
 * useScrollChoreography.js
 * Phase 5 — GSAP ScrollTrigger choreography hook
 *
 * Attaches GSAP ScrollTrigger animations to the HomePage's DOM sections.
 * Rules:
 *   - Does NOT touch MachineSection's Canvas, useFrame, or scrollRatioRef.
 *   - Only animates the HUD overlay text, showcase components, and section markers.
 *   - Fully cleans up on unmount (kills all triggers).
 *   - Respects prefers-reduced-motion via window.matchMedia check.
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Returns true if the user has requested reduced motion.
 * When true, all GSAP animations are skipped (elements remain visible at full opacity).
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useScrollChoreography() {
  useEffect(() => {
    // ── Guard: skip all GSAP if user prefers reduced motion ──
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      /* ────────────────────────────────────────────────────────
         1. GOLD DIVIDERS — subtle scale-in from centre
         Target: .gold-divider (App.css / index.css)
      ──────────────────────────────────────────────────────── */
      gsap.utils.toArray('.gold-divider').forEach((el) => {
        gsap.fromTo(el,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            transformOrigin: 'center center',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      /* ────────────────────────────────────────────────────────
         2. MACHINE HUD OVERLAY — slide in from the side
         The Canvas runs its own pipeline; we only animate the
         HUD overlay elements (text, badges, console panel).
         The Canvas div itself is NOT touched.
      ──────────────────────────────────────────────────────── */
      gsap.utils.toArray('.machineSection').forEach((section) => {
        const hudLeft   = section.querySelector('.hudLeft');
        const hudRight  = section.querySelector('.hudRight');
        const statusBar = section.querySelector('.statusIndicator');
        const badge     = section.querySelector('.badge');

        // Staggered entrance: status bar → badge → left panel → right panel
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          defaults: { ease: 'power3.out' },
        });

        if (statusBar) tl.fromTo(statusBar,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.6 },
          0
        );
        if (badge) tl.fromTo(badge,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)' },
          0.1
        );
        if (hudLeft) tl.fromTo(hudLeft,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.85 },
          0.2
        );
        if (hudRight) tl.fromTo(hudRight,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.85 },
          0.35
        );
      });

      /* ────────────────────────────────────────────────────────
         BLOCKS 3-5 INTENTIONALLY OMITTED:
         WeddingInvite, FlexBanner, PhotoshopUI, PhotoFrames,
         BusinessCards, ServicesGrid, LegacySection, and
         ContactSection all have their own Framer Motion
         useInView + stagger entrance animations already.
         Adding GSAP on the same elements would double-animate.
         GSAP is used only on elements with NO existing FM:
         gold-dividers (block 1), HUD panels (block 2),
         and spec badges (block 6).
      ──────────────────────────────────────────────────────── */

      /* ────────────────────────────────────────────────────────
         6. MACHINE SPEC BADGES — micro-stagger on entrance
         These are inside the HUD overlay (pure DOM, safe to animate).
      ──────────────────────────────────────────────────────── */
      gsap.utils.toArray('.machineSection').forEach((section) => {
        const badges = section.querySelectorAll('.specBadge');
        if (!badges.length) return;

        gsap.fromTo(badges,
          { opacity: 0, scale: 0.8, y: 10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.4)',
            stagger: 0.07,
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

    }); // end gsap.context

    // ── Cleanup: kills all ScrollTriggers created in this context ──
    return () => ctx.revert();
  }, []);
}
