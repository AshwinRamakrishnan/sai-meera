import React, { useMemo } from 'react';
import './HeroParticles.css';

const HeroParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 4 + 4; // 4-8px
      const isCyan = Math.random() > 0.5;
      const color = isCyan ? 'var(--cyan, #00d4ff)' : 'var(--gold, #f5a623)';
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const animationDelay = `${Math.random() * 5}s`;
      const animationDuration = `${10 + Math.random() * 10}s`;
      const opacity = 0.2 + Math.random() * 0.2; // 0.2 - 0.4
      
      return { id: i, size, color, left, top, animationDelay, animationDuration, opacity };
    });
  }, []);

  return (
    <div className="hero-particles-container" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="hero-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
            boxShadow: `0 0 10px ${p.color}`
          }}
        />
      ))}
    </div>
  );
};

export default HeroParticles;
