import gsap from "gsap";
import "./style.css";

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

// Texture
// const image = new Image();
// const texture = new THREE.Texture(image);
// image.onload = () => {
//   texture.needsUpdate = true;
// };
// image.src = diff;

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader()
  .setPath("/static/textures/environmentMaps/4/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

scene.background = cubeTextureLoader;

// door textures
const colorTex = textureLoader.load("/static/textures/door/color.jpg");
const aoTex = textureLoader.load("/static/textures/door/ambientOcclusion.jpg");
const alphaTex = textureLoader.load("/static/textures/door/alpha.jpg");
const heightTex = textureLoader.load("/static/textures/door/height.jpg");
const metallicTex = textureLoader.load("/static/textures/door/metallic.jpg");
const normalTex = textureLoader.load("/static/textures/door/normal.jpg");
const roughnessTex = textureLoader.load("/static/textures/door/roughness.jpg");

// accessories texture
const gradient = textureLoader.load("/static/textures/gradients/5.jpg");
const matcap = textureLoader.load("/static/textures/matcaps/2.png");

// texture filters
// colorTex.minFilter = THREE.NearestFilter;
// colorTex.magFilter = THREE.NearestFilter;
gradient.magFilter = THREE.NearestFilter;

// material
// const material = new THREE.MeshBasicMaterial({ map: colorTex });
// const material = new THREE.MeshNormalMaterial({ normalMap: normalTex });
// const material = new THREE.MeshMatcapMaterial({ matcap });
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// const material = new THREE.MeshToonMaterial();
const material = new THREE.MeshStandardMaterial();
// const material = new THREE.Mesh();
// material.wireframe = true;
// material.transparent = true;
// material.side = THREE.DoubleSide;
// material.shininess = 100;
// material.specular = 100;
// material.gradientMap = gradient;
// material.map = colorTex;
// material.metalnessMap = metallicTex;
// material.roughnessMap = roughnessTex;
// material.normalMap = normalTex;
// material.normalScale.set(1.5, 1.5);
// material.alphaMap = alphaTex;
// material.displacementMap = heightTex;
// material.displacementScale = 0.05;
// material.aoMap = aoTex;
material.metalness = 0.9;
material.roughness = 0.1;
material.envMap = cubeTextureLoader;

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 25.5);
pointLight.position.set(2, 3, 4);
// scene.add(pointLight);

//add single mesh
// const geo = new THREE.BoxGeometry(1, 1, 1);
// const mesh = new THREE.Mesh(geo, material);
// scene.add(mesh);
// // position;
// mesh.position.z = 3;
// mesh.position.x = 2;
// mesh.position.y = 1.5;
// // scale;
// /* mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.05;*/
// mesh.scale.set(2.5, 0.5, 0.5);
// // rotation;
// mesh.rotation.reorder("YXZ");
// mesh.rotation.x = 0.25 * Math.PI;
// mesh.rotation.y = 0.25 * Math.PI;

//add group mesh
const group = new THREE.Group();
scene.add(group);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 24), material);
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1, 12),
  material
);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.25, 12, 32),
  material
);

plane.position.set(0, -1.5, 0);
torus.position.set(0, 1.5, 0);
torus.rotateX(Math.PI * 2);
// sphere.position.set(-1.5, 0, 0);
cylinder.position.set(1.5, 0, 0);

// group.add(sphere, cube, cylinder, plane, torus);
group.add(sphere);

// group transformation
// group.rotation.z = 0.1 * Math.PI;
// group.scale.y = 1.5;
// group.position.y = -0.5;

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
// const camera = new THREE.OrthographicCamera(
//   -aspectRatio,
//   aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );

scene.add(camera);
// camera.position.x = 1.5;
// camera.position.y = 1.5;
camera.position.z = 4;
// camera.lookAt(mesh.position);

const controls = new OrbitControls(camera, canvas);
// controls.target = group.position;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
renderer.render(scene, camera);

let time = Date.now();

const clock = new THREE.Clock();

// gsap.to(group.position, {
//   duration: 1,
//   delay: 1,
//   x: 2,
// });
// gsap.to(group.position, {
//   duration: 1,
//   delay: 2,
//   x: -2,
// });

function animate() {
  // const curTime = Date.now();
  // const deltaTime = curTime - time;
  // time = curTime;

  const elapsedTime = clock.getElapsedTime();
  controls.update();

  renderer.render(scene, camera);
  // group.rotation.y += 0.01 * Math.PI * deltaTime * 0.01;
  // group.rotation.y = elapsedTime / 2;
  // group.translateY(Math.cos(elapsedTime) * 0.05);

  // camera.position.x = cursor.x * 5;
  // camera.position.y = cursor.y * 5;

  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.position.y = cursor.y * 10;

  // camera.lookAt(group.position);

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
