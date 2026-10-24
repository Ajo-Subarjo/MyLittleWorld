import * as THREE from 'three';
import { Player } from './player.js';
import { Collider } from './collider.js';
import { Object } from './object.js'


const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xFFFF);


const object = new Object();
const walls = object.walls;

const collider = new Collider(walls);


const player = new Player();


const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(128, 128),
  new THREE.MeshBasicMaterial({color: 0x87ff72}));

plane.position.set(0, 0, 0)
plane.rotation.x = THREE.MathUtils.degToRad(0)



scene.add(player.mesh, plane);  
// scene.add(player.arrowHelper  )
scene.add(...walls)


player.mesh.position.z = 10
const Timer = new THREE.Timer();





function animate() {
  requestAnimationFrame(animate);
  Timer.update();
  const delta = Timer.getDelta();

  const offset = new THREE.Vector3(0, -35, 50);
  camera.position.copy(player.mesh.position).add(offset)
  camera.lookAt(player.mesh.position);

  player.update(delta);
  
  const hits = collider.check(player);
  for (const hit of hits) {
    console.log('hit', hit.name)
  }

  renderer.render(scene, camera);
}

animate();

