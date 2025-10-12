import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export function specular(canvas: HTMLCanvasElement) {
    const width = Math.max(300, canvas.clientWidth);
    const height = Math.max(300, canvas.clientHeight);

    // Transparent background
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // fully transparent
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 4);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Geometry + material
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Pure specular — no diffuse or ambient
    const material = new THREE.MeshPhongMaterial({
        color: 0x000000,              // no diffuse reflection
        specular: 0xffffff,           // pure white specular highlight
        shininess: 80,               // higher = smaller and brighter highlight
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Single point light (for the specular highlight)
    const light = new THREE.PointLight(0xffffff, 10);
    light.position.set(2, 2, 2);
    scene.add(light);

    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
}
