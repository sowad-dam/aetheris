'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { scrollState } from '@/lib/scrollState';

// ── ISOLATED GLOBAL POINTER TRACKER (ZERO REFLOW / ZERO HIT-TESTING) ──
const globalPointer = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      globalPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
}

// ── 1. PROCEDURAL STUDIO LIGHTING RIG ──
// Directional Key Light + Behind-and-Above Silhouette Rim Spotlight + Neon Red Accent
function StudioLighting() {
  const pointerLightRef = useRef<THREE.PointLight>(null!);

  useFrame((_, delta) => {
    // Direct ref mutation only (zero React state updates)
    if (pointerLightRef.current) {
      pointerLightRef.current.position.x = THREE.MathUtils.damp(
        pointerLightRef.current.position.x,
        globalPointer.x * 3.6,
        7,
        delta
      );
      pointerLightRef.current.position.y = THREE.MathUtils.damp(
        pointerLightRef.current.position.y,
        globalPointer.y * 2.6,
        7,
        delta
      );
    }
  });

  return (
    <>
      {/* Front Specular Key Light: Illuminates metallic faceting */}
      <directionalLight
        position={[-4.5, 5.5, 4.5]}
        intensity={5.2}
        color="#ffffff"
      />

      {/* Razor-sharp Specular Rim Spotlight placed directly behind and slightly above the bot */}
      <directionalLight
        position={[0, 3.8, -4.5]}
        intensity={4.5}
        color="#ffffff"
      />

      {/* 10% Vivid Accent Rim Light: Cyberpunk Neon Red / Rose (#ff0055) */}
      <directionalLight
        position={[5.5, -1.0, -3.0]}
        intensity={8.0}
        color="#ff0055"
      />

      {/* Left Specular Rim Light: Cool Monochromatic Platinum */}
      <directionalLight
        position={[-4.5, 1.8, -3.5]}
        intensity={4.0}
        color="#e2e8f0"
      />

      {/* Top Studio Rim Light */}
      <directionalLight
        position={[0, 6.5, -1.5]}
        intensity={2.8}
        color="#cbd5e1"
      />

      {/* Deep Obsidian Ambient Fill */}
      <ambientLight intensity={0.88} color="#151724" />

      {/* Interactive Cursor Point Light */}
      <pointLight
        ref={pointerLightRef}
        position={[0, 0, 4.4]}
        intensity={2.8}
        color="#ffffff"
        distance={14}
        decay={1.8}
      />
    </>
  );
}

