import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

function addModelToBG() {

  //Variables for setup

  let container;
  let camera;
  let renderer;
  let scene;
  let box;

  function init() {

    container = document.querySelector(".scene.one");

    //Create scene
    scene = new THREE.Scene();

    const fov = 35;
    const aspect = container.clientWidth/container.clientHeight;
    const near = 0.9;
    const far = 1000;

    //Camera setup
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

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

    const gltfLoader = new GLTFLoader();

    gltfLoader.load("./static/roman_coin/scene.gltf", (gltf) => {
      gltf.scene.scale.set(75, 75, 75);
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.rotation.set(0, 0, 0);

      scene.add(gltf.scene);
      animate();
    });
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
    
   // Full Height

   car_anim.to(scene.rotation, { y: 6, scrollTrigger: {
      
    trigger: ".section-one",
    endTrigger: ".section-three",
    end: "top bottom",          
  }})


  // Slide 2

  car_anim.to(camera.position, { x: 0, scrollTrigger: {
    
    trigger: ".section-two",
    
    start: "top bottom",
    end: "top top",
  }}) 

  car_anim.to(camera.position, { x: -0.5, scrollTrigger: {
    trigger: ".section-three",
    
    start: "top bottom",
    end: "top top",
  }}) 
  
  
  car_anim.to(camera.position, { x: .5, scrollTrigger: {
    trigger: ".section-four",
    start: "top bottom",     

    end: "bottom bottom",        
  }})

  car_anim.to(scene.rotation, { y: 3, scrollTrigger: {
    trigger: ".section-four",
    start: "top bottom", 

    end: "bottom bottom",    
  }})

  car_anim.to("#section-five", {
    motionPath: {
        path: "#path",
        align: "#path",
        alignOrigin: [0.5, 0.5],
        autoRotate: true
    },
    transformOrigin: "50% 50%",
    duration: 5,
    ease: "power1.inOut"
});

}
addModelToBG();