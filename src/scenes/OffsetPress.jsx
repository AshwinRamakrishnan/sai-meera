import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import InvitationOutput from './InvitationOutput';

const INK_COLORS = ['#0044cc', '#ff0033', '#ffee00', '#101010', '#aa00ff', '#ff8800'];

// Memoized shared materials
function usePressMaterials() {
  return useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: '#2a2218', roughness: 0.22, metalness: 0.82, envMapIntensity: 1.5 }),
    bodyDark: new THREE.MeshStandardMaterial({ color: '#1a1610', roughness: 0.3, metalness: 0.75, envMapIntensity: 1.2 }),
    steel: new THREE.MeshStandardMaterial({ color: '#8a7a68', roughness: 0.08, metalness: 1.0, envMapIntensity: 2.0 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#9a9088', roughness: 0.06, metalness: 1.0, envMapIntensity: 2.5 }),
    iron: new THREE.MeshStandardMaterial({ color: '#4a4838', roughness: 0.35, metalness: 0.85, envMapIntensity: 1.0 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#1a1a18', roughness: 0.75, metalness: 0.08 }),
    paper: new THREE.MeshStandardMaterial({ color: '#f5f0e5', roughness: 0.92, metalness: 0.0, side: THREE.DoubleSide }),
    glowO: new THREE.MeshStandardMaterial({ color: '#ff6600', emissive: '#ff6600', emissiveIntensity: 2.0 }),
    glowY: new THREE.MeshStandardMaterial({ color: '#ffdd00', emissive: '#ffdd00', emissiveIntensity: 1.5 }),
    inkFtn: INK_COLORS.map(c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.8, roughness: 0.9 })),
    pltCoat: INK_COLORS.map(c => new THREE.MeshStandardMaterial({ color: c, opacity: 0.3, transparent: true, roughness: 0.4 })),
    inkStripe: INK_COLORS.map(c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.3 }))
  }), []);
}

