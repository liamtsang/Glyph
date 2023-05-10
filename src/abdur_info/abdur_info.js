import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// URLS
import coinurl from "../../public/static/abdur_rahman/coin/coin.glb?url";
import flagurl from "../../public/static/abdur_rahman/flag/scene.glb?url"
import rifleurl from "../../public/static/abdur_rahman/rifle/rifle.glb?url"

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
const flag = await new Promise(res => new GLTFLoader(loadingManager).load(flagurl, res))
const rifle = await new Promise(res => new GLTFLoader(loadingManager).load(rifleurl, res))

const grids = new THREE.Group();
const rifleGroup = new THREE.Group();
var clock = new THREE.Clock();
let mixer;
let container;
let camera;
let renderer;
let scene;

function init() {
    container = document.querySelector(".scene.one");

    //Create scene
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x111111);

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

    /* coin */
    coin.scene.scale.set(2, 2, 2);
    coin.scene.position.set(0, 20, -5);
    coin.scene.rotation.set(0, Math.PI/2, 0);

    /* flag */
    flag.scene.scale.set(.004, .004, .004);
    flag.scene.position.set(20, 0, -6);
    flag.scene.rotation.set(0, 0, 0);

    /* rifle */
    rifle.scene.scale.set(.01,.01,.01);
    for (let i = 0; i < 9; i++) {
      let clone = rifle.scene.clone();
      clone.position.set(-i, 0, 0);
      clone.rotation.set(0, 0, Math.PI/2);
      rifleGroup.add(clone);
    }
    rifleGroup.rotation.set(0, 0, 0);
    rifleGroup.position.set(4.1, 20, -5);
    
    scene.add(flag.scene);
    scene.add(coin.scene);
    scene.add(rifleGroup);

    animate();
  }

  function animate() {
    // var delta = clock.getDelta();
		// if ( mixer ) mixer.update( delta );
    requestAnimationFrame(animate);      
    renderer.render(scene, camera);
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
      trigger: ".section-three",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(grids.position, { z: -8, 
    ease: "back.out(0)",
    scrollTrigger: {
      trigger: ".section-four",
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


  /* Coin */
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

  /* Flag */
  car_anim.to(flag.scene.position, { y: 0, scrollTrigger: {
    trigger: ".section-four",
    start: "top bottom",
    end: "top top",
  }})
  car_anim.to(flag.scene.position, { x: -7, scrollTrigger: {
    trigger: ".section-four",
    start: "top bottom",
    end: "bottom top",
  }})
  car_anim.to(flag.scene.position, { x: -20, scrollTrigger: {
    trigger: ".section-four",
    start: "bottom bottom",
    end: "bottom top",
  }}) 
  // Bust Rotation
   car_anim.to(flag.scene.rotation, { y: 3.14/2, scrollTrigger: {
    trigger: ".section-four",
    start: "top bottom",
    end: "top top",
  }})

  /* rifle */
  car_anim.to(rifleGroup.position, { y: -2, 
    scrollTrigger: {
      trigger: ".section-three",
      start: "top bottom",
      end: "bottom top",
  }}) 
  car_anim.to(rifleGroup.position, { y: -20, 
    scrollTrigger: {
      trigger: ".section-three",
      start: "bottom bottom",
      end: "bottom top",
  }}) 
