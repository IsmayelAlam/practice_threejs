import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import * as dat from "lil-gui";
import Stats from "three/addons/libs/stats.module.js";

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

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// updateAllMaterials
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 1;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

const environmentMap = cubeTextureLoader.load([
  "/textures/px.jpg",
  "/textures/nx.jpg",
  "/textures/py.jpg",
  "/textures/ny.jpg",
  "/textures/pz.jpg",
  "/textures/nz.jpg",
]);
environmentMap.colorSpace = THREE.SRGBColorSpace;
// scene.background = environmentMap;
scene.environment = environmentMap;
scene.colorSpace = THREE.SRGBColorSpace;

// texture
// const mapTexture = textureLoader.load("/models/color.jpg");
// mapTexture.colorSpace = THREE.SRGBColorSpace;
// const normalTexture = textureLoader.load("/models/normal.jpg");

// Material
const material = new THREE.MeshStandardMaterial({
  // map: mapTexture,
  // normalMap: normalTexture,
});
// add mesh
gltfLoader.load("/models/scene.gltf", (gltf) => {
  // Model
  const mesh = gltf.scene.children[0];
  mesh.rotation.z = Math.PI * 0.5;
  // mesh.material = material;
  scene.add(mesh);

  // Update materials
  updateAllMaterials();
});

// light
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, -2.25);
scene.add(directionalLight);

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.colorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// post process
// const effectComposer = new EffectComposer(renderer);
// effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
