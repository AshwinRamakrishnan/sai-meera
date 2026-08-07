import React from 'react';
import { Grid } from '@react-three/drei';

/**
 * Shared floor plane with grid overlay for all machine scenes.
 */
export default function SceneFloor() {
  return (
    <group>
      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#0d0d1a"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Grid overlay */}
      <Grid
        position={[0, 0, 0]}
        args={[40, 40]}
        cellSize={0.5}
        cellThickness={0.3}
        cellColor="#1a1a2e"
        sectionSize={2}
        sectionThickness={0.5}
        sectionColor="#252540"
        fadeDistance={20}
        fadeStrength={1}
        followCamera={false}
      />
    </group>
  );
}
