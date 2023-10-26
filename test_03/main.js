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
const directionalLight = new THREE.DirectionalLight("white", 5);

scene.add(directionalLight);

// material
const textureLoader = new THREE.TextureLoader();

//add group mesh
const parameters = {
  count: 1000,
  size: 0.02,
};

function generateGalaxy() {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(parameters.count * 3).map(
    () => (Math.random() - 0.5) * 3
  );

  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, material);
  scene.add(points);
}

generateGalaxy();

// scene.add();

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
