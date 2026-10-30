import * as THREE from 'three'


export class AudioManager {
    constructor (audiolistener) {

        this.footstep_sound = new THREE.Audio(audiolistener)
        this.footstep_soundb = new THREE.Audio(audiolistener)
        this.bgm_sound = new THREE.Audio(audiolistener)
        this.ui_sound = new THREE.Audio(audiolistener)
        this.audioloader = new THREE.AudioLoader();


        this.audioloader.load(
            '/assets/sfx/footstep1.ogg',
             (buffer) => {
                this.footstep_sound.setBuffer(buffer);
                this.footstep_sound.setVolume(0.4);
            }
        );
        this.audioloader.load(
            '/assets/sfx/footstep2.ogg',
            (buffer) => {
                this.footstep_soundb.setBuffer(buffer);
                this.footstep_soundb.setVolume(0.4);
            }
        )
    
        this.audioloader.load(
            '/assets/sfx/JDSherbert - Nostalgia Music Pack - Disney Films.ogg',
             (buffer) => {
                this.bgm_sound.setBuffer(buffer);
                this.bgm_sound.setLoop(true);
                this.bgm_sound.setVolume(0.6);
                this.bgm_sound.play(1)
            }
        );

        this.audioloader.load(
            '/assets/sfx/cozy_fx_27.ogg',
             (buffer) => {
                this.ui_sound.setBuffer(buffer);
                this.ui_sound.setVolume(0.8);
            }
        );



    }

    playUI() {
        if (this.ui_sound.buffer && !this.ui_sound.isPlaying) {
            this.ui_sound.play()
        }
    } 



    playFootstep() {
        const sounds = [
            this.footstep_sound,
            this.footstep_soundb
        ]
        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        if (sound.buffer && !sound.isPlaying) {
            sound.setPlaybackRate(0.85 + Math.random() * 0.03);
            sound.play()
        }
    }   

    playBgm() {
        if (this.bgm_sound.buffer && !this.bgm_sound.isPlaying) {
            this.bgm_sound.play()
        }
    }

    stopBgm() {
        if (this.bgm_sound.isPlaying) {
            this.bgm_sound.stop()
        }
    }
}
