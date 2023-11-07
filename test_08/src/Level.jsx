import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo, useRef, useState } from "react";
import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion } from "three";

const boxGeo = new BoxGeometry(1, 1, 1);

const floor1Mat = new MeshStandardMaterial({ color: "limegreen" });
const floor2Mat = new MeshStandardMaterial({ color: "greenyellow" });
const obstacleMat = new MeshStandardMaterial({ color: "orangered" });
const wallMat = new MeshStandardMaterial({ color: "slategrey" });

export default function Level({ count = 5 }) {
  const types = [BlockSpinner, BlockLimbo, BlockAxe];
  const blocks = useMemo(
    () =>
      [...new Array(count).keys()].map(
        () => types[Math.floor(Math.random() * types.length)]
      ),
    [count, types]
  );

  return (
    <>
      <Bounce length={count + 2} />
      <BlockStart pos={[0, 0, 0]} />
      {blocks.map((Block, i) => (
        <Block key={i} pos={[0, 0, -(i + 1) * 4]} />
      ))}
      <BlockEnd pos={[0, 0, -(count + 1) * 4]} />
    </>
  );
}

function Bounce({ length = 1 }) {
  return (
    <RigidBody type="fixed" restitution={0.2} friction={0}>
      <mesh
        geometry={boxGeo}
        material={wallMat}
        position={[2.15, 0.75, -length * 2 + 2]}
        scale={[0.3, 1.5, length * 4]}
        castShadow
      />
      <mesh
        geometry={boxGeo}
        material={wallMat}
        position={[-2.15, 0.75, -length * 2 + 2]}
        scale={[0.3, 1.5, length * 4]}
        receiveShadow
      />
      <mesh
        geometry={boxGeo}
        material={wallMat}
        position={[0, 0.75, -length * 4 + 2]}
        scale={[4, 1.5, 0.3]}
        receiveShadow
      />
      <CuboidCollider
        args={[2, 0.1, 2 * length]}
        position={[0, -0.1, -length * 2 + 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  );
}

function BlockStart({ pos = [0, 0, 0] }) {
  return (
    <group position={pos}>
      <mesh
        geometry={boxGeo}
        material={floor1Mat}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
}
function BlockEnd({ pos = [0, 0, 0] }) {
  const hamburger = useGLTF("./hamburger.glb");

  hamburger.scene.children.forEach((mesh) => (mesh.castShadow = true));

  return (
    <group position={pos}>
      <mesh
        geometry={boxGeo}
        material={floor1Mat}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        restitution={0.2}
        friction={0}
        position={[0, 0.25, 0]}
      >
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
}
function BlockSpinner({ pos = [0, 0, 0] }) {
  const [speed] = useState(Math.random);
  const obstacle = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    const rotation = new Quaternion();
    rotation.setFromEuler(new Euler(0, time * ((speed - 0.5) * 5), 0));

    obstacle?.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={pos}>
      <mesh
        geometry={boxGeo}
        material={floor2Mat}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh
          geometry={boxGeo}
          material={obstacleMat}
          scale={[3.5, 0.3, 0.3]}
          receiveShadow
          castShadow
        />
      </RigidBody>
    </group>
  );
}
function BlockLimbo({ pos = [0, 0, 0] }) {
  const [speed] = useState(Math.random);
  const obstacle = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    const y = Math.sin(time + speed * 2 * Math.PI) + 1.15;

    obstacle?.current.setNextKinematicTranslation({
      x: pos[0],
      y: pos[1] + y,
      z: pos[2],
    });
  });

  return (
    <group position={pos}>
      <mesh
        geometry={boxGeo}
        material={floor2Mat}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh
          geometry={boxGeo}
          material={obstacleMat}
          scale={[3.5, 0.3, 0.3]}
          receiveShadow
          castShadow
        />
      </RigidBody>
    </group>
  );
}
function BlockAxe({ pos = [0, 0, 0] }) {
  const [speed] = useState(Math.random);
  const obstacle = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    const x = Math.sin(time + speed * 2 * Math.PI) * 1.25;

    obstacle?.current.setNextKinematicTranslation({
      x: pos[0] + x,
      y: pos[1] + 0.75,
      z: pos[2],
    });
  });

  return (
    <group position={pos}>
      <mesh
        geometry={boxGeo}
        material={floor2Mat}
        position-y={-0.1}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh
          geometry={boxGeo}
          material={obstacleMat}
          scale={[1.5, 1.5, 0.3]}
          receiveShadow
          castShadow
        />
      </RigidBody>
    </group>
  );
}
