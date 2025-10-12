import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function terrain(canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(350, 350);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,
        350 / 350,
        0.1,
        100
    );
    camera.position.set(0.2, 0.5, -1.8);

    const controls = new OrbitControls(camera, renderer.domElement);

    const planeRes = 256;
    const geometry = new THREE.PlaneGeometry(3, 3, planeRes, planeRes);

    const heightMap = new THREE.TextureLoader().load('/assets/images/heightmap.png');
    heightMap.wrapS = heightMap.wrapT = THREE.ClampToEdgeWrapping;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uHeightMap: { value: heightMap },
            uHeightScale: { value: 0.5 },
        },
        vertexShader: `
            uniform sampler2D uHeightMap;
            uniform float uHeightScale;
            varying float vHeight;
            void main() {
                vec2 uv = uv;
                float height = texture2D(uHeightMap, uv).r;
                vec3 displacedPosition = position + normal * height * uHeightScale;
                vHeight = height;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
            }
        `,
        fragmentShader: `
            varying float vHeight;
            void main() {
                // Simple grayscale or gradient based on height
                gl_FragColor = vec4(vec3(vHeight), 1.0);
            }
        `,
        side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    renderer.setAnimationLoop(() => {
        controls.update();
        renderer.render(scene, camera);
    });
}