// ── 2. HYPER-GLOSSY CYBERNETIC BOT (REFERENCE 1 AESTHETIC) ──
function CyberneticHeroBot() {
  const headGroupRef = useRef<THREE.Group>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const bodyRef = useRef<THREE.Group>(null!);

  // 1. Primary Body Shell: High-sheen Liquid Obsidian Chrome / Polished Titanium Gunmetal
  // Base color: Crisp deep metallic gray (#202230) with metalness: 0.95, roughness: 0.12, clearcoat: 1.0, clearcoatRoughness: 0.05
  const primaryBodyMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#202230'),
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.98,
    });
  }, []);

  // 2. Structural Insets & Joints: Deep Matte Obsidian (#0a0a0f) to carve clear geometric muscle separation
  const matteObsidianMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0a0a0f'),
      metalness: 0.35,
      roughness: 0.75,
    });
  }, []);

  // 3. Polished Platinum Chrome Armor Plates
  const chromeArmorMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#384058'),
      metalness: 0.98,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });
  }, []);

  // 4. Dark curved glass visor plate
  const visorGlassMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a0d18'),
      metalness: 0.2,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      transmission: 0.55,
      transparent: true,
      opacity: 0.88,
    });
  }, []);

  // 5. Vivid Emissive Elements (Strict 10% Accent): Neon Rose / Cyberpunk Red (#ff0055)
  // eye visors, ear audio-rings, and chest energy conduits with emissiveIntensity: 3.8
  const neonAccentMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#400014'),
      emissive: new THREE.Color('#ff0055'),
      emissiveIntensity: 3.8,
      roughness: 0.05,
    });
  }, []);

  // Floating Halo Orbital Ring
  const haloRingMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#22283e'),
      metalness: 0.98,
      roughness: 0.05,
      clearcoat: 1.0,
      emissive: new THREE.Color('#ff0055'),
      emissiveIntensity: 0.55,
    });
  }, []);

  useFrame((state, delta) => {
    // ── CURSOR-ANCHORED LOOK-AT (DAMPED LERP) ──
    const targetX = (globalPointer.x * Math.PI) / 4;
    const targetY = (globalPointer.y * Math.PI) / 6;

    // Head rotation
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = THREE.MathUtils.damp(
        headGroupRef.current.rotation.y,
        targetX,
        5.5,
        delta
      );
      headGroupRef.current.rotation.x = THREE.MathUtils.damp(
        headGroupRef.current.rotation.x,
        -targetY,
        5.5,
        delta
      );
    }

    // Upper Torso subtle follow
    if (bodyRef.current) {
      bodyRef.current.rotation.y = THREE.MathUtils.damp(
        bodyRef.current.rotation.y,
        targetX * 0.28,
        4.5,
        delta
      );
      bodyRef.current.rotation.x = THREE.MathUtils.damp(
        bodyRef.current.rotation.x,
        -targetY * 0.16,
        4.5,
        delta
      );
    }

    // Floating Halo gentle orbital spin & float
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.45;
      haloRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
      haloRef.current.position.y = 0.82 + Math.sin(state.clock.elapsedTime * 1.6) * 0.025;
    }

    // Dynamic energy conduit pulse around 3.8
    neonAccentMat.emissiveIntensity = 3.8 + Math.sin(state.clock.elapsedTime * 3.8) * 0.5;
  });

  return (
    <group position={[0, -0.22, 0]} scale={0.96}>
      {/* ── TORSO & ILLUMINATED CORE CHANNELS ── */}
      <group ref={bodyRef}>
        {/* Main Polished Titanium Body Shell */}
        <RoundedBox
          args={[1.18, 1.02, 0.68]}
          radius={0.18}
          smoothness={8}
          material={primaryBodyMat}
          position={[0, -0.44, 0]}
          frustumCulled
        />

        {/* Structural Inset: Deep Matte Obsidian Abdominal Girdle */}
        <RoundedBox
          args={[0.92, 0.24, 0.7]}
          radius={0.06}
          smoothness={4}
          material={matteObsidianMat}
          position={[0, -0.84, 0]}
          frustumCulled
        />

        {/* Neck Articulated Joint: Deep Matte Obsidian */}
        <mesh position={[0, 0.08, 0]} material={matteObsidianMat}>
          <cylinderGeometry args={[0.22, 0.26, 0.16, 32]} />
        </mesh>

        {/* Chest Armor Bezel Frame: Polished Chrome */}
        <mesh position={[0, -0.32, 0.35]} rotation={[Math.PI / 2, 0, 0]} material={chromeArmorMat}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
        </mesh>

        {/* Central Glowing Arc Reactor Core: Neon Rose (#ff0055) */}
        <mesh position={[0, -0.32, 0.37]} material={neonAccentMat}>
          <sphereGeometry args={[0.09, 24, 24]} />
        </mesh>

        {/* Chest Recessed Inset Plate: Deep Matte Obsidian */}
        <RoundedBox
          args={[0.62, 0.52, 0.02]}
          radius={0.04}
          smoothness={4}
          material={matteObsidianMat}
          position={[0, -0.46, 0.35]}
          frustumCulled
        />

        {/* Illuminated Core Channel: Vertical Conduit Spine */}
        <RoundedBox
          args={[0.04, 0.44, 0.025]}
          radius={0.015}
          smoothness={4}
          material={neonAccentMat}
          position={[0, -0.58, 0.365]}
          frustumCulled
        />

        {/* Illuminated Core Channels: Lateral Rib Grooves Left & Right */}
        <RoundedBox
          args={[0.26, 0.035, 0.025]}
          radius={0.012}
          smoothness={4}
          material={neonAccentMat}
          position={[-0.22, -0.38, 0.365]}
          rotation={[0, 0, 0.18]}
          frustumCulled
        />
        <RoundedBox
          args={[0.26, 0.035, 0.025]}
          radius={0.012}
          smoothness={4}
          material={neonAccentMat}
          position={[0.22, -0.38, 0.365]}
          rotation={[0, 0, -0.18]}
          frustumCulled
        />
        <RoundedBox
          args={[0.22, 0.03, 0.025]}
          radius={0.012}
          smoothness={4}
          material={neonAccentMat}
          position={[-0.2, -0.48, 0.365]}
          rotation={[0, 0, 0.14]}
          frustumCulled
        />
        <RoundedBox
          args={[0.22, 0.03, 0.025]}
          radius={0.012}
          smoothness={4}
          material={neonAccentMat}
          position={[0.2, -0.48, 0.365]}
          rotation={[0, 0, -0.14]}
          frustumCulled
        />

        {/* Shoulder Insets: Deep Matte Obsidian Sockets */}
        <mesh position={[-0.66, -0.14, 0]} rotation={[0, 0, Math.PI / 2]} material={matteObsidianMat}>
          <cylinderGeometry args={[0.16, 0.16, 0.1, 32]} />
        </mesh>
        <mesh position={[0.66, -0.14, 0]} rotation={[0, 0, Math.PI / 2]} material={matteObsidianMat}>
          <cylinderGeometry args={[0.16, 0.16, 0.1, 32]} />
        </mesh>

        {/* Chamfered Shoulder Couplings: Polished Titanium Gunmetal */}
        <RoundedBox
          args={[0.32, 0.26, 0.54]}
          radius={0.09}
          smoothness={6}
          material={primaryBodyMat}
          position={[-0.76, -0.14, 0]}
          frustumCulled
        />
        <RoundedBox
          args={[0.32, 0.26, 0.54]}
          radius={0.09}
          smoothness={6}
          material={primaryBodyMat}
          position={[0.76, -0.14, 0]}
          frustumCulled
        />
      </group>

      {/* ── HEAD & VISOR (LOOK-AT ROOT) ── */}
      <group ref={headGroupRef} position={[0, 0.44, 0]}>
        {/* Chamfered Titanium Gunmetal Head Shell */}
        <RoundedBox
          args={[0.92, 0.78, 0.72]}
          radius={0.22}
          smoothness={10}
          material={primaryBodyMat}
          position={[0, 0.16, 0]}
          frustumCulled
        />

        {/* Structural Inset: Matte Obsidian Temples */}
        <RoundedBox
          args={[0.94, 0.2, 0.5]}
          radius={0.06}
          smoothness={4}
          material={matteObsidianMat}
          position={[0, 0.26, 0.05]}
          frustumCulled
        />

        {/* Ear Audio-Rings: Chrome Cylinders with Glowing Neon Rose Accent */}
        <mesh position={[-0.49, 0.16, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeArmorMat}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 32]} />
        </mesh>
        <mesh position={[-0.54, 0.16, 0]} rotation={[0, 0, Math.PI / 2]} material={neonAccentMat}>
          <cylinderGeometry args={[0.06, 0.06, 0.025, 24]} />
        </mesh>

        <mesh position={[0.49, 0.16, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeArmorMat}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 32]} />
        </mesh>
        <mesh position={[0.54, 0.16, 0]} rotation={[0, 0, Math.PI / 2]} material={neonAccentMat}>
          <cylinderGeometry args={[0.06, 0.06, 0.025, 24]} />
        </mesh>

        {/* Dark Curved Glass Visor Plate */}
        <RoundedBox
          args={[0.74, 0.36, 0.14]}
          radius={0.08}
          smoothness={8}
          material={visorGlassMat}
          position={[0, 0.16, 0.36]}
          frustumCulled
        />

        {/* Visor Frame Inset: Deep Matte Obsidian */}
        <RoundedBox
          args={[0.78, 0.4, 0.04]}
          radius={0.09}
          smoothness={6}
          material={matteObsidianMat}
          position={[0, 0.16, 0.33]}
          frustumCulled
        />

        {/* Forehead Sensor Gem: Neon Rose (#ff0055) */}
        <mesh position={[0, 0.42, 0.35]} material={neonAccentMat}>
          <boxGeometry args={[0.08, 0.04, 0.03]} />
        </mesh>

        {/* Glowing Eye Visors: Neon Rose / Cyberpunk Red (#ff0055) with emissiveIntensity: 3.8 */}
        <mesh position={[-0.17, 0.16, 0.395]} material={neonAccentMat}>
          <capsuleGeometry args={[0.045, 0.09, 12, 16]} />
        </mesh>
        <mesh position={[0.17, 0.16, 0.395]} material={neonAccentMat}>
          <capsuleGeometry args={[0.045, 0.09, 12, 16]} />
        </mesh>

        {/* Floating Halo Orbital Ring */}
        <mesh
          ref={haloRef}
          position={[0, 0.82, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={haloRingMat}
          frustumCulled
        >
          <torusGeometry args={[0.58, 0.018, 16, 80]} />
        </mesh>
      </group>
    </group>
  );
}

