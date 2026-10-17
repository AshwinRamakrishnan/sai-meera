import React from 'react';
import './LivingNatureMonitor.css';

import landscapeBaseImg from '../../assets/design_lab_landscape.png';

// Realistic distant avian flock data across the mountain sky
const birdsData = [
  {
    id: 1,
    scale: 0.58,
    duration: 18,
    delay: 0,
    altitudeStart: 18,
    altitudeEnd: 14,
    flapSpeed: 0.88,
  },
  {
    id: 2,
    scale: 0.48,
    duration: 21,
    delay: 2.2,
    altitudeStart: 24,
    altitudeEnd: 19,
    flapSpeed: 0.82,
  },
  {
    id: 3,
    scale: 0.35,
    duration: 27,
    delay: 6.5,
    altitudeStart: 11,
    altitudeEnd: 8,
    flapSpeed: 1.05,
  },
  {
    id: 4,
    scale: 0.52,
    duration: 22,
    delay: 10.5,
    altitudeStart: 28,
    altitudeEnd: 22,
    flapSpeed: 0.86,
  },
  {
    id: 5,
    scale: 0.42,
    duration: 24,
    delay: 13.8,
    altitudeStart: 16,
    altitudeEnd: 12,
    flapSpeed: 0.94,
  },
];

// Single Bird component with articulated wing flapping
const Bird = ({ id, scale, duration, delay, altitudeStart, altitudeEnd, flapSpeed }) => {
  return (
    <div
      className={`dl-nature-bird dl-bird-${id}`}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        '--bird-scale': scale,
        '--bird-y-start': `${altitudeStart}%`,
        '--bird-y-end': `${altitudeEnd}%`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="-20 -10 40 20"
        className="dl-bird-svg"
        style={{ animationDuration: `${flapSpeed}s` }}
      >
        {/* Left Wing with Realistic Avian Curvature */}
        <path
          className="dl-bird-wing dl-wing-left"
          d="M 0,0 C -5,-4 -12,-8 -20,-5 C -15,-2 -7,-1 0,1 Z"
        />
        {/* Aerodynamic Bird Body & Tail */}
        <path
          className="dl-bird-body"
          d="M -2,-1 C -1,-3 1,-3 2,-1 C 3,1 2,4 0,6 C -2,4 -3,1 -2,-1 Z"
        />
        {/* Right Wing with Realistic Avian Curvature */}
        <path
          className="dl-bird-wing dl-wing-right"
          d="M 0,0 C 5,-4 12,-8 20,-5 C 15,-2 7,-1 0,1 Z"
        />
      </svg>
    </div>
  );
};

const LivingNatureMonitor = ({ isActive = true }) => {
  return (
    <div className={`dl-living-nature-screen ${isActive ? 'is-active' : ''}`} aria-hidden="true">
      {/* 1. Underlying 4K Mountain Landscape Foundation (Seamless full scene) */}
      <img
        src={landscapeBaseImg}
        alt="Photorealistic mountain, lake, and forest nature landscape"
        className="dl-nature-base-landscape"
        loading="eager"
      />

      {/* 2. Living Sky & Moving Cloud Layers (Overlaid softly on upper sky) */}
      <div className="dl-sky-effects-zone">
        {/* Soft Drifting Cloud Layer 1 */}
        <div className="dl-cloud-drift dl-cloud-layer-1" />

        {/* High Cirrus Drifting Cloud Layer 2 */}
        <div className="dl-cloud-drift dl-cloud-layer-2" />

        {/* Warm Golden Hour Mountain Sunbeam Glow */}
        <div className="dl-sky-sunlight-haze" />

        {/* Realistic Flock of Birds Flying across Mountain Peaks */}
        <div className="dl-birds-flight-space">
          {birdsData.map((bird) => (
            <Bird key={bird.id} {...bird} />
          ))}
        </div>
      </div>

      {/* 3. Living Lake & Water Reflections (Soft-masked over lower water area) */}
      <div className="dl-lake-effects-zone">
        {/* Organic Water Ripple Undulation */}
        <div className="dl-lake-water-waves" />

        {/* Horizontal Perspective Ripple Bands */}
        <div className="dl-lake-ripples-band dl-ripples-near" />
        <div className="dl-lake-ripples-band dl-ripples-far" />

        {/* Sunlight Water Surface Specular Shimmer */}
        <div className="dl-lake-golden-sheen" />

        {/* Tiny Specular Sunlight Glints on Lake Surface */}
        <div className="dl-sun-glint dl-glint-1" />
        <div className="dl-sun-glint dl-glint-2" />
        <div className="dl-sun-glint dl-glint-3" />
        <div className="dl-sun-glint dl-glint-4" />
        <div className="dl-sun-glint dl-glint-5" />
        <div className="dl-sun-glint dl-glint-6" />
      </div>

      {/* 4. Shoreline Forest Atmospheric Depth */}
      <div className="dl-forest-breeze" />

      {/* 5. Anti-Reflective Monitor Glass & Bezel Inner Shadow */}
      <div className="dl-nature-screen-glass" />
    </div>
  );
};

export default LivingNatureMonitor;
