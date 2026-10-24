import * as THREE from 'three'

export class Collider {
    constructor(walls) {
        this.box = new THREE.Box3();

        this.wallBoxes = walls.map(wall => ({
            object: wall,
            box: new THREE.Box3().setFromObject(wall)
        }));
    };

    check(object) {
        this.box.setFromObject(object.mesh);

        return this.wallBoxes.filter(
            wallBox => this.box.intersectsBox(wallBox.box)).map(wallBox => wallBox.object)
    };

}