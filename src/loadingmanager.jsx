import * as THREE from 'three';
import { createSignal, Show } from 'solid-js';



export const loadingManager = new THREE.LoadingManager();

export default function loadingScreen() {

    const [progress, setProgress] = createSignal(0);
    const [onLoad, setLoaded] = createSignal(false)
    const [loadingText, setLoadingText] = createSignal('loading')

    loadingManager.onProgress = (url, loaded, total) => {
        const progress = Math.round((loaded/total) * 100);
        console.log(`loading: ${progress}%`)
        setProgress(progress)
    }

    loadingManager.onLoad = () => {
        console.log('Loading Complete: 100%');
        setLoadingText('almost ready!');
        setTimeout(() => {setLoaded(true)}, 2000);

    }

    loadingManager.onError = (url) => {
        console.error(`failed to load${url}`)
    }

    return (
        <Show when={!onLoad()}>
            <div className='loading-screen'>
                <div id='sprite'></div>
                <p id='loading-text'>
                    {loadingText}
                    <Show when={loadingText() == 'loading'}>
                        <span id='dots'>..</span>
                    </Show>
                    <span id='percentage'>{progress()}%</span>
                </p>
            </div>
        </Show>
    )
}