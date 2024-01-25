import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

// Window sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Cube
// const geometry = new THREE.BoxGeometry(10, 10, 100);

const geometry = new THREE.SphereGeometry(3, 64, 64);
// const geometry = new THREE.SphereGeometry(10, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff83 });
// const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Light
const light = new THREE.PointLight(0xffffff, 50, 100);
light.position.set(0, 10, 10);
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.y = 0;
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");

if (canvas == null) {
  throw new Error("Cannot create canvas, no webgl HTML class defined.");
}

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
});

// Re-render the view as screen is resized
const loop = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();
