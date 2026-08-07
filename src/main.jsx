import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
