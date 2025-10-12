/**
 * Centralized configuration for DOM element selectors used in mesh and water surface generation.
 *
 * These selectors map configuration fields to their corresponding DOM inputs.
 */
export const config = {
    meshGeneration: {
        geometry: '#mesh-generation #geometry',
        resolution: '#mesh-generation #resolution',
    },
    waterSurfaceGeneration: {
        nbIterations: '#water-surface-generation #nb-iterations',
        amplitudeMultiplier: '#water-surface-generation #amplitude-multiplier',
        frequencyMultiplier: '#water-surface-generation #frequency-multiplier',
        speed: '#water-surface-generation #speed',
    }
};

/**
 * Retrieves the value of a form element (input, select, textarea) from the DOM.
 *
 * @param selector - A CSS selector string identifying the DOM element.
 * @returns The string value of the element, or an empty string if the element is not found
 *          or if it is an unsupported element type (e.g., file input).
 *
 * @example
 * ```ts
 * const geometry = get(config.meshGeneration.geometry);
 * ```
 */
export function get(selector: string): string {
    const element = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement | null;
    
    if (!element) {
        console.error('DOM element not found: ', selector);
        return '';
    }
    
    if (element instanceof HTMLInputElement && element.type !== 'file') {
        return element.value;
    }
    if (element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
        return element.value;
    }

    return '';
}

/**
 * Registers a `change` event listener on a DOM element.
 *
 * @param selector - A CSS selector string identifying the DOM element.
 * @param callback - A function to be called when the element’s value changes.
 *
 * @example
 * ```ts
 * onChange(config.meshGeneration.geometry, (event) => {
 *   console.log("Resolution changed:", (event.target as HTMLInputElement).value);
 * });
 * ```
 */
export function onChange(selector: string, callback: (event: Event) => void) {
    const element = document.querySelector(selector) as HTMLElement | null;
    
    if (!element) {
        console.error('DOM element not found: ', selector);
        return;
    }
    
    element.addEventListener('change', callback);
}

/**
 * Reads the current mesh generation configuration from the DOM.
 *
 * @returns An object containing mesh geometry type and resolution.
 *
 * @example
 * ```ts
 * const meshConfig = getMeshGenerationConfig();
 * console.log(meshConfig.geometry, meshConfig.resolution);
 * ```
 */
export function getMeshGenerationConfig() {
    return {
        geometry: get(config.meshGeneration.geometry),
        resolution: Number(get(config.meshGeneration.resolution)),
    };
}

/**
 * Registers change listeners for mesh generation configuration inputs.
 *
 * @param updateMesh - A function that updates the mesh whenever configuration changes.
 *
 * @example
 * ```ts
 * onMeshGenerationConfigChange(() => {
 *   console.log("Mesh configuration changed!");
 * });
 * ```
 */
export function onMeshGenerationConfigChange(updateMesh: () => void) {
    onChange(config.meshGeneration.geometry, updateMesh);
    onChange(config.meshGeneration.resolution, updateMesh);
}

/**
 * Reads the current water surface generation configuration from the DOM.
 *
 * @returns An object containing iteration count, amplitude multiplier,
 *          frequency multiplier, and speed values.
 *
 * @example
 * ```ts
 * const waterConfig = getWaterSurfaceGenerationConfig();
 * console.log(waterConfig.nbIterations, waterConfig.speed);
 * ```
 */
export function getWaterSurfaceGenerationConfig() {
    return {
        nbIterations: Number(get(config.waterSurfaceGeneration.nbIterations)),
        amplitudeMultiplier: Number(get(config.waterSurfaceGeneration.amplitudeMultiplier)),
        frequencyMultiplier: Number(get(config.waterSurfaceGeneration.frequencyMultiplier)),
        speed: Number(get(config.waterSurfaceGeneration.speed))
    };
}

/**
 * Registers change listeners for water surface generation configuration inputs.
 *
 * @param updateWater - A function that updates the water simulation whenever configuration changes.
 *
 * @example
 * ```ts
 * onWaterSurfaceGenerationConfigChanged(() => {
 *   console.log("Water surface configuration changed!");
 * });
 * ```
 */
export function onWaterSurfaceGenerationConfigChanged(updateWater: () => void) {
    onChange(config.waterSurfaceGeneration.nbIterations, updateWater);
    onChange(config.waterSurfaceGeneration.amplitudeMultiplier, updateWater);
    onChange(config.waterSurfaceGeneration.frequencyMultiplier, updateWater);
    onChange(config.waterSurfaceGeneration.speed, updateWater);
}

