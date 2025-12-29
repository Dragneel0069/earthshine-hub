import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { WebGLFallback, isWebGLAvailable } from "./WebGLFallback";
function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.8, 64, 64]} scale={1}>
        <MeshDistortMaterial
          color="#22c55e"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.15}
          metalness={0.9}
        />
      </Sphere>
      {/* Inner glow sphere */}
      <Sphere args={[1.75, 32, 32]} scale={1}>
        <meshBasicMaterial
          color="#4ade80"
          transparent
          opacity={0.1}
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 600;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Green-themed particles
      colors[i * 3] = 0.1 + Math.random() * 0.2;     // R - low
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.4; // G - high
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.3; // B - medium-low
    }

    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

function GlowRings() {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef1.current) {
      ringRef1.current.rotation.x = Math.PI / 2;
      ringRef1.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = Math.PI / 3;
      ringRef2.current.rotation.z = -state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <>
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial color="#84cc16" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

export function EarthGlobe() {
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    setWebglAvailable(isWebGLAvailable());
  }, []);

  if (!webglAvailable) {
    return (
      <div className="w-full h-full min-h-[400px] lg:min-h-[600px] flex items-center justify-center">
        <WebGLFallback variant="globe" className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[600px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#22c55e" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#84cc16" />
        <AnimatedSphere />
        <ParticleField />
        <GlowRings />
        <Stars radius={60} depth={50} count={1500} factor={4} saturation={0.2} fade speed={0.5} />
      </Canvas>
    </div>
  );
}