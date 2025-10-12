import * as THREE from 'three';
import { OrbitControls, VertexNormalsHelper } from 'three/examples/jsm/Addons.js';

export function mesh(canvas: HTMLCanvasElement) {
    const width = Math.max(300, canvas.clientWidth);
    const height = Math.max(300, canvas.clientHeight);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

    const geometry = new THREE.SphereGeometry(1, 16, 16);

    // Materials
    const coloredMaterial = new THREE.MeshNormalMaterial();
    const wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05
    });

    // Variants
    const points = new THREE.Points(geometry, pointsMaterial); // vertices as points
    const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    const colored = new THREE.Mesh(geometry, coloredMaterial);
    const normal = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    const helper = new VertexNormalsHelper(normal, 0.2, 0xff0000);

    // Array for cycling
    const spheres: THREE.Object3D[] = [
        points,
        colored,
        new THREE.Group(),
        wireframe,
    ];
    (spheres[2] as THREE.Group).add(normal, helper); // group normal+helper

    let current = 0;
    scene.add(spheres[current]);

    new OrbitControls(camera, renderer.domElement);

    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });

    camera.position.z = 4;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    canvas.addEventListener('dblclick', () => {
        // remove current sphere
        scene.remove(spheres[current]);

        // switch index
        current = (current + 1) % spheres.length;

        // add new one
        scene.add(spheres[current]);
    });
}

