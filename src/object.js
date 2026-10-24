import * as THREE from 'three';




export class Object {
    constructor() {
        this.walls = [];

        const leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(2,130,10),
            new THREE.MeshBasicMaterial()
        );

        const rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(2,130,10),
            new THREE.MeshBasicMaterial()
        );

        const frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(130,2,10),
            new THREE.MeshBasicMaterial()
        );

        const backWall = new THREE.Mesh(
            new THREE.BoxGeometry(130,2,10),
            new THREE.MeshBasicMaterial()
        );
        

        leftWall.position.set(-65,0,5)
        rightWall.position.set(65,0,5)
        frontWall.position.set(0,65,5)
        backWall.position.set(0,-65,5)

        leftWall.name = 'leftWall'
        rightWall.name = 'rightWall'
        frontWall.name = 'frontWall'
        backWall.name = 'backWall'


        this.walls.push(leftWall, rightWall, frontWall, backWall)
    }
}