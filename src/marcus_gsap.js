import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

const coin = await new Promise(res => new GLTFLoader().load("./static/roman_coin/scene.gltf", res))
const bust = await new Promise(res => new GLTFLoader().load("./static/marcus_aurelius/bust/scene.gltf", res))
const standard = await new Promise(res => new GLTFLoader().load("./static/marcus_aurelius/standard/scene.gltf", res))

let s0;
let s1;
let s2;
let s3;

let container;
let camera;
let renderer;
let scene;
let box;

function init() {

    container = document.querySelector(".scene.one");

    //Create scene
    scene = new THREE.Scene();

    const fov = 90;
    const aspect = container.clientWidth/container.clientHeight;
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

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);


    function render() {
      renderer.render(scene, camera);
    }



    /* BUST */
    bust.scene.scale.set(1, 1, 1);
    bust.scene.position.set(-2.5, 15, 0);
    bust.scene.rotation.set(0, 185, 0);

    /* Standard */
    s0 = standard.scene.clone();
    s1 = standard.scene.clone();
    s2 = standard.scene.clone();
    s3 = standard.scene.clone();

    s0.scale.set(3, 3, 3);
    s0.position.set(2.5, 15, 2);
    s0.rotation.set(0, 185, 0);

    s1.scale.set(3, 3, 3);
    s1.position.set(.25, 15, 1);
    s1.rotation.set(0, 185, 0);

    s2.scale.set(3, 3, 3);
    s2.position.set(-2, 15, 0);
    s2.rotation.set(0, 185, 0);

    s3.scale.set(3, 3, 3);
    s3.position.set(-4, 15, -1);
    s3.rotation.set(0, 185, 0);
    
    scene.add(coin.scene);
    scene.add(bust.scene);
    scene.add(s0);
    scene.add(s1);
    scene.add(s2);
    scene.add(s3);

    animate();
  }

  function animate() {
    requestAnimationFrame(animate);      
    renderer.render(scene, camera);
  }

  init();

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener("resize", onWindowResize);

  gsap.registerPlugin(ScrollTrigger);
  
  scene.rotation.set(0, 3, 0)
  camera.position.set(2, 0, 7)
  
  ScrollTrigger.defaults({
    immediateRender: false,
    ease: "power1.inOut",
    scrub: true,
  });
  
  let car_anim = gsap.timeline()

  /* BUST */
  // Bust Y
  car_anim.to(bust.scene.position, { y: 0, scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "top top",
  }})
  car_anim.to(bust.scene.position, { y: -20, scrollTrigger: {
    trigger: ".section-three",
    start: "bottom bottom",
    end: "bottom top",
  }}) 
  // Bust Rotation
   car_anim.to(bust.scene.rotation, { y: 180, scrollTrigger: {
    trigger: ".section-three",
    start: "top bottom",
    end: "top top",
  }})
  car_anim.to(bust.scene.rotation, { y: 190, scrollTrigger: {
    trigger: ".section-three",
    start: "bottom bottom",
    end: "bottom top",
  }}) 

  /* STANDARD 1 */
  // S0 Y
  car_anim.to(s0.position, { y: 0, 
    ease: "elastic.inOut(2, 0.5)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(s0.position, { y: 40, scrollTrigger: {
    trigger: ".section-four",
    start: "bottom bottom",
    end: "bottom top",
  }})
  // S1 Y
  car_anim.to(s1.position, { y: 0, 
    ease: "elastic.inOut(2, 0.5)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(s1.position, { y: 40, scrollTrigger: {
    trigger: ".section-four",
    start: "bottom bottom",
    end: "bottom top",
  }})
  // S2 Y
  car_anim.to(s2.position, { y: 0, 
    ease: "elastic.inOut(2, 0.5)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(s2.position, { y: 40, scrollTrigger: {
    trigger: ".section-four",
    start: "bottom bottom",
    end: "bottom top",
  }}) 
  // S3 Y
  car_anim.to(s3.position, { y: 0, 
    ease: "elastic.inOut(2, 0.5)",
    scrollTrigger: {
      trigger: ".section-four",
      start: "top bottom",
      end: "top top",
  }})
  car_anim.to(s3.position, { y: 40, scrollTrigger: {
    trigger: ".section-four",
    start: "bottom bottom",
    end: "bottom top",
  }}) 