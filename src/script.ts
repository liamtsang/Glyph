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
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
//@ts-ignore
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

//@ts-ignore
import * as dat from "lil-gui";

// Debug
//const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

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
camera.position.set(2, 2.5, 2);
camera.lookAt(0, 2.5, 0);
scene.add(camera);

/**
 * Coin
 */
//GLTFLoader
const gltfLoader = new GLTFLoader();

gltfLoader.load("./static/roman_coin/scene.gltf", (gltf: any) => {
  gltf.scene.scale.set(100, 100, 100);
  gltf.scene.position.set(0, .5, 0);
  scene.add(gltf.scene);
});

/**
 * Text
 */
const loader = new FontLoader();
const font = await new Promise(res => new FontLoader().load('static/fonts/IBM Plex Mono/IBM Plex Mono_Regular.json', res))
const geo = new TextGeometry("hello", { 
  font: font,
  size: 0.2,
  height: 0.00001,
  bevelEnabled: false,})
const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial())


function addText(y, z, rotate, color){
  const materials = new THREE.MeshBasicMaterial( { color: color,transparent: true,depthWrite: false,});
  console.log(materials);
  
  var center1 = new THREE.Vector3();
  mesh.geometry.computeBoundingBox();
  mesh.geometry.boundingBox.getCenter(center1);
  mesh.geometry.center();
  mesh.position.y = y;
  mesh.rotation.y = rotate;
  mesh.position.z = z;
  return mesh;
}

let t1 = await addText(2, 0, 2*Math.PI, '#ffffff');

//let t1 = await addText("Marcus Aurelius Antoninus", 2, 0, 2*Math.PI, '#ffffff');
//addText("Marcus Aurelius Antoninus", 2, -.001, 2*Math.PI, '#000000');
//let b1 = addText("Harmony of the emperor", -1, 0, Math.PI, '#ffffff');
//addText("Harmony of the emperor", -1, .001, Math.PI, '#000000');
//let b2 = addText("holder of tribunician power", -1.25, 0, Math.PI, '#ffffff');
//addText("holder of tribunician power", -1.25, .001, Math.PI, '#000000');
//let b3 = addText("for the 16th time", -1.5, 0, Math.PI, '#ffffff');
//addText("for the 16th time", -1.5, .001, Math.PI, '#000000');
//let b4 = addText("consul for the third time", -1.75, 0, Math.PI, '#ffffff');
//addText("consul for the third time", -1.75, .001, Math.PI, '#000000');

console.log(t1);
scene.add(t1);
t1.visible =false;

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

const grids = new THREE.Group();
grids.add(grid);
grids.add(grid2);
grids.add(grid3);

scene.add(grids);
camera.attach(grids);


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
 * Controls */
const controls = new OrbitControls(camera, canvas);
//controls.minPolarAngle = Math.PI/2;
//controls.maxPolarAngle = Math.PI/2;

controls.target.set(0, 0, 0);
controls.enableDamping = true;

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

let CSSrenderer: any;
CSSrenderer = new CSS3DRenderer(canvas);
CSSrenderer.setSize( window.innerWidth, window.innerHeight );

//Color Management
THREE.ColorManagement.enabled = true;
THREE.ColorManagement.legacyMode = false;

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

/**
 * Animate
 */

/* Rotation Check */
function checkRotation(){
  if (camera.rotation.z > 1 || camera.rotation.z < -1) {
    t1.visible = false
  } else {
    t1.visible = true
  }
}

const tick = () => {
  // Update controls
  controls.update()
  checkRotation()
  // Render
  renderer.render(scene, camera);
  CSSrenderer.render( scene, camera );

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
