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
         3. SHOWCASE COMPONENTS — staggered fade-up
         Targets: WeddingInvite, FlexBanner, PhotoshopUI,
                  PhotoFrames, BusinessCards, ServicesGrid sections.
         We target the section wrapper by their root classNames.
      ──────────────────────────────────────────────────────── */
      const showcaseSelectors = [
        '.wedding-section',      // WeddingInvite
        '.flexbanner-section',   // FlexBanner
        '.ps-section',           // PhotoshopUI
        '.frames-section',       // PhotoFrames
        '.cards-section',        // BusinessCards
        '.services-section',     // ServicesGrid
      ];

      showcaseSelectors.forEach((sel) => {
        gsap.utils.toArray(sel).forEach((el) => {
          // Animate direct children with a stagger
          const children = el.querySelectorAll(
            'h2, h3, p, .showcase-card, .service-item, .frame-item, .card-item'
          );

          gsap.fromTo(el,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          if (children.length) {
            gsap.fromTo(children,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                stagger: 0.08,
                scrollTrigger: {
                  trigger: el,
                  start: 'top 78%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }
        });
      });

      /* ────────────────────────────────────────────────────────
         4. LEGACY SECTION stats counters — GSAP parallel bar
         LegacySection already uses Framer Motion for counter;
         we add a GSAP entrance for the outer container only.
      ──────────────────────────────────────────────────────── */
      const legacySection = document.querySelector('.legacy-section');
      if (legacySection) {
        const statCards = legacySection.querySelectorAll('.legacy-stat, .stat-card, .legacy-card');
        if (statCards.length) {
          gsap.fromTo(statCards,
            { opacity: 0, y: 32, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: 'back.out(1.3)',
              stagger: 0.12,
              scrollTrigger: {
                trigger: legacySection,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      }

      /* ────────────────────────────────────────────────────────
         5. CONTACT SECTION — slide-up entrance
      ──────────────────────────────────────────────────────── */
      const contactSection = document.querySelector('.contact-section, .contact-hero-section');
      if (contactSection) {
        gsap.fromTo(contactSection,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contactSection,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

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
