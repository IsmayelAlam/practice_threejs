import "./style.css";

import * as THREE from "three";

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const geo = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geo, material);

scene.add(mesh);

const size = {
  width: 800,
  height: 600,
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
// camera.position.x = 1;
// camera.position.y = 1;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);

renderer.render(scene, camera);
