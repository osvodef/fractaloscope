import { Scope } from './scope';

if (isWebGlSupported()) {
    init();
} else {
    (document.getElementById('no-webgl') as HTMLDivElement).style.display = 'table';
}

function init(): void {
    document.body.classList.add(!isMobile() ? 'desktop' : 'mobile');

    const tipsClass = !isMobile() ? '.tips.mouse' : '.tips.touch';
    const dragElement = document.querySelector(`${tipsClass} .drag`) as HTMLDivElement;
    const zoomElement = document.querySelector(`${tipsClass} .zoom`) as HTMLDivElement;
    const morphElement = document.querySelector(`${tipsClass} .morph`) as HTMLDivElement;

    const scope = window.scope = new Scope(
        document.querySelector('.display') as HTMLElement,
        document.querySelector('.audio') as HTMLAudioElement,
    );

    const startSeed = scope.getSeed();
    const startCenter = scope.getCenter();
    const startZoom = scope.getZoom();

    scope.on('drag', () => {
        if (scope.getCenter().sub(startCenter).length() > 0.05) {
            dragElement.classList.add('hidden');
            scope.off('drag');
        }
    });

    scope.on('zoom', () => {
        if (Math.abs(scope.getZoom() - startZoom) > 0.25) {
            zoomElement.classList.add('hidden');
            scope.off('zoom');
        }
    });

    scope.on('morph', () => {
        if (scope.getSeed().sub(startSeed).length() > 0.01) {
            morphElement.classList.add('hidden');
            scope.off('morph');
        }
    });

    const soundElement = document.querySelector('.sound-button') as HTMLDivElement;
    const soundOnElement = soundElement.querySelector('.on') as HTMLImageElement;
    const soundOffElement = soundElement.querySelector('.off') as HTMLImageElement;

    let isPlayingAudio = false;

    soundElement.addEventListener('click', () => {
        if (!isPlayingAudio) {
            scope.playAudio();
            soundOnElement.classList.remove('hidden');
            soundOffElement.classList.add('hidden');
            isPlayingAudio = true;
        } else {
            scope.pauseAudio();
            soundOnElement.classList.add('hidden');
            soundOffElement.classList.remove('hidden');
            isPlayingAudio = false;
        }
    });
}

function isMobile() {
    return window.orientation !== undefined
        || navigator.userAgent.toLowerCase().indexOf('mobile') !== -1;
}

function isWebGlSupported(): boolean {
    try {
        const canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext && !!canvas.getContext('webgl');
    } catch (e) {
        return false;
    }
}
