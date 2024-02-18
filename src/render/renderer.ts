import * as THREE from "three";
import "../style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RobotRender } from "./robot_renderer";

interface WindowSize {
  width: number;
  height: number;
}

function setGroundFloor(): THREE.Mesh {
  const groundFloor = new THREE.PlaneGeometry(600, 600, 1, 1);
  const groundMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xdddddd,
    roughness: 0.5,
  });
  const groundMesh = new THREE.Mesh(groundFloor, groundMaterial);
  return groundMesh;
}

function setLighting(): THREE.Light[] {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  const rectLight = new THREE.RectAreaLight(0xffffff, 100, 200, 200);
  rectLight.lookAt(0, 0, 0);
  rectLight.position.set(0, 1500, 0);
  rectLight.rotation.set(-Math.PI / 2, 0, 0);
  rectLight.castShadow = true;
  return [ambientLight, rectLight];
}

export function setScene(robotRender: RobotRender): THREE.Scene {
  // Add robot & ground floor
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  group.add(robotRender.getRender());
  group.add(setGroundFloor());

  // Correct positioning for readable display
  group.rotateX(-Math.PI / 2);
  group.translateY(-200);
  scene.add(group);

  // Add lighting
  const lights = setLighting();
  lights.map((light) => {
    scene.add(light);
  });

  return scene;
}

function setCamera(
  scene: THREE.Scene,
  sizes: WindowSize
): THREE.PerspectiveCamera {
  const cam = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    10,
    5000
  );
  cam.position.x = 700;
  cam.position.y = 700;
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
