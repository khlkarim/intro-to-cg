import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function lighting(canvas: HTMLCanvasElement) {
    const width = Math.max(300, canvas.clientWidth);
    const height = Math.max(300, canvas.clientHeight);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- Lighting setup ---
    // Directional light (acts like the sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    // Ambient light (for global illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // moderate intensity

    // --- Materials ---
    // 1️⃣ Lambertian sphere with NO ambient lighting
    const lambertNoAmbientMat = new THREE.MeshLambertMaterial({
        color: 0x3399ff,
    });
    const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), lambertNoAmbientMat);

    // 2️⃣ Lambertian sphere WITH ambient lighting
    const lambertWithAmbientMat = new THREE.MeshLambertMaterial({
        color: 0x3399ff,
    });
    const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), lambertWithAmbientMat);

    // Add ambient light to scene only for this one
    const ambientScene = new THREE.Scene();
    ambientScene.add(ambientLight, directionalLight.clone());
    const sphere2Wrapper = new THREE.Group();
    sphere2Wrapper.add(sphere2);
    ambientScene.add(sphere2Wrapper);

    // 3️⃣ Phong shaded sphere
    const phongMat = new THREE.MeshPhongMaterial({
        color: 0x3399ff,
        shininess: 100, // higher = tighter specular highlight
        specular: 0xffffff,
    });
    const sphere3 = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), phongMat);

    // --- Array for cycling ---
    const spheres = [
        { mesh: sphere1, scene: scene },        // no ambient
        // { mesh: sphere2, scene: ambientScene }, // with ambient
        { mesh: sphere3, scene: scene }, // phong
    ];

    let current = 0;
    scene.add(spheres[current].mesh);

    // --- Rendering loop ---
    renderer.setAnimationLoop(() => {
        controls.update();
        const currentScene = spheres[current].scene;
        renderer.render(currentScene, camera);
    });

    // --- Double-click to cycle spheres ---
    canvas.addEventListener('dblclick', () => {
        // remove old sphere
        spheres[current].scene.remove(spheres[current].mesh);

        // switch index
        current = (current + 1) % spheres.length;

        // add new sphere
        spheres[current].scene.add(spheres[current].mesh);
    });
}

