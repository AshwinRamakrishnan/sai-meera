import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Desk = React.memo(function Desk() {
  return (
    <group position={[0, 0.83, 0]}>
      {/* Main desk surface */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[5.8, 0.1, 2.6]} />
        <meshStandardMaterial color="#080810" roughness={0.18} metalness={0.75} />
      </mesh>
      
      {/* Front edge */}
      <mesh position={[0, 0, 1.31]}>
        <boxGeometry args={[5.8, 0.1, 0.02]} />
        <meshStandardMaterial color="#12122a" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Keyboard tray */}
      <mesh position={[0, -0.25, -0.2]}>
        <boxGeometry args={[5.2, 0.05, 1.4]} />
        <meshStandardMaterial color="#050508" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Legs */}
      {[[-2.7, -1.1], [2.7, -1.1], [-2.7, 1.1], [2.7, 1.1]].map(([x, z], i) => (
        <group key={`leg-${i}`} position={[x, -0.44, z]}>
          <mesh>
            <boxGeometry args={[0.07, 0.82, 0.07]} />
            <meshStandardMaterial color="#3a3a55" roughness={0.06} metalness={1} />
          </mesh>
          <mesh position={[0, -0.37, 0]}>
            <boxGeometry args={[0.14, 0.035, 0.14]} />
            <meshStandardMaterial color="#050508" roughness={0.5} metalness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
});

const MainMonitor = React.forwardRef(function MainMonitor(props, ref) {
  const ui_z = 0.038;
  const toolIconColors = [0x0066cc, 0x555566, 0x555566, 0x00aa88, 0x555566, 0xaa4400, 0x555566, 0x555566, 0x555566, 0x555566, 0x555566, 0x2244cc];
  const artRows = [0x0a2a7a, 0x1a4a0a, 0x6a1a0a, 0x0a4a6a, 0x4a0a6a, 0x2a4a0a, 0x0a1a4a];
  
  // Forwarded ref goes to the screen mesh to animate its emissive property
  return (
    <group position={[-1.0, 0.84, -0.16]}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.6, 0.04, 0.55]} />
        <meshStandardMaterial color="#3a3a55" roughness={0.06} metalness={1} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.055, 0.52, 0.065]} />
        <meshStandardMaterial color="#3a3a55" roughness={0.06} metalness={1} />
      </mesh>

      {/* Head */}
      <group position={[0, 0.88, 0]} rotation={[-0.14, 0, 0]}>
        {/* Bezel */}
        <mesh>
          <boxGeometry args={[2.75, 1.68, 0.055]} />
          <meshStandardMaterial color="#060608" roughness={0.45} metalness={0.45} />
        </mesh>

        {/* Screen */}
        <mesh position={[0, 0, 0.034]} ref={ref.screen}>
          <boxGeometry args={[2.62, 1.55, 0.012]} />
          <meshStandardMaterial color="#0a1a6a" emissive="#0a1a6a" emissiveIntensity={0.9} roughness={0.02} />
        </mesh>
        
        {/* Screen Frame Glow */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[2.64, 1.57, 0.008]} />
          <meshStandardMaterial color="#1a2266" emissive="#4455ff" emissiveIntensity={0.2} roughness={0.3} />
        </mesh>

        {/* UI: Menu Bar */}
        <mesh position={[0, 0.72, ui_z]}>
          <boxGeometry args={[2.58, 0.09, 0.004]} />
          <meshStandardMaterial color="#252530" roughness={0.4} />
        </mesh>

        {/* UI: Toolbar */}
        <mesh position={[-1.17, -0.02, ui_z]}>
          <boxGeometry args={[0.22, 1.4, 0.004]} />
          <meshStandardMaterial color="#1a1a28" />
        </mesh>
        {toolIconColors.map((c, i) => (
          <mesh key={`icon-${i}`} position={[-1.17, 0.62 - i * 0.108, ui_z + 0.004]}>
            <boxGeometry args={[0.15, 0.085, 0.002]} />
            <meshStandardMaterial color={c} roughness={0.5} />
          </mesh>
        ))}

        {/* UI: Layer Panel */}
        <mesh position={[1.07, -0.03, ui_z]}>
          <boxGeometry args={[0.44, 1.38, 0.004]} />
          <meshStandardMaterial color="#181824" />
        </mesh>
        {Array.from({ length: 9 }).map((_, lr) => {
          const rColor = lr === 2 ? 0x1e3a7a : lr === 5 ? 0x3a1e7a : 0x222235;
          const tColor = [0x1a3a8a, 0x5a1a0a, 0x0a4a2a, 0x3a3a0a, 0x2a0a3a, 0x1a4a4a, 0x4a2a0a, 0x0a2a5a, 0x3a1a4a][lr % 9];
          return (
            <group key={`layer-${lr}`}>
              <mesh position={[1.07, 0.59 - lr * 0.12, ui_z + 0.004]}>
                <boxGeometry args={[0.4, 0.07, 0.002]} />
                <meshStandardMaterial color={rColor} roughness={0.5} />
              </mesh>
              <mesh position={[0.87, 0.59 - lr * 0.12, ui_z + 0.006]}>
                <boxGeometry args={[0.06, 0.055, 0.001]} />
                <meshStandardMaterial color={tColor} roughness={0.5} />
              </mesh>
            </group>
          );
        })}

        {/* UI: Art Canvas */}
        {artRows.map((c, i) => (
          <mesh key={`art-${i}`} position={[-0.08, 0.44 - i * 0.16, ui_z + 0.003]}>
            <boxGeometry args={[1.5, 0.16, 0.003]} />
            <meshStandardMaterial color={c} roughness={0.3} />
          </mesh>
        ))}

        {/* UI: Property Bar & Histogram */}
        <mesh position={[0, -0.69, ui_z]}>
          <boxGeometry args={[2.58, 0.14, 0.004]} />
          <meshStandardMaterial color="#1c1c28" />
        </mesh>
        <mesh position={[1.07, -0.55, ui_z]}>
          <boxGeometry args={[0.38, 0.22, 0.004]} />
          <meshStandardMaterial color="#101018" />
        </mesh>
        {Array.from({ length: 12 }).map((_, hb) => {
          const h = 0.04 + Math.random() * 0.14;
          return (
            <mesh key={`hist-${hb}`} position={[0.9 + hb * 0.024, -0.6 + h / 2, ui_z + 0.004]}>
              <boxGeometry args={[0.022, h, 0.002]} />
              <meshStandardMaterial color="#4466ff" emissive="#2244cc" emissiveIntensity={0.3} />
            </mesh>
          );
        })}

        {/* 3D Cursor */}
        <mesh position={[0, 0, ui_z + 0.005]} ref={ref.cursor}>
          <boxGeometry args={[0.02, 0.04, 0.002]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
});

