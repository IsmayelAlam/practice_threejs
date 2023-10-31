import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import Stats from "three/addons/libs/stats.module.js";

import vertexShader from "./shaders/water/vertex.glsl";
import fragmentShader from "./shaders/water/fragment.glsl";

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

const control = {
  subdivision: 512,
  size: {
    x: 1,
    y: 1,
    z: 1,
  },
  depthColor: "#186691",
  surfaceColor: "#9bd8ff",
};

// shader
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uBigWavesElevation: { value: 0.2 },
    uBigWaveFreq: { value: new THREE.Vector2(4, 1.5) },
    uWaveSpeed: { value: 0.75 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFreq: { value: 3.0 },
    uSmallWavesIteration: { value: 4.0 },
    uSmallWavesSpeed: { value: 0.2 },

    uDepthColor: { value: new THREE.Color(control.depthColor) },
    uSurfaceColor: { value: new THREE.Color(control.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },
  },

  side: THREE.DoubleSide,
  transparent: true,
  // wireframe: true,
});

// add mesh
let geo = new THREE.PlaneGeometry(
  control.size.x,
  control.size.y,
  control.subdivision,
  control.subdivision
);
// geo = new THREE.BoxGeometry(
//   control.size.x,
//   control.size.y,
//   control.size.z,
//   control.subdivision,
//   control.subdivision,
//   control.subdivision
// );
const mesh = new THREE.Mesh(geo, material);
mesh.rotation.x = -Math.PI * 0.5;
scene.add(mesh);

// debugger
gui
  .add(material.uniforms.uBigWavesElevation, "value", 0, 1, 0.001)
  .name("Big Waves Elevation");
gui
  .add(material.uniforms.uBigWaveFreq.value, "x", 0, 10, 0.01)
  .name("Big Waves FreqX");
gui
  .add(material.uniforms.uBigWaveFreq.value, "y", 0, 10, 0.01)
  .name("Big Waves FreqY");
gui
  .add(material.uniforms.uWaveSpeed, "value", 0, 2, 0.01)
  .name("Big Wave Speed");

gui
  .add(material.uniforms.uSmallWavesElevation, "value", 0, 2, 0.01)
  .name("Small Waves Elevation");
gui
  .add(material.uniforms.uSmallWavesFreq, "value", 0, 5, 0.1)
  .name("Small Waves Freq");
gui
  .add(material.uniforms.uSmallWavesIteration, "value", 0, 10, 1)
  .name("Small Waves Iteration");
gui
  .add(material.uniforms.uSmallWavesSpeed, "value", 0, 2, 0.01)
  .name("Small Wave Speed");

gui
  .add(material.uniforms.uColorOffset, "value", 0, 1, 0.01)
  .name("Color Offset");
gui
  .add(material.uniforms.uColorMultiplier, "value", 0, 10, 0.01)
  .name("Color Multiplier");

gui
  .addColor(control, "surfaceColor")
  .onChange(() =>
    material.uniforms.uSurfaceColor.value.set(control.surfaceColor)
  );
gui
  .addColor(control, "depthColor")
  .onChange(() => material.uniforms.uDepthColor.value.set(control.depthColor));

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(1, 1, 1.5);
camera.lookAt(mesh.position);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);

// renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));

// time
const time = new THREE.Clock();

// animations
function animate() {
  stats.begin();
  const elapsedTime = time.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

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
