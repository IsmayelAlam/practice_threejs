import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import Stats from "three/addons/libs/stats.module";
import * as dat from "lil-gui";

const canvas = document.querySelector(".webgl");
const gui = new dat.GUI();

// performance monitor
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

const size = {
  width: innerWidth,
  height: innerHeight,
};
let aspectRatio = size.width / size.height;

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Texture loader
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/baked.jpg");
texture.colorSpace = THREE.SRGBColorSpace;
texture.flipY = false;

// model
const allMat = new THREE.MeshBasicMaterial({ map: texture });
const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
const portalMat = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

gltfLoader.load("/portal.glb", (geo) => {
  geo.scene.traverse((child) =>
    child.name === "poleLightA" ||
    child.name === "poleLightB" ||
    child.name === "portalLight"
      ? (child.material = lampMat)
      : (child.material = allMat)
  );
  scene.add(geo.scene);
});

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(1, 2, 5);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

// animations
function animate() {
  stats.begin();
  controls.update();
  renderer.render(scene, camera);
  stats.end();
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
