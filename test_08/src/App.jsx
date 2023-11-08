import { KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";

import Lights from "./Light";
import Level from "./Level";
import Player from "./Player";
import Interface from "./Interface";
import useGame from "./stores/useGame";

function App() {
  const blocks = useGame((state) => state.blockCount);
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2.5, 4, 6],
        }}
      >
        <Perf />
        <Lights />
        <Physics>
          <Level count={blocks} />
          <Player />
        </Physics>
      </Canvas>
      <Interface />
    </KeyboardControls>
  );
}

export default App;
