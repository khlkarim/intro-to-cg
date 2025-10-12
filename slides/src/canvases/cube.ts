import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export function cube(canvas: HTMLCanvasElement)
{
    const width = Math.max(300, canvas.clientWidth);
    const height = Math.max(300, canvas.clientHeight);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000);
    camera.position.z = 2;
    camera.position.y = 2;
    camera.position.x = 2;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const controls = new OrbitControls(camera, renderer.domElement);

    const axesHelper = new THREE.AxesHelper(100);
    cube.add(axesHelper);

    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
}