const SideMonitor = React.memo(function SideMonitor() {
  return (
    <group position={[1.95, 0.84, -0.26]}>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.0, 0.04, 0.42]} />
        <meshStandardMaterial color="#3a3a55" roughness={0.06} metalness={1} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[0.045, 0.44, 0.055]} />
        <meshStandardMaterial color="#3a3a55" roughness={0.06} metalness={1} />
      </mesh>
      <group position={[0, 0.72, 0]}>
        <mesh rotation={[Math.PI / 2 - 0.13, 0, 0]}>
          <boxGeometry args={[1.75, 0.052, 1.15]} />
          <meshStandardMaterial color="#060608" roughness={0.45} metalness={0.45} />
        </mesh>
        <mesh rotation={[Math.PI / 2 - 0.13, 0, 0]} position={[0, 0, -0.02]}>
          <boxGeometry args={[1.65, 0.012, 1.05]} />
          <meshStandardMaterial color="#060e40" emissive="#060e40" emissiveIntensity={0.7} roughness={0.02} />
        </mesh>
        {[{ c: 0x0a2050, x: -0.38 }, { c: 0x250a20, x: 0.02 }, { c: 0x0a2515, x: 0.42 }].map(({ c, x }, i) => (
          <mesh key={`block-${i}`} rotation={[Math.PI / 2 - 0.13, 0, 0]} position={[x, 0, -0.015]}>
            <boxGeometry args={[0.5, 0.012, 0.9]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.15} />
          </mesh>
        ))}
      </group>
    </group>
  );
});

