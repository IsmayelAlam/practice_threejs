import { OrbitControls, Sky } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Lights from "./Light";
import Level from "./Level";
import { Physics } from "@react-three/rapier";

function App() {
  return (
    <>
      <Perf />
      <OrbitControls makeDefault />
      <Lights />
      <Physics debug>
        <Level />
      </Physics>
    </>
  );
}

export default App;
