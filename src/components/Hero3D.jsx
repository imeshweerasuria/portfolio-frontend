import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

function Orb() {
  return (
    <Float speed={1.7} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial metalness={0.65} roughness={0.2} />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 3.6], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2.5, 2.5, 2.5]} intensity={1.2} />
      <pointLight position={[-2, -1, 2]} intensity={0.7} />

      <Orb />

      {/* Lock it so it looks clean and controlled */}
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}