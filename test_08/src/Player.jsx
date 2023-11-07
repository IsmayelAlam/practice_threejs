import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

export default function Player() {
  const [subKeys, getKeys] = useKeyboardControls();

  useFrame(() => {
    const { forward, backward, leftward, rightward, jump } = getKeys();
  });

  return (
    <RigidBody
      colliders="ball"
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
}