const WacomTablet = React.forwardRef(function WacomTablet(props, ref) {
  return (
    <group position={[-0.12, 0.836, 0.68]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[1.6, 0.042, 1.02]} />
        <meshStandardMaterial color="#080810" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[1.48, 0.016, 0.9]} />
        <meshStandardMaterial color="#06103a" emissive="#0a1a60" emissiveIntensity={0.35} roughness={0.06} />
      </mesh>
      {/* ExpressKeys */}
      {Array.from({ length: 8 }).map((_, k) => (
        <mesh key={`ek-${k}`} position={[-0.84, 0.022, -0.32 + k * 0.065]}>
          <boxGeometry args={[0.04, 0.042, 0.038]} />
          <meshStandardMaterial color="#0c0c1a" metalness={0.6} />
        </mesh>
      ))}
      {/* Touch Ring */}
      <mesh position={[-0.84, 0.04, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.055, 0.016, 6, 16]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.8} />
      </mesh>
      
      {/* UI Elements on Tablet */}
      {[{ c: 0x0a1a44, x: 0, z: -0.1 }, { c: 0x3a1a0a, x: 0.15, z: 0.08 }, { c: 0x0a2a1a, x: -0.12, z: 0.22 }].map(({ c, x, z }, i) => (
        <mesh key={`tab-ui-${i}`} position={[x, 0.032, z]}>
          <boxGeometry args={[0.42, 0.012, 0.3]} />
          <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Pen group controlled by ref */}
      <group ref={ref}>
        {/* Pen Body */}
        <mesh position={[0.38, 0.055, -0.08]} rotation={[0, 0, Math.PI / 3.5]}>
          <cylinderGeometry args={[0.013, 0.009, 0.26, 8]} />
          <meshStandardMaterial color="#0e0e1e" roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Pen Tip */}
        <mesh position={[0.455, 0.035, -0.12]} rotation={[0, 0, Math.PI / 3.5]}>
          <coneGeometry args={[0.006, 0.04, 8]} />
          <meshStandardMaterial color="#1a1a2c" metalness={0.98} />
        </mesh>
        {/* Pen Clip */}
        <mesh position={[0.38, 0.09, -0.065]} rotation={[0, 0, Math.PI / 3.5]}>
          <boxGeometry args={[0.006, 0.18, 0.008]} />
          <meshStandardMaterial color="#3a3a4a" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
});

const Keyboard = React.memo(function Keyboard() {
  const rgbCols = [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x0088ff, 0x8800ff];
  const keys = [];
  
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 14; col++) {
      const kc = rgbCols[(row * 14 + col) % 6];
      const isSpec = row === 0 && col < 2;
      keys.push(
        <group key={`key-${row}-${col}`} position={[-0.58 + col * 0.09, 0.858, row * 0.086 + 0.04]}>
          <mesh>
            <boxGeometry args={[0.08, 0.024, 0.074]} />
            <meshStandardMaterial color={isSpec ? "#003355" : "#111120"} roughness={0.3} metalness={0.5} />
          </mesh>
          {Math.random() > 0.65 && (
            <mesh position={[0, -0.004, 0]}>
              <boxGeometry args={[0.04, 0.004, 0.04]} />
              <meshStandardMaterial color={kc} emissive={kc} emissiveIntensity={0.6} />
            </mesh>
          )}
        </group>
      );
    }
  }

  return (
    <group position={[-0.12, 0, 0.22]}>
      <mesh position={[0, 0.836, 0]}>
        <boxGeometry args={[1.36, 0.038, 0.46]} />
        <meshStandardMaterial color="#0c0c1a" roughness={0.28} metalness={0.65} />
      </mesh>
      {keys}
      <mesh position={[0, 0.834, 0.12]}>
        <boxGeometry args={[1.32, 0.02, 0.18]} />
        <meshStandardMaterial color="#111120" roughness={0.8} />
      </mesh>
    </group>
  );
});

