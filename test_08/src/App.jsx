import { OrbitControls, Sky } from "@react-three/drei";
import { Perf } from "r3f-perf";
import Lights from "./Light";
import Level from "./Level";
import { Physics } from "@react-three/rapier";
import Player from "./Player";

function App() {
  return (
    <>
      <Perf />
      <OrbitControls makeDefault />
      <Lights />
      <Physics debug>
        <Level />
        <Player />
      </Physics>
    </>
  );
}

export default App;
