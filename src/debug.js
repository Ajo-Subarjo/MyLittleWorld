import { RapierHelper } from 'three/addons/helpers/RapierHelper.js';


export class PhysicsDebug {
    constructor(scene, physics) {
        this.helper = new RapierHelper(physics.world);
        scene.add(this.helper);
    }

    update() {
        this.helper.update();
    }

    toggle() {
        this.helper.visible = !this.helper.visible;
    }
}