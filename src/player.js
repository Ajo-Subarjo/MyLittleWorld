import * as THREE from 'three';

export class Player {
    constructor() {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(10,20),
            new THREE.MeshBasicMaterial({color: 0xFF0000})
        );
        this.mesh.rotation.x = THREE.MathUtils.degToRad(90) 
        this.speed = 10;
        this.keys = {};

        window.addEventListener('keydown', (e) => this.keys[e.code] = true)
        window.addEventListener('keyup', (e) => this.keys[e.code] = false)
    }

    update(delta, walls) {
        const move = this.speed * delta;
        if (this.keys['KeyW']) this.mesh.position.y += move;
        if (this.keys['KeyS']) this.mesh.position.y -= move;
        if (this.keys['KeyA']) this.mesh.position.x -= move;
        if (this.keys['KeyD']) this.mesh.position.x += move;
    };

}

