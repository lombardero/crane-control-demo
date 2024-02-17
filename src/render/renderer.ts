import * as THREE from "three";
import "../style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RobotRender } from "./robot_renderer";

interface WindowSize {
  width: number;
  height: number;
}

export function setScene(robotRender: RobotRender): THREE.Scene {
  const scene = new THREE.Scene();
  scene.add(robotRender.getRender());

  return scene;
}

function setCamera(
  scene: THREE.Scene,
  sizes: WindowSize
): THREE.PerspectiveCamera {
  // Camera
  const cam = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    10,
    5000
  );
  cam.position.x = 1000;
  scene.add(cam);

  return cam;
}

function setRenderer(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  sizes: WindowSize
) {
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

  return renderer;
}

function setResizeLoop(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  sizes: WindowSize
): void {
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
}

export function set3DView(scene: THREE.Scene): void {
  // Window sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const camera = setCamera(scene, sizes);
  const renderer = setRenderer(scene, camera, sizes);

  setResizeLoop(scene, camera, renderer, sizes);
}
