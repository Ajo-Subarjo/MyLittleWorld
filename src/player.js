import * as THREE from 'three';


export class Player {
    constructor(scene, physics) {
        this.scene = scene;
        this.physics = physics;
        this.RAPIER = physics.RAPIER;

        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(10,20),
            new THREE.MeshStandardMaterial({color: 0xFF0000})
        );
        this.mesh.position.z = 10;
        // this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);

        const light = new THREE.PointLight(0xf7a545, 650,20, 1)
        light.position.set(0,2,2)
        light.castShadow = true
        light.shadow.mapSize.set(1024, 1024)

        this.mesh.add(light);


        this.body = this.physics.world.createRigidBody(
            this.RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,0,10)
        );

        const q = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0), // Z axis -> capsule lies along X
            Math.PI / 2
        );

        this.collider = this.physics.world.createCollider(
            this.RAPIER.ColliderDesc.capsule(5,5),
            this.body
        );


        this.controller = this.physics.world.createCharacterController(0.01);
        this.controller.setSlideEnabled(true);  
        
        this.verticalVelocity = 0;

        this.speed = 100
        this.keys = {
            KeyW: false,
            KeyS: false,
            KeyA: false,
            KeyD: false
        };
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        }); 
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    };

    update(delta) {
        const movement = new THREE.Vector3(
            Number(this.keys.KeyD) - Number(this.keys.KeyA),
            0,
            Number(this.keys.KeyS) - Number(this.keys.KeyW)
        );

        this.verticalVelocity += -9.18 * delta;

        if (movement.lengthSq() > 0) {
            movement.normalize();
        }      
        
        movement.multiplyScalar(this.speed * delta);

        movement.y = this.verticalVelocity * delta


        this.controller.computeColliderMovement(
            this.collider,
            {
                x: movement.x,
                y: movement.y,
                z: movement.z
            }
        );

        const correctedMovement = this.controller.computedMovement();
        const currentPosition = this.body.translation();

        this.body.setNextKinematicTranslation({
            x: currentPosition.x + correctedMovement.x,
            y: currentPosition.y + correctedMovement.y,
            z: currentPosition.z + correctedMovement.z
        });

        const position = this.body.translation();
        this.mesh.position.set(
            position.x,
            position.y,
            position.z
        );
    }
}

