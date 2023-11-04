/* eslint-disable react/no-unknown-property */
import { OrbitControls, Sky } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useRef } from "react";

function App() {
  const boxRef = useRef();

  useFrame((state, delta) => {
    boxRef.current.rotation.y += delta;
  });

  return (
    <>
      <Perf />
      <OrbitControls />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <Sky />
      <group ref={boxRef}>
        <mesh position-x={-2}>
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
        <mesh rotation-y={Math.PI * 0.25} position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </group>
      <mesh rotation-x={-Math.PI * 0.5} position-y={-2} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}

export default App;
