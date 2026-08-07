import React from 'react';
import './GlassCard.css';

const GlassCard = ({ children, className = '', accentColor = 'cyan', hover = true }) => {
  return (
    <div 
      className={`glass-card ${hover ? 'hover-effect' : ''} accent-${accentColor} ${className}`}
    >
      <div className="glass-content">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
