import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export function plane(canvas: HTMLCanvasElement)
{
    const width = Math.max(300, canvas.clientWidth);
    const height = Math.max(300, canvas.clientHeight);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000);
    camera.position.z = 5;

    const geometry = new THREE.PlaneGeometry(20, 10, 20, 10);
    const material = new THREE.MeshBasicMaterial({ wireframe: true });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.scale.set(0.2, 0.2, 0.2);

    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
}