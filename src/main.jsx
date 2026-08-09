import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

// Suppress internal Three.js / R3F deprecation warnings (cosmetic only, not our code)
const _warn = console.warn.bind(console);
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && (
    msg.includes('THREE.Clock') ||
    msg.includes('THREE.WebGLProgram') ||
    msg.includes('THREE.Timer')
  )) return;
  _warn(...args);
};

// --- TEMPORARY ERROR CATCHER ---
const _error = console.error.bind(console);
console.error = (...args) => {
  _error(...args);
  try {
    const errDiv = document.createElement('div');
    errDiv.style.cssText = 'position:fixed;top:0;left:0;z-index:999999;background:red;color:white;padding:10px;font-family:monospace;white-space:pre-wrap;max-height:50vh;overflow:auto;width:100%';
    errDiv.textContent = 'REACT ERROR: ' + args.map(a => {
      if (!a) return String(a);
      if (a.stack) return a.stack;
      if (a.message) return a.message;
      return String(a);
    }).join(' ');
    document.body.appendChild(errDiv);
  } catch(e) {
    _error("Error catcher crashed", e);
  }
};
window.addEventListener('error', (e) => {
  console.error(e.error || e.message);
});
// --------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
