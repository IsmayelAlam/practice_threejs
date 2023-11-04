import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import Stats from "three/addons/libs/stats.module";
import * as dat from "lil-gui";

import firefliesVertexShader from "./shader/fireflies/vertex.glsl";
import firefliesFragmentShader from "./shader/fireflies/fragment.glsl";
import portalVertexShader from "./shader/portal/vertex.glsl";
import portalFragmentShader from "./shader/portal/fragment.glsl";

const canvas = document.querySelector(".webgl");
const gui = new dat.GUI();
const pixelRatio = Math.min(window.devicePixelRatio, 3);

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

const control = {
  clearColor: "#201919",
  fireFlySize: 75.0,
  portalStartColor: new THREE.Color("#c1a436"),
  portalEndColor: new THREE.Color("#f1ec91"),
};
gui
  .addColor(control, "clearColor")
  .onChange(() => renderer.setClearColor(control.clearColor));
gui.add(control, "fireFlySize", 1, 250, 0.1);
gui.addColor(control, "portalStartColor");
gui.addColor(control, "portalEndColor");

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Texture loader
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/baked.jpg");
texture.colorSpace = THREE.SRGBColorSpace;
texture.flipY = false;

// model
const allMat = new THREE.MeshBasicMaterial({ map: texture });
const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
const fireFliesMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uSize: { value: control.fireFlySize },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const portalMat = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
    uStartColor: { value: control.portalStartColor },
    uEndColor: { value: control.portalEndColor },
  },
});

gltfLoader.load("/portal.glb", (geo) => {
  geo.scene.traverse((child) =>
    child.name === "poleLightA" ||
    child.name === "poleLightB" ||
    child.name === "portalLight"
      ? child.name === "portalLight"
        ? (child.material = portalMat)
        : (child.material = lampMat)
      : (child.material = allMat)
  );
  scene.add(geo.scene);
});

// particles
const fireFliesGeo = new THREE.BufferGeometry();
const fireFliesCount = 30;
const fireFliesPos = new Float32Array(fireFliesCount * 3).map((_, i) =>
  i % 3 !== 1 ? (Math.random() - 0.5) * 4 : Math.random() * 2
);
fireFliesGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(fireFliesPos, 3)
);

const fireFlies = new THREE.Points(fireFliesGeo, fireFliesMat);
scene.add(fireFlies);
// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(1, 2, 4);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(pixelRatio);
renderer.setClearColor(control.clearColor);

const clock = new THREE.Clock();
// animations
function animate() {
  stats.begin();
  fireFliesMat.uniforms.uSize.value = control.fireFlySize;
  fireFliesMat.uniforms.uTime.value = clock.getElapsedTime();

  portalMat.uniforms.uTime.value = clock.getElapsedTime();
  portalMat.uniforms.uStartColor.value = control.portalStartColor;
  portalMat.uniforms.uEndColor.value = control.portalEndColor;

  controls.update();
  renderer.render(scene, camera);
  stats.end();
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
