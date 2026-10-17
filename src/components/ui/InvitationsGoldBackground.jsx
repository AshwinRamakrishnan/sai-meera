import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './InvitationsGoldBackground.css';

/* =========================================================================
   QRONOS-EXACT 3D GOLD FILAMENT VORTEX / HOURGLASS BACKGROUND
   Exclusively active on Invitations & Ceremony product pages
   Brand Palette:
     - Pure Dark Space: #000000
     - Primary Metallic Gold: #D4AF37
     - Champagne Highlights: #F5E6A8
     - Warm Golden Luster: #E5C158
     - Antique Gold: #A68026
     - Golden Amber Comets: #FFC837
   ========================================================================= */

const TWO_PI = 2 * Math.PI;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const fovFromZoom = (zoom) => clamp(134 - zoom, 1, 175);
const TICK_INTERVAL = 1 / 30; // 30 fps tick for buffer geometry updates

function easeCubic(val, min, max) {
  if (val <= min) return 0;
  if (val >= max) return 1;
  const t = (val - min) / (max - min);
  return 1 - (1 - t) * (1 - t) * (1 - t);
}

// Monotone cubic spline interpolation for mathematical continuity
function createMonotoneSpline(pts) {
  const n = pts.length;
  const slopes = [];
  for (let i = 0; i < n - 1; i++) {
    slopes[i] = (pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]);
  }
  const m = [slopes[0]];
  for (let i = 1; i < n - 1; i++) {
    m[i] = slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2;
  }
  m[n - 1] = slopes[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(slopes[i]) < 1e-12) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / slopes[i];
    const b = m[i + 1] / slopes[i];
    const sumSq = a * a + b * b;
    if (sumSq > 9) {
      const s = 3 / Math.sqrt(sumSq);
      m[i] = s * a * slopes[i];
      m[i + 1] = s * b * slopes[i];
    }
  }
  return (x) => {
    if (x <= pts[0][0]) return pts[0][1];
    if (x >= pts[n - 1][0]) return pts[n - 1][1];
    let k = 0;
    while (k < n - 2 && pts[k + 1][0] < x) k++;
    const dx = pts[k + 1][0] - pts[k][0];
    const t = (x - pts[k][0]) / dx;
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * pts[k][1] +
      (t3 - 2 * t2 + t) * dx * m[k] +
      (-2 * t3 + 3 * t2) * pts[k + 1][1] +
      (t3 - t2) * dx * m[k + 1]
    );
  };
}

function sampleLUT(splineFn, size = 1024) {
  const lut = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    lut[i] = splineFn(i / (size - 1));
  }
  return lut;
}

function sampleInterpolatedLUT(lut, t) {
  if (t <= 0) return lut[0];
  const last = lut.length - 1;
  if (t >= 1) return lut[last];
  const idxFloat = t * last;
  const idx = idxFloat | 0;
  return lut[idx] + (lut[idx + 1] - lut[idx]) * (idxFloat - idx);
}

