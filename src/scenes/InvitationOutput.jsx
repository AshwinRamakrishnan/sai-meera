import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function InvitationOutput({ scrollRatio = 0 }) {
  const groupRef = useRef();
  
  // Create geometry with vertex colors once
  const { geometry, foilGeom } = useMemo(() => {
    const ig = new THREE.PlaneGeometry(1.5, 1, 1, 20);
    const pos = ig.attributes.position;
    const ci = [];
    for (let v = 0; v < pos.count; v++) {
      const yf = (pos.getY(v) + 0.5); // 0 to 1 mapping
      ci.push(yf * 0.8 + 0.15, yf * 0.7 + 0.1, yf * 0.5 + 0.08);
    }
    ig.setAttribute('color', new THREE.Float32BufferAttribute(ci, 3));
    
    const fg = new THREE.PlaneGeometry(1.52, 0.03);
    
    return { geometry: ig, foilGeom: fg };
  }, []);

  const sheets = useMemo(() => {
    const arr = [];
    for (let j = 4; j >= 0; j--) {
      const isMain = j === 0;
      arr.push({
        j,
        isMain,
        hOffset: isMain ? 0 : (Math.random() - 0.5) * 0.04,
        vOffset: isMain ? 0 : (Math.random() - 0.5) * 0.04,
        zRot: isMain ? 0 : (Math.random() - 0.5) * 0.02,
      });
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const invH = scrollRatio * 3.2;
    groupRef.current.visible = invH > 0.08;
    
    if (invH > 0.08) {
      groupRef.current.children.forEach((child) => {
        if (child.userData.isSheet) {
          child.scale.set(1, invH, 1);
          child.position.z = 1.8 + invH / 2 + child.userData.vOffset;
        } else if (child.userData.isFoil) {
          child.position.z = 1.8 + invH;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {sheets.map((sheet) => (
        <React.Fragment key={sheet.j}>
          <mesh
            geometry={geometry}
            rotation={[-Math.PI / 2, 0, sheet.zRot]}
            position={[sheet.hOffset, 0.02 - sheet.j * 0.002, 0]}
            userData={{ isSheet: true, vOffset: sheet.vOffset }}
          >
            <meshStandardMaterial
              vertexColors={true}
              roughness={sheet.isMain ? 0.78 : 0.85}
              metalness={sheet.isMain ? 0.06 : 0.02}
              side={THREE.DoubleSide}
            />
          </mesh>
          {sheet.isMain && (
            <mesh
              geometry={foilGeom}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.025, 0]}
              userData={{ isFoil: true }}
            >
              <meshStandardMaterial
                color={0xc9a84c}
                emissive={0xc9a84c}
                emissiveIntensity={1.2}
                roughness={0.1}
                metalness={1.0}
              />
            </mesh>
          )}
        </React.Fragment>
      ))}
    </group>
  );
}