const Accessories = React.memo(function Accessories() {
  return (
    <group>
      {/* Mouse */}
      <mesh position={[0.82, 0.858, 0.22]}>
        <cylinderGeometry args={[0.032, 0.026, 0.1, 16]} />
        <meshStandardMaterial color="#0a0a16" roughness={0.18} metalness={0.75} />
      </mesh>
      <mesh position={[0.81, 0.907, 0.2]}>
        <boxGeometry args={[0.02, 0.01, 0.04]} />
        <meshStandardMaterial color="#18182a" roughness={0.35} />
      </mesh>
      <mesh position={[0.83, 0.907, 0.2]}>
        <boxGeometry args={[0.02, 0.01, 0.04]} />
        <meshStandardMaterial color="#18182a" roughness={0.35} />
      </mesh>
      <mesh position={[0.82, 0.86, 0.26]}>
        <boxGeometry args={[0.004, 0.085, 0.004]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.72, 0.832, 0.22]}>
        <boxGeometry args={[0.55, 0.006, 0.45]} />
        <meshStandardMaterial color="#060612" roughness={0.95} />
      </mesh>

      {/* Calibrator */}
      <mesh position={[-2.3, 1.82, -0.16]}>
        <sphereGeometry args={[0.058, 14, 14]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.06} metalness={0.4} />
      </mesh>
      <mesh position={[-2.3, 1.99, -0.16]}>
        <cylinderGeometry args={[0.004, 0.004, 0.32, 6]} />
        <meshStandardMaterial color="#2a2a3a" roughness={0.5} />
      </mesh>

      {/* Swatches */}
      <mesh position={[1.5, 0.834, 0.48]}>
        <boxGeometry args={[0.95, 0.005, 0.68]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.92} />
      </mesh>
      {[0x00aacc, 0xcc0044, 0xccbb00, 0x111111, 0x00ccaa, 0xcc5500].map((c, i) => (
        <mesh key={`swatch-${i}`} position={[1.12 + (i % 3) * 0.2, 0.838, 0.38 + Math.floor(i / 3) * 0.2]}>
          <boxGeometry args={[0.13, 0.006, 0.14]} />
          <meshStandardMaterial color={c} roughness={0.8} />
        </mesh>
      ))}

      {/* Mug */}
      <mesh position={[2.1, 0.9, -0.12]}>
        <cylinderGeometry args={[0.055, 0.05, 0.14, 16]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[2.1, 0.975, -0.12]}>
        <cylinderGeometry args={[0.046, 0.046, 0.01, 16]} />
        <meshStandardMaterial color="#220e00" roughness={0.95} />
      </mesh>
      <mesh position={[2.155, 0.9, -0.12]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.042, 0.009, 6, 14, Math.PI]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.4} />
      </mesh>

      {/* Lamp */}
      <mesh position={[-2.5, 0.836, 0.35]}>
        <cylinderGeometry args={[0.11, 0.13, 0.04, 16]} />
        <meshStandardMaterial color="#3a3a55" roughness={0.06} metalness={1} />
      </mesh>
      <mesh position={[-2.5, 1.12, 0.35]} rotation={[0, 0, 0.22]}>
        <boxGeometry args={[0.025, 0.58, 0.025]} />
        <meshStandardMaterial color="#3a3a55" roughness={0.06} metalness={1} />
      </mesh>
      <mesh position={[-2.38, 1.58, 0.35]} rotation={[0, 0, -0.32]}>
        <boxGeometry args={[0.025, 0.48, 0.025]} />
        <meshStandardMaterial color="#3a3a55" roughness={0.06} metalness={1} />
      </mesh>
      <mesh position={[-2.28, 1.78, 0.35]} rotation={[0, 0, -Math.PI / 2.3]}>
        <cylinderGeometry args={[0.085, 0.065, 0.11, 12]} />
        <meshStandardMaterial color="#151520" roughness={0.25} metalness={0.6} />
      </mesh>

      {/* Speakers */}
      {[-2.72, 2.62].map((x, si) => {
        const c = si === 0 ? "#00ff88" : "#0055ff";
        return (
          <group key={`speaker-${si}`}>
            <mesh position={[x, 1.06, -0.24]}>
              <boxGeometry args={[0.28, 0.48, 0.22]} />
              <meshStandardMaterial color="#0a0a14" roughness={0.4} metalness={0.5} />
            </mesh>
            <mesh position={[x, 1.1, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.01, 24]} />
              <meshStandardMaterial color="#1a1a28" roughness={0.6} />
            </mesh>
            <mesh position={[x, 1.1, -0.13]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color="#0c0c18" roughness={0.5} />
            </mesh>
            <mesh position={[x, 1.1, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.12, 0.008, 6, 20]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
});

export default function PhotoshopStation({ scrollRatio = 0 }) {
  const mainScreenRef = useRef();
  const mainCursorRef = useRef();
  const wacomPenRef = useRef();

  useFrame((state) => {
    const pt = state.clock.elapsedTime;
    
    // Main Monitor Animation
    if (mainScreenRef.current) {
      mainScreenRef.current.material.emissiveIntensity = 0.8 + Math.sin(pt * 1.1) * 0.08;
    }
    
    if (mainCursorRef.current) {
      mainCursorRef.current.material.emissiveIntensity = Math.floor(pt * 1.5) % 2 === 0 ? 2.5 : 0;
    }

    // Wacom Pen Animation
    if (wacomPenRef.current && scrollRatio > 0.1) {
      wacomPenRef.current.position.x = Math.sin(pt * 0.85) * 0.07;
      wacomPenRef.current.position.z = Math.cos(pt * 0.65) * 0.055;
    } else if (wacomPenRef.current) {
      wacomPenRef.current.position.x = 0;
      wacomPenRef.current.position.z = 0;
    }
  });

  return (
    <group>
      {/* Fog — pushed back */}
      <fog attach="fog" args={['#04040e', 28, 45]} />

      {/* Studio Lighting — Bright and visible */}
      <ambientLight intensity={3.0} color="#080810" />
      <directionalLight position={[5, 12, 6]} intensity={3.5} color="#00ff88" />
      <directionalLight position={[-6, 8, 8]} intensity={2.5} color="#aabbff" />
      <directionalLight position={[-6, 5, -5]} intensity={2.0} color="#001a44" />
      <directionalLight position={[0, 18, 0]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-1.5, 3.5, 2.5]} intensity={5.0} color="#00ff88" distance={7} />
      <pointLight position={[2.5, 2.5, -1]} intensity={3.0} color="#0055ff" distance={6} />
      <pointLight position={[0, 3.2, 2]} intensity={8.0} color="#1a44ff" distance={5} />
      <hemisphereLight skyColor="#001a00" groundColor="#040404" intensity={1.0} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0c0c18" roughness={0.85} metalness={0.15} />
      </mesh>

      <Desk />
      <MainMonitor ref={{ screen: mainScreenRef, cursor: mainCursorRef }} />
      <SideMonitor />
      <WacomTablet ref={wacomPenRef} />
      <Keyboard />
      <Accessories />
    </group>
  );
}
