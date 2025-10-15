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
    /**
     * Update the uniforms when the configuration changes.
     */
    onWaterSurfaceGenerationConfigChanged(() => {});
}

/**
 * Creates a mesh representing the water surface.
 */ 
function createWaterSurface() {}

/**
 * Creates a water material.
 */
function createWaterMaterial() {}

/**
 * Returns the uniforms for the water shader.
 */
function getUniforms() {
    return getWaterSurfaceGenerationConfig();
}