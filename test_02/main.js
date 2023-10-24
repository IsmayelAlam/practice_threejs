import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

const canvas = document.querySelector(".webgl");
const size = {
  width: innerWidth,
  height: innerHeight,
};
let aspectRatio = size.width / size.height;

const cursor = { x: 0, y: 0 };
const lastPos = { x: cursor.x * 0.95, y: cursor.y * 0.95 };
addEventListener("mousemove", (e) => {
  cursor.x = e.x / size.width - 0.5;
  cursor.y = e.y / size.height - 0.5;

  lastPos.x = cursor.x * 0.9;
  lastPos.y = cursor.y * 0.9;
});

const scene = new THREE.Scene();
const clock = new THREE.Clock();

const textureLoader = new THREE.TextureLoader();

const material = new THREE.MeshMatcapMaterial({
  matcap: textureLoader.load("4.png"),
});

const bg = textureLoader.load("bg.png");
bg.colorSpace = THREE.SRGBColorSpace;
bg.magFilter = THREE.NearestFilter;
bg.wrapS = THREE.RepeatWrapping;
bg.wrapT = THREE.RepeatWrapping;
bg.repeat.set(size.width / aspectRatio / 25, size.height / aspectRatio / 25);
scene.background = bg;

const geoSphere = new THREE.SphereGeometry(0.5, 32, 16);
const geoCapsule = new THREE.CapsuleGeometry(0.5, 1, 2, 16);
const geoCone = new THREE.ConeGeometry(0.5, 1, 16);
const geoCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
const geoTorus = new THREE.TorusGeometry(0.5, 0.25, 16, 64);
const geoBox = new THREE.BoxGeometry(1, 1, 1);

const geo = [geoSphere, geoCapsule, geoCone, geoCylinder, geoTorus, geoBox];

const allGeo = [];

for (let i = 0; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 50;
  const y = (Math.random() - 0.5) * 50;
  const z = (Math.random() - 0.5) * 50;
  const s = Math.random() + 0.1;
  const g = Math.floor(Math.random() * geo.length);

  const mesh = new THREE.Mesh(geo[g], material);

  mesh.position.set(x, y, z);
  mesh.rotation.set(x, 0, z);
  mesh.scale.set(s, s, s);

  scene.add(mesh);
  allGeo.push(mesh);
}

const loader = new FontLoader();

const textGroup = new THREE.Group();
scene.add(textGroup);

loader.load("Comfortaa_Bold.json", function (font) {
  const fontSetting = {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.025,
    bevelOffset: 0,
    bevelSegments: 5,
  };
  const geoText01 = new TextGeometry("DESIGN", fontSetting);
  const geoText02 = new TextGeometry("DEVELOP", fontSetting);
  const geoText03 = new TextGeometry("DEPLOY", fontSetting);

  geoText01.center();
  geoText02.center();
  geoText03.center();

  const material = new THREE.MeshNormalMaterial();

  const mesh1 = new THREE.Mesh(geoText01, material);
  const mesh2 = new THREE.Mesh(geoText02, material);
  const mesh3 = new THREE.Mesh(geoText03, material);

  mesh1.position.y = 0.75;
  mesh3.position.y = -0.75;

  textGroup.add(mesh1, mesh2, mesh3);
  textGroup.scale.y = 0.75;
});

const camera = new THREE.PerspectiveCamera(120, aspectRatio, 0.01, 100);
scene.add(camera);
camera.position.z = 1;

const controls = new OrbitControls(camera, canvas);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
renderer.render(scene, camera);

function animate() {
  const rotate = (i) => Math.sin(elapsedTime + i) * Math.PI * 0.25;

  controls.update();

  const elapsedTime = clock.getElapsedTime();

  if (cursor.x !== 0 || cursor.y !== 0)
    camera.position.set(
      lastPos.x * 5 * Math.PI,
      lastPos.x * 5 * Math.PI,
      lastPos.y * 5 * Math.PI
    );

  camera.lookAt(textGroup.position);

  textGroup.rotation.set(
    lastPos.x * 1.5 * Math.PI * Math.sin(elapsedTime),
    lastPos.y * 1.5 * Math.PI,
    lastPos.x * 1.5 * Math.PI * Math.cos(elapsedTime)
  );

  allGeo.forEach((geo, i) => geo.rotation.set(rotate(i), 0, rotate(i)));

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
}
animate();
