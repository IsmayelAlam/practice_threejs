import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import Stats from "three/addons/libs/stats.module.js";

// import vertexShader from "./shaders/galaxy/vertex.glsl";
// import fragmentShader from "./shaders/galaxy/fragment.glsl";

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

// shader
const material = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  // wireframe: true,
});

// add mesh
const geo = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(1, 1, 1.5);
camera.lookAt(mesh.position);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

// time
const time = new THREE.Clock();

// animations
function animate() {
  stats.begin();
  const elapsedTime = time.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  stats.end();
  window.requestAnimationFrame(animate);
}
animate();

// EventListener
addEventListener("resize", (e) => {
  size.width = innerWidth;
  size.height = innerHeight;
  aspectRatio = size.width / size.height;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
