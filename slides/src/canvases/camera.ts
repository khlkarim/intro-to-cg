import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export function camera(canvas: HTMLCanvasElement)
{
    const width = Math.max(300, canvas.clientWidth);
    const height = Math.max(300, canvas.clientHeight);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000);
    camera.position.z = 4;
    camera.position.y = 4;
    camera.position.x = 4;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ wireframe: true });
    const cube1 = new THREE.Mesh(geometry, material);
    cube1.position.z = 1.5;
    scene.add(cube1);

    const cube2 = new THREE.Mesh(geometry, material);
    cube2.position.x = 1.5;
    scene.add(cube2);

    const cube3 = new THREE.Mesh(geometry, material);
    cube3.position.y = 1.5;
    scene.add(cube3);

    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
}