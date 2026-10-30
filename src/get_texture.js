import * as THREE from 'three'
import { manager } from './loadingmanager';

const loader = new THREE.TextureLoader(manager)

export default function get_texture(path, isSprite = false, frame = 0) {

    if (isSprite) {
        const texture = loader.load(path);
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping

        texture.repeat.set(
            1 / 3,
            1 / 2
        );

        const col = frame % 3;
        const row = Math.floor(frame / 3);

        texture.offset.x = col / 3;
        texture.offset.y = 1 - (row + 1) / 2;

        return texture

    } else {
        return new THREE.TextureLoader().load(path);
    }
}