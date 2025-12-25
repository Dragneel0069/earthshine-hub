import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  Text3D, 
  Center, 
  Environment,
  MeshTransmissionMaterial,
  RoundedBox
} from "@react-three/drei";
import * as THREE from "three";

interface EmissionBarProps {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
  delay?: number;
}

function EmissionBar({ position, height, color, label, delay = 0 }: EmissionBarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const scale = useRef(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime - delay;
    if (time > 0 && scale.current < 1) {
      scale.current = Math.min(1, scale.current + 0.02);
    }
    if (meshRef.current) {
      meshRef.current.scale.y = scale.current * height;
      meshRef.current.position.y = (scale.current * height) / 2;
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[0.4, 1, 0.4]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </RoundedBox>
    </group>
  );
}

function FloatingOrb({ position, color, size = 0.15 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <MeshTransmissionMaterial
        color={color}
        thickness={0.5}
        roughness={0}
        transmission={0.9}
        ior={1.5}
        chromaticAberration={0.03}
      />
    </mesh>
  );
}

function Scene({ scope1 = 450, scope2 = 380, scope3 = 720 }: { scope1?: number; scope2?: number; scope3?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const maxEmission = Math.max(scope1, scope2, scope3);
  
  const normalizedHeights = useMemo(() => ({
    scope1: (scope1 / maxEmission) * 2,
    scope2: (scope2 / maxEmission) * 2,
    scope3: (scope3 / maxEmission) * 2,
  }), [scope1, scope2, scope3, maxEmission]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Emission Bars */}
      <EmissionBar position={[-1, 0, 0]} height={normalizedHeights.scope1} color="#22c55e" label="Scope 1" delay={0} />
      <EmissionBar position={[0, 0, 0]} height={normalizedHeights.scope2} color="#3b82f6" label="Scope 2" delay={0.2} />
      <EmissionBar position={[1, 0, 0]} height={normalizedHeights.scope3} color="#eab308" label="Scope 3" delay={0.4} />
      
      {/* Base Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Floating Orbs */}
      <FloatingOrb position={[-1.5, 1.5, 0.5]} color="#22c55e" />
      <FloatingOrb position={[1.5, 1.2, -0.5]} color="#3b82f6" />
      <FloatingOrb position={[0, 2, 0.8]} color="#eab308" size={0.1} />
      <FloatingOrb position={[-0.8, 0.8, 1]} color="#8b5cf6" size={0.08} />
    </group>
  );
}

interface Dashboard3DSceneProps {
  scope1?: number;
  scope2?: number;
  scope3?: number;
}

export function Dashboard3DScene({ scope1 = 450, scope2 = 380, scope3 = 720 }: Dashboard3DSceneProps) {
  return (
    <div className="w-full h-[350px] rounded-xl overflow-hidden bg-gradient-to-b from-card to-background">
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#22c55e" />
          <pointLight position={[5, 3, 5]} intensity={0.3} color="#3b82f6" />
          <Scene scope1={scope1} scope2={scope2} scope3={scope3} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
