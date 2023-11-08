import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";

import Lights from "./Light";
import Level from "./Level";
import Player from "./Player";

function App() {
  return (
    <>
      <Perf />
      <Lights />
      <Physics debug>
        <Level />
        <Player />
      </Physics>
    </>
  );
}

export default App;
