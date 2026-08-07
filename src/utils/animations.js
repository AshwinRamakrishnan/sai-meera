import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const fadeInUp = { y: 60, opacity: 0, duration: 1, ease: 'power3.out' };
export const fadeInDown = { y: -60, opacity: 0, duration: 1, ease: 'power3.out' };
export const staggerReveal = { y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out' };
export const scaleIn = { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.6)' };

export function createScrollTrigger(trigger, animation, options = {}) {
  return ScrollTrigger.create({
    trigger,
    start: 'top 80%',
    end: 'bottom 20%',
    ...options,
    onEnter: () => gsap.to(trigger, animation),
  });
}
