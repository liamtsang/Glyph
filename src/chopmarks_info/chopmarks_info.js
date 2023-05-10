import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// URLS
import shipurl from "../../public/static/chopmarks/ship/junk_ship.glb?url"
import stampurl from "../../public/static/chopmarks/stamp/stamp.glb?url"
import stallurl from "../../public/static/chopmarks/stall_decimated/market_stall.glb?url"

const loadingManager = new THREE.LoadingManager( () => {
  const loadingScreen = document.getElementById( 'loading-screen' );
  loadingScreen.classList.add( 'fade-out' );
  // optional: remove loader from DOM via event listener
  loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
} );

const ship = await new Promise(res => new GLTFLoader(loadingManager).load(shipurl, res))
const stamp = await new Promise(res => new GLTFLoader(loadingManager).load(stampurl, res))
const stall = await new Promise(res => new GLTFLoader(loadingManager).load(stallurl, res))

let s0, s1, s2, s3;
let sh0, sh1, sh2, sh3;
let sht0, sht1, sht2, sht3;
const grids = new THREE.Group();

let container;
let camera;
let renderer;
let scene;
let box;

function init() {
    container = document.querySelector(".scene.one");

    //Create scene
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x111111);

    const fov = 90;
    const aspect = container.clientWidth/(container.clientHeight/2);
    const near = 0.9;
    const far = 1000;

    //Camera setup
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    //Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setSize(container.clientWidth, (container.clientHeight/2));
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);


    function render() {
      renderer.render(scene, camera);
    }
    /* CAMERA */
    scene.rotation.set(0, 0, 0)
    camera.position.set(0, 4, 0)

    /* GRID HELPER */
    // const gridHelper = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
    // gridHelper.position.set(0, -2, -10);
    // gridHelper.rotation.set(-.3, 0, 0);
    // scene.add(gridHelper);
    const grid = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
    const grid2 = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
    grid2.rotation.x = Math.PI / 2;
    grid2.position.set(0, 5, -5);
    const grid3 = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
    grid3.rotation.x = Math.PI / 2;
    grid3.rotation.z = Math.PI / 2;
    grid3.position.set(-5, 5, 0);
    const grid4 = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
    grid4.rotation.z = Math.PI / 2;
    grid4.position.set(5, 5, 0);
    grid4.rotation.x = Math.PI / 2;
    const grid5 = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
    grid5.position.set(0, 10, 0);
    grids.add(grid, grid2, grid3, grid4, grid5);
    grids.position.set(0, 20 , -3);
    grids.rotation.set(0, Math.PI/4 , 0);
    scene.add(grids);

    /* SHIP */
    ship.scene.scale.set(.8, .8, .8);
    ship.scene.position.set(20, 0, -5);
    ship.scene.rotation.set(0, 0, 0);

    /* STAMP */
    stamp.scene.scale.set(20, 20, 20);
    stamp.scene.rotation.set(0, Math.PI/2, 0);
    stamp.scene.position.set(0, 20, -3);
    
    /* STALL */
    stall.scene.scale.set(2,2,2);
    stall.scene.rotation.set(0, -Math.PI, 0);
    stall.scene.position.set(0, -20, -4);
    
    scene.add(ship.scene);
    scene.add(stamp.scene);
    scene.add(stall.scene);

    animate();
  }

  function animate() {
    requestAnimationFrame(animate);      
    renderer.render(scene, camera);
  }

  init();

  function onWindowResize() {
    camera.aspect = container.clientWidth / (container.clientHeight/2);
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, (container.clientHeight/2));
  }

  window.addEventListener("resize", onWindowResize);

  gsap.registerPlugin(ScrollTrigger);
  
  ScrollTrigger.defaults({
    immediateRender: false,
    ease: "power1.inOut",
    scrub: true,
    scroller: "html"
  });
  
  let car_anim = gsap.timeline()

  /* GRID */
  car_anim.to(grids.position, { y: 0, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-two",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(grids.rotation, { y: 0, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(grids.position, { z: 10, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-six",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(camera.rotation, { x: Math.PI/2, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-five",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(camera.position, { z: -3, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-five",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(camera.position, { y: 5, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-five",
      start: "top bottom",
      end: "top top",
  }})


  /* BUST */
  // Bust Y
  car_anim.to(ship.scene.position, { y: 3, scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "top top",
  }})
  car_anim.to(ship.scene.position, { x: -2, scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "top top",
  }})
  car_anim.to(ship.scene.position, { x: -20, scrollTrigger: {
    trigger: ".section-three",
    start: "bottom bottom",
    end: "bottom top",
  }}) 
  // Bust Rotation
   car_anim.to(ship.scene.rotation, { y: 3.14/2, scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "top top",
  }})

  /* BOOK */
  car_anim.to(stall.scene.position, { y: 12, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "bottom top",
  }}) 
  car_anim.to(stall.scene.position, { y: -20, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "bottom bottom",
      end: "bottom top",
  }}) 
  
  /* SHIELD 1 */
  // S0 Y
  car_anim.to(stamp.scene.position, { y: 6.5, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-five",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(stamp.scene.position, { z: 6.5, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-five",
      start: "bottom bottom",
      end: "bottom top",
  }})
