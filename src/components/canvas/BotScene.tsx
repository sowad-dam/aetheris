'use client';

import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, folder } from 'leva';

// ─── Types ────────────────────────────────────────────────────────
export interface TelemetryCoords {
  x: number; y: number; z: number; fps: number;
}

interface BotSceneProps {
  onUpdate?: (c: TelemetryCoords) => void;
}

// ─── Floating cosmic particle dust ────────────────────────────────
function CosmicDust() {
  const ref = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const N = 900;
    const positions = new Float32Array(N * 3);
    const colors    = new Float32Array(N * 3);
    const cerulean  = new THREE.Color(0x00a4e4);
    const rose      = new THREE.Color(0xff007f);
    const white     = new THREE.Color(0xffffff);

    for (let i = 0; i < N; i++) {
      // Spread in a wide, flat cloud — mostly behind the bot
      positions[i*3]   = (Math.random() - 0.5) * 28;
      positions[i*3+1] = (Math.random() - 0.5) * 18;
      positions[i*3+2] = (Math.random() - 0.5) * 12 - 4; // push behind bot

      const pick = Math.random();
      const c = pick > 0.72 ? cerulean : pick > 0.44 ? white : rose;
      colors[i*3]   = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.012;
    ref.current.rotation.x = Math.sin(t * 0.007) * 0.04;
    // Subtle twinkle via opacity shader — approximate with position shift
  });

  return (
    <points ref={ref} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.042}
        vertexColors
        transparent
        opacity={0.52}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Procedural AI Bot Character ─────────────────────────────────
