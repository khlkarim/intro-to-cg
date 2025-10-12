/**
 * Entry point for the application. 
 * 
 * This module:
 * - Imports example demos (mesh generation and water surface generation).
 * - Sets up navigation (tab-based UI).
 * - Initializes examples by attaching them to the correct canvas element.
 */

import './style.css';
import { meshGeneration } from './examples/mesh-generation';
import { waterSurfaceGeneration } from './examples/water-surface-generation';

/**
 * An `Example` is a function that takes a canvas element 
 * and initializes a rendering demo on it.
 */
type Example = (canvas: HTMLCanvasElement) => void;

/**
 * Type for each example's configuration.
 */
interface ExampleConfig {
    name: ExampleKey;          // Internal identifier
    label: string;             // Display label (optional, for UI)
    init: Example;             // Function that initializes the example
}

/**
 * Valid keys for examples.
 * Using a union type ensures strong typing for dataset attributes.
 */
type ExampleKey = 'mesh-generation' | 'water-surface-generation';

/**
 * Centralized registry of examples.
 */
const EXAMPLES: Record<ExampleKey, ExampleConfig> = {
    'mesh-generation': {
        name: 'mesh-generation',
        label: 'Mesh Generation',
        init: meshGeneration
    },
    'water-surface-generation': {
        name: 'water-surface-generation',
        label: 'Water Surface Generation',
        init: waterSurfaceGeneration
    }
};

/**
 * Application initializer.
 * 
 * Sets up:
 * - Navigation tab switching.
 * - Example initialization per tab.
 */
function initApp(): void {
    initNavigation();
    initExamples();
}
document.addEventListener("DOMContentLoaded", initApp);

/**
 * Initializes navigation logic for tab-based UI.
 * 
 * - Attaches event listeners to navigation buttons.
 * - When a button is clicked:
 *   - Updates active button styling.
 *   - Shows the associated tab while hiding others.
 */
function initNavigation(): void {
    const tabs = document.querySelectorAll<HTMLDivElement>(".tab");
    const navBtns = document.querySelectorAll<HTMLButtonElement>(".navbtn");

    navBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Activate clicked button
            navBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            // Determine target tab from dataset
            const tabName = btn.dataset.tabName as ExampleKey | undefined;
            if (!tabName) return;

            // Show only the tab that matches the button
            tabs.forEach((tab) => {
                tab.classList.toggle("active", tab.dataset.tabName === tabName);
            });
        });
    });
}

/**
 * Initializes all examples inside their respective tabs.
 * 
 * - Iterates over all tab containers.
 * - Checks if the tab has a corresponding example in `EXAMPLES`.
 * - If so, passes the contained `<canvas>` to the example initializer.
 */
function initExamples(): void {
    const tabs = document.querySelectorAll<HTMLDivElement>(".tab");

    tabs.forEach((tab) => {
        const tabName = tab.dataset.tabName as ExampleKey | undefined;
        if (!tabName) return;

        const exampleConfig = EXAMPLES[tabName];
        const canvas = tab.querySelector<HTMLCanvasElement>("canvas");
        if (!canvas) return;

        exampleConfig.init(canvas);

        const sliders = tab.querySelectorAll('input[type=range]');
        sliders.forEach((slider) => {
            const sliderValue = tab.querySelector('#' + slider.id + '-value');

            if(!sliderValue) return;
            slider.addEventListener("input", () => {
                sliderValue.textContent = (slider as HTMLInputElement).value;
            });
        });
    });
}
