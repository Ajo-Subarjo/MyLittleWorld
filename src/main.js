import * as THREE from 'three';

const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xFFFF)


camera.position.set(0, 0, 30);
camera.rotation.x = THREE.MathUtils.degToRad(35);



const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(64, 64),
  new THREE.MeshBasicMaterial({color: 0x87ff72}));

plane.position.set(0, 10, 0)
plane.rotation.x = THREE.MathUtils.degToRad(0)
scene.add(plane);






function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera)
}
animate();
