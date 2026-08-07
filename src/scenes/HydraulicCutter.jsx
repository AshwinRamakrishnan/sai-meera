import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CutterOutput from './CutterOutput';

const StaticChassis = React.memo(({ mat }) => (
  <group>
    {/* MAIN MACHINE BODY */}
    <mesh position={[0, 0.9, 0]} material={mat.chassis} castShadow receiveShadow>
      <boxGeometry args={[6.5, 1.8, 2.8]} />
    </mesh>
    
    {/* Doors */}
    {[0, 1, 2].map((d) => (
      <group key={`door-${d}`} position={[-3.1 + d * 2.1, 0.9, 1.42]}>
        <mesh material={mat.body}>
          <boxGeometry args={[1.9, 1.6, 0.04]} />
        </mesh>
        <mesh position={[0, 0, 0.18]} material={mat.chrome}>
          <boxGeometry args={[0.04, 0.04, 0.35]} />
        </mesh>
        {[-0.6, 0.6].map((hy, i) => (
          <mesh key={`hinge-${i}`} position={[0.94, hy, 0]} material={mat.chrome}>
            <boxGeometry args={[0.06, 0.06, 0.06]} />
          </mesh>
        ))}
        <mesh 
          rotation={[Math.PI / 2, 0, 0]} 
          position={[-0.7, 0.68, 0.03]} 
          material={d === 1 ? mat.glowG : mat.glowB}
        >
          <cylinderGeometry args={[0.028, 0.028, 0.02, 12]} />
        </mesh>
      </group>
    ))}

    {/* Table Top */}
    <mesh position={[0, 1.86, 0]} material={mat.brushedSteel} castShadow>
      <boxGeometry args={[6.5, 0.12, 2.8]} />
    </mesh>

    {/* Side stripes */}
    {[-3.26, 3.26].map((x) => (
      <group key={`stripe-${x}`} position={[x, 0.9, 0]}>
        <mesh material={mat.bodyMid}>
          <boxGeometry args={[0.04, 1.8, 2.82]} />
        </mesh>
        <mesh position={[0, 0, 1.42]} material={mat.glowB}>
          <boxGeometry args={[0.015, 1.4, 0.04]} />
        </mesh>
      </group>
    ))}

    {/* Back Wall */}
    <mesh position={[0, 1.75, -1.42]} material={mat.chassis}>
      <boxGeometry args={[6.5, 3.5, 0.08]} />
    </mesh>

    {/* Beam Track */}
    <mesh position={[0, 2.75, -0.2]} material={mat.steel}>
      <boxGeometry args={[6.6, 0.14, 0.18]} />
    </mesh>

    {/* Pillars */}
    {[-3.2, 3.2].map((x) => (
      <group key={`pillar-${x}`} position={[x, 0, -0.2]}>
        <mesh position={[0, 2.4, 0]} material={mat.hyd}>
          <boxGeometry args={[0.22, 1.2, 0.22]} />
        </mesh>
        <mesh position={[0, 2.9, 0]} material={mat.chrome}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 16]} />
        </mesh>
        <mesh position={[0, 3.25, 0]} material={mat.steel}>
          <cylinderGeometry args={[0.04, 0.04, 0.45, 12]} />
        </mesh>
        <mesh position={[0, 3.5, 0]} material={mat.chrome}>
          <cylinderGeometry args={[0.065, 0.065, 0.06, 16]} />
        </mesh>
      </group>
    ))}

    {/* Safety Guard */}
    <mesh position={[0, 2.2, 1.42]} material={new THREE.MeshStandardMaterial({ color: 0x4488aa, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.18 })}>
      <boxGeometry args={[6.2, 0.55, 0.04]} />
    </mesh>

    {/* Guard Ticks */}
    {Array.from({ length: 28 }).map((_, r) => (
      <mesh key={`tick-${r}`} position={[-3.3 + r * 0.24, 1.92, r % 5 === 0 ? -0.6 : -0.55]} material={mat.glowB}>
        <boxGeometry args={[0.012, 0.02, r % 5 === 0 ? 0.22 : 0.12]} />
      </mesh>
    ))}

    {/* Control Panel */}
    <group position={[-3.6, 2.4, 1.5]}>
      <mesh material={mat.panel}>
        <boxGeometry args={[0.55, 1.0, 0.22]} />
      </mesh>
      <mesh position={[0, 0.15, 0.12]} material={mat.screen}>
        <boxGeometry args={[0.44, 0.34, 0.01]} />
      </mesh>
      {Array.from({ length: 6 }).map((_, r) => (
        <mesh key={`ln-${r}`} position={[0, -0.02 + r * 0.038, 0.13]} material={new THREE.MeshStandardMaterial({ color: 0x003366, emissive: 0x0055cc, emissiveIntensity: 0.4 })}>
          <boxGeometry args={[0.4, 0.022, 0.003]} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.4, 0.13]} material={mat.glowR}>
        <cylinderGeometry args={[0.062, 0.062, 0.04, 20]} />
      </mesh>
      {[0xffe600, 0x00e5ff, 0x00ff66].map((c, i) => (
        <mesh key={`btn-${i}`} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2 - i * 0.055, 0.13]} material={new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.6 })}>
          <cylinderGeometry args={[0.034, 0.034, 0.03, 12]} />
        </mesh>
      ))}
    </group>
  </group>
));

