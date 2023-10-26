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

// Light
const directionalLight = new THREE.DirectionalLight("#b9d5ff", 0.5);

scene.add(directionalLight);

// material
const textureLoader = new THREE.TextureLoader();

const material = new THREE.MeshStandardMaterial({ color: "white" });

//add group mesh
const plane = new THREE.PlaneGeometry(1, 1, 1, 1);

const ground = new THREE.Mesh(plane, material);
ground.position.set(0, 0, 0);
ground.scale.set(20, 20);
ground.rotation.set(-Math.PI * 0.5, 0, 0);

scene.add(ground);

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(-2, 1, 7.5);
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
