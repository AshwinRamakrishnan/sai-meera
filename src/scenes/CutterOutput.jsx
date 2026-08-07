import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const OutputTray = React.memo(({ mat }) => {
  const cutSheetN = 16;
  return (
    <group>
      {/* CUT PAPER OUTPUT TRAY */}
      <mesh position={[4.8, 0.6, 0]} material={mat.body}>
        <boxGeometry args={[3.0, 0.05, 1.8]} />
      </mesh>
      <mesh position={[3.32, 0.82, 0]} material={mat.chrome}>
        <boxGeometry args={[0.04, 0.45, 1.8]} />
      </mesh>
      <mesh position={[6.3, 0.82, 0]} material={mat.chrome}>
        <boxGeometry args={[0.04, 0.45, 1.8]} />
      </mesh>
      <mesh position={[4.8, 0.82, -0.9]} material={mat.chrome}>
        <boxGeometry args={[3.0, 0.45, 0.04]} />
      </mesh>
      <mesh position={[4.8, 1.12, -0.91]} material={new THREE.MeshStandardMaterial({ color: 0x002244, emissive: 0x00e5ff, emissiveIntensity: 0.5 })}>
        <boxGeometry args={[1.4, 0.12, 0.02]} />
      </mesh>
      <pointLight color={0x00e5ff} position={[4.8, 1.2, -0.5]} intensity={1.5} distance={2} />
      
      {Array.from({ length: cutSheetN }).map((_, s) => (
        <mesh key={`cutsheet-${s}`} position={[4.8, 0.66 + s * 0.016, 0]} material={mat.paperCut}>
          <boxGeometry args={[2.8, 0.016, 1.65]} />
        </mesh>
      ))}
      <mesh position={[4.8, 0.68 + cutSheetN * 0.016, 0]} material={new THREE.MeshStandardMaterial({ color: 0xf8f4ec, roughness: 0.88 })}>
        <boxGeometry args={[2.8, 0.018, 1.65]} />
      </mesh>
      <mesh position={[4.8 + 1.4, 0.68 + cutSheetN * 0.016, 0]} material={new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1.2 })}>
        <boxGeometry args={[0.01, 0.018, 1.65]} />
      </mesh>
    </group>
  );
});

export default function CutterOutput({ scrollRatio = 0 }) {
  const particlesRef = useRef([]);
  const piecesRef = useRef([]);
  const lastCutTimeRef = useRef(-999);

  const mat = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: 0x141e30, roughness: 0.22, metalness: 0.82 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0x6a7890, roughness: 0.05, metalness: 1 }),
    paperCut: new THREE.MeshStandardMaterial({ color: 0xeae5d8, roughness: 0.88, metalness: 0 }),
    paper: new THREE.MeshStandardMaterial({ color: 0xf2ede0, roughness: 0.9, metalness: 0 }),
  }), []);

  const particleMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: 0xf0ece0, roughness: 0.9, side: THREE.DoubleSide, transparent: true, opacity: 0 
  }), []);

  // Initialize refs
  const pCount = 30;
  const cCount = 3;
  
  if (particlesRef.current.length === 0) {
    for (let i = 0; i < pCount; i++) {
      particlesRef.current.push({
        ref: React.createRef(),
        vx: 0, vy: 0, vz: 0, life: 0, active: false
      });
    }
  }
  
  if (piecesRef.current.length === 0) {
    for (let i = 0; i < cCount; i++) {
      piecesRef.current.push({
        ref: React.createRef(),
        vy: 0, life: 0, active: false
      });
    }
  }

  useFrame((state) => {
    const ct = state.clock.elapsedTime;
    const cycleT = (ct * 0.7) % (Math.PI * 2);
    const isCutting = scrollRatio > 0.05 && Math.sin(cycleT) > 0.6;

    if (isCutting && ct - lastCutTimeRef.current > 0.4) {
      lastCutTimeRef.current = ct;
      
      // Spawn particles
      particlesRef.current.forEach(pData => {
        if (!pData.active && Math.random() > 0.4) {
          pData.active = true;
          pData.life = 0;
          const p = pData.ref.current;
          p.visible = true;
          p.position.set((Math.random() - 0.5) * 4, 1.92, (Math.random() - 0.5) * 1.2);
          pData.vx = (Math.random() - 0.5) * 0.08;
          pData.vy = Math.random() * 0.05 + 0.02;
          pData.vz = (Math.random() - 0.5) * 0.06;
          p.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          p.material.opacity = 0.8;
        }
      });
      
      // Spawn cut piece
      const pcData = piecesRef.current.find(c => !c.active);
      if (pcData) {
        pcData.active = true;
        pcData.life = 0;
        const pc = pcData.ref.current;
        pc.visible = true;
        pc.position.set(0, 1.94, -0.6);
        pc.rotation.set(-Math.PI / 2, 0, 0);
        pcData.vy = 0;
      }
    }

    // Animate particles
    particlesRef.current.forEach(pData => {
      if (pData.active) {
        pData.life += 0.016;
        const p = pData.ref.current;
        p.position.x += pData.vx;
        p.position.y += pData.vy;
        pData.vy -= 0.002; // Gravity
        p.position.z += pData.vz;
        p.rotation.x += 0.04;
        p.rotation.y += 0.03;
        p.material.opacity = Math.max(0, 0.8 - pData.life * 0.8);
        
        if (pData.life > 1.2 || p.position.y < 1.8) {
          pData.active = false;
          p.visible = false;
        }
      }
    });

    // Animate cut pieces
    piecesRef.current.forEach(pcData => {
      if (pcData.active) {
        pcData.life += 0.016;
        const pc = pcData.ref.current;
        pc.position.y += pcData.vy;
        pcData.vy -= 0.003; // Gravity
        pc.position.z -= 0.01;
        pc.rotation.x -= 0.02;
        
        if (pcData.life > 1.5 || pc.position.y < 0) {
          pcData.active = false;
          pc.visible = false;
        }
      }
    });
  });

  return (
    <group>
      <OutputTray mat={mat} />
      
      {/* Shred Particles */}
      {particlesRef.current.map((pData, i) => (
        <mesh key={`particle-${i}`} ref={pData.ref} visible={false} material={particleMat}>
          <planeGeometry args={[0.08, 0.03]} />
        </mesh>
      ))}

      {/* Cut Pieces */}
      {piecesRef.current.map((pcData, i) => (
        <mesh key={`piece-${i}`} ref={pcData.ref} visible={false} material={mat.paper}>
          <planeGeometry args={[4.5, 0.3]} />
        </mesh>
      ))}
    </group>
  );
}
