import * as THREE from 'three';
import { pass } from 'three/tsl';
import { dof } from 'three/addons/tsl/display/DepthOfFieldNode.js';




import { Player } from './player.js';
import { Object } from './object.js'
import { Physics } from './physics.js';
import { PhysicsDebug } from './debug.js';


async function Main() {
  const canvas = document.querySelector('#canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  // const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(10,20,10);
  scene.add(sun)


  scene.fog = new THREE.FogExp2(0x3b414d, 0.013);  

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x888888);


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
    camera.position.copy(player.mesh.position).add(offset)
    camera.lookAt(player.mesh.position);

    renderer.render(scene, camera);
  }

  animate();


  function createObject() {
    const wallRight = new Object(
      scene,
      physics,
      new THREE.BoxGeometry(5,10,200),
      new THREE.MeshStandardMaterial({color: 0x888888}),
      new THREE.Vector3(100,0,0)
    );
    const wallLeft = new Object(
      scene,
      physics,
      new THREE.BoxGeometry(5,10,200),
      new THREE.MeshStandardMaterial({color: 0x888888}),
      new THREE.Vector3(-100,0,0)
    );
    const wallBack = new Object(
      scene,
      physics,
      new THREE.BoxGeometry(200,10,5),
      new THREE.MeshStandardMaterial({color: 0x888888}),
      new THREE.Vector3(0,0,100)
    );
    const wallFront = new Object(
      scene,
      physics,
      new THREE.BoxGeometry(200,10,5),
      new THREE.MeshStandardMaterial({color: 0x888888}),
      new THREE.Vector3(0,0,-100)
    );
    const floor = new Object(
      scene,
      physics,
      new THREE.BoxGeometry(200,10,200),
      new THREE.MeshStandardMaterial({color: 0x888888, roughness: 1}),
      new THREE.Vector3(0,-10,0)
    );
    

    const interactables1 = new Object(
      scene,
      physics,
      new THREE.BoxGeometry(10,10,10),
      new THREE.MeshStandardMaterial({color: 0x8888FF}),
      new THREE.Vector3(0,0,0)
    )




  }
}



Main();




