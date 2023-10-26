import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

const gui = new dat.GUI();

const canvas = document.querySelector(".webgl");

const scene = new THREE.Scene();

const size = {
  width: innerWidth,
  height: innerHeight,
};
let aspectRatio = size.width / size.height;

//add mesh
const parameters = {
  count: 10000,
  size: 0.02,
  radius: 5,
  branch: 7,
  spin: 0.2,
  randomNess: 0.02,
  randomPow: 1,
  colorIn: "#ff6030",
  colorOut: "#1b3984",
};

gui.add(parameters, "count", 1000, 1000000, 100).onFinishChange(generateGalaxy);
gui.add(parameters, "size", 0.001, 0.1, 0.001).onFinishChange(generateGalaxy);
gui.add(parameters, "radius", 0.1, 20, 0.1).onFinishChange(generateGalaxy);
gui.add(parameters, "branch", 3, 20, 1).onFinishChange(generateGalaxy);
gui.add(parameters, "spin", -5, 5, 0.01).onFinishChange(generateGalaxy);
gui.add(parameters, "randomNess", 0, 2, 0.001).onFinishChange(generateGalaxy);
gui.add(parameters, "randomPow", 1, 10, 0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, "colorIn").onFinishChange(generateGalaxy);
gui.addColor(parameters, "colorOut").onFinishChange(generateGalaxy);

let geo = null;
let material = null;
let points = null;

function generateGalaxy() {
  const pos = new Float32Array(parameters.count * 3);
  const color = new Float32Array(parameters.count * 3);
  const colorIn = new THREE.Color(parameters.colorIn);
  const colorOut = new THREE.Color(parameters.colorOut);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const rad = Math.random() * parameters.radius;
    const spinAng = rad * parameters.spin;
    const branchAng =
      (Math.PI * 2 * (i % parameters.branch)) / parameters.branch;

    const randomX =
      Math.pow(Math.random(), parameters.randomPow) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      (Math.pow(Math.random(), parameters.randomPow) *
        (Math.random() < 0.5 ? 1 : -1) *
        rad) /
      parameters.radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomPow) *
      (Math.random() < 0.5 ? 1 : -1);

    const x = Math.cos(branchAng + spinAng) * rad + randomX;
    const y = randomY;
    const z = Math.sin(branchAng + spinAng) * rad + randomZ;

    pos[i3] = x;
    pos[i3 + 1] = y;
    pos[i3 + 2] = z;

    const mixColor = colorIn.clone();
    mixColor.lerp(colorOut, rad / parameters.radius);

    color[i3] = mixColor.r;
    color[i3 + 1] = mixColor.g;
    color[i3 + 2] = mixColor.b;
  }

  if (geo !== null) {
    geo.dispose();
    material.dispose();
    scene.remove(points);
  }

  geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(color, 3));

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(geo, material);
  scene.add(points);
}

generateGalaxy();

// Camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(-2, 1, 7.5);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

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
