import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const size = {
  width: innerWidth,
  height: innerHeight,
};
let aspectRatio = size.width / size.height;

const geo = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(0, 1, 2);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

// animations
function animate() {
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
