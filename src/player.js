import * as THREE from 'three';
import { setProject } from './project_screen.jsx' 
import get_texture from './get_texture.js';


export class Player {
    constructor(scene, physics) {
        this.scene = scene;
        this.physics = physics;
        this.RAPIER = physics.RAPIER;

        this.texture = get_texture('/assets/character_spritesheet_leveled_with_lamp.png');

        this.cols = 3;
        this.rows = 2;

        this.frameCurrent = 0;
        this.frameTotal = 5;

        this.frameTime = 0.2;
        this.elapsedTime = 0;

        this.texture.wrapS = THREE.RepeatWrapping
        this.texture.wrapT = THREE.RepeatWrapping   
        this.texture.repeat.set(
            1 / this.cols,
            1 / this.rows
        );

        this.screen = false

        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(10,20),
            new THREE.MeshToonMaterial({
                map: this.texture,
                transparent: true, 
                color: 0xe8fffb,
                side: THREE.DoubleSide,
                // depthWrite: true,
                alphaTest: 0.1
            })
        );

        
        // this.mesh.position.z = 1000;
        this.mesh.castShadow = false;
        this.mesh.receiveShadow = false;
        this.scene.add(this.mesh);

        const light = new THREE.PointLight(0xffc871, 150, 18, 0.8)
        light.position.set(4,0,0)
        light.castShadow = true
        light.shadow.mapSize.set(512, 512)
        this.mesh.add(light);


        this.body = this.physics.world.createRigidBody(
            this.RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0,0,90)
        );

        this.collider = this.physics.world.createCollider(
            this.RAPIER.ColliderDesc.capsule(5,3),
            this.body
        );


        this.closestObject= ""    


        this.controller = this.physics.world.createCharacterController(0.01);
        this.controller.setSlideEnabled(true);  
        this.verticalVelocity = 0;

        this.speed = 50
        this.keys = {
            KeyW: false,
            KeyS: false,
            KeyA: false,
            KeyD: false,    
            KeyE: false,
        };
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        }); 
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        this.frameUpdate(0);
    };

    frameUpdate(frame) {
        const col = frame % this.cols;
        const row = frame % this.rows;

        this.texture.offset.x = col / this.cols;
        this.texture.offset.y = 1 - (row + 1) / this.rows;
    };

    animationUpdate(movement ,delta) {
        // console.log(movement.length())
        this.elapsedTime += delta

        if (movement.length() > 0.1){
            if (this.elapsedTime >= this.frameTime) {
                this.elapsedTime = 0;

                this.frameCurrent = (this.frameCurrent + 1) % this.frameTotal;
                this.frameUpdate(this.frameCurrent)
            };
        };
    };


    checkOrientatio(movement) {
        // console.log(movement);
        if (movement > 0) {
            this.mesh.rotation.y = 0
            // console.log(Math.PI)
        } else if (movement < 0) {
            this.mesh.rotation.y = Math.PI   
            // console.log(-Math.PI)     
        };
    };



    update(delta) {
        const movement = new THREE.Vector3(
            Number(this.keys.KeyD) - Number(this.keys.KeyA),
            0,
            Number(this.keys.KeyS) - Number(this.keys.KeyW)
        );

        // this.verticalVelocity += -9.18 * delta;

        if (movement.lengthSq() > 0) {
            movement.normalize();
        }      
        
        movement.multiplyScalar(this.speed * delta);

        // movement.y = this.verticalVelocity * delta


        this.controller.computeColliderMovement(
            this.collider,
            {
                x: movement.x,
                y: movement.y,
                z: movement.z
            }
        );

        this.checkOrientatio(movement.x);
        this.animationUpdate(movement ,delta);

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


        if (this.keys.KeyE) {
            console.log(this.closestObject)
            if (!this.screen) {
                if (this.closestObject) {
                    this.screen = true

                    if (this.closestObject == 'OneBonker'){
                        setProject(this.closestObject)
                    } else {
                        setProject(this.closestObject)
                    }
                    this.keys.KeyE = false
                }
            } else {
                if (this.closestObject) {
                    setProject(null)
                    this.keys.KeyE = false
                    this.screen = false
                }
            }
                   
        }
    }
}

