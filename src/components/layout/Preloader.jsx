import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = ({ isLoading, onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (loaded || hide) return;
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setLoaded(true), 300);
        setTimeout(() => {
          setHide(true);
          console.log('Preloader: reached 100%, calling onLoadComplete() if it exists');
          if (onLoadComplete) onLoadComplete();
        }, 800);
      }
      setProgress(currentProgress);
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadComplete, loaded, hide]);

  // Also support external isLoading prop to hide immediately
  useEffect(() => {
    if (!isLoading && !hide) {
      setLoaded(true);
      setTimeout(() => setHide(true), 500);
    }
  }, [isLoading, hide]);

  if (hide) return null;

  return (
    <div className={`preloader ${loaded ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <h1 className="preloader-text">SAI MEERA DIGITAL DESIGN</h1>
        <div className="preloader-bar-container">
          <div 
            className="preloader-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
