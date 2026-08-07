import React from 'react';
import './CoreSystem.css';

const CoreSystem = () => {
  return (
    <div className="core-system-container">
      <div className="core-rings">
        <div className="ring ring-outer"></div>
        <div className="ring ring-middle"></div>
        <div className="ring ring-inner"></div>
        <div className="core-center">
          <span>SM</span>
        </div>
      </div>
      <div className="core-label">CORE SYSTEM</div>
    </div>
  );
};

export default CoreSystem;