// Composed from clean geometric primitives:
//   • Root group (full body, subtle scroll-based position)
//   • Torso group
//   • Head group (Look-At tracking)
//   • Eye spheres (emissive Cerulean / Rose)
//   • Visor / face panel
//   • Antenna
//   • Shoulder pads
//   • Lower body / legs (decorative)
function AiBot({ trackSensitivity, trackSmoothing }: { trackSensitivity: number; trackSmoothing: number }) {
  const root      = useRef<THREE.Group>(null!);
  const torso     = useRef<THREE.Group>(null!);
  const headGroup = useRef<THREE.Group>(null!);
  const leftEye   = useRef<THREE.Mesh>(null!);
  const rightEye  = useRef<THREE.Mesh>(null!);
  const visor     = useRef<THREE.Mesh>(null!);

  // Smooth mouse tracking accumulators
  const smooth = useRef({ yaw: 0, pitch: 0 });
  const { pointer } = useThree();

  // Shared Materials
  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0x0d1520,
    metalness: 0.92,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  }), []);

  const accentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0x001828,
    metalness: 0.95,
    roughness: 0.10,
    clearcoat: 1.0,
    emissive: new THREE.Color(0x00a4e4),
    emissiveIntensity: 0.55,
  }), []);

  const eyeMatL = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x001428,
    emissive: new THREE.Color(0x00a4e4),
    emissiveIntensity: 2.8,
    metalness: 0.6,
    roughness: 0.1,
  }), []);

  const eyeMatR = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x1a0010,
    emissive: new THREE.Color(0xff007f),
    emissiveIntensity: 2.4,
    metalness: 0.6,
    roughness: 0.1,
  }), []);

  const visorMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0x002233,
    metalness: 0.5,
    roughness: 0.05,
    transparent: true,
    opacity: 0.65,
    transmission: 0.4,
    clearcoat: 1.0,
    emissive: new THREE.Color(0x00a4e4),
    emissiveIntensity: 0.18,
  }), []);

  const darkPlateMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: 0x08111a,
    metalness: 0.88,
    roughness: 0.22,
    clearcoat: 0.8,
  }), []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // ── Smooth Look-At tracking ──────────────────────────────────
    // pointer.x / pointer.y are in [-1, +1] NDC space
    const targetYaw   = pointer.x * trackSensitivity * 0.62;  // left-right
    const targetPitch = pointer.y * trackSensitivity * 0.38;  // up-down

    // Lerp smoothing — alpha driven by Leva trackSmoothing
    const alpha = Math.min(1, trackSmoothing * delta);
    smooth.current.yaw   = THREE.MathUtils.lerp(smooth.current.yaw,   targetYaw,   alpha);
    smooth.current.pitch = THREE.MathUtils.lerp(smooth.current.pitch, targetPitch, alpha);

    // Clamp to realistic head-turn limits
    const clampedYaw   = THREE.MathUtils.clamp(smooth.current.yaw,   -0.65, 0.65);
    const clampedPitch = THREE.MathUtils.clamp(smooth.current.pitch, -0.35, 0.35);

    if (headGroup.current) {
      headGroup.current.rotation.y = clampedYaw;
      headGroup.current.rotation.x = -clampedPitch;
    }

    // Subtle torso follow (softer than head)
    if (torso.current) {
      torso.current.rotation.y = THREE.MathUtils.lerp(
        torso.current.rotation.y, clampedYaw * 0.28, alpha * 0.4
      );
    }

    // Ambient breathing motion on root
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.25) * 0.06;
    }

    // Eye pulse
    if (leftEye.current)  eyeMatL.emissiveIntensity = 2.4 + Math.sin(t * 3.2) * 0.55;
    if (rightEye.current) eyeMatR.emissiveIntensity = 2.0 + Math.cos(t * 2.8) * 0.4;

    // Visor subtle flicker
    if (visor.current) visorMat.emissiveIntensity = 0.14 + Math.sin(t * 4.1) * 0.06;
  });

  return (
    <group ref={root} position={[0, -0.4, 0]}>

      {/* ── Lower Body / Hip ─────────────────────────────────── */}
      <mesh geometry={new THREE.BoxGeometry(0.9, 0.28, 0.44)} material={darkPlateMat}
            position={[0, -1.28, 0]} frustumCulled />

      {/* Leg stubs */}
      <mesh geometry={new THREE.BoxGeometry(0.28, 0.52, 0.32)} material={bodyMat}
            position={[-0.22, -1.7, 0]} frustumCulled />
      <mesh geometry={new THREE.BoxGeometry(0.28, 0.52, 0.32)} material={bodyMat}
            position={[0.22, -1.7, 0]} frustumCulled />

      {/* ── Torso ─────────────────────────────────────────────── */}
      <group ref={torso}>
        {/* Main torso box */}
        <mesh geometry={new THREE.BoxGeometry(1.14, 1.0, 0.52)} material={bodyMat}
              position={[0, -0.38, 0]} frustumCulled />

        {/* Chest accent plate */}
        <mesh geometry={new THREE.BoxGeometry(0.52, 0.38, 0.06)} material={accentMat}
              position={[0, -0.26, 0.28]} frustumCulled />

        {/* Chest core circle */}
        <mesh geometry={new THREE.CylinderGeometry(0.11, 0.11, 0.06, 32)} material={eyeMatL}
              position={[0, -0.26, 0.32]} rotation={[Math.PI / 2, 0, 0]} frustumCulled />

        {/* Shoulder Pads */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh
              geometry={new THREE.BoxGeometry(0.32, 0.28, 0.52)}
              material={darkPlateMat}
              position={[side * 0.73, -0.06, 0]}
              frustumCulled
            />
            {/* Shoulder accent stripe */}
            <mesh
              geometry={new THREE.BoxGeometry(0.28, 0.05, 0.06)}
              material={accentMat}
              position={[side * 0.73, -0.06, 0.28]}
              frustumCulled
            />
          </group>
        ))}

        {/* Neck cylinder */}
        <mesh geometry={new THREE.CylinderGeometry(0.12, 0.14, 0.22, 16)} material={darkPlateMat}
              position={[0, 0.24, 0]} frustumCulled />

        {/* ── Head Group (controlled by Look-At) ───────────────── */}
        <group ref={headGroup} position={[0, 0.48, 0]}>

          {/* Cranium / main head box */}
          <mesh geometry={new THREE.BoxGeometry(0.82, 0.72, 0.62)} material={bodyMat}
                position={[0, 0.22, 0]} frustumCulled />

          {/* Face panel (slightly recessed front plate) */}
          <mesh geometry={new THREE.BoxGeometry(0.62, 0.48, 0.08)} material={darkPlateMat}
                position={[0, 0.22, 0.32]} frustumCulled />

          {/* Visor horizontal band */}
          <mesh ref={visor} position={[0, 0.24, 0.37]} frustumCulled>
            <boxGeometry args={[0.56, 0.14, 0.04]} />
            <primitive object={visorMat} attach="material" />
          </mesh>

          {/* Left Eye */}
          <mesh ref={leftEye} geometry={new THREE.SphereGeometry(0.065, 20, 20)}
                material={eyeMatL} position={[-0.14, 0.24, 0.38]} frustumCulled />

          {/* Right Eye */}
          <mesh ref={rightEye} geometry={new THREE.SphereGeometry(0.065, 20, 20)}
                material={eyeMatR} position={[0.14, 0.24, 0.38]} frustumCulled />

          {/* Eye socket rings */}
          {[-0.14, 0.14].map((x, i) => (
            <mesh key={i}
              geometry={new THREE.TorusGeometry(0.082, 0.012, 12, 40)}
              material={accentMat}
              position={[x, 0.24, 0.37]}
              rotation={[Math.PI / 2, 0, 0]}
              frustumCulled
            />
          ))}

          {/* Chin stripe */}
          <mesh geometry={new THREE.BoxGeometry(0.38, 0.06, 0.06)} material={accentMat}
                position={[0, 0.04, 0.36]} frustumCulled />

          {/* Temple accent panels */}
          {[-1, 1].map((side) => (
            <mesh key={side}
              geometry={new THREE.BoxGeometry(0.06, 0.28, 0.42)}
              material={darkPlateMat}
              position={[side * 0.44, 0.22, 0.08]}
              frustumCulled
            />
          ))}

          {/* Antenna base */}
          <mesh geometry={new THREE.CylinderGeometry(0.018, 0.018, 0.38, 8)} material={accentMat}
                position={[0.18, 0.74, 0]} frustumCulled />
          {/* Antenna tip */}
          <mesh geometry={new THREE.SphereGeometry(0.028, 12, 12)} material={eyeMatL}
                position={[0.18, 0.94, 0]} frustumCulled />

        </group>
        {/* ── End Head ─────────────────────────────────────────── */}

      </group>
      {/* ── End Torso ─────────────────────────────────────────── */}

    </group>
  );
}