// Radial glow texture for comet heads
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 248, 220, 0.95)');
    grad.addColorStop(0.3, 'rgba(245, 230, 168, 0.45)');
    grad.addColorStop(0.7, 'rgba(212, 175, 55, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function InvitationsGoldBackground({
  topRadius = 380,
  waistRadius = 53,
  waistPosition = 50,
  bottomRadius = 1150,
  twist = 3,
  zoom = 75,
  speed = 10,
  direction = 'right',
  lineCount = 240,
  showDots = true,
  dotCount = 3000,
  showComets = true,
  cometCount = 8,
  hoverRepel = true,
}) {
  const containerRef = useRef(null);

  // Reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const configRef = useRef(null);
  configRef.current = {
    floorRadius: bottomRadius / 60,
    waistRadius: waistRadius / 60,
    crownRadius: topRadius / 60,
    waistAt: 1 - waistPosition / 100,
    twist,
    zoom,
    flowDir: direction === 'left' ? -1 : 1,
    flowSpeed: (speed / 100) * (direction === 'left' ? -1 : 1),
    lineCount,
    showDots,
    dotCount,
    showComets,
    cometCount,
    hoverRepel,
    running: !reducedMotion,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create a fresh canvas dynamically to guarantee clean WebGL state
    const canvas = document.createElement('canvas');
    canvas.className = 'cat-invitations-gold-canvas';
    container.insertBefore(canvas, container.firstChild);

    let animFrameId = null;
    let renderer = null;
    let disposables = [];
    let isVisible = true;
    let lastTime = performance.now();
    let startTime = 0;
    let flowAccum = 0;
    let tickAccum = 0;
    let targetRepel = 0;
    let handlePointerMove = null;
    let handlePointerLeave = null;
    let resizeObserver = null;
    let observer = null;

    const track = (obj) => {
      disposables.push(obj);
      return obj;
    };

    try {
      // 1. WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0); // Transparent canvas background
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      // 2. Scene & Camera Setup matching Qronos
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        fovFromZoom(configRef.current.zoom),
        1,
        0.1,
        500
      );
      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // Elevated front-facing camera perspective
      const dist = 5 / Math.tan((67 * Math.PI) / 180 / 2);
      const dir = new THREE.Vector3(3.4, -0.6, 10).normalize();
      const target = new THREE.Vector3(0, 5, 0);
      camera.position.copy(target).addScaledVector(dir, dist);
      camera.lookAt(target);

      // 3. Interactive Repel Uniforms & Custom Shader Hook
      const uniforms = {
        uMouse: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: 1 },
        uRadius: { value: 0.2 },
        uStrength: { value: 0 },
      };

      const hookRepelShader = (material) => {
        material.onBeforeCompile = (shader) => {
          shader.uniforms.uMouse = uniforms.uMouse;
          shader.uniforms.uAspect = uniforms.uAspect;
          shader.uniforms.uRadius = uniforms.uRadius;
          shader.uniforms.uStrength = uniforms.uStrength;
          shader.vertexShader = shader.vertexShader
            .replace(
              'void main() {',
              `
              uniform vec2 uMouse;
              uniform float uAspect;
              uniform float uRadius;
              uniform float uStrength;
              void main() {
              `
            )
            .replace(
              '#include <fog_vertex>',
              `
              #include <fog_vertex>
              if (uStrength > 0.0 && uRadius > 0.0 && gl_Position.w > 0.0) {
                  vec2 ndc = gl_Position.xy / gl_Position.w;
                  vec2 off = ndc - uMouse;
                  float dist = length(off * vec2(uAspect, 1.0));
                  float f = uStrength * exp(-(dist * dist) / (2.0 * uRadius * uRadius));
                  float m = length(off);
                  if (m > 1e-4) {
                      ndc += (off / m) * f;
                      gl_Position.xy = ndc * gl_Position.w;
                  }
              }
              `
            );
        };
        return material;
      };

      // 4. Mathematical Spline Generation
      const cfg = configRef.current;
      const eWaist = clamp(cfg.waistAt, 0.08, 0.92);
      const flR = cfg.floorRadius;
      const crR = cfg.crownRadius;
      const totalTwist = cfg.twist * TWO_PI;

      const radiusLUT = sampleLUT(
        createMonotoneSpline([
          [0, flR],
          [0.24 * eWaist, 0.667 * flR],
          [0.5 * eWaist, 0.3 * flR],
          [0.76 * eWaist, 0.08 * flR],
          [eWaist, cfg.waistRadius],
          [eWaist + 0.3 * (1 - eWaist), 0.2 * crR],
          [eWaist + 0.6 * (1 - eWaist), 0.44 * crR],
          [1, crR],
        ])
      );

      const heightLUT = sampleLUT(
        createMonotoneSpline([
          [0, 0],
          [0.1, 0.2],
          [0.2, 0.8],
          [0.35, 2],
          [0.5, 3.8],
          [0.75, 7],
          [1, 10],
        ])
      );

      const twistLUT = sampleLUT(
        createMonotoneSpline([
          [0, 0],
          [0.15, 0.15 * totalTwist],
          [0.25, 0.25 * totalTwist],
          [0.45, 0.55 * totalTwist],
          [0.6, 0.7 * totalTwist],
          [0.8, 0.88 * totalTwist],
          [1, totalTwist],
        ])
      );

      const writePointFn = (outArr, outOffset, t, lane, flowOffset, wobbleAmp, wobblePhase, time) => {
        const r = sampleInterpolatedLUT(radiusLUT, t);
        const y = sampleInterpolatedLUT(heightLUT, t);
        const theta = sampleInterpolatedLUT(twistLUT, t) + lane + flowOffset;
        const rWobble = r + Math.sin(25 * t + wobblePhase + 0.3 * time) * wobbleAmp * r;
        outArr[outOffset]     = Math.cos(theta) * rWobble;
        outArr[outOffset + 1] = y;
        outArr[outOffset + 2] = Math.sin(theta) * rWobble;
      };

      // 5. Filaments Mesh Setup (Single LineSegments Buffer)
      const SEGMENTS_PER_LINE = 399; // 400 sample points
      const POINTS_PER_LINE = 400;
      const countLines = Math.max(10, Math.round(configRef.current.lineCount));
      const totalSegments = countLines * SEGMENTS_PER_LINE;
      const totalVertices = totalSegments * 2;

      const linePositions = new Float32Array(totalVertices * 3);
      const lineColors = new Float32Array(totalVertices * 3);

      const lineGeo = track(new THREE.BufferGeometry());
      lineGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
      );
      lineGeo.setAttribute(
        'color',
        new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage)
      );

      // Opacity 0.72 with AdditiveBlending ensures floor & waist strands remain rich and distinct
      const lineMat = track(
        hookRepelShader(
          new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.72,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        )
      );

      const lineSegmentsMesh = new THREE.LineSegments(lineGeo, lineMat);
      lineSegmentsMesh.frustumCulled = false;
      rootGroup.add(lineSegmentsMesh);

      // Metallic Gold Palette per strand
      const goldPalette = [
        new THREE.Color('#D4AF37'), // Rich Metallic Gold
        new THREE.Color('#F5E6A8'), // Champagne Highlight
        new THREE.Color('#E5C158'), // Warm Bright Gold
        new THREE.Color('#C59A27'), // Classic Gold
        new THREE.Color('#9B7A23'), // Deep Gold Shadow
      ];

      const strands = [];
      for (let i = 0; i < countLines; i++) {
        strands.push({
          lane: (i / countLines) * TWO_PI,
          speed: 0.95 + 0.1 * Math.random(),
          pulse: Math.random() * TWO_PI,
          wobblePhase: Math.random() * TWO_PI,
          from: 0,
          to: 1,
          bright: 0.5,
          color: goldPalette[i % goldPalette.length],
          offset: i * SEGMENTS_PER_LINE * 6,
          pts: new Float32Array(POINTS_PER_LINE * 3),
          cols: new Float32Array(POINTS_PER_LINE * 3),
        });
      }

      // 6. Instanced Sparkling Micro-Dots
      const totalDots = configRef.current.showDots
        ? Math.max(0, Math.round(configRef.current.dotCount))
        : 0;

      let dotMesh = null;
      const dotInstances = [];
      const dummyMatrix = new THREE.Matrix4();
      const dotColors = new Float32Array(totalDots * 3);
      const dotPositions = new Float32Array(totalDots * 3);
      const CHAMPAGNE_COLOR = new THREE.Color('#F5E6A8');

      if (totalDots > 0) {
        const dotPlaneGeo = track(new THREE.PlaneGeometry(1, 1));
        const dotMat = track(
          hookRepelShader(
            new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.85,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            })
          )
        );

        dotMesh = new THREE.InstancedMesh(dotPlaneGeo, dotMat, totalDots);
        dotMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        dotMesh.instanceColor = new THREE.InstancedBufferAttribute(dotColors, 3);
        dotMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
        dotMesh.frustumCulled = false;
        rootGroup.add(dotMesh);

        for (let i = 0; i < totalDots; i++) {
          const strandIdx = Math.floor(Math.random() * strands.length);
          const s = Math.random() < 0.5 ? 0.2 + 0.4 * Math.random() : 0.05 + 0.9 * Math.random();
          dotInstances.push({
            s,
            strand: strandIdx,
            lane: strands[strandIdx].lane,
            pulse: Math.random() * TWO_PI,
            flickerRate: 0.15 + 4.5 * Math.random(),
            bright: 0.04 + Math.pow(Math.random(), 1.5) * 0.96,
          });
        }
      }

      // 7. Golden Comets Racing along Filaments
      const cometGlowTex = track(createGlowTexture());
      const cometCount = configRef.current.showComets
        ? Math.max(0, Math.round(configRef.current.cometCount))
        : 0;
      const COMET_TAIL_POINTS = 19;
      const comets = [];
      const COMET_GOLD = new THREE.Color('#FFC837');

      for (let i = 0; i < cometCount; i++) {
        const trailPositions = new Float32Array(COMET_TAIL_POINTS * 3);
        const trailColors = new Float32Array(COMET_TAIL_POINTS * 3);

        const cometGeo = track(new THREE.BufferGeometry());
        cometGeo.setAttribute(
          'position',
          new THREE.BufferAttribute(trailPositions, 3).setUsage(THREE.DynamicDrawUsage)
        );
        cometGeo.setAttribute(
          'color',
          new THREE.BufferAttribute(trailColors, 3).setUsage(THREE.DynamicDrawUsage)
        );

        const cometLineMat = track(
          hookRepelShader(
            new THREE.LineBasicMaterial({
              vertexColors: true,
              transparent: true,
              opacity: 0.9,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            })
          )
        );

        const line = new THREE.Line(cometGeo, cometLineMat);
        line.frustumCulled = false;

        const headMat = track(
          new THREE.SpriteMaterial({
            map: cometGlowTex,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: new THREE.Color(1.2 * COMET_GOLD.r, 1.2 * COMET_GOLD.g, 1.2 * COMET_GOLD.b),
          })
        );
        const head = new THREE.Sprite(headMat);
        head.scale.set(0.35, 0.35, 1);

        rootGroup.add(line);
        rootGroup.add(head);

        const st = strands[Math.floor(Math.random() * strands.length)];
        const cometSpeed = 0.09 * (0.7 + 0.6 * Math.random());

        comets.push({
          bright: 0.7 + 0.3 * Math.random(),
          lane: st.lane,
          speed: cometSpeed,
          base: cometSpeed,
          pulse: st.speed,
          wobblePhase: st.wobblePhase,
          racing: false,
          s: 0,
          idle: 0,
          idleFor: 0.4 + (i / Math.max(1, cometCount)) * 8,
          trail: trailPositions,
          trailCol: trailColors,
          geo: cometGeo,
          line,
          head,
        });
      }

      // 8. Viewport Resize Handler
      let currentHeight = 1;
      const handleResize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        currentHeight = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        uniforms.uAspect.value = w / h;
        uniforms.uRadius.value = clamp(60 / (h / 2), 0.01, 3);
      };

      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
      handleResize();

      // 9. Interactive Pointer Repel Handlers (scoped strictly to container)
      handlePointerMove = (e) => {
        const rect = container.getBoundingClientRect();
        if (rect.width && rect.height) {
          uniforms.uMouse.value.set(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -(((e.clientY - rect.top) / rect.height) * 2 - 1)
          );
          targetRepel = configRef.current.hoverRepel && configRef.current.running ? 0.45 : 0;
        }
      };

      handlePointerLeave = () => {
        targetRepel = 0;
      };

      container.addEventListener('pointermove', handlePointerMove, { passive: true });
      container.addEventListener('pointerleave', handlePointerLeave, { passive: true });
      container.addEventListener('pointercancel', handlePointerLeave, { passive: true });

      // 10. Intersection Observer for Performance
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0].isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      // 11. Main Render Animation Loop
      const animate = (now) => {
        animFrameId = requestAnimationFrame(animate);

        const delta = Math.min((now - lastTime) / 1000, 0.04);
        lastTime = now;

        if (!isVisible || !configRef.current.running) {
          return;
        }

        if (startTime === 0) startTime = now;
        const elapsed = (now - startTime) / 1000;
        const currentCfg = configRef.current;

        // Smooth camera FOV if zoom changes
        const targetFov = fovFromZoom(currentCfg.zoom);
        if (camera.fov !== targetFov) {
          camera.fov = targetFov;
          camera.updateProjectionMatrix();
        }

        uniforms.uRadius.value = clamp(60 / (currentHeight / 2), 0.01, 3);
        flowAccum += delta * currentCfg.flowSpeed;

        // Repel strength easing
        const uStrength = uniforms.uStrength;
        uStrength.value += (targetRepel - uStrength.value) * Math.min(1, 12 * delta);

        // Entrance timeline curves matching Qronos
        const uEntrance = easeCubic(elapsed, 0, 2.0);
        const dotEntrance = easeCubic(elapsed, 1.2, 3.0);
        const cometEntrance = easeCubic(elapsed, 2.5, 4.5);

        // Update filaments buffer at 30 fps tick
        tickAccum += delta;
        if (tickAccum >= TICK_INTERVAL) {
          tickAccum -= TICK_INTERVAL;

          for (let sIdx = 0; sIdx < strands.length; sIdx++) {
            const st = strands[sIdx];
            const flowOffset = flowAccum * st.speed;
            const pts = st.pts;
            const cols = st.cols;
            const col = st.color;

            // Qronos Exact Shading Formulations
            const oVal = st.bright * 1.0;
            const lVal = 0.15 + 1.5 * oVal;
            const hVal =
              Math.min(
                0.5 * oVal * (0.9 + 0.1 * Math.sin(0.18 * elapsed + st.pulse)),
                0.7
              ) * Math.min(3 * uEntrance, 1);

            const cCut = st.from + uEntrance * (st.to - st.from);
            const uCut = 0.15 * (st.to - st.from);

            for (let pIdx = 0; pIdx < POINTS_PER_LINE; pIdx++) {
              const param = pIdx / (POINTS_PER_LINE - 1);
              const o3 = pIdx * 3;

              writePointFn(pts, o3, param, st.lane, flowOffset, 0.008, st.wobblePhase, elapsed);

              // Tapering edge fades: crown fades smoothly, floor remains luminous and clearly visible
              let pFade = 1;
              if (param < 0.08) {
                const f = param / 0.08;
                pFade = 0.78 + 0.22 * f; // Maintain strong baseline luminance at floor
              } else if (param > 0.85) {
                const f = (1 - param) / 0.15;
                pFade = f * f;
              }

              // Entrance cutoff
              let fCut = 1;
              if (param > cCut) {
                fCut = 0;
              } else if (param > cCut - uCut) {
                fCut = (cCut - param) / uCut;
                fCut *= fCut;
              }

              // Subtle text-zone attenuation right behind the center text area (waist region)
              // Keeps filaments clearly visible and moving, but reduces glare behind heading
              const waistDist = Math.abs(param - currentCfg.waistAt);
              const textZoneAtten = 0.72 + 0.28 * Math.min(waistDist / 0.15, 1.0);

              // Bottom floor luminance boost: compensates for geometric fanning of strands across wide floor
              const bottomBoost = param < 0.45 ? 1.0 + 1.6 * Math.pow((0.45 - param) / 0.45, 1.15) : 1.0;

              const g = pFade * lVal * fCut * hVal * textZoneAtten * bottomBoost;
              cols[o3]     = col.r * g;
              cols[o3 + 1] = col.g * g;
              cols[o3 + 2] = col.b * g;
            }

            // Copy to LineSegments interleaved buffer
            let segOffset = st.offset;
            for (let seg = 0; seg < SEGMENTS_PER_LINE; seg++) {
              const iA = seg * 3;
              const iB = (seg + 1) * 3;

              linePositions[segOffset]     = pts[iA];
              linePositions[segOffset + 1] = pts[iA + 1];
              linePositions[segOffset + 2] = pts[iA + 2];
              lineColors[segOffset]        = cols[iA];
              lineColors[segOffset + 1]    = cols[iA + 1];
              lineColors[segOffset + 2]    = cols[iA + 2];

              linePositions[segOffset + 3] = pts[iB];
              linePositions[segOffset + 4] = pts[iB + 1];
              linePositions[segOffset + 5] = pts[iB + 2];
              lineColors[segOffset + 3]    = cols[iB];
              lineColors[segOffset + 4]    = cols[iB + 1];
              lineColors[segOffset + 5]    = cols[iB + 2];

              segOffset += 6;
            }
          }

          lineGeo.attributes.position.needsUpdate = true;
          lineGeo.attributes.color.needsUpdate = true;
        }

        // Update Instanced Micro-Dots
        if (dotMesh && totalDots > 0) {
          const dotSize = 0.02; // matching Qronos
          for (let d = 0; d < totalDots; d++) {
            const inst = dotInstances[d];
            const st = strands[inst.strand] || strands[0];
            const flowOffset = flowAccum * st.speed;
            const o3 = d * 3;

            writePointFn(dotPositions, o3, inst.s, inst.lane, flowOffset, 0.008, st.wobblePhase, elapsed);

            const scale = dotSize * dotEntrance;
            dummyMatrix.makeScale(scale, scale, scale);
            dummyMatrix.setPosition(dotPositions[o3], dotPositions[o3 + 1], dotPositions[o3 + 2]);
            dotMesh.setMatrixAt(d, dummyMatrix);

            const flicker =
              1 -
              0.5 +
              0.5 *
                (0.08 +
                  0.92 *
                    Math.pow(Math.max(0, Math.sin(elapsed * inst.flickerRate + inst.pulse)), 2.5));
            const intensity = inst.bright * flicker * 2.5 * dotEntrance;

            dotColors[o3]     = CHAMPAGNE_COLOR.r * intensity;
            dotColors[o3 + 1] = CHAMPAGNE_COLOR.g * intensity;
            dotColors[o3 + 2] = CHAMPAGNE_COLOR.b * intensity;
          }

          dotMesh.instanceMatrix.needsUpdate = true;
          if (dotMesh.instanceColor) dotMesh.instanceColor.needsUpdate = true;
          dotMesh.material.opacity = 0.85 * dotEntrance;
        }

        // Update Golden Comets
        for (let c = 0; c < comets.length; c++) {
          const cm = comets[c];
          const tailLen = cm.trail.length / 3;

          if (!cm.racing) {
            cm.head.material.opacity = 0;
            if (cometEntrance < 0.3) continue;
            cm.idle += delta;
            if (cm.idle > cm.idleFor) {
              cm.racing = true;
              cm.s = currentCfg.flowDir < 0 ? 0.95 : 0.03;
              cm.base = 0.09 * (0.7 + 0.6 * Math.random());
              cm.speed = cm.base;
              const st = strands[Math.floor(Math.random() * strands.length)];
              cm.lane = st.lane;
              cm.pulse = st.speed;
              cm.wobblePhase = st.wobblePhase;
            }
            continue;
          }

          cm.s += delta * cm.speed * currentCfg.flowDir;
          if (currentCfg.flowDir < 0 ? cm.s < 0.03 : cm.s > 0.95) {
            cm.racing = false;
            cm.idle = 0;
            cm.idleFor = 8 * (0.6 + 0.8 * Math.random());
            cm.trailCol.fill(0);
            cm.geo.attributes.color.needsUpdate = true;
            cm.head.material.opacity = 0;
            continue;
          }

          const cometFlow = flowAccum * cm.pulse;
          const hFactor =
            clamp((cm.s - 0.03) / 0.1, 0, 1) * clamp((0.95 - cm.s) / 0.1, 0, 1);

          for (let k = 0; k < tailLen; k++) {
            const param = clamp(cm.s - 0.005 * k * currentCfg.flowDir, 0.005, 0.995);
            const k3 = k * 3;
            writePointFn(cm.trail, k3, param, cm.lane, cometFlow, 0.008, cm.wobblePhase, elapsed);

            const falloff = Math.pow(1 - k / tailLen, 2);
            const bright = cm.bright * 1.5 * falloff * hFactor;
            const pAmp = cometEntrance * (k < 3 ? 1.3 : 1);

            cm.trailCol[k3]     = COMET_GOLD.r * bright * pAmp;
            cm.trailCol[k3 + 1] = COMET_GOLD.g * bright * pAmp;
            cm.trailCol[k3 + 2] = COMET_GOLD.b * bright * pAmp;
          }

          cm.head.position.set(cm.trail[0], cm.trail[1], cm.trail[2]);
          cm.head.material.opacity = 0.35 * hFactor * cometEntrance;
          cm.head.scale.set(0.35, 0.35, 1);
          cm.geo.attributes.position.needsUpdate = true;
          cm.geo.attributes.color.needsUpdate = true;
        }

        renderer.render(scene, camera);
      };

      // Kick off animation loop
      animFrameId = requestAnimationFrame(animate);

    } catch (err) {
      console.warn('[InvitationsGoldBackground] WebGL initialization failed:', err);
    }

    // Cleanup on unmount
    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (handlePointerMove) container.removeEventListener('pointermove', handlePointerMove);
      if (handlePointerLeave) {
        container.removeEventListener('pointerleave', handlePointerLeave);
        container.removeEventListener('pointercancel', handlePointerLeave);
      }
      if (resizeObserver) resizeObserver.disconnect();
      if (observer) observer.disconnect();

      for (const obj of disposables) {
        try {
          if (obj.dispose) obj.dispose();
        } catch (e) {}
      }

      if (renderer) {
        try {
          renderer.dispose();
        } catch (e) {}
      }

      // Remove the dynamically appended canvas safely
      if (container && canvas && container.contains(canvas)) {
        try {
          container.removeChild(canvas);
        } catch (e) {}
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="cat-invitations-gold-bg"
      aria-hidden="true"
    >
      {/* Subtle gold lighting overlay & bottom gradient fade into content */}
      <div className="qronos-gold-vortex-overlay" />
      <div className="qronos-gold-bottom-fade" />
    </div>
  );
}
