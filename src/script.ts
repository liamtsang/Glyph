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

function addText(text, y, z, rotate, color){
  loader.load( 'static/fonts/OffBit/OffBit_Trial_Bold.json', function ( font: any ) {
    const geometry1 = new TextGeometry( text, {
      font: font,
      size: 0.2,
      height: 0.00001,
      bevelEnabled: false,
    } );
    
    const materials = new THREE.MeshPhongMaterial( { color: color,transparent: true});
    const textMesh1 = new THREE.Mesh( geometry1, materials );
  
    var center1 = new THREE.Vector3();
    textMesh1.geometry.computeBoundingBox();
    textMesh1.geometry.boundingBox.getCenter(center1);
    textMesh1.geometry.center();
    textMesh1.position.y = y;
    textMesh1.rotation.y = rotate;
    textMesh1.position.z = z;

    scene.add(textMesh1);
  } );
}

addText("Marcus Aurelius Antoninus", 2, 0, 2*Math.PI, '#ffffff');
addText("Marcus Aurelius Antoninus", 2, -.001, 2*Math.PI, '#000000');
addText("Harmony of the emperor", -1, 0, Math.PI, '#ffffff');
addText("Harmony of the emperor", -1, .001, Math.PI, '#000000');
addText("holder of tribunician power", -1.25, 0, Math.PI, '#ffffff');
addText("holder of tribunician power", -1.25, .001, Math.PI, '#000000');
addText("for the 16th time", -1.5, 0, Math.PI, '#ffffff');
addText("for the 16th time", -1.5, .001, Math.PI, '#000000');
addText("consul for the third time", -1.75, 0, Math.PI, '#ffffff');
addText("consul for the third time", -1.75, .001, Math.PI, '#000000');


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

const tick = () => {
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera);
  CSSrenderer.render( scene, camera );

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
