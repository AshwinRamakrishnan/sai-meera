import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useScroll, useInView, useTransform, motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import './MachineSection.css';
import SharedLighting from '../../scenes/SharedLighting';

/**
 * SceneBridge — lives INSIDE the Canvas.
 * Reads scrollRatioRef every animation frame (60fps) via useFrame.
 * This bypasses React's render cycle entirely → zero lag, frame-perfect animation.
 */
function SceneBridge({ scrollRef, Component }) {
  const [scrollRatio, setScrollRatio] = useState(0);
  const lastRef = useRef(0);

  useFrame(() => {
    const next = scrollRef.current;
    // Only trigger re-render when value changes meaningfully
    if (Math.abs(next - lastRef.current) > 0.0008) {
      lastRef.current = next;
      setScrollRatio(next);
    }
  });

  if (!Component) return null;
  return <Component scrollRatio={scrollRatio} />;
}

function ModelLoadNotifier({ onLoaded }) {
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);
  return null;
}

const ConsoleLine = ({ line, index, scrollYProgress, totalLines }) => {
  const displayTransform = useTransform(scrollYProgress, (v) => {
    const visible = Math.floor(v * (totalLines + 1));
    return index <= visible ? 'block' : 'none';
  });
  const isHighlight = /READY|RUNNING|LOADED|ENGAGED|CALIBRATED|PRINTING|RENDERING/i.test(line);
  return (
    <motion.div className="consoleLine" style={{ display: displayTransform }}>
      <span className="prefix">▸</span>
      {isHighlight ? <span className="highlight">{line}</span> : line}
    </motion.div>
  );
};

const MachineSection = React.memo(function MachineSection({
  id,
  machineNumber,
  machineName,
  serialNumber,
  specs,
  accentColor,
  consoleLines = [],
  description = '',
  sceneComponent: SceneComponent,
  cameraPosition,
  cameraFov,
  cameraTarget,
  customLighting = true,
}) {
  const sectionRef = useRef(null);

  // ─── scrollRatio as a REF (no React re-render on scroll) ───
  const scrollRatioRef = useRef(0);

  // ─── 1. MOUNT/UNMOUNT CANVAS (Only when near view to save WebGL memory) ───
  const hasMountedCanvas = useInView(sectionRef, { margin: "300px" });

  // ─── 2. PAUSE RENDER LOOP (Pause when completely out of view) ───
  const isRenderingActive = useInView(sectionRef, { margin: "0px" });

  // ─── 3. LOAD NOTIFIER (Fade out placeholder when 3D assets are ready) ───
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset loading state if canvas unmounts so it shows loading again when scrolling back
  useEffect(() => {
    if (!hasMountedCanvas) setIsLoaded(false);
  }, [hasMountedCanvas]);

  // ─── Scroll tracking: write to ref (instant), no React re-renders ───
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // Write to ref INSTANTLY — no React delay for 3D bridge
      scrollRatioRef.current = latest;
    });
  }, [scrollYProgress]);

  // ─── HUD Motion Transforms (zero React state updates) ───
  const statusTransform = useTransform(scrollYProgress, (v) => v < 0.1 ? 'STANDBY' : v < 0.85 ? 'OPERATING' : 'COMPLETE');
  const meterWidthTransform = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);
  const meterTextTransform = useTransform(scrollYProgress, (v) => `Print Progress: ${Math.round(v * 100)}%`);

  // ─── Derived values ───
  const r3fAccent = useMemo(() => {
    if (accentColor === 'var(--orange)') return '#ff6a00';
    if (accentColor === 'var(--green)') return '#00ff94';
    if (accentColor === 'var(--gold)') return '#f5a623';
    return '#00d4ff';
  }, [accentColor]);

  return (
    <section id={id} ref={sectionRef} className="machineSection" style={{ '--accent-color': accentColor }}>
      <div className="stickyContainer">
        {/* ── Full-bleed 3D Canvas ── */}
        <div className="canvasArea">
          {/* Loading Placeholder */}
          <div className={`machine-loading-overlay ${isLoaded ? 'loaded' : ''}`}>
            <div className="loading-spinner"></div>
            <div className="loading-text">
              <span className="loading-label">MACHINE {machineNumber}</span>
              LOADING PRINT SYSTEM...
            </div>
          </div>

          {hasMountedCanvas && (
            <Canvas
              frameloop={isRenderingActive ? 'always' : 'demand'}
              dpr={[1, Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.5)]}
              gl={{
                antialias: window.innerWidth >= 768,
                toneMapping: 6, // ACESFilmicToneMapping
                toneMappingExposure: 1.6,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
                depth: true,
              }}
              camera={{
                position: cameraPosition || [9, 6, 12],
                fov: window.innerWidth < 768 ? (cameraFov || 42) + 18 : (cameraFov || 42),
                near: 0.1,
                far: 200,
              }}
              style={{ width: '100%', height: '100%' }}
              performance={{ min: 0.5 }}
            >
              <color attach="background" args={['#0a0a0f']} />
              <SharedLighting accentColor={r3fAccent} />
              <Suspense fallback={null}>
                {/* SceneBridge reads scrollRatioRef via useFrame — frame-perfect, zero React lag */}
                <SceneBridge scrollRef={scrollRatioRef} Component={SceneComponent} />
                <ModelLoadNotifier onLoaded={() => setIsLoaded(true)} />
              </Suspense>
            </Canvas>
          )}
          <div className="badge">{machineNumber}</div>
        </div>

        {/* ── HUD Overlay ── */}
        <div className="hudOverlay">
          {/* Status indicator (top-left) */}
          <div className="statusIndicator">
            <div className="statusDot" />
            <span className="statusText">
              MACHINE {machineNumber} · <motion.span className="statusValue">{statusTransform}</motion.span>
            </span>
          </div>

          {/* Left: Machine title, description, spec badges, meter */}
          <div className="hudLeft">
            <div className="machineLabel">MACHINE {machineNumber} · {serialNumber}</div>
            <h2 className="machineTitle">{machineName}</h2>
            {description && <p className="machineDescription">{description}</p>}

            <div className="specBadgesRow">
              {specs.map((spec, i) => (
                <div key={i} className="specBadge">
                  {spec.label}
                </div>
              ))}
            </div>

            <div className="meterContainer">
              <motion.div className="meterLabel">{meterTextTransform}</motion.div>
              <div className="meterTrack">
                <motion.div className="meterFill" style={{ width: meterWidthTransform }} />
              </div>
            </div>
          </div>

          {/* Right: Live Console */}
          <div className="hudRight">
            <div className="consolePanel">
              <div className="consoleScanline" />
              <div className="consoleTitle">LIVE CONSOLE</div>
              {consoleLines.map((line, i) => (
                <ConsoleLine 
                  key={i} 
                  line={line} 
                  index={i} 
                  scrollYProgress={scrollYProgress} 
                  totalLines={consoleLines.length} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default MachineSection;