// Memoized print unit with ALL details
const PrintUnit = React.memo(function PrintUnit({ cx, index, materials, onRegisterRefs }) {
  const impRef = useRef();
  const blnkRef = useRef();
  const pltRef = useRef();
  const inkRef = useRef();
  const gearRefs = useRef([]);

  React.useEffect(() => {
    onRegisterRefs(index, {
      imp: impRef.current,
      blnk: blnkRef.current,
      plt: pltRef.current,
      ink: inkRef.current,
      gears: gearRefs.current
    });
  }, [index, onRegisterRefs]);

  const icMat = materials.inkFtn[index];
  const coatMat = materials.pltCoat[index];
  const stripeMat = materials.inkStripe[index];

  return (
    <group position={[cx, 0, 0]}>
      {/* Cabinet */}
      <mesh position={[0, 2.2275, 0]} material={materials.body} castShadow receiveShadow>
        <boxGeometry args={[1.863, 2.7, 3.51]} />
      </mesh>
      {/* Door */}
      <mesh position={[0.945, 2.2275, 0]} material={materials.bodyDark}>
        <boxGeometry args={[0.054, 2.43, 3.375]} />
      </mesh>
      {/* Indicator Stripe */}
      <mesh position={[0.9585, 2.2275, 1.728]} material={stripeMat}>
        <boxGeometry args={[0.027, 2.16, 0.054]} />
      </mesh>

      {/* Impression Cylinder */}
      <mesh ref={impRef} position={[0, 2.7, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.iron} castShadow>
        <cylinderGeometry args={[0.567, 0.567, 3.105, 32]} />
      </mesh>
      {/* Chrome rings on impression cylinder */}
      {Array.from({ length: 4 }).map((_, s) => (
        <mesh key={`ring-${s}`} position={[-1.5525 + 3.105 * (s + 0.5) / 4, 2.7, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.chrome}>
          <torusGeometry args={[0.5805, 0.0162, 8, 32]} />
        </mesh>
      ))}

      {/* Blanket Cylinder */}
      <mesh ref={blnkRef} position={[0, 3.672, -0.432]} rotation={[0, 0, Math.PI / 2]} material={materials.rubber} castShadow>
        <cylinderGeometry args={[0.486, 0.486, 3.0375, 32]} />
      </mesh>
      {/* End caps on blanket cylinder */}
      {Array.from({ length: 2 }).map((_, e) => (
        <mesh key={`endcap-${e}`} position={[-1.4715 + e * 2.943, 3.672, -0.432]} rotation={[0, 0, Math.PI / 2]} material={materials.chrome}>
          <cylinderGeometry args={[0.49275, 0.49275, 0.081, 32]} />
        </mesh>
      ))}

      {/* Plate Cylinder */}
      <group position={[0, 4.428, -0.135]}>
        <mesh ref={pltRef} rotation={[0, 0, Math.PI / 2]} material={materials.steel} castShadow>
          <cylinderGeometry args={[0.4455, 0.4455, 2.97, 32]} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} material={coatMat}>
          <cylinderGeometry args={[0.45225, 0.45225, 2.943, 32]} />
        </mesh>
      </group>

      {/* Form rollers */}
      {[0, 0.2, 0.4, 0.58].map((ox, idx) => (
        <mesh key={`form-${idx}`} position={[0, 5.0625 + ox * 0.162, 0.648 + ox * 0.162]} rotation={[0, 0, Math.PI / 2]} material={materials.rubber}>
          <cylinderGeometry args={[0.135, 0.135, 2.9025, 16]} />
        </mesh>
      ))}
      
      {/* Vibrator roller */}
      <mesh position={[0, 5.4, 1.242]} rotation={[0, 0, Math.PI / 2]} material={materials.steel}>
        <cylinderGeometry args={[0.108, 0.108, 2.835, 16]} />
      </mesh>

      {/* Ink Fountain */}
      <mesh position={[0, 5.643, 1.485]} material={materials.bodyDark}>
        <boxGeometry args={[1.755, 0.378, 2.295]} />
      </mesh>
      <mesh ref={inkRef} position={[0, 5.805, 1.485]} material={icMat}>
        <boxGeometry args={[1.593, 0.081, 2.133]} />
      </mesh>
      {/* Ink blade */}
      <mesh position={[0, 5.778, 0.459]} material={materials.chrome}>
        <boxGeometry args={[1.728, 0.0243, 0.054]} />
      </mesh>
      {/* Ink keys */}
      {Array.from({ length: 10 }).map((_, k) => (
        <mesh key={`key-${k}`} position={[-0.6075 + k * 0.135, 5.778, 0.405]} rotation={[Math.PI / 2, 0, 0]} material={materials.chrome}>
          <cylinderGeometry args={[0.0405, 0.0405, 0.07425, 6]} />
        </mesh>
      ))}

      {/* Side frames & gears */}
      {[-1.539, 1.539].map((xo, i) => (
        <group key={`side-${i}`} position={[xo, 0, 0]}>
          <mesh position={[0, 3.3075, 0]} material={materials.chrome}>
            <boxGeometry args={[0.0945, 5.4, 3.51]} />
          </mesh>
          <mesh position={[0, 3.1725, 1.836]} rotation={[Math.PI / 2, 0, 0]} material={materials.iron}>
            <cylinderGeometry args={[0.3375, 0.3375, 0.081, 24]} />
          </mesh>
          {/* Gear spokes */}
          <group 
            position={[0, 3.1725, 1.836]} 
            rotation={[Math.PI / 2, 0, 0]}
            ref={el => el && gearRefs.current.push(el)}
          >
            {Array.from({ length: 10 }).map((_, g) => (
              <mesh key={`spoke-${g}`} rotation={[0, 0, g * Math.PI / 5]} material={materials.steel}>
                <boxGeometry args={[0.0405, 0.648, 0.03375]} />
              </mesh>
            ))}
          </group>
          {/* Gear shafts */}
          <mesh position={[0, 3.1725, 1.971]} rotation={[Math.PI / 2, 0, 0]} material={materials.chrome}>
            <cylinderGeometry args={[0.07425, 0.07425, 0.243, 12]} />
          </mesh>
          {/* Chain wheels */}
          <mesh position={[0, 4.428, 1.836]} rotation={[Math.PI / 2, 0, 0]} material={materials.steel}>
            <cylinderGeometry args={[0.243, 0.243, 0.054, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
});

export default function OffsetPress({ scrollRatio = 0 }) {
  const materials = usePressMaterials();
  const unitsRef = useRef([]);
  const flySheetsRef = useRef([]);
  const dlvSheetsRef = useRef([]);

  const handleRegisterRefs = useCallback((idx, refs) => {
    unitsRef.current[idx] = refs;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const speed = scrollRatio * 0.09;

    // 1. Print Units Animation
    unitsRef.current.forEach((u, i) => {
      if (!u) return;
      if (u.imp) u.imp.rotation.x += speed;
      if (u.blnk) u.blnk.rotation.x -= speed * 0.96;
      if (u.plt) u.plt.rotation.x += speed * 0.88;
      
      if (u.gears) {
        u.gears.forEach(g => {
          if (g) g.rotation.z += speed; 
        });
      }

      if (u.ink && u.ink.material) {
        u.ink.material.emissiveIntensity = 0.6 + Math.sin(t * 3 + i) * 0.25;
      }
    });

    // 2. Flying Sheets Animation
    flySheetsRef.current.forEach((sh, i) => {
      if (!sh) return;
      if (scrollRatio > 0.01) {
        sh.visible = true;
        const bx = -6.75 + i * 2.43;
        const ph = i * Math.PI * 0.33;
        
        // Loop sheets from right to left based on time and scroll
        const rawX = bx - t * 5.0 * scrollRatio + 13.5;
        const modX = ((rawX % 16.875) + 16.875) % 16.875;
        sh.position.x = modX - 8.1;
        
        // Slight flutter effect
        sh.position.y = 0.918 + Math.sin(t * 1.8 + ph) * 0.024;
        sh.rotation.z = Math.sin(t * 0.7 + ph) * 0.008;
      } else {
        sh.visible = false;
      }
    });

    // 3. Delivery Sheets Flutter
    dlvSheetsRef.current.forEach((sh, i) => {
      if (!sh) return;
      if (scrollRatio > 0.01) {
        sh.position.y = 0.972 + i * 0.0216 + Math.sin(t * 5 + i) * 0.002 * scrollRatio;
      }
    });
  });

  return (
    <group position={[0, -1.5, 0]}>
      {/* FOG — pushed far so machine stays bright */}
      <fog attach="fog" args={['#070502', 35, 60]} />

      {/* STUDIO LIGHTING — Bright enough to see all machine details */}
      <ambientLight intensity={3.5} color="#1a1510" />
      {/* Key light — warm orange from upper-right */}
      <directionalLight position={[8, 18.9, 9.45]} intensity={5.0} color="#ff8822" />
      {/* Fill light — warm from front-left to remove shadows */}
      <directionalLight position={[-8, 8, 10]} intensity={3.0} color="#ffcc88" />
      {/* Back/rim light — cool highlight from behind */}
      <directionalLight position={[0, 10, -12]} intensity={2.5} color="#88aaff" />
      {/* Top wash — bright white from above */}
      <directionalLight position={[0, 27, 0]} intensity={2.5} color="#fff5e8" />
      {/* Side fill — eliminates dark left side */}
      <directionalLight position={[-12, 5, 0]} intensity={2.0} color="#3a2a10" />
      {/* Accent point lights for machine details */}
      <pointLight position={[-1.35, 4.05, 2.7]} intensity={8.0} color="#ff6600" distance={12} />
      <pointLight position={[2.7, 5.4, -1.35]} intensity={5.0} color="#ffdd00" distance={10} />
      <pointLight position={[0, 3, 5]} intensity={4.0} color="#ffffff" distance={10} />
      {/* Ground bounce */}
      <hemisphereLight skyColor="#2a1a08" groundColor="#0a0808" intensity={1.2} />

      {/* FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1812" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* PRESS BED & RAILS & GIRDERS */}
      <mesh position={[0, 0.43875, 0]} material={materials.body} castShadow receiveShadow>
        <boxGeometry args={[14.85, 0.8775, 3.78]} />
      </mesh>
      {[-1.89, 1.89].map((z, i) => (
        <mesh key={`rail-${i}`} position={[0, 0.9045, z]} material={materials.chrome}>
          <boxGeometry args={[15.39, 0.081, 0.162]} />
        </mesh>
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh key={`girder-${i}`} position={[(i - 5) * 1.35, 0.405, 0]} material={materials.iron}>
          <boxGeometry args={[0.108, 0.81, 3.726]} />
        </mesh>
      ))}

      {/* 6 PRINT UNITS */}
      {Array.from({ length: 6 }).map((_, u) => (
        <PrintUnit
          key={`unit-${u}`}
          index={u}
          cx={-5.0625 + u * 2.025}
          materials={materials}
          onRegisterRefs={handleRegisterRefs}
        />
      ))}

      {/* FEEDER UNIT (Right side) */}
      <group position={[8.64, 0, 0]}>
        {/* Main Body */}
        <mesh position={[0, 1.4175, 0]} material={materials.body} castShadow>
          <boxGeometry args={[2.7, 1.89, 3.78]} />
        </mesh>
        {/* Paper stack */}
        {Array.from({ length: 18 }).map((_, s) => (
          <mesh key={`fdr-sheet-${s}`} position={[0, 0.972 + s * 0.02025, 0]} material={materials.paper}>
            <boxGeometry args={[2.43, 0.02025, 3.51]} />
          </mesh>
        ))}
        {/* Suction Head */}
        <mesh position={[0, 2.484, 0]} material={materials.iron}>
          <boxGeometry args={[1.485, 0.189, 3.51]} />
        </mesh>
        {/* Suction Cups */}
        {Array.from({ length: 8 }).map((_, s) => (
          <mesh key={`cup-${s}`} position={[-0.675 + s * 0.135, 2.6325, 0]} material={materials.rubber}>
            <cylinderGeometry args={[0.06075, 0.06075, 0.135, 8]} />
          </mesh>
        ))}
        {/* Feeder Side Panel */}
        <mesh position={[-1.323, 1.4175, 0]} material={materials.bodyDark}>
          <boxGeometry args={[0.054, 1.755, 3.645]} />
        </mesh>
        {/* Feeder Table */}
        <mesh position={[0, 2.43, 0]} material={materials.chrome}>
          <boxGeometry args={[2.7, 0.081, 3.78]} />
        </mesh>
      </group>

      {/* DELIVERY UNIT (Left side) */}
      <group position={[-8.775, 0, 0]}>
        {/* Main Body */}
        <mesh position={[0, 1.485, 0]} material={materials.body} castShadow>
          <boxGeometry args={[2.7, 2.025, 3.78]} />
        </mesh>
        {/* Printed paper stack */}
        {Array.from({ length: 14 }).map((_, s) => (
          <mesh 
            key={`dlv-sheet-${s}`} 
            position={[0, 0.972 + s * 0.0216, 0]} 
            material={materials.paper}
            ref={el => el && (dlvSheetsRef.current[s] = el)}
          >
            <boxGeometry args={[2.43, 0.0216, 3.51]} />
          </mesh>
        ))}
        {/* Delivery wheels and spokes */}
        {[-1.62, 1.62].map((z, i) => (
          <group key={`dlv-wheel-${i}`} position={[0, 2.6325, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.steel}>
              <cylinderGeometry args={[0.27, 0.27, 0.081, 20]} />
            </mesh>
            {Array.from({ length: 8 }).map((_, g) => (
              <mesh key={`dlv-spoke-${g}`} rotation={[Math.PI / 2, 0, g * Math.PI / 4]} material={materials.chrome}>
                <boxGeometry args={[0.03375, 0.486, 0.027]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* FLYING SHEETS */}
      {Array.from({ length: 6 }).map((_, fs) => (
        <mesh 
          key={`fly-${fs}`}
          ref={el => el && (flySheetsRef.current[fs] = el)}
          visible={false}
          material={materials.paper}
        >
          <boxGeometry args={[2.3625, 0.0189, 3.4425]} />
        </mesh>
      ))}

      {/* CONSOLE BRIDGE & SAFETY RAILING */}
      <mesh position={[0, 6.345, -1.5525]} material={materials.iron}>
        <boxGeometry args={[17.55, 0.297, 0.4725]} />
      </mesh>
      <mesh position={[0, 6.8175, 1.5525]} material={materials.chrome}>
        <boxGeometry args={[17.55, 0.054, 0.054]} />
      </mesh>
      {[-8.1, 8.1].map((x, i) => (
        <mesh key={`post-${i}`} position={[x, 6.183, 1.5525]} material={materials.chrome}>
          <boxGeometry args={[0.054, 1.35, 0.054]} />
        </mesh>
      ))}

      {/* Console Base */}
      <mesh position={[0, 7.155, 1.755]} material={materials.body}>
        <boxGeometry args={[2.16, 1.755, 0.297]} />
      </mesh>
      {/* Console Screen Base */}
      <mesh position={[0, 7.155, 1.917]}>
        <boxGeometry args={[1.998, 1.485, 0.0162]} />
        <meshStandardMaterial color="#1a0800" emissive="#ff6600" emissiveIntensity={0.35} />
      </mesh>
      {/* Screen text lines (emissive bars) */}
      {Array.from({ length: 8 }).map((_, r) => (
        <mesh key={`ln-${r}`} position={[0, 6.426 + r * 0.1755, 1.9305]}>
          <boxGeometry args={[1.917, 0.0567, 0.00675]} />
          <meshStandardMaterial color="#ff8800" emissive="#ff8800" emissiveIntensity={0.45} />
        </mesh>
      ))}
      {/* CMYK ink level bars */}
      {INK_COLORS.map((c, i) => {
        const height = 0.108 + Math.abs(Math.sin((i + 1) * 123)) * 0.405;
        return (
          <mesh key={`bar-${i}`} position={[-0.567 + i * 0.243, 6.3855, 1.9305]}>
            <boxGeometry args={[0.243, height, 0.0054]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.5} />
          </mesh>
        );
      })}
      {/* Console Knobs */}
      {Array.from({ length: 12 }).map((_, k) => (
        <mesh key={`knob-${k}`} position={[-0.7425 + k * 0.135, 7.722, 1.8225]} rotation={[Math.PI / 2, 0, 0]} material={materials.chrome}>
          <cylinderGeometry args={[0.04725, 0.04725, 0.054, 8]} />
        </mesh>
      ))}

      {/* INVITATION OUTPUT */}
      <InvitationOutput scrollRatio={scrollRatio} />
    </group>
  );
}
