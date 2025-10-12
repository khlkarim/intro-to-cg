import * as THREE from 'three';
import waterVertexShader from './shaders/water.vert?raw';
import waterFragmentShader from './shaders/wireframe.frag?raw';

function createWaterMaterial()
{
    const { 
        speed, 
        nbIterations, 
        amplitudeMultiplier, 
        frequencyMultiplier, 
    } = {
        speed: 3, 
        nbIterations: 18,
        amplitudeMultiplier: 0.82,
        frequencyMultiplier: 1.18,
    };

    return new THREE.RawShaderMaterial({
        wireframe: true,
        side: THREE.DoubleSide,
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        uniforms: {
            uLightDir: { value: new THREE.Vector3() },
            uTime: { value: performance.now() / 1000 },
            
            uSpeed: { value: speed },
            uNbIterations: { value: nbIterations },
            uAmplitudeMultiplier: { value: amplitudeMultiplier },
            uFrequencyMultiplier: { value: frequencyMultiplier },
        },
    });
}

function createSurface()
{
    const material = createWaterMaterial();
    const geometry = new THREE.PlaneGeometry(50, 50, 100, 100);

    const surface = new THREE.Mesh(geometry, material);
    surface.rotateX(Math.PI/2);

    return surface;
}

export function meshGeneration(canvas: HTMLCanvasElement) {
    const scene = createScene();

    const surface = createSurface();
    scene.add(surface);

    const renderer = createRenderer(canvas);
    const camera = createCamera(renderer);
    camera.position.x = 10;
    camera.position.y = 1;
    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3(0,2 ,0));

    surface.material.uniforms.uLightDir.value = (new THREE.Vector3(300, 200, 500));
    renderer.setAnimationLoop(() => {
        surface.material.uniforms.uTime.value = performance.now() / 1000;
        renderer.render(scene, camera);
    });
}

export function createRenderer(canvas?: HTMLCanvasElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
}

export function createScene(): THREE.Scene {
    const scene = new THREE.Scene();
    return scene;
}

export function createCamera(renderer: THREE.WebGLRenderer): THREE.PerspectiveCamera {
    function setRendererSize() {
        const dpr = window.devicePixelRatio || 1;
        const width = renderer.domElement.clientWidth;
        const height = renderer.domElement.clientHeight;
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(dpr);
    }

    setRendererSize();

    const { width, height } = renderer.domElement;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

    window.addEventListener('resize', () => {
        setRendererSize();
        const { width, height } = renderer.domElement;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    return camera;
}