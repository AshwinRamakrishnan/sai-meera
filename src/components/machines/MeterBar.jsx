import React from 'react';
import './MeterBar.css';

export default function MeterBar({ progress = 0, accentColor, label }) {
  const percentage = Math.round(progress * 100);
  
  return (
    <div className="meterContainer">
      <div className="header">
        <span className="label">{label}</span>
        <span className="percentage">{percentage}%</span>
      </div>
      <div className="track">
        <div 
          className="fill" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: accentColor,
            boxShadow: `0 0 10px ${accentColor}80`
          }} 
        />
      </div>
    </div>
  );
}
