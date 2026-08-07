import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import FlexBannerOutput from './FlexBannerOutput';

export default function FlexPrinter({ scrollRatio = 0 }) {
  const carriageGroupRef = useRef();
  const inkPLRef = useRef();
  const mgPLRef = useRef();
  const supRollRef = useRef();
  const takeCoreRef = useRef();
  const dryerGrillRef = useRef();
  const dryerPLRef = useRef();
  const dropletsRef = useRef([]);

  const inkColors = useMemo(() => [0x00aaff, 0xff0055, 0xffdd00, 0x111111, 0x00ccff, 0xff44aa, 0xffffff, 0x66ffcc], []);
  const tubeColors2 = useMemo(() => [0x0055ff, 0xff0044, 0xffee00, 0x111111, 0x00aaff, 0xff44aa, 0xffffff, 0x44ffaa], []);

  const ratio = scrollRatio;

  useFrame((state) => {
    const ft = state.clock.elapsedTime;
    
    if (ratio > 0.01 && ratio < 0.99) {
      if (carriageGroupRef.current) carriageGroupRef.current.position.x = Math.sin(ft * 2.4) * 3.2;
      if (inkPLRef.current) {
        inkPLRef.current.position.x = carriageGroupRef.current.position.x;
        inkPLRef.current.intensity = 5 + Math.sin(ft * 16) * 1.2;
      }
      if (mgPLRef.current) {
        mgPLRef.current.position.x = carriageGroupRef.current.position.x;
        mgPLRef.current.intensity = 2.5 + Math.cos(ft * 14) * 0.8;
      }
    } else {
      if (inkPLRef.current) inkPLRef.current.intensity = 0.4;
      if (mgPLRef.current) mgPLRef.current.intensity = 0.3;
    }

    dropletsRef.current.forEach((d) => {
      if (d) {
        if (ratio > 0.05) {
          d.visible = true;
          d.position.y = d.userData.baseY - Math.abs(Math.sin(ft * 10 + d.userData.ph)) * 0.06;
          if (d.material) d.material.emissiveIntensity = 1.5 + Math.sin(ft * 20 + d.userData.ph) * 0.5;
        } else {
          d.visible = false;
        }
      }
    });

    if (supRollRef.current) supRollRef.current.rotation.x -= 0.012 * ratio;
    if (takeCoreRef.current) takeCoreRef.current.rotation.x += 0.035 * ratio;

    if (dryerGrillRef.current && dryerGrillRef.current.material) {
        dryerGrillRef.current.material.emissiveIntensity = 0.4 + Math.sin(ft * 3) * 0.3;
    }
    if (dryerPLRef.current) dryerPLRef.current.intensity = 1.5 + Math.sin(ft * 4) * 0.6;
  });

  return (
    <>
      {/* Studio Lighting — Bright and vibrant */}
      <ambientLight intensity={3.0} color="#0a0a1a" />
      <directionalLight position={[8, 14, 8]} intensity={4.0} color="#00c8ff" />
      <directionalLight position={[-8, 8, 10]} intensity={2.5} color="#aaccff" />
      <directionalLight position={[-8, 4, -6]} intensity={1.8} color="#1a0030" />
      <directionalLight position={[0, 2, -10]} intensity={0.8} color="#ff006e" />
      <directionalLight position={[0, 20, 0]} intensity={2.0} color="#ffffff" />
      <hemisphereLight skyColor="#00111a" groundColor="#060606" intensity={1.0} />

      <fog attach="fog" args={['#06060f', 30, 50]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0a0a14" roughness={0.85} metalness={0.15} />
      </mesh>

      <group position={[0, -0.5, 0]}>
        {/* MASSIVE STEEL FRAME / CHASSIS */}
      <mesh position={[0, 0.275, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.55, 1.8]} />
        <meshStandardMaterial color={0x0f1020} roughness={0.2} metalness={0.9} envMapIntensity={1} />
      </mesh>
      {[-1, 1].map(z => (
        <mesh key={`chrome-${z}`} position={[0, 0.59, z * 0.9]}>
          <boxGeometry args={[8.2, 0.08, 0.12]} />
          <meshStandardMaterial color={0x4a5070} roughness={0.06} metalness={1} />
        </mesh>
      ))}
      {[...Array(7)].map((_, i) => (
        <mesh key={`beam-${i}`} position={[(i - 3) * 1.15, 0.27, 0]}>
          <boxGeometry args={[0.06, 0.48, 1.78]} />
          <meshStandardMaterial color={0x252840} roughness={0.08} metalness={0.98} />
        </mesh>
      ))}

      {/* SIDE TOWERS */}
      {[-4.1, 4.1].map((x, si) => (
        <group key={`tower-${x}`} position={[x, 1.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 2.6, 1.8]} />
            <meshStandardMaterial color={0x0f1020} roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[si === 0 ? 0.32 : -0.32, 0, 0]}>
            <boxGeometry args={[0.04, 2.5, 1.6]} />
            <meshStandardMaterial color={0x1a1c30} roughness={0.25} metalness={0.85} />
          </mesh>
          {[...Array(6)].map((_, v) => (
            <mesh key={`vt-${v}`} position={[0, -0.8 + v * 0.22, 0]}>
              <boxGeometry args={[0.38, 0.03, 1.55]} />
              <meshStandardMaterial color={0x060610} roughness={0.5} metalness={0.6} />
            </mesh>
          ))}
          <mesh position={[si === 0 ? 0.32 : -0.32, 0, 0.85]}>
            <boxGeometry args={[0.02, 1.8, 0.04]} />
            <meshStandardMaterial color={si === 0 ? 0x00e5ff : 0xff006e} emissive={si === 0 ? 0x00e5ff : 0xff006e} emissiveIntensity={si === 0 ? 2 : 1.8} />
          </mesh>
          <mesh position={[0, -0.3, si === 0 ? 0.92 : -0.92]}>
             <boxGeometry args={[0.5, 0.06, 0.01]} />
             <meshStandardMaterial color={0x001122} emissive={0x00c8ff} emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[si === 0 ? 0.27 : -0.27, 1.2, 0]}>
             <boxGeometry args={[0.06, 0.06, 0.06]} />
             <meshStandardMaterial color={0x00e5ff} emissive={0x00e5ff} emissiveIntensity={2} />
          </mesh>
          {[-0.65, 0.65].map(oz => (
            <group key={`leg-${oz}`} position={[0, -1.8, oz * 0.9]}>
              <mesh>
                <boxGeometry args={[0.16, 1.0, 0.16]} />
                <meshStandardMaterial color={0x060610} roughness={0.5} metalness={0.6} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* TOP CROSSBEAMS */}
      {[...Array(4)].map((_, cb) => (
        <mesh key={`cb-${cb}`} position={[0, 0.68 + cb * 0.22, -0.75]}>
          <boxGeometry args={[8.0, 0.1, 0.1]} />
          <meshStandardMaterial color={0x4a5070} roughness={0.06} metalness={1} />
        </mesh>
      ))}
      <mesh position={[0, 2.68, 0]} castShadow>
        <boxGeometry args={[7.8, 0.28, 1.6]} />
        <meshStandardMaterial color={0x0f1020} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* INK CARTRIDGE RACK */}
      <mesh position={[0, 3.1, -0.1]}>
        <boxGeometry args={[1.4, 0.28, 1.2]} />
        <meshStandardMaterial color={0x0d1525} roughness={0.3} metalness={0.7} />
      </mesh>
      {inkColors.map((c, i) => (
        <group key={`cart-${i}`} position={[-0.49 + i * 0.14, 3.26, -0.1]}>
          <mesh>
            <boxGeometry args={[0.13, 0.22, 0.1]} />
            <meshStandardMaterial color={c} roughness={0.45} emissive={c} emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0, -0.06, 0.05]}>
            <boxGeometry args={[0.11, 0.04, 0.004]} />
            <meshStandardMaterial color={0x000000} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* INK TUBES */}
      {tubeColors2.map((c, i) => {
        const pts = [new THREE.Vector3(-0.49 + i * 0.14, 3.0, -0.1), new THREE.Vector3(-0.35 + i * 0.1, 2.4, 0.2), new THREE.Vector3(0, 1.15, 0.82)];
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh key={`tube-${i}`}>
            <tubeGeometry args={[curve, 10, 0.009, 6, false]} />
            <meshStandardMaterial color={c} roughness={0.55} metalness={0.15} opacity={0.7} transparent={true} />
          </mesh>
        );
      })}

      {/* CARRIAGE RAIL */}
      <mesh position={[0, 1.06, 0.5]}>
        <boxGeometry args={[8.0, 0.07, 0.1]} />
        <meshStandardMaterial color={0x4a5070} roughness={0.06} metalness={1} />
      </mesh>
      {[...Array(7)].map((_, i) => (
        <mesh key={`rails-${i}`} position={[(i - 3) * 1.1, 0.88, 0.5]}>
          <boxGeometry args={[0.04, 0.4, 0.06]} />
          <meshStandardMaterial color={0x252840} roughness={0.08} metalness={0.98} />
        </mesh>
      ))}

      {/* PRINT HEAD CARRIAGE */}
      <group ref={carriageGroupRef} position={[0, 1.28, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 0.45, 0.85]} />
          <meshStandardMaterial color={0x1c2d60} roughness={0.15} metalness={0.92} />
        </mesh>
        {[-0.52, 0.52].map(ox => (
          <mesh key={`fin-${ox}`} position={[ox, 0, 0]}>
            <boxGeometry args={[0.06, 0.38, 0.72]} />
            <meshStandardMaterial color={0x3a4060} roughness={0.12} metalness={0.95} />
          </mesh>
        ))}
        <mesh position={[0, -0.24, 0.44]}>
          <boxGeometry args={[1.05, 0.03, 0.04]} />
          <meshStandardMaterial color={0x00e5ff} emissive={0x00e5ff} emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, -0.22, 0.44]}>
          <boxGeometry args={[0.98, 0.04, 0.15]} />
          <meshStandardMaterial color={0x060610} roughness={0.5} metalness={0.6} />
        </mesh>
        {inkColors.map((c, i) => (
          <group key={`nozzle-grp-${i}`}>
            <mesh position={[-0.35 + i * 0.1, -0.22, 0.44]}>
              <cylinderGeometry args={[0.022, 0.016, 0.16, 8]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.8} />
            </mesh>
            {[...Array(3)].map((_, d) => {
              const idx = i * 3 + d;
              return (
                <mesh 
                  key={`drop-${idx}`} 
                  position={[-0.35 + i * 0.1, -0.3 - d * 0.025, 0.44]}
                  ref={(el) => (dropletsRef.current[idx] = el)}
                  userData={{ baseY: -0.3 - d * 0.025, ph: i + d * 1.2, idx: i }}
                  visible={false}
                >
                  <sphereGeometry args={[0.007, 6, 6]} />
                  <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.8} />
                </mesh>
              )
            })}
          </group>
        ))}
      </group>

      <pointLight ref={inkPLRef} color={0x00e5ff} intensity={5} distance={5} position={[0, 1.4, 1.2]} />
      <pointLight ref={mgPLRef} color={0xff006e} intensity={3} distance={3.5} position={[0.8, 1.5, 0.8]} />

      {/* SUPPLY MEDIA ROLL */}
      <mesh ref={supRollRef} rotation={[0, 0, Math.PI / 2]} position={[0, 1.85, -1.35]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 7.8, 64]} />
        <meshStandardMaterial color={0xe8e4d8} roughness={0.85} metalness={0} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 1.85, -1.35]}>
        <cylinderGeometry args={[0.1, 0.1, 7.95, 16]} />
        <meshStandardMaterial color={0x2a2a40} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* TAKE-UP CORE */}
      <mesh ref={takeCoreRef} rotation={[0, 0, Math.PI / 2]} position={[0, 0.1, 1.8]}>
        <cylinderGeometry args={[0.12, 0.12, 7.8, 32]} />
        <meshStandardMaterial color={0x2a2a40} roughness={0.4} metalness={0.8} />
      </mesh>
      {[[-1.15, 0.75], [1.0, 0.75]].map(([z, y], idx) => (
        <mesh key={`roll-${idx}`} rotation={[0, 0, Math.PI / 2]} position={[0, y, z]}>
          <cylinderGeometry args={[0.11, 0.11, 7.6, 32]} />
          <meshStandardMaterial color={0x0c0c16} roughness={0.8} metalness={0.1} />
        </mesh>
      ))}

      {/* FLAT MEDIA PATH */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.73, -0.075]}>
        <planeGeometry args={[7.5, 2.95]} />
        <meshStandardMaterial color={0xeeeada} roughness={0.82} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* DRYER / UV UNIT */}
      <mesh position={[-2.5, 1.12, 0]}>
        <boxGeometry args={[1.6, 0.3, 1.7]} />
        <meshStandardMaterial color={0x0f1020} roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh ref={dryerGrillRef} position={[-2.5, 1.13, 0]}>
        <boxGeometry args={[1.55, 0.04, 1.5]} />
        <meshStandardMaterial color={0xffaa00} emissive={0xff6600} emissiveIntensity={0.6} />
      </mesh>
      <pointLight ref={dryerPLRef} color={0xff8800} intensity={2} distance={2} position={[-2.5, 0.85, 0]} />

      {/* CONTROL PANEL */}
      <mesh position={[3.5, 0.85, 0.95]}>
        <boxGeometry args={[0.85, 0.65, 0.22]} />
        <meshStandardMaterial color={0x0d1525} roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[3.5, 0.85, 1.07]}>
        <boxGeometry args={[0.72, 0.52, 0.012]} />
        <meshStandardMaterial color={0x001122} emissive={0x00e5ff} emissiveIntensity={0.4} />
      </mesh>

      {/* BANNER GROUP */}
      <FlexBannerOutput scrollRatio={scrollRatio} />
      </group>
    </>
  );
}
