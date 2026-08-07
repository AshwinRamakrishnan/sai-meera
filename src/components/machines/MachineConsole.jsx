import React, { useMemo } from 'react';
import './MachineConsole.css';

export default function MachineConsole({ lines = [], scrollRatio, accentColor }) {
  // If no lines provided, use defaults
  const defaultLines = [
    "INITIALIZING SYSTEM...",
    "CHECKING FLUID LEVELS...",
    "CALIBRATING SENSORS...",
    "ALIGNING PRINT HEADS...",
    "LOADING COLOR PROFILES...",
    "PREPARING SUBSTRATE...",
    "STARTING JOB RUN...",
    "PRINTING IN PROGRESS...",
    "UV CURING ACTIVE...",
    "JOB COMPLETE."
  ];
  
  const displayLines = lines.length > 0 ? lines : defaultLines;
  
  // Calculate how many lines to show based on scrollRatio
  // e.g., at 0.1 ratio, show 10% of lines
  const visibleCount = Math.max(1, Math.ceil(scrollRatio * displayLines.length));
  
  const visibleLines = displayLines.slice(0, visibleCount);
  
  return (
    <div className="consoleContainer">
      <div className="scanline" />
      <div className="consoleContent">
        {visibleLines.map((line, index) => (
          <div key={index} className="consoleLine">
            <span 
              className="prefix" 
              style={{ color: accentColor }}
            >{"> "}</span>
            <span className="text">{line}</span>
            {index === visibleLines.length - 1 && scrollRatio < 1 && (
              <span className="cursor" style={{ backgroundColor: accentColor }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
