import { ambient } from './ambient';
import { animation } from './animation';
import { camera } from './camera';
import { cube } from './cube';
import { lighting } from './lighting';
import { mesh } from './mesh';
import { plane } from './plane';
import { result } from './result';
import { specular } from './specular';
import { sphere } from './sphere';
import { terrain } from './terrain';
import { world } from './world';
import { waterSurfaceGeneration } from './hero/hero';
import { meshGeneration } from './hero/wireframe-hero';
import { rotatingCube } from './rotating-cube';

type CanvasInitializer = (canvas: HTMLCanvasElement) => void;

export default function init() {
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
