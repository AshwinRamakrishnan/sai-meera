import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FlexBannerOutput({ scrollRatio = 0 }) {
  const bannerGroupRef = useRef();
  const bannerMeshRef = useRef();
  const leadingEdgeRef = useRef();
  const eyeletsGroupRef = useRef();
  
  // Create banner texture once
  const bannerTex = useMemo(() => {
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 512; texCanvas.height = 256;
    const tctx = texCanvas.getContext('2d');
    
    // Gradient background
    const grad = tctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#0a1628');
    grad.addColorStop(0.3, '#1a0a3e');
    grad.addColorStop(0.6, '#0a2848');
    grad.addColorStop(1, '#0d1b2a');
    tctx.fillStyle = grad;
    tctx.fillRect(0, 0, 512, 256);
    
    // Add decorative elements
    tctx.fillStyle = '#00e5ff';
    tctx.font = 'bold 42px Arial';
    tctx.textAlign = 'center';
    tctx.fillText('GRAND OPENING', 256, 90);
    
    tctx.fillStyle = '#ff006e';
    tctx.font = 'bold 28px Arial';
    tctx.fillText('★ MEGA EVENT ★', 256, 140);
    
    tctx.fillStyle = '#ffe600';
    tctx.font = '18px Arial';
    tctx.fillText('Saturday · 15 June · 10 AM', 256, 190);
    
    // CMYK accent bars
    const cmykColors = ['#00e5ff', '#ff006e', '#ffe600', '#00ff88'];
    cmykColors.forEach((c, i) => {
      tctx.fillStyle = c;
      tctx.fillRect(100 + i * 80, 210, 60, 6);
    });
    
    const tex = new THREE.CanvasTexture(texCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const segs = 32;
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(7.4, 1, segs, segs);
    return g;
  }, [segs]);

  useFrame((state) => {
    const ft = state.clock.elapsedTime;
    const bannerH = Math.max(scrollRatio * 4.2, 0.001);

    if (bannerMeshRef.current) {
      bannerMeshRef.current.scale.set(1, bannerH, 1);
      bannerMeshRef.current.position.set(0, 0.015, 1.8 + bannerH / 2);
      bannerMeshRef.current.rotation.z = Math.sin(ft * 0.35) * 0.006;

      const posAttr = geom.attributes.position;
      for (let vi = 0; vi < posAttr.count; vi++) {
        const x = posAttr.getX(vi);
        const y = posAttr.getY(vi) * bannerH;
        posAttr.setZ(vi, Math.sin(x * 0.8 + ft * 0.5) * 0.03 + Math.sin(y * 1.2) * 0.02);
      }
      posAttr.needsUpdate = true;
      geom.computeVertexNormals();
    }
    
    if (leadingEdgeRef.current) {
        leadingEdgeRef.current.position.set(0, 0.02, 1.8 + bannerH);
    }
    
    if (eyeletsGroupRef.current) {
        eyeletsGroupRef.current.position.set(0, 0, 1.8 + bannerH - 0.08);
    }
  });

  const showBanner = scrollRatio > 0.01;
  if (!showBanner) return null;

  return (
    <group ref={bannerGroupRef}>
      <mesh 
        ref={bannerMeshRef} 
        geometry={geom} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial 
          map={bannerTex}
          roughness={0.65}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={leadingEdgeRef}>
        <boxGeometry args={[7.4, 0.04, 0.06]} />
        <meshStandardMaterial color={0xe8e4d8} roughness={0.8} />
      </mesh>

      <group ref={eyeletsGroupRef}>
        {[-3.5, -2.5, -1.5, 0, 1.5, 2.5, 3.5].map((ex, i) => (
          <mesh key={`eyelet-${i}`} position={[ex, 0.03, 0]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.06, 0.016, 6, 12]} />
            <meshStandardMaterial color={0x888888} metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
