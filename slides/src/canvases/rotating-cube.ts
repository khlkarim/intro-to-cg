import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export function rotatingCube(canvas: HTMLCanvasElement) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        300 / 250,
        0.1,
        1000
    );
    camera.position.z = 1.5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(200, 150);
    renderer.setClearColor(0x000000, 0);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    new OrbitControls(camera, renderer.domElement);

    function animate() {
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    window.addEventListener("resize", () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    });
}