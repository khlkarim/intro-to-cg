import { ambient } from '../canvases/ambient';
import { animation } from '../canvases/animation';
import { camera } from '../canvases/camera';
import { cube } from '../canvases/cube';
import { lighting } from '../canvases/lighting';
import { mesh } from '../canvases/mesh';
import { plane } from '../canvases/plane';
import { result } from '../canvases/result';
import { specular } from '../canvases/specular';
import { sphere } from '../canvases/sphere';
import { terrain } from '../canvases/terrain';
import { world } from '../canvases/world';
import { waterSurfaceGeneration } from './hero/hero';
import { meshGeneration } from './hero/wireframe-hero';
import { rotatingCube } from '../canvases/rotating-cube';

type CanvasInitializer = (canvas: HTMLCanvasElement) => void;

export function initSlides() {
    const canvasInitializers: Record<string, CanvasInitializer> = {
        '.hero-canvas': waterSurfaceGeneration,
        '.mesh-generation-canvas': meshGeneration,
        '.world-canvas': world,
        '.camera-canvas': camera,
        '.cube-canvas': cube,
        '.animation-canvas': animation,
        '.sphere-canvas': sphere,
        '.mesh-canvas': mesh,
        '.plane-canvas': plane,
        '.rotating-cube': rotatingCube,
        '.terrain-canvas': terrain,
        '.lighting-canvas': lighting,
        '.specular-canvas': specular,
        '.ambient-canvas': ambient,
        '.result-canvas': result,
    };

    for (const [selector, initializer] of Object.entries(canvasInitializers)) {
        document.querySelectorAll<HTMLCanvasElement>(selector)
            .forEach(initializer);
    }
}
