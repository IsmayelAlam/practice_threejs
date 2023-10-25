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
const pointLight = new THREE.PointLight(0xffffff, 1);
const directionalLight = new THREE.DirectionalLight(0x25fff0, 1);
const hemisphereLight = new THREE.HemisphereLight(0xf052f0, 1);
const rectAreaLight = new THREE.RectAreaLight(0xa05200, 2, 1, 1);
const spotLight = new THREE.SpotLight(0xf0f2f0, 1);

const spotLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(spotLightHelper);

spotLight.position.set(0, 0, 2);
spotLight.castShadow = true;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
pointLight.position.set(0, 2, 0);
pointLight.castShadow = true;

scene.add(
  //   ambientLight,
  //   directionalLight
  //   hemisphereLight,
  //   pointLight
  //   rectAreaLight,
  spotLight
);

// material
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
material.roughness = 0.5;

//add group mesh
const group = new THREE.Group();

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 24), material);
sphere.position.set(-1.5, 0, 0);
sphere.castShadow = true;

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
cube.castShadow = true;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(7.5, 7.5, 100, 100),
  material
);
plane.position.set(0, -1, 0);
plane.rotation.set(-1, 0, 0);
plane.receiveShadow = true;

const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1, 24),
  material
);
cylinder.position.set(1.5, 0, 0);
cylinder.castShadow = true;

group.add(sphere, cube, cylinder, plane);
scene.add(group);

const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 4;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
renderer.shadowMap.enabled = true;

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