// ─── Lighting Rig ────────────────────────────────────────────────
function Lights({ cerulean, rose }: { cerulean: number; rose: number }) {
  const mouseLight = useRef<THREE.PointLight>(null!);
  const { pointer } = useThree();
  const pos = useRef(new THREE.Vector3(0, 0, 4));

  useFrame(() => {
    pos.current.lerp(
      new THREE.Vector3(pointer.x * 5, pointer.y * 3.5, 4),
      0.05
    );
    if (mouseLight.current) mouseLight.current.position.copy(pos.current);
  });

  return (
    <>
      <pointLight ref={mouseLight} color={0x00a4e4} intensity={cerulean} distance={18} decay={1.5} />
      <directionalLight color={0xff007f} intensity={rose}  position={[-5, 6, -3]} />
      <directionalLight color={0xffffff} intensity={0.55}  position={[5, -4, 2]}  />
      <ambientLight      color={0x080d1a} intensity={1.8} />
      <pointLight        color={0x00a4e4} intensity={1.6}  position={[0, 2, 1]} distance={6} decay={2} />
    </>
  );
}

// ─── Main Scene Container ─────────────────────────────────────────
function SceneInner({ onUpdate }: BotSceneProps) {
  const { trackSensitivity, trackSmoothing, ceruleanIntensity, roseIntensity } = useControls(
    'Aetheris · Bot', {
      'Mouse Tracking': folder({
        trackSensitivity: { value: 1.0, min: 0.2, max: 2.5,  step: 0.05, label: 'Sensitivity'   },
        trackSmoothing:   { value: 6.0, min: 1.0, max: 20.0, step: 0.5,  label: 'Smoothing Spd' },
      }),
      'Lighting': folder({
        ceruleanIntensity: { value: 3.8, min: 0, max: 10, step: 0.1, label: 'Cerulean' },
        roseIntensity:     { value: 2.2, min: 0, max: 10, step: 0.1, label: 'Neon Rose' },
      }),
    }
  );

  const { clock } = useThree();
  const fpsRef = useRef({ frames: 0, last: 0, fps: 60 });

  useFrame(() => {
    const now = performance.now();
    fpsRef.current.frames++;
    if (now - fpsRef.current.last >= 1000) {
      fpsRef.current.fps = Math.round((fpsRef.current.frames * 1000) / (now - fpsRef.current.last));
      fpsRef.current.frames = 0;
      fpsRef.current.last = now;
    }
    if (onUpdate) {
      onUpdate({ x: 0, y: 0, z: 0, fps: fpsRef.current.fps });
    }
  });

  return (
    <>
      <Lights cerulean={ceruleanIntensity} rose={roseIntensity} />
      <CosmicDust />
      <Float speed={0.9} rotationIntensity={0} floatIntensity={0.2}>
        <AiBot trackSensitivity={trackSensitivity} trackSmoothing={trackSmoothing} />
      </Float>
    </>
  );
}

// ─── Exported Canvas Wrapper ─────────────────────────────────────
export default function BotScene({ onUpdate }: BotSceneProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.15, 5.5], fov: 42 }}
        shadows={false}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <SceneInner onUpdate={onUpdate} />
        </Suspense>
      </Canvas>
    </div>
  );
}
