import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useScroll } from 'framer-motion';
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
  // Separate state only for the HUD overlay (UI updates at lower frequency)
  const [hudRatio, setHudRatio] = useState(0);

  // Mount Canvas immediately — pre-compiles shaders while user reads hero section
  const isInView = true;

  // ─── Scroll tracking: write to ref (instant), throttle HUD updates ───
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    let rafId;
    const unsub = scrollYProgress.on('change', (latest) => {
      // Write to ref INSTANTLY — no React delay
      scrollRatioRef.current = latest;
      // Throttle HUD DOM updates via rAF (smooth but not every pixel)
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setHudRatio(latest));
    });
    return () => { unsub(); cancelAnimationFrame(rafId); };
  }, [scrollYProgress]);

  // ─── Derived values ───
  const r3fAccent = useMemo(() => {
    if (accentColor === 'var(--orange)') return '#ff6a00';
    if (accentColor === 'var(--green)') return '#00ff94';
    if (accentColor === 'var(--gold)') return '#f5a623';
    return '#00d4ff';
  }, [accentColor]);

  const status = hudRatio < 0.1 ? 'STANDBY' : hudRatio < 0.85 ? 'OPERATING' : 'COMPLETE';
  const visibleLines = Math.floor(hudRatio * consoleLines.length);
  const meterPct = Math.round(hudRatio * 100);

  return (
    <section id={id} ref={sectionRef} className="machineSection" style={{ '--accent-color': accentColor }}>
      <div className="stickyContainer">
        {/* ── Full-bleed 3D Canvas ── */}
        <div className="canvasArea">
          {isInView && (
            <Canvas
              dpr={[1, Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.0 : 1.5)]}
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
              MACHINE {machineNumber} · <span className="statusValue">{status}</span>
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
              <div className="meterLabel">Print Progress: {meterPct}%</div>
              <div className="meterTrack">
                <div className="meterFill" style={{ width: `${meterPct}%` }} />
              </div>
            </div>
          </div>

          {/* Right: Live Console */}
          <div className="hudRight">
            <div className="consolePanel">
              <div className="consoleScanline" />
              <div className="consoleTitle">LIVE CONSOLE</div>
              {consoleLines.slice(0, visibleLines).map((line, i) => {
                const isHighlight = /READY|RUNNING|LOADED|ENGAGED|CALIBRATED|PRINTING|RENDERING/i.test(line);
                return (
                  <div key={i} className="consoleLine">
                    <span className="prefix">▸</span>
                    {isHighlight ? (
                      <span className="highlight">{line}</span>
                    ) : (
                      line
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default MachineSection;
