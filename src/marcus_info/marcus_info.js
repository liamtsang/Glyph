import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// URLS
import coinurl from "../../public/static/marcus_aurelius/coin_decimated/coin.glb?url";
import busturl from "../../public/static/marcus_aurelius/bust_decimate/bust.glb?url"
import shieldurl from "../../public/static/marcus_aurelius/shield/roman_scutum_shield.glb?url"
import bookurl from "../../public/static/marcus_aurelius/book/book.glb?url"

const loadingManager = new THREE.LoadingManager( () => {
  const loadingScreen = document.getElementById( 'loading-screen' );
  loadingScreen.classList.add( 'fade-out' );
  // optional: remove loader from DOM via event listener
  loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
} );
function onTransitionEnd( event ) {
	const element = event.target;
	element.remove();
}

const coin = await new Promise(res => new GLTFLoader(loadingManager).load(coinurl, res))
const bust = await new Promise(res => new GLTFLoader(loadingManager).load(busturl, res))
const shield = await new Promise(res => new GLTFLoader(loadingManager).load(shieldurl, res))
const book = await new Promise(res => new GLTFLoader(loadingManager).load(bookurl, res))

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

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
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

    /* COIN */
    coin.scene.scale.set(.075, .075, .075);
    coin.scene.position.set(0, 24, -5);
    coin.scene.rotation.set(0, 0, 0);

    /* BUST */
    bust.scene.scale.set(.8, .8, .8);
    bust.scene.position.set(0, 30, -5);
    bust.scene.rotation.set(0, 5, 0);

    /* SHIELD */
    shield.scene.scale.set(2, 2, 2);
    shield.scene.rotation.set(.1, 0, 0);
    sh0 = shield.scene.clone();
    sh1 = shield.scene.clone();
    sh2 = shield.scene.clone();
    sh3 = shield.scene.clone();
    sh0.position.set(3, 20, -5);
    sh1.position.set(1, 20, -5);
    sh2.position.set(-1, 20, -5);
    sh3.position.set(-3, 20, -5 );

    /* SHIELD TOP */
    sht0 = shield.scene.clone();
    sht0.rotation.set(-Math.PI/2, 0, 0);
    sht1 = sht0.clone();
    sht2 = sht0.clone();
    sht3 = sht0.clone();
    sht0.position.set(3, 20, -5.1);
    sht1.position.set(1, 20, -5);
    sht2.position.set(-1, 20, -5);
    sht3.position.set(-3, 20, -5 );

    /* BOOK */
    book.scene.scale.set(5.5, 5.5, 5.5);
    book.scene.rotation.set(0, Math.PI/2, 0);
    book.scene.position.set(0, 20, -2);

    scene.add(coin.scene);
    scene.add(bust.scene);
    scene.add(book.scene);
    scene.add(sh0,sh1,sh2,sh3);
    scene.add(sht0,sht1,sht2,sht3);
    animate();
  }

  function animate() {
    requestAnimationFrame(animate);      
    renderer.render(scene, camera);

    /* Animations */
    coin.scene.rotation.y += 0.0025;
  }

  init();

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
  car_anim.to(grids.position, { z: 2, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-five",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(grids.position, { y: 20, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-six",
      start: "top bottom",
      end: "top top",
  }})
  
  /* COIN */
  car_anim.to(coin.scene.position, { y: 4, scrollTrigger: {
    trigger: ".section-two",
    start: "top bottom",
    end: "top top",
  }})
  car_anim.to(coin.scene.position, { x: -20, scrollTrigger: {
    trigger: ".section-two",
    start: "bottom bottom",
    end: "bottom top",
  }}) 

  /* BUST */
  // Bust Y
  car_anim.to(bust.scene.position, { y: 4, scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "top top",
  }})
  car_anim.to(bust.scene.position, { x: -20, scrollTrigger: {
    trigger: ".section-three",
    start: "bottom bottom",
    end: "bottom top",
  }}) 
  // Bust Rotation
   car_anim.to(bust.scene.rotation, { y: 0, scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "top top",
  }})

  /* SHIELD 1 */
  // S0 Y
  car_anim.to(sh0.position, { y: 0, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(sh0.position, { y: 20, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "bottom bottom",
      end: "bottom top",
  }})
  // S1 Y
  car_anim.to(sh1.position, { y: 0, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(sh1.position, { y: 20, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "bottom bottom",
      end: "bottom top",
  }})
  // S2 Y
  car_anim.to(sh2.position, { y: 0, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(sh2.position, { y: 20, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "bottom bottom",
      end: "bottom top",
  }}) 
  // S3 Y
  car_anim.to(sh3.position, { y: 0, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(sh3.position, { y: 20, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "bottom bottom",
      end: "bottom top",
  }}) 

  /* SHIELD TOP */
  // S0 Y
  car_anim.to(sht0.position, { y: 4.3, 
    ease: "back.in(0)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(sht0.position, { y: 20, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "bottom bottom",
      end: "bottom top",
  }})
  // S1 Y
  car_anim.to(sht1.position, { y: 4.3, 
    ease: "back.in(0)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(sht1.position, { y: 20, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "bottom bottom",
      end: "bottom top",
  }})
  // S2 Y
  car_anim.to(sht2.position, { y: 4.3, 
    ease: "back.in(0)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(sht2.position, { y: 20, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "bottom bottom",
      end: "bottom top",
  }}) 
  // S3 Y
  car_anim.to(sht3.position, { y: 4.3, 
    ease: "back.in(0)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(sht3.position, { y: 20, 
    scrollTrigger: {
      trigger: ".section-four",
      start: "bottom bottom",
      end: "bottom top",
  }}) 

  /* BOOK */
  car_anim.to(book.scene.position, { y: -1.5, 
    scrollTrigger: {
      trigger: ".section-five",
      start: "top bottom",
      end: "bottom top",
  }}) 