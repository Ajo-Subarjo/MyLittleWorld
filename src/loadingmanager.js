import * as THREE from 'three'



export const manager = new THREE.LoadingManager();

const fill = document.getElementById('fill');
const percentage = document.getElementById('pct');
const loader = document.getElementById('loader');

manager.onProgress = (url, loaded, total) => {
    const p = Math.round((loaded/total) * 100);
    fill.style.width = p + '%';
    percentage.textContent = p + '%';
};

export const assetsReady = new Promise((resolve, reject) => {
    manager.onLoad = resolve;
    manager.onError = (url) => reject(new Error('Failed to load' + url));
});

export function hideLoadingScreen() {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 600)
};

export function showError(msg) {
    percentage.textContent = msg
}