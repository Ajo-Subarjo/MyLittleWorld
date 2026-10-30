import RAPIER from '@dimforge/rapier3d-compat';

export class Physics {
    static async create() {
        await RAPIER.init();
        return new Physics();
    }

    constructor() {
        this.RAPIER = RAPIER;

        this.world = new RAPIER.World({
            x: 0,
            y: -9.81,
            z: 0
        });
    };

    update() {
        this.world.step();
    };
}   