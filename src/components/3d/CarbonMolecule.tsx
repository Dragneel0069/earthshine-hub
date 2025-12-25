import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Float, Trail } from "@react-three/drei";
import * as THREE from "three";

function Atom({ position, color, size = 0.3 }: { position: [number, number, number]; color: string; size?: number }) {
  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere position={position} args={[size, 32, 32]}>
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
}

function Bond({ start, end, color = "#888888" }: { start: THREE.Vector3; end: THREE.Vector3; color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  
  const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );

  return (
    <mesh ref={ref} position={midPoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.03, 0.03, length, 8]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

function CO2Molecule() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  const carbonPos = new THREE.Vector3(0, 0, 0);
  const oxygen1Pos = new THREE.Vector3(-1.2, 0, 0);
  const oxygen2Pos = new THREE.Vector3(1.2, 0, 0);

  return (
    <group ref={groupRef}>
      {/* Carbon atom (center) */}
      <Atom position={[0, 0, 0]} color="#1a1a2e" size={0.4} />
      
      {/* Oxygen atoms */}
      <Trail width={1} length={6} color="#ef4444" attenuation={(t) => t * t}>
        <Atom position={[-1.2, 0, 0]} color="#ef4444" size={0.35} />
      </Trail>
      <Trail width={1} length={6} color="#ef4444" attenuation={(t) => t * t}>
        <Atom position={[1.2, 0, 0]} color="#ef4444" size={0.35} />
      </Trail>
      
      {/* Bonds */}
      <Bond start={carbonPos} end={oxygen1Pos} color="#666666" />
      <Bond start={carbonPos} end={oxygen2Pos} color="#666666" />
    </group>
  );
}

export function CarbonMolecule() {
  return (
    <div className="w-full h-[200px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#22c55e" />
        <CO2Molecule />
      </Canvas>
    </div>
  );
}
