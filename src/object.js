import * as THREE from 'three';



export class Object {
    constructor(scene, physics, ThreeGeo, ThreeMat, position) {
        this.scene = scene
        this.physics = physics

        this.mesh = new THREE.Mesh(
            ThreeGeo,
            ThreeMat
        );
        
        const geometry = this.mesh.geometry.parameters;

        this.body = physics.world.createRigidBody(
            physics.RAPIER.RigidBodyDesc.fixed().setTranslation(
                position.x,
                position.y,
                position.z
            )
        );

        physics.world.createCollider(
            physics.RAPIER.ColliderDesc.cuboid(
                geometry.width/2,
                geometry.height/2,
                geometry.depth/2    
            ),
            this.body
        );
        
        this.mesh.position.copy(position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);
    }
}