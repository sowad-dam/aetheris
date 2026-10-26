'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useControls, folder } from 'leva';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TelemetryCoordinates {
  x: number; y: number; z: number;
  rotX: number; rotY: number; fps: number;
}

interface Scene3DProps {
  onCoordinateUpdate?: (c: TelemetryCoordinates) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const C_CERULEAN = new THREE.Color(0x00a4e4);
const C_ROSE     = new THREE.Color(0xff007f);
const C_WHITE    = new THREE.Color(0xffffff);

// ─── Component ────────────────────────────────────────────────────────────────
export default function Scene3D({ onCoordinateUpdate }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Leva live-tweak panel ─────────────────────────────────────────────────
  const {
    rotSpeed,
    ringCount,
    metalness,
    roughness,
    ceruleanIntensity,
    roseIntensity,
  } = useControls('Aetheris · Core', {
    'Rotation Speed': folder({
      rotSpeed: { value: 0.32, min: 0.05, max: 2.0, step: 0.01, label: 'Base Speed' },
    }),
    'Geometry': folder({
      ringCount: { value: 5, min: 2, max: 9, step: 1, label: 'Orbital Rings' },
    }),
    'Material': folder({
      metalness:  { value: 0.95, min: 0, max: 1, step: 0.01 },
      roughness:  { value: 0.10, min: 0, max: 1, step: 0.01 },
    }),
    'Lighting': folder({
      ceruleanIntensity: { value: 3.8, min: 0, max: 10, step: 0.1, label: 'Cerulean' },
      roseIntensity:     { value: 2.2, min: 0, max: 10, step: 0.1, label: 'Neon Rose' },
    }),
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer — performance-locked ─────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    const dpr = Math.min(window.devicePixelRatio, 1.5); // clamp DPR
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = false; // shadows removed for 60 FPS
    container.appendChild(renderer.domElement);

    // ── Scene & Camera ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08080a, 0.028);

    const camera = new THREE.PerspectiveCamera(
      42, window.innerWidth / window.innerHeight, 0.1, 80
    );
    camera.position.set(0, 0, 7.5);

    // ── Core container ─────────────────────────────────────────────────────
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // ── Shared MeshPhysicalMaterial (spec requirement) ─────────────────────
    const coreMat = new THREE.MeshPhysicalMaterial({
      color:           0x0a1828,
      metalness,
      roughness,
      clearcoat:       1.0,
      clearcoatRoughness: 0.12,
      transmission:    0.2,
      ior:             1.5,
      emissive:        C_CERULEAN,
      emissiveIntensity: 0.55,
      side: THREE.FrontSide,
    });

    // ── INNER GLOWING SPHERE ───────────────────────────────────────────────
    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.68, 64, 64),
      new THREE.MeshPhysicalMaterial({
        color:       0x001428,
        emissive:    C_CERULEAN,
        emissiveIntensity: 1.8,
        metalness:   0.7,
        roughness:   0.15,
        clearcoat:   1.0,
        transparent: true,
        opacity:     0.92,
      })
    );
    innerSphere.frustumCulled = true;
    coreGroup.add(innerSphere);

    // ── Soft rose halo around the inner sphere ─────────────────────────────
    const haloBallMat = new THREE.MeshStandardMaterial({
      color: C_ROSE,
      emissive: C_ROSE,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const haloBall = new THREE.Mesh(new THREE.SphereGeometry(0.78, 32, 32), haloBallMat);
    haloBall.frustumCulled = true;
    coreGroup.add(haloBall);

    // ── WIREFRAME ICOSAHEDRON OUTER CAGE ──────────────────────────────────
    const icosaGeo = new THREE.IcosahedronGeometry(1.28, 1);
    const icosaMat = new THREE.MeshStandardMaterial({
      color: 0x00a4e4,
      emissive: C_CERULEAN,
      emissiveIntensity: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const icosahedron = new THREE.Mesh(icosaGeo, icosaMat);
    icosahedron.frustumCulled = true;
    coreGroup.add(icosahedron);

    // ── CONCENTRIC ORBITAL RINGS ───────────────────────────────────────────
    // Slim tube radius ~0.02 as specified
    const rings: THREE.Mesh[] = [];

    const buildRings = (count: number) => {
      // Remove old rings
      rings.forEach(r => coreGroup.remove(r));
      rings.length = 0;

      const baseRadius = 2.0;
      const radiusStep = 0.38;

      for (let i = 0; i < count; i++) {
        const radius = baseRadius + i * radiusStep;
        const isRose = i % 2 !== 0;

        const ringGeo = new THREE.TorusGeometry(radius, 0.018, 16, 180);
        const ringMat = new THREE.MeshPhysicalMaterial({
          color:             isRose ? 0x3d0020 : 0x001a2e,
          metalness:         0.98,
          roughness:         0.05,
          clearcoat:         1.0,
          emissive:          isRose ? C_ROSE : C_CERULEAN,
          emissiveIntensity: isRose ? 0.6 : 0.8,
          transparent:       true,
          opacity:           isRose ? 0.72 : 0.85,
        });

        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.frustumCulled = true;

        // Unique orientation per ring
        const angleX = (i * Math.PI) / count + Math.PI / 6;
        const angleY = (i * Math.PI * 0.618); // golden-ratio spread
        ring.rotation.set(angleX, angleY, 0);

        rings.push(ring);
        coreGroup.add(ring);
      }
    };

    buildRings(ringCount);

    // ── PARTICLE CYBER-DUST FIELD ──────────────────────────────────────────
    const PARTICLE_COUNT = 1600;
    const partGeo = new THREE.BufferGeometry();
    const partPos  = new Float32Array(PARTICLE_COUNT * 3);
    const partCol  = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      partPos[i * 3]     = (Math.random() - 0.5) * 30;
      partPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const c = Math.random() > 0.5 ? C_CERULEAN : C_ROSE;
      partCol[i * 3]     = c.r;
      partCol[i * 3 + 1] = c.g;
      partCol[i * 3 + 2] = c.b;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    partGeo.setAttribute('color',    new THREE.BufferAttribute(partCol, 3));

    const partMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(partGeo, partMat);
    particles.frustumCulled = true;
    scene.add(particles);

    // ── LIGHTING ───────────────────────────────────────────────────────────
    // 1. Mouse-tracking Cerulean point light
    const cerLight = new THREE.PointLight(0x00a4e4, ceruleanIntensity, 20, 1.4);
    cerLight.position.set(0, 0, 4);
    scene.add(cerLight);

    // 2. Neon Rose rim light (directional)
    const roseLight = new THREE.DirectionalLight(0xff007f, roseIntensity);
    roseLight.position.set(-6, 7, -3);
    scene.add(roseLight);

    // 3. Soft white fill
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(6, -4, 2);
    scene.add(fillLight);

    // 4. Ambient
    scene.add(new THREE.AmbientLight(0x0c1830, 1.6));

    // 5. Core pulsing inner light
    const coreLight = new THREE.PointLight(0x00a4e4, 2.4, 5.5);
    coreGroup.add(coreLight);

    // ── GLTF Optional Loader ───────────────────────────────────────────────
    new GLTFLoader().load(
      '/models/core.glb',
      (gltf) => {
        innerSphere.visible = false;
        icosahedron.visible = false;
        const model = gltf.scene;
        model.scale.setScalar(1.4);
        model.traverse((c) => {
          if ((c as THREE.Mesh).isMesh) {
            (c as THREE.Mesh).material = coreMat;
            c.frustumCulled = true;
          }
        });
        coreGroup.add(model);
      },
      undefined,
      () => { /* procedural fallback is already visible */ }
    );

    // ── Scroll stage targets ───────────────────────────────────────────────
    const mob = () => window.innerWidth < 768;

    const stages = () => ({
      s1: { px: 0,    py: 0,    pz: 0,    sc: 1.00 },
      s2: { px: mob() ? 0 : 2.2,  py: mob() ? 1.4 : 0,  pz: mob() ? -2.0 : -1.0, sc: mob() ? 0.62 : 0.76 },
      s3: { px: mob() ? 0 : -2.5, py: mob() ? 1.3 : -0.5, pz: mob() ? -2.0 : 0.5, sc: mob() ? 0.64 : 0.84 },
      s4: { px: 0,    py: mob() ? 0.9 : 0, pz: mob() ? -3.4 : -3.0, sc: mob() ? 0.54 : 0.70 },
    });

    const curPos   = new THREE.Vector3(0, 0, 0);
    const tgtPos   = new THREE.Vector3(0, 0, 0);
    let   curScale = 1.0;
    let   tgtScale = 1.0;

    const scrollProgress = { v: 0 };

    const applyStage = (p: number) => {
      const S = stages();
      let a: typeof S.s1, b: typeof S.s1, t: number;

      if (p <= 0.33)       { a = S.s1; b = S.s2; t = p / 0.33; }
      else if (p <= 0.66)  { a = S.s2; b = S.s3; t = (p - 0.33) / 0.33; }
      else                 { a = S.s3; b = S.s4; t = (p - 0.66) / 0.34; }

      const et = THREE.MathUtils.smoothstep(t, 0, 1);
      tgtPos.set(
        THREE.MathUtils.lerp(a.px, b.px, et),
        THREE.MathUtils.lerp(a.py, b.py, et),
        THREE.MathUtils.lerp(a.pz, b.pz, et),
      );
      tgtScale = THREE.MathUtils.lerp(a.sc, b.sc, et);
    };

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.0,
      onUpdate: (self) => {
        scrollProgress.v = self.progress;
        applyStage(self.progress);
      },
    });

    // ── Mouse tracking — throttled lerp alpha 0.05 (spec) ─────────────────
    const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      applyStage(scrollProgress.v);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // ── 60 FPS Render loop ─────────────────────────────────────────────────
    let rafId: number;
    let lastT = performance.now();
    let frames = 0;
    let fps = 60;
    const clock = new THREE.Clock();

    const render = () => {
      rafId = requestAnimationFrame(render);

      const t  = clock.getElapsedTime();

      // FPS meter
      frames++;
      const now = performance.now();
      if (now - lastT >= 1000) {
        fps = Math.round((frames * 1000) / (now - lastT));
        frames = 0; lastT = now;
      }

      // Mouse lerp — alpha 0.05 as specified
      mouse.cx = THREE.MathUtils.lerp(mouse.cx, mouse.tx, 0.05);
      mouse.cy = THREE.MathUtils.lerp(mouse.cy, mouse.ty, 0.05);

      // Update Cerulean mouse-tracking point light
      cerLight.position.x = mouse.cx * 5.0;
      cerLight.position.y = mouse.cy * 3.5;
      cerLight.intensity = ceruleanIntensity;
      roseLight.intensity = roseIntensity;

      // Lerp core position & scale (smooth)
      curPos.lerp(tgtPos, 0.07);
      curScale = THREE.MathUtils.lerp(curScale, tgtScale, 0.07);

      // Breathing
      const breath  = Math.sin(t * 1.5) * 0.10;
      const breathS = Math.cos(t * 1.5) * 0.018;

      coreGroup.position.set(curPos.x, curPos.y + breath, curPos.z);
      const s = curScale + breathS;
      coreGroup.scale.setScalar(s);

      // Inner sphere subtle pulse
      innerSphere.rotation.y = t * 0.22;
      innerSphere.rotation.x = t * 0.14;

      // Icosahedron cage counter-rotation
      icosahedron.rotation.x = -t * 0.18;
      icosahedron.rotation.y =  t * 0.28 + mouse.cx * 0.25;

      // Orbital rings — varied speeds per ring, per Leva rotSpeed
      rings.forEach((ring, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const spd = rotSpeed * (0.5 + i * 0.18);
        ring.rotation.z += dir * spd * 0.01;
        ring.rotation.x += dir * spd * 0.006;
      });

      // Rebuild rings if Leva ringCount changed
      if (rings.length !== ringCount) buildRings(ringCount);

      // Particle drift
      particles.rotation.y = t * 0.018;
      particles.rotation.x = Math.sin(t * 0.012) * 0.04;

      // Core pulsing glow
      coreLight.intensity = 2.0 + Math.sin(t * 2.8) * 0.9;

      // Camera micro-parallax from mouse (throttled alpha 0.05)
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.cx * 0.35, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.cy * 0.22, 0.05);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      // Broadcast telemetry (every ~10 frames to avoid overhead)
      if (onCoordinateUpdate && frames % 10 === 0) {
        onCoordinateUpdate({
          x: parseFloat(coreGroup.position.x.toFixed(2)),
          y: parseFloat(coreGroup.position.y.toFixed(2)),
          z: parseFloat(coreGroup.position.z.toFixed(2)),
          rotX: parseFloat(icosahedron.rotation.x.toFixed(2)),
          rotY: parseFloat(icosahedron.rotation.y.toFixed(2)),
          fps,
        });
      }
    };

    render();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      trigger.kill();

      // Dispose geometries & materials
      [innerSphere, haloBall, icosahedron, ...rings].forEach((m) => {
        m.geometry.dispose();
        if (Array.isArray(m.material)) m.material.forEach(x => x.dispose());
        else m.material.dispose();
      });
      partGeo.dispose(); partMat.dispose();
      coreMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotSpeed, ringCount, metalness, roughness, ceruleanIntensity, roseIntensity]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
