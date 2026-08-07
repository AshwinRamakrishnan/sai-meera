import React from 'react';

/**
 * Shared industrial lighting rig for all machine scenes.
 * Cinematic key/fill/back/hemisphere setup.
 */
export default function SharedLighting({ accentColor = '#00d4ff' }) {
  return (
    <>
      {/* Key light — warm, strong, from upper-right */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={2.2}
        color="#fff5e6"
      />
      {/* Fill light — cool, softer, from left */}
      <directionalLight
        position={[-4, 4, -2]}
        intensity={0.9}
        color="#b0d4ff"
      />
      {/* Back/rim light — subtle, creates edge separation */}
      <directionalLight
        position={[0, 3, -6]}
        intensity={0.6}
        color="#ffffff"
      />
      {/* Top-down industrial overhead light */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={0.8}
        color="#ffe8c0"
      />
      {/* Hemisphere light — overall ambient fill */}
      <hemisphereLight
        skyColor="#1a1a2e"
        groundColor="#0a0a0f"
        intensity={0.8}
      />
      {/* Accent point light — matches the machine's theme color */}
      <pointLight
        position={[0, 2, 4]}
        intensity={1.2}
        color={accentColor}
        distance={20}
        decay={2}
      />
      {/* Ambient base light */}
      <ambientLight intensity={0.35} />
    </>
  );
}
