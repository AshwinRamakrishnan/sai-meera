import { useState, useEffect, useRef } from 'react';

export const useScrollRatio = () => {
  const ref = useRef(null);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;

      const startScroll = elementTop - viewportHeight;
      const endScroll = elementTop + elementHeight;
      
      let progress = 0;
      if (scrollY >= startScroll && scrollY <= endScroll) {
        progress = (scrollY - startScroll) / (endScroll - startScroll);
      } else if (scrollY > endScroll) {
        progress = 1;
      }
      
      setRatio(Math.max(0, Math.min(1, progress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, ratio };
};
