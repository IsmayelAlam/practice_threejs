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
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const spotLight = new THREE.SpotLight(0xf0f2f0, 1);
const ambientLight = new THREE.AmbientLight(0xf0f2f0, 2);

scene.add(directionalLight, ambientLight);

// material
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
material.roughness = 0.5;

//add group mesh
const cube = new THREE.BoxGeometry(1, 1, 1);
const plane = new THREE.PlaneGeometry(1, 1, 1, 1);
const cone = new THREE.ConeGeometry(1, 1, 4);

const ground = new THREE.Mesh(plane, material);
ground.position.set(0, 0, 0);
ground.scale.set(20, 20);
ground.rotation.set(-Math.PI * 0.5, 0, 0);

const house = new THREE.Group();

const walls = new THREE.Mesh(cube, material);
walls.position.set(0, 1, 0);
walls.scale.set(4, 2, 4);

const roof = new THREE.Mesh(cone, material);
roof.scale.set(3.5, 1, 3.5);
roof.position.set(0, 2.5, 0);
roof.rotation.set(0, -Math.PI * 0.25, 0);

const door = new THREE.Mesh(plane, material);
door.position.set(0, 0.5, 2.001);

house.add(walls, roof, door);

scene.add(ground, house);

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(-2, 1, 10);
camera.lookAt(house.position);
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
