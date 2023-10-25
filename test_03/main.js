import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const size = {
  width: innerWidth,
  height: innerHeight,
};
let aspectRatio = size.width / size.height;

// fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

// Light
const directionalLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);

const doorLight = new THREE.PointLight("#ff7d46", 1, 10);
doorLight.position.set(0, 2, 2.3);

const ghostLight1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghostLight2 = new THREE.PointLight("#00ffff", 2, 3);
const ghostLight3 = new THREE.PointLight("#ffff00", 2, 3);

scene.add(
  directionalLight,
  ambientLight,
  ghostLight1,
  ghostLight2,
  ghostLight3
);

// material
const textureLoader = new THREE.TextureLoader();

const doorColor = textureLoader.load("/door/color.jpg");
const doorAlpha = textureLoader.load("/door/alpha.jpg");
const doorHeight = textureLoader.load("/door/height.jpg");
const doorMetal = textureLoader.load("/door/metalness.jpg");
const doorNormal = textureLoader.load("/door/normal.jpg");
const doorRough = textureLoader.load("/door/roughness.jpg");
doorColor.colorSpace = THREE.SRGBColorSpace;

const doorMaterial = new THREE.MeshStandardMaterial({
  map: doorColor,
  transparent: true,
  alphaMap: doorAlpha,
  normalMap: doorNormal,
  roughnessMap: doorRough,
  metalnessMap: doorMetal,
  displacementMap: doorHeight,
});

const bricksColor = textureLoader.load("/bricks/color.jpg");
const bricksNormal = textureLoader.load("/bricks/normal.jpg");
const bricksRough = textureLoader.load("/bricks/roughness.jpg");
bricksColor.colorSpace = THREE.SRGBColorSpace;

const bricksMaterial = new THREE.MeshStandardMaterial({
  map: bricksColor,
  normalMap: bricksNormal,
  roughnessMap: bricksRough,
});

const grassColor = textureLoader.load("/grass/color.jpg");
grassColor.colorSpace = THREE.SRGBColorSpace;
grassColor.repeat.set(8, 8);
grassColor.wrapS = THREE.RepeatWrapping;
grassColor.wrapT = THREE.RepeatWrapping;
const grassNormal = textureLoader.load("/grass/normal.jpg");
grassNormal.repeat.set(8, 8);
grassNormal.wrapS = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
const grassRough = textureLoader.load("/grass/roughness.jpg");
grassRough.repeat.set(8, 8);
grassRough.wrapS = THREE.RepeatWrapping;
grassRough.wrapT = THREE.RepeatWrapping;

const grassMaterial = new THREE.MeshStandardMaterial({
  map: grassColor,
  normalMap: grassNormal,
  roughnessMap: grassRough,
});

const bushMat = new THREE.MeshStandardMaterial({ color: "green" });
const roofMat = new THREE.MeshStandardMaterial({ color: "brown" });
const graveMat = new THREE.MeshStandardMaterial({ color: "grey" });

//add group mesh
const cube = new THREE.BoxGeometry(1, 1, 1);
const plane = new THREE.PlaneGeometry(1, 1, 1, 1);
const cone = new THREE.ConeGeometry(1, 1, 4);
const sphere = new THREE.SphereGeometry(0.5, 32, 16);

const ground = new THREE.Mesh(plane, grassMaterial);
ground.position.set(0, 0, 0);
ground.scale.set(20, 20);
ground.rotation.set(-Math.PI * 0.5, 0, 0);

const house = new THREE.Group();

const walls = new THREE.Mesh(cube, bricksMaterial);
walls.position.set(0, 1, 0);
walls.scale.set(4, 2, 4);

const roof = new THREE.Mesh(cone, roofMat);
roof.scale.set(3.5, 1, 3.5);
roof.position.set(0, 2.5, 0);
roof.rotation.set(0, -Math.PI * 0.25, 0);

const door = new THREE.Mesh(plane, doorMaterial);
door.position.set(0, 0.9, 2.001);
door.scale.set(2, 2);

const bush1 = new THREE.Mesh(sphere, bushMat);
const bush2 = new THREE.Mesh(sphere, bushMat);
const bush3 = new THREE.Mesh(sphere, bushMat);
const bush4 = new THREE.Mesh(sphere, bushMat);
bush1.position.set(0.8, 0.2, 2.2);
bush2.position.set(1.4, 0.1, 2.1);
bush2.scale.set(0.5, 0.5, 0.5);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.scale.set(0.8, 0.8, 0.8);
bush4.position.set(-1, 0.05, 2.6);
bush4.scale.set(0.25, 0.25, 0.25);

house.add(walls, roof, door, bush1, bush2, bush3, bush4, doorLight);

const graves = new THREE.Group();

for (let i = 0; i < 75; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(cube, graveMat);
  grave.scale.set(0.25, 0.6, 0.1);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = Math.random() - 0.5;

  graves.add(grave);
}

scene.add(ground, house, graves);

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(-2, 1, 7.5);
camera.lookAt(house.position);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
renderer.setClearColor("#262837");

// animations
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  ghostLight1.position.set(
    Math.cos(elapsedTime) * 5,
    Math.abs(Math.sin(elapsedTime * 5)),
    Math.sin(elapsedTime) * 5
  );
  ghostLight2.position.set(
    Math.cos(elapsedTime + 549) * 6,
    Math.abs(Math.sin(elapsedTime * 5 + 65)),
    Math.sin(elapsedTime + 549) * 5
  );
  ghostLight3.position.set(
    Math.cos(elapsedTime + 55) * 5,
    Math.abs(Math.sin(elapsedTime * 5 + 58)),
    Math.sin(elapsedTime + 55) * 6
  );

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}
animate();

addEventListener("resize", (e) => {
  size.width = innerWidth;
  size.height = innerHeight;
  aspectRatio = size.width / size.height;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
addEventListener("dblclick", (e) => {
  document.fullscreenElement
    ? document.exitFullscreen()
    : canvas.requestFullscreen();
});
