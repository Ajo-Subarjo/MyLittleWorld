import * as THREE from 'three';
import { setProject } from './project_screen.jsx' 
import get_texture from './get_texture.js';


export class StaticObject {
    constructor(scene, physics, ThreeGeo, ThreeMat, position, rotation = new THREE.Vector3(0,0,0), castShadow = true, collide = true) {
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

        if (collide) {
            if (ThreeGeo instanceof THREE.PlaneGeometry) {
                physics.world.createCollider(
                    physics.RAPIER.ColliderDesc.cuboid(
                        geometry.width/2,
                        geometry.height/2,
                        geometry.width/12,
                    ),
                    this.body
                );
            } else {
                physics.world.createCollider(
                    physics.RAPIER.ColliderDesc.cuboid(
                        geometry.width/2,
                        geometry.height/2,
                        geometry.depth/2    
                    ),
                    this.body
                );
            }
        };

        const quaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
                rotation.x,
                rotation.y,
                rotation.z
            )
        );

        this.mesh.rotation.setFromVector3(rotation);
        this.body.setRotation({
            x: quaternion.x,
            y: quaternion.y,
            z: quaternion.z,
            w: quaternion.w
        })
        this.mesh.position.copy(position);
        this.mesh.castShadow = castShadow;
        this.mesh.receiveShadow = castShadow;
        scene.add(this.mesh);
    }
};

export class InteractAbleObject {
    constructor(objectName,scene, physics, threeGeo, position) {
        this.scene = scene
        this.physics = physics

        this.objetName = objectName
        this.close = false
        this.animating = false

        this.defaultPos = position


        this.texture = get_texture('/assets/ornament_leveled_light.png', true, 0)
        this.mesh = new THREE.Mesh(
            threeGeo,
            new THREE.MeshStandardMaterial({
                map: this.texture,
                transparent: true,
                depthWrite: true,
                alphaTest: 0.8
            })
        );

        this.labelTexture = get_texture('/assets/ornament_leveled_light.png', true, 1)
        this.label = new THREE.Mesh(
            new THREE.PlaneGeometry(10,8),
            new THREE.MeshBasicMaterial({
                map: this.labelTexture,
                transparent: true, 
                depthWrite: true,
                alphaTest: 0.8
            })
        );

        

        this.radius = 10;
        this.center = this.mesh.position;


        const geometry = this.mesh.geometry.parameters;

        this.body = physics.world.createRigidBody(
            physics.RAPIER.RigidBodyDesc.fixed().setTranslation(
                position.x,
                position.y,
                position.z
            )
        );

        this.collider = physics.world.createCollider(
            physics.RAPIER.ColliderDesc.cuboid(
                geometry.width/2,
                geometry.height/2,
                geometry.width/6    
            ),
            this.body
        );

        
        this.label.rotation.x = -Math.PI / 4
        this.label.position.copy(position);
        this.label.position.z -= 4  

        this.mesh.position.copy(position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh, this.label);
    }

    setPopLabel() {
        this.target = this.defaultPos.clone()
        this.target.y += 10
    }

    setHideLabel() {
        this.target = this.defaultPos.clone()
        this.target.y -= 10
        
    }


    update(player, delta) {
        const dis = player.mesh.position.distanceTo(this.center);

        // console.log(dis)

        if (dis <= this.radius && !this.close) {
            console.log("player in area")

            this.close = true
            this.setPopLabel()
            // this.label.position.lerp(this.target, 0.5 * delta);

            this.animating = true
            player.closestObject = this.objetName
            // console.log(player.closestObject)
        } else if (dis >= this.radius && this.close) {
            this.close = false
            this.setHideLabel()

            // this.label.position.lerp(this.target, 0.5 * delta);
            this.animating = true
            player.closestObject = ''
            setProject(null)
        }

        if (this.animating) {
            this.label.position.lerp(this.target, 10 * delta);

            if (this.label.position.distanceTo(this.target) < 0.1) {
                this.label.position.copy(this.target);
                this.animating = false
                
            }

        }

    }
}