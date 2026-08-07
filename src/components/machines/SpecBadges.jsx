import React from 'react';
import './SpecBadges.css';

export default function SpecBadges({ specs = [], accentColor }) {
  if (!specs || specs.length === 0) return null;

  return (
    <div className="badgesGrid">
      {specs.map((spec, idx) => (
        <div key={idx} className="badge">
          <div 
            className="dot" 
            style={{ backgroundColor: accentColor }}
          />
          <div className="content">
            <span className="label">{spec.label}</span>
            <span className="value">{spec.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
