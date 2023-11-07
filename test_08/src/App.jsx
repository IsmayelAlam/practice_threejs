import { OrbitControls, Sky } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Lights from "./Light";

function App() {
  return (
    <>
      <Perf />
      <OrbitControls />
      <Lights />
      <Sky />
      <group>
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
