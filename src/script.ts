//@ts-ignore
import * as THREE from "three";
//@ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//@ts-ignore
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
//@ts-ignore
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

//@ts-ignore
import * as dat from "lil-gui";

// Debug
//const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Coin
 */

//GLTFLoader
const gltfLoader = new GLTFLoader();

gltfLoader.load("./static/roman_coin/scene.gltf", (gltf: any) => {
  gltf.scene.scale.set(75, 75, 75);
  gltf.scene.position.set(0, 2.25, 0);
  scene.add(gltf.scene);

  //Rotate Scroll
  window.addEventListener("wheel", onMouseWheel);
  function onMouseWheel(event: any) {
    gltf.scene.rotation.y += event.deltaY * 0.001;
  }
});

/**
 * Text
 */
const loader = new FontLoader();
const marcus = ["S", "U", "C", "R", "A", "M"];
const aurelius = ["S", "U", "I", "L", "E", "R", "U", "A"];

const textMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  flatShading: true,
});
const marcusTextGroup = new THREE.Group();
const aureliusTextGroup = new THREE.Group();

loader.load(
  "./static/fonts/OffBit/OffBit_Trial_Bold.json",
  function (font: any) {
    textGenerate(font);
  }
);

//Drawing text on mouse event
function textGenerate(font: any) {
  var split: any = 3;
  window.addEventListener("wheel", onMouseWheel);
  function onMouseWheel(event: any) {
    console.log(split);
    split += event.deltaY * 0.01;
    if (split < -1) {
      split = 0;  
    }
    if( split < 11){
      drawText(split, font, marcus, 5);
      drawText(split, font, aurelius, 4);
    }
  }
}

function drawText(split: any, font: any, textin: any, height: any) {
  const textGroup = new THREE.Group();
  const text = textin;
  for (let i = 0; i < text.length; i++) {
    const textGeo = new TextGeometry(text[i], {
      font: font,
      size: 1,
      height: 0.01,
    });
    if (i >= split) {
      const textMesh1 = new THREE.Mesh(textGeo, textMat);
      textMesh1.rotation.y = Math.PI / 2;
      textMesh1.translateX(i * -1 + split - 1);
      textMesh1.translateY(height);
      textGroup.add(textMesh1);
    } else if (i < split) {
      const textMesh1 = new THREE.Mesh(textGeo, textMat);
      textMesh1.translateX(i * -1 + split - 1);
      textMesh1.translateY(height);
      textGroup.add(textMesh1);
    }
    textGroup.position.set(-5, 0, -5);
    if (textin == marcus) {
      marcusTextGroup.add(textGroup);
      scene.add(marcusTextGroup);
      removeObject3D(marcusTextGroup.children[i]);
    }
    if (textin == aurelius) {
      aureliusTextGroup.add(textGroup);
      scene.add(aureliusTextGroup);
      removeObject3D(aureliusTextGroup.children[i]);
    }
  }
}

/**
 * Remove Object
 */
function removeObject3D(object3D: any) {
  if (!(object3D instanceof THREE.Object3D)) return false;

  // for better memory management and performance
  if (object3D.geometry) object3D.geometry.dispose();

  if (object3D.material) {
    if (object3D.material instanceof Array) {
      // for better memory management and performance
      object3D.material.forEach((material: any) => material.dispose());
    } else {
      // for better memory management and performance
      object3D.material.dispose();
    }
  }
  object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
  return true;
}

/**
 * Grids
 */
const grid = new THREE.GridHelper(10, 10, 0xccddee, 0xccddee);

const grid2 = new THREE.GridHelper(10, 10, 0xccddee, 0xccddee);
grid2.rotation.x = Math.PI / 2;
grid2.position.set(0, 5, -5);

const grid3 = new THREE.GridHelper(10, 10, 0xccddee, 0xccddee);
grid3.rotation.x = Math.PI / 2;
grid3.rotation.z = Math.PI / 2;
grid3.position.set(-5, 5, 0);

scene.add(grid);
scene.add(grid2);
scene.add(grid3);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  80,
  sizes.width / sizes.height,
  0.1,
  100
);
var cameraScroll = 0;
window.addEventListener("wheel", onMouseWheel);
  function onMouseWheel(event: any) {
    cameraScroll += event.deltaY * 0.001;
    if (cameraScroll > 0 && cameraScroll < 2.07) {
      camera.lookAt(cameraScroll, 2.5, 0);
    } else if (cameraScroll < 1) {
      camera.lookAt(0, 2.5, 0);
    }
  }
camera.position.set(2, 2.5, 2);
camera.lookAt(0, 2.5, 0);
scene.add(camera);

/**
 * Controls 
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;
*/

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Color Management
THREE.ColorManagement.enabled = true;
THREE.ColorManagement.legacyMode = false;

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

/**
 * Animate
 */

const tick = () => {
  // Update controls
  //controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
