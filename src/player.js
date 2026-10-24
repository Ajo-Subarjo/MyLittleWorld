import * as THREE from 'three';


export class Player {
    constructor() {
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(10,20),
            new THREE.MeshBasicMaterial({color: 0xFF0000})
        );
        this.mesh.rotation.x = THREE.MathUtils.degToRad(90) 
        this.speed = 10;

        this.keys = {
            KeyW: false,
            KeyS: false,
            KeyA: false,
            KeyD: false,
        };


        window.addEventListener('keydown', (e) => {
            if (e.code in this.keys) {
                this.keys[e.code] = true
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code in this.keys) {
                this.keys[e.code] = false
            }
        });

    };


    update(delta) {
        const move = this.speed * delta;
        
        if (this.keys['KeyW']) this.mesh.position.y += move;
        if (this.keys['KeyS']) this.mesh.position.y -= move;
        if (this.keys['KeyA']) this.mesh.position.x -= move;
        if (this.keys['KeyD']) this.mesh.position.x += move;
    };
}