// ── 3. SCROLL-LINKED SMOOTH GLIDING TO RIGHT QUADRANT (+2.6 X) ──
function UnifiedBotScene() {
  const botRootRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (!botRootRef.current) return;

    // Read direct scroll progress without triggering React component re-renders
    const p = THREE.MathUtils.clamp(scrollState.progress, 0, 1);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    // Hero Section: Bot sits poised in center stage (X: 0, Scale: 1.0)
    // Scroll Transition: Interpolates smoothly from 0 (center) to +2.6 (right quadrant), scaling from 1.0 to 0.78
    const heroExit = THREE.MathUtils.clamp(p / 0.24, 0, 1);
    const eased = THREE.MathUtils.smoothstep(heroExit, 0, 1);

    const targetX = isMobile ? 0 : THREE.MathUtils.lerp(0, 2.6, eased);
    const targetScale = isMobile
      ? THREE.MathUtils.lerp(0.85, 0.68, eased)
      : THREE.MathUtils.lerp(1.0, 0.78, eased);
    const targetY = isMobile
      ? THREE.MathUtils.lerp(-0.15, 0.75, eased)
      : THREE.MathUtils.lerp(-0.18, -0.05, eased);
    const targetZ = isMobile
      ? THREE.MathUtils.lerp(0, -0.8, eased)
      : THREE.MathUtils.lerp(0, -0.4, eased);
    const targetTiltZ = isMobile ? 0 : THREE.MathUtils.lerp(0, 0.06, eased);

    // Damped interpolation applied directly to Three.js group ref
    botRootRef.current.position.x = THREE.MathUtils.damp(
      botRootRef.current.position.x,
      targetX,
      5.5,
      delta
    );
    botRootRef.current.position.y = THREE.MathUtils.damp(
      botRootRef.current.position.y,
      targetY,
      5.5,
      delta
    );
    botRootRef.current.position.z = THREE.MathUtils.damp(
      botRootRef.current.position.z,
      targetZ,
      5.5,
      delta
    );

    botRootRef.current.rotation.z = THREE.MathUtils.damp(
      botRootRef.current.rotation.z,
      targetTiltZ,
      5.5,
      delta
    );

    const currentScale = botRootRef.current.scale.x;
    const nextScale = THREE.MathUtils.damp(currentScale, targetScale, 5.5, delta);
    botRootRef.current.scale.set(nextScale, nextScale, nextScale);
  });

  return (
    <group ref={botRootRef}>
      <Float speed={1.1} rotationIntensity={0.02} floatIntensity={0.15}>
        <CyberneticHeroBot />
      </Float>
    </group>
  );
}

// ── 4. EXPORTED CANVAS SCENE (FORCE GPU HARDWARE RASTERIZATION) ──
export default function Hero3DObject() {
  return (
    <div className="w-full h-full pointer-events-none hardware-composited-frame">
      <Canvas
        gl={{
          powerPreference: 'high-performance',
          antialias: false,
          stencil: false,
          depth: true,
          alpha: true,
        }}
        dpr={[1, 1.25]}
        camera={{ position: [0, 0.05, 5.2], fov: 42 }}
        className="w-full h-full pointer-events-none"
      >
        <React.Suspense fallback={null}>
          {/* Procedural Lighting Rig with behind-and-above rim spotlight */}
          <StudioLighting />

          {/* Unified Cybernetic Bot Scene with Smooth Scroll-to-Right Choreography */}
          <UnifiedBotScene />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
