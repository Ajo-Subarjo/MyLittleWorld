import * as THREE from 'three/webgpu';
import { array, pass, vec3 } from 'three/tsl';
// import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js';

import { render } from 'solid-js/web';
import ProjectScreen from './project_screen.jsx';

import { Player } from './player.js';
import { StaticObject, InteractAbleObject } from './object.js'
import { Physics } from './physics.js';
import { PhysicsDebug } from './debug.js';
import get_texture from './get_texture.js';




async function Main() {

  const canvas = document.querySelector('#canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  // const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const renderer = new THREE.WebGPURenderer({ canvas, antialias: true});
  await renderer.init();

  render(
    () => <ProjectScreen />,
    document.getElementById('root')
  )


  let Interact = []

  const renderPipeline = new THREE.RenderPipeline(renderer);
  const scenePass = pass(scene, camera);

  const colorNode = scenePass.getTextureNode('output');
  // const viewZNode = scenePass.getViewZNode();
  
  

  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(10,20,10);
  scene.add(sun)

  scene.background = new THREE.Color(0x3b414d)
  scene.fog = new THREE.FogExp2(0x3b414d, 0.0175);  

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0x3b414d);


  renderPipeline.outputNode = colorNode;
  // renderPipeline.outputNode = dof(
  //   colorNode,
  //   viewZNode,
  //   10.0,
  //   5.0,
  //   0.0 
  // );




  const physics = await Physics.create();
  const player = new Player(scene, physics);

  createObject()

  const debug = new PhysicsDebug(scene,physics);
  const Timer = new THREE.Timer();



  function animate() {
    requestAnimationFrame(animate);

    Timer.update();
    const delta = Timer.getDelta();

    physics.update();
    player.update(delta);
    debug.update();

    const offset = new THREE.Vector3(0, 60, 50);
    camera.position.copy(player.mesh.position).add(offset);
    camera.lookAt(player.mesh.position);

    Interact[0].update(player, delta)


    // renderer.render(scene, camera);
    renderPipeline.render();

  }
  animate();

  



  function createObject() {
    const wallRight = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(5,10,200),
      new THREE.MeshStandardMaterial({visible: false}),
      new THREE.Vector3(100,0,0)
    );
    const wallLeft = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(5,10,200),
      new THREE.MeshStandardMaterial({visible: false}),
      new THREE.Vector3(-100,0,0)
    );
    const wallBack = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(200,10,5),
      new THREE.MeshStandardMaterial({visible: false}),
      new THREE.Vector3(0,0,100)
    );
    const wallFront = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(200,10,5),
      new THREE.MeshStandardMaterial({visible: false}),
      new THREE.Vector3(0,0,-100)
    );



    const ground_texture = new THREE.TextureLoader().load('/assets/ground.png');
    const ground = new StaticObject(
      scene,
      physics,
      new THREE.BoxGeometry(200,10,200),
      new THREE.MeshStandardMaterial({
        map: ground_texture, 
      }),
      new THREE.Vector3(0,-10,0)
    );



    const bush_texture = get_texture('/assets/ornament_leveled_light.png', true, 3);
    const bush = new StaticObject(
      scene,
      physics,
      new THREE.PlaneGeometry(10,10,10),
      new THREE.MeshStandardMaterial({
        map: bush_texture, 
        transparent: true,
        depthWrite: false,
        alphaTest: 0.1
      }),
      new THREE.Vector3(0,-3,0)
    );
    

    const interactables1 = new InteractAbleObject(
      "Serene",
      scene,
      physics,
      new THREE.PlaneGeometry(15,15),
      new THREE.Vector3(50,0,-40),
    )
    Interact.push(interactables1)
  };
}

Main();




