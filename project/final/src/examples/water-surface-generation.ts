import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { createCamera, createOverlay, createRenderer, createScene, loadSkybox } from '../helpers/three';
import { getWaterSurfaceGenerationConfig, onWaterSurfaceGenerationConfigChanged } from '../helpers/input';

import wave1VertexShader from '../shaders/waves/wave-1.vert';
import wave2VertexShader from '../shaders/waves/wave-2.vert';
import wave3VertexShader from '../shaders/waves/wave-3.vert';
import waveFragmentShader from '../shaders/waves/default.frag';

import waterVertexShader from '../shaders/water/water.vert';
import waterFragmentShader from '../shaders/water/water.frag';

/**
 * Initializes the water surface simulation and rendering pipeline.
 */
export function waterSurfaceGeneration(canvas: HTMLCanvasElement) {
    const renderer = createRenderer(canvas);
    
    const scene = createScene();
    const camera = createCamera(renderer);

    camera.position.set(-2, 1, -7);
    new OrbitControls(camera, renderer.domElement);

    const perf = createOverlay(renderer);

    // Background
    loadSkybox('/textures/skybox/').then((texture) => {
        scene.background = texture;
    });

    // Water surface
    const surface = createWaterSurface();
    scene.add(surface);

    // Animation loop
    renderer.setAnimationLoop(() => {
        perf.begin();

        surface.material.uniforms.uTime.value = performance.now() / 1000;
        renderer.render(scene, camera);

        perf.end();
    });

    /**
     * Update the uniforms when the configuration changes.
     */
    onWaterSurfaceGenerationConfigChanged(() => {
        Object.assign(surface.material.uniforms, getUniforms());
    })
}

/**
 * Creates a mesh representing the water surface.
 */ 
function createWaterSurface() {
    const geometry = new THREE.PlaneGeometry(100, 100, 2000, 2000);
    const material = createWaterMaterial();

    const surface = new THREE.Mesh(geometry, material);
    surface.rotateX(Math.PI / 2);

    return surface;
}

/**
 * Creates a water material.
 */
function createWaterMaterial() {
    return new THREE.RawShaderMaterial({
        side: THREE.DoubleSide,
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        uniforms: getUniforms(),
        transparent: true,  // this tells Three.js to treat alpha
    });
}

/**
 * Returns the uniforms for the water shader.
 */
function getUniforms() {
    const { 
        speed, 
        nbIterations, 
        amplitudeMultiplier, 
        frequencyMultiplier 
    } = getWaterSurfaceGenerationConfig();

    return {
        uLightPos: { value: new THREE.Vector3(200, 200, 700) },
        uTime: { value: performance.now() / 1000 },
        uSpeed: { value: speed },
        uNbIterations: { value: nbIterations },
        uAmplitudeMultiplier: { value: amplitudeMultiplier },
        uFrequencyMultiplier: { value: frequencyMultiplier },
    };
}