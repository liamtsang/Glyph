import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

// URLS
import busturl from "../../public/static/marcus_aurelius/coin_decimated/coin.glb?url";
import fonturl from "../../public/static/fonts/Work Sans/Work Sans Medium_Regular.json?url";

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

gltfLoader.load(busturl, (gltf) => {
  gltf.scene.scale.set(.025, .025, .025);
  gltf.scene.position.set(0, 0, 0);
  console.log(gltf)
  const box = new THREE.Box3().setFromObject( gltf.scene );
  const center = box.getCenter( new THREE.Vector3() );

  gltf.scene.position.x += ( gltf.scene.position.x - center.x );
  gltf.scene.position.y += ( gltf.scene.position.y - center.y );
  gltf.scene.position.z += ( gltf.scene.position.z - center.z );
  scene.add(gltf.scene);
});



/**
 * Text
 */
const font = await new Promise(res => new FontLoader().load(fonturl, res))
const frontTextGroup = new THREE.Group();
const backTextGroup = new THREE.Group();

function addText(text, x, y, z, rotate, color){
  const geo = new TextGeometry(text, { 
    font: font,
    size: 0.15,
    height: 0.001,
    bevelEnabled: false,})
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: color,
  }))
  var center1 = new THREE.Vector3();
  mesh.geometry.computeBoundingBox();
  mesh.geometry.boundingBox.getCenter(center1);
  // mesh.geometry.center(); 

  mesh.position.x = x;
  mesh.position.y = y;
  mesh.rotation.y = rotate;
  mesh.position.z = z;
  return mesh;

}

/* Text Additions */

let f1 = addText("↪ Info", .75, -.65, 0, Math.PI, '#E71616');
let f2 = addText("Marcus Aurelius", .75, -.85, 0, Math.PI, '#ffffff');
let f3 = addText("Rome, Italy", .75, -1.05, 0, Math.PI, '#ffffff');
let f4 = addText("161 AD", .75, -1.25, 0, Math.PI, '#ffffff');
let f5 = addText("Silver", .75, -1.45, 0, Math.PI, '#ffffff');

let b1 = addText("↓ Translation", 1, -.65, 0, Math.PI, '#E71616');
let b2 = addText("Harmony of the emperor", 1, -.85, 0, Math.PI, '#ffffff');
let b3 = addText("Holder of tribunician power", 1, -1.05, 0, Math.PI, '#ffffff');
let b4 = addText("for the 16th time, consul", 1, -1.25, 0, Math.PI, '#ffffff');
let b5 = addText("for the third time", 1, -1.45, 0, Math.PI, '#ffffff');

let f6 = addText("↓ Translation", .75, 1.6, 0, Math.PI, '#E71616');
let f7 = addText("Supreme commander", .75, 1.4, 0, Math.PI, '#ffffff');
let f8 = addText("Marcus Aurelius ", .75, 1.20, 0, Math.PI, '#ffffff');
let f9 = addText("Antoninus, Emperor", .75, 1, 0, Math.PI, '#ffffff');

frontTextGroup.add(f1,f2,f3,f4,f5,f6,f7,f8,f9);
frontTextGroup.position.set(0, -.25, 0);
frontTextGroup.rotation.y = Math.PI;
scene.add(frontTextGroup);

backTextGroup.add(b1,b2,b3,b4,b5,);
backTextGroup.position.set(0, 2.25, 0);
backTextGroup.rotation.y = 0
scene.add(backTextGroup);

/**
 * Grids
 */
const grid = new THREE.GridHelper(10, 10, 0x444444, 0x444444);

const grid2 = new THREE.GridHelper(10, 10, 0x444444, 0x444444);
grid2.rotation.x = Math.PI / 2;
grid2.position.set(0, 5, -5);

const grid3 = new THREE.GridHelper(10, 10, 0x444444, 0x444444);
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

let CSSrenderer;
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
  if ( camera.rotation.z > -Math.PI/2 && camera.rotation.z < Math.PI/2 ) {
    frontTextGroup.visible = true
    backTextGroup.visible = false
  } else {
    frontTextGroup.visible = false
    backTextGroup.visible = true
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