export default function HydraulicCutter({ scrollRatio = 0 }) {
  const beamGroupRef = useRef();
  const bladeGroupRef = useRef();
  const bladeGlowRef = useRef();
  const backgaugeRef = useRef();
  const laserLineRef = useRef();
  const paperStackRef = useRef();
  const lightBarRef = useRef();
  const bladePLRef = useRef();
  
  const mat = useMemo(() => ({
    chassis: new THREE.MeshStandardMaterial({ color: 0x0d1322, roughness: 0.18, metalness: 0.88 }),
    body: new THREE.MeshStandardMaterial({ color: 0x141e30, roughness: 0.22, metalness: 0.82 }),
    bodyMid: new THREE.MeshStandardMaterial({ color: 0x1a2540, roughness: 0.28, metalness: 0.78 }),
    steel: new THREE.MeshStandardMaterial({ color: 0x4a5870, roughness: 0.08, metalness: 1 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0x6a7890, roughness: 0.05, metalness: 1 }),
    brushedSteel: new THREE.MeshStandardMaterial({ color: 0x3a4455, roughness: 0.15, metalness: 0.95 }),
    paper: new THREE.MeshStandardMaterial({ color: 0xf2ede0, roughness: 0.9, metalness: 0 }),
    bladeMat: new THREE.MeshStandardMaterial({ color: 0xb8c8d8, roughness: 0.04, metalness: 1, envMapIntensity: 2 }),
    glowB: new THREE.MeshStandardMaterial({ color: 0x0099ff, emissive: 0x0099ff, emissiveIntensity: 1.8 }),
    glowR: new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 2.2 }),
    glowG: new THREE.MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 1.5 }),
    glowY: new THREE.MeshStandardMaterial({ color: 0xffe600, emissive: 0xffe600, emissiveIntensity: 1.6 }),
    panel: new THREE.MeshStandardMaterial({ color: 0x0a1220, roughness: 0.35, metalness: 0.65 }),
    screen: new THREE.MeshStandardMaterial({ color: 0x001a44, emissive: 0x0033aa, emissiveIntensity: 0.5, roughness: 0.02 }),
    hyd: new THREE.MeshStandardMaterial({ color: 0x2a3a50, roughness: 0.12, metalness: 0.92 }),
    safety: new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffaa00, emissiveIntensity: 0.3, roughness: 0.6 }),
    warningRed: new THREE.MeshStandardMaterial({ color: 0xcc2200, emissive: 0xaa1100, emissiveIntensity: 0.4, roughness: 0.55 }),
  }), []);

  const stackCount = 22;

  useFrame((state) => {
    const ct = state.clock.elapsedTime;
    const ratio = scrollRatio;
    
    // Cutting animation logic
    const cycleT = (ct * 0.7) % (Math.PI * 2);
    const bladeY = ratio > 0.05 ? 2.75 - Math.max(0, Math.sin(cycleT) * 0.7) : 2.75;
    const isCutting = ratio > 0.05 && Math.sin(cycleT) > 0.6;
    
    if (beamGroupRef.current) beamGroupRef.current.position.y = bladeY + 0.05;
    if (bladeGroupRef.current) bladeGroupRef.current.position.y = bladeY;
    if (bladeGlowRef.current) bladeGlowRef.current.material.emissiveIntensity = isCutting ? 4 : 0;
    if (bladePLRef.current) bladePLRef.current.intensity = isCutting ? 5 : 0.5;

    // Paper compression
    if (paperStackRef.current) {
      paperStackRef.current.children.forEach((sh, i) => {
        sh.scale.y = isCutting && i > Math.floor(stackCount * 0.7) ? 0.7 : 1;
      });
    }

    // Backgauge movement
    if (backgaugeRef.current) {
      if (ratio > 0.04) {
        backgaugeRef.current.position.z = Math.sin(ct * 0.18) * 0.35;
      }
    }
    
    if (laserLineRef.current) {
      laserLineRef.current.material.emissiveIntensity = ratio > 0.04 ? 2.5 + Math.sin(ct * 8) * 0.5 : 8 + Math.sin(ct * 15) * 2;
    }

    // Lights
    if (lightBarRef.current) {
      lightBarRef.current.material.emissiveIntensity = isCutting ? 2.5 : 0.8 + Math.sin(ct * 1.5) * 0.3;
    }
  });

  return (
    <group>
      {/* Studio Lighting — Bright and visible */}
      <ambientLight intensity={3.0} color="#0a0c14" />
      <directionalLight position={[6, 16, 8]} intensity={5.0} color="#88ccff" />
      <directionalLight position={[-8, 8, 10]} intensity={2.5} color="#bbccff" />
      <directionalLight position={[-8, 5, -5]} intensity={1.8} color="#001a2a" />
      <directionalLight position={[0, 18, 0]} intensity={2.0} color="#ffffff" />
      <pointLight position={[0, 2, 2.5]} intensity={4.0} color="#00e5ff" distance={6} />
      <pointLight position={[0, 2.8, 0]} intensity={2.0} color="#ffffff" distance={3} />
      <pointLight position={[-4, 2, 1]} intensity={1.5} color="#ffaa44" distance={4} />
      <hemisphereLight skyColor="#050a14" groundColor="#040404" intensity={1.0} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0c0e18" roughness={0.85} metalness={0.15} />
      </mesh>

      <fog attach="fog" args={['#04060f', 30, 50]} />

      <StaticChassis mat={mat} />
      
      <pointLight ref={bladePLRef} color={0xffffff} position={[0, 2.8, 0]} intensity={0.5} distance={3} />
      <pointLight color={0x00e5ff} position={[0, 2, 2.5]} intensity={3.5} distance={6} />
      
      {/* Light Bar */}
      <mesh ref={lightBarRef} position={[0, 3.65, 1.3]} material={mat.glowY}>
        <boxGeometry args={[5.5, 0.06, 0.06]} />
      </mesh>
      
      {/* CUTTING BEAM */}
      <group ref={beamGroupRef} position={[0, 2.75, -0.2]}>
        <mesh material={mat.hyd}>
          <boxGeometry args={[6.55, 0.25, 0.55]} />
        </mesh>
        <mesh position={[0, 0, 0.28]} material={mat.bodyMid}>
          <boxGeometry args={[6.5, 0.2, 0.04]} />
        </mesh>
        <mesh position={[0, -0.18, 0]} material={mat.safety}>
          <boxGeometry args={[6.3, 0.055, 0.35]} />
        </mesh>
        {Array.from({ length: 18 }).map((_, s) => (
          <mesh key={`stripe-${s}`} position={[-3.0 + s * 0.33, -0.18, 0.18]} material={mat.warningRed}>
            <boxGeometry args={[0.18, 0.055, 0.01]} />
          </mesh>
        ))}
        {[-3.0, 3.0].map((x) => (
          <mesh key={`rod-${x}`} position={[x, 0, -0.05]} material={mat.chrome}>
            <cylinderGeometry args={[0.04, 0.04, 0.32, 10]} />
          </mesh>
        ))}
      </group>

      {/* BLADE */}
      <group ref={bladeGroupRef} position={[0, 2.75, -0.04]}>
        <mesh material={mat.bladeMat}>
          <boxGeometry args={[6.4, 0.06, 0.08]} />
        </mesh>
        <mesh position={[0, -0.04, 0.02]} material={new THREE.MeshStandardMaterial({ color: 0xd0e0f0, roughness: 0.02, metalness: 1 })}>
          <boxGeometry args={[6.4, 0.025, 0.04]} />
        </mesh>
        <mesh ref={bladeGlowRef} position={[0, -0.04, 0.02]} material={new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0 })}>
          <boxGeometry args={[6.4, 0.01, 0.02]} />
        </mesh>
      </group>

      {/* PAPER INPUT STACK */}
      <group ref={paperStackRef}>
        {Array.from({ length: stackCount }).map((_, s) => (
          <mesh key={`sheet-${s}`} position={[0, 1.94 + s * 0.018, 0.1]} material={mat.paper} castShadow={s === stackCount - 1}>
            <boxGeometry args={[4.5, 0.018, 2.2]} />
          </mesh>
        ))}
      </group>

      {/* Paper Guides */}
      {[-2.32, 2.32].map((x) => (
        <group key={`guide-${x}`}>
          <mesh position={[x, 2.12, 0.1]} material={mat.chrome}>
            <boxGeometry args={[0.06, 0.55, 2.2]} />
          </mesh>
          {Array.from({ length: 10 }).map((_, m) => (
            <mesh key={`tick-${m}`} position={[x, 1.95 + m * 0.05, 0.1 + 0.8 - m * 0.18]} material={mat.glowB}>
              <boxGeometry args={[0.03, 0.01, 0.04]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* BACKGAUGE */}
      <group ref={backgaugeRef}>
        <mesh position={[0, 2.06, -1.0]} material={mat.body}>
          <boxGeometry args={[5.8, 0.22, 0.18]} />
        </mesh>
        <mesh position={[0, 2.06, -0.91]} material={mat.brushedSteel}>
          <boxGeometry args={[5.7, 0.18, 0.03]} />
        </mesh>
        <mesh position={[0, 2.14, -0.88]} material={mat.glowB}>
          <boxGeometry args={[0.12, 0.04, 0.06]} />
        </mesh>
        <mesh ref={laserLineRef} position={[0, 2.08, -0.88]} material={new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0066ff, emissiveIntensity: 3, transparent: true, opacity: 0.7 })}>
          <boxGeometry args={[5.5, 0.004, 0.003]} />
        </mesh>
      </group>

      <CutterOutput scrollRatio={scrollRatio} />
    </group>
  );
}
