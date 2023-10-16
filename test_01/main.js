import gsap from "gsap";
import "./style.css";

import * as THREE from "three";

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

//add single mesh
// const geo = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geo, material);
// scene.add(mesh);
// // position
// // mesh.position.z = -3;
// mesh.position.x = -1;
// mesh.position.y = -1;
// // scale
// /* mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.05;*/
// mesh.scale.set(2.5, 0.5, 0.5);
// // rotation
// mesh.rotation.reorder("YXZ");
// mesh.rotation.x = 0.25 * Math.PI;
// mesh.rotation.y = 0.25 * Math.PI;

//add group mesh
const group = new THREE.Group();
scene.add(group);

const cube01 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const cube02 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
const cube03 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);

cube01.position.set(-1.5, 0, 0);
cube03.position.set(1.5, 0, 0);

group.add(cube01, cube02, cube03);

// group transformation
// group.rotation.z = 0.1 * Math.PI;
// group.scale.y = 1.5;
// group.position.y = -0.5;

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const size = {
  width: innerWidth,
  height: innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
scene.add(camera);
camera.position.x = 1.5;
camera.position.z = 3;
// camera.lookAt(mesh.position);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

// let time = Date.now();

const clock = new THREE.Clock();

gsap.to(group.position, {
  duration: 1,
  delay: 1,
  x: 2,
});
gsap.to(group.position, {
  duration: 1,
  delay: 2,
  x: -2,
});

function animate() {
  // const curTime = Date.now();
  // const deltaTime = curTime - time;
  // time = curTime;

  const elapsedTime = clock.getElapsedTime();

  renderer.render(scene, camera);
  // group.rotation.y += 0.01 * Math.PI * deltaTime * 0.01;
  group.rotation.y = elapsedTime;
  group.translateY(Math.cos(elapsedTime) * 0.05);

  camera.lookAt(group.position);

  window.requestAnimationFrame(animate);
}
animate();
