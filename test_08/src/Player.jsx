import { Vector3 } from "three";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import useGame from "./stores/useGame";

export default function Player() {
  const [subKeys, getKeys] = useKeyboardControls();
  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blockCount = useGame((state) => state.blockCount);

  const [smoothCamPos] = useState(() => new Vector3(5, 5, 5));
  const [smoothCamTer] = useState(() => new Vector3());
  const body = useRef();

  useEffect(() => {
    const unSubJump = subKeys(
      (state) => state.jump,
      (value) => {
        const origin = body.current.translation();
        if (value && origin.y < 0.5)
          body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
      }
    );
    const unSubAny = subKeys(() => start());

    return () => {
      unSubJump();
      // unSubAny();
    };
  }, []);

  useFrame((state, delta) => {
    /**
     * controls
     */
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.3 * delta;
    const torqueStrength = 0.1 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    /**
     * Camera
     */
    const bodyPos = body.current.translation();

    const cameraPos = new Vector3();
    cameraPos.copy(bodyPos);
    cameraPos.z += 2.25;
    cameraPos.y += 0.65;

    const cameraTarget = new Vector3();
    cameraTarget.copy(bodyPos);
    cameraTarget.y += 0.25;

    smoothCamPos.lerp(cameraPos, 5 * delta);
    smoothCamTer.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCamPos);
    state.camera.lookAt(smoothCamTer);

    /**
     * Phases
     */
    if (bodyPos.z < -blockCount * 4 - 2) end();
    if (bodyPos.y < -4) restart();
  });

  return (
    <RigidBody
      colliders="ball"
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      ref={body}
      canSleep={false}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
}
