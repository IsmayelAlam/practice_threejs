import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const size = {
  width: innerWidth,
  height: innerHeight,
};
const cursor = { x: 0, y: 0 };
let aspectRatio = size.width / size.height;

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

// material
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
// material.metalness = 0.9;
material.roughness = 0.5;

//add group mesh
const group = new THREE.Group();

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 24), material);
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 100, 100), material);
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1, 12),
  material
);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.25, 12, 32),
  material
);

plane.position.set(0, -1, 0);
plane.rotation.set(-1.5, 0, 0);
torus.position.set(0, 1.5, 0);
torus.rotateX(Math.PI * 2);
sphere.position.set(-1.5, 0, 0);
cylinder.position.set(1.5, 0, 0);

group.add(sphere, cube, cylinder, plane, torus);
scene.add(group);

const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 4;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

function animate() {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}
animate();

addEventListener("mousemove", (e) => {
  cursor.x = e.x / size.width - 0.5;
  cursor.y = -(e.y / size.height - 0.5);
});
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
