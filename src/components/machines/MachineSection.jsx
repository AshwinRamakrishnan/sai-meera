import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { useScroll } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import './MachineSection.css';
import { Environment } from '@react-three/drei';

/**
 * MachineSection — Premium full-bleed layout with performance optimizations.
 *
 * Performance features:
 * - IntersectionObserver pauses Canvas rendering when off-screen
 * - DPR capped at 1.5 to prevent WebGL context loss on mobile
 * - React.memo prevents unnecessary re-renders
 *
 * Layout: Full-bleed 3D Canvas with HUD overlay (Apple keynote style).
 */

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
  const [scrollRatio, setScrollRatio] = useState(0);
  const [isInView, setIsInView] = useState(false);

  // ─── IntersectionObserver: Pause Canvas when off-screen ───
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ─── Scroll tracking via Framer Motion ───
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setScrollRatio(latest);
    });
  }, [scrollYProgress]);

  // ─── Derived values ───
  const r3fAccent = useMemo(() => {
    if (accentColor === 'var(--orange)') return '#ff6a00';
    if (accentColor === 'var(--green)') return '#00ff94';
    if (accentColor === 'var(--gold)') return '#f5a623';
    return '#00d4ff';
  }, [accentColor]);

  const status = scrollRatio < 0.1 ? 'STANDBY' : scrollRatio < 0.85 ? 'OPERATING' : 'COMPLETE';
  const visibleLines = Math.floor(scrollRatio * consoleLines.length);
  const meterPct = Math.round(scrollRatio * 100);

  return (
    <section id={id} ref={sectionRef} className="machineSection" style={{ '--accent-color': accentColor }}>
      <div className="stickyContainer">
        {/* ── Full-bleed 3D Canvas ── */}
        <div className="canvasArea">
          {isInView && (
            <Canvas
              dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
              gl={{
                antialias: true,
                toneMapping: 6, // ACESFilmicToneMapping
                toneMappingExposure: 1.8,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
                depth: true,
              }}
              camera={{
                position: cameraPosition || [9, 6, 12],
                fov: cameraFov || 42,
                near: 0.1,
                far: 200,
              }}
              style={{ width: '100%', height: '100%' }}
              performance={{ min: 0.5 }}
            >
              <color attach="background" args={['#0a0a0f']} />
              <Suspense fallback={null}>
                {/* Render the machine immediately since it's procedural */}
                {SceneComponent && <SceneComponent scrollRatio={scrollRatio} />}
              </Suspense>
              <Suspense fallback={null}>
                {/* Environment downloads an HDRI, wrap in own Suspense so it doesn't block */}
                <Environment preset="city" />
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
