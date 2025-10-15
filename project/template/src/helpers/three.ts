import * as THREE from 'three';
import { ThreePerf } from 'three-perf';

/**
 * Creates a WebGL renderer.
 */
export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });

    const width = 960;
    const height = 600;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    return renderer;
}

/**
 * Creates an empty scene.
 */
export function createScene(): THREE.Scene {
    const scene = new THREE.Scene();
    return scene;
}

/**
 * Creates a perspective camera.
 */
export function createCamera(renderer: THREE.WebGLRenderer): THREE.PerspectiveCamera {
    const { width, height } = renderer.domElement;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 5;

    return camera;
}

/**
 * Creates a performance overlay with configurable position.
 */
export function createOverlay(
    renderer: THREE.WebGLRenderer,
    options?: { anchorX?: 'left' | 'right'; anchorY?: 'top' | 'bottom' }
) {
    const container = renderer.domElement.parentElement;
    if (!container) {
        throw new Error('Renderer DOM element must have a parent element to attach the overlay.');
    }

    const perf = new ThreePerf({
        renderer,
        domElement: container,
        anchorX: options?.anchorX ?? 'left',
        anchorY: options?.anchorY ?? 'top',
    });

    const overlay = container.querySelector('#three-perf-ui') as HTMLDivElement;
    overlay.style.opacity = '0.8';
    overlay.style.position = 'absolute'; 

    return perf;
}

/**
 * Loads a cubemap skybox asynchronously.
 */
export function loadSkybox(path: string, files?: string[]): Promise<THREE.CubeTexture> {
    return new Promise((resolve, reject) => {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath(path);

        loader.load(
            files ?? ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
            texture => resolve(texture),
            undefined,
            error => reject(error)
        );
    });
}