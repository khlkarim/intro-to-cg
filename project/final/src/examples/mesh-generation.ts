import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { createCamera, createOverlay, createRenderer, createScene } from '../helpers/three';
import { getMeshGenerationConfig, onMeshGenerationConfigChange } from '../helpers/input';

/**
 * Initialize and run the mesh generation scene.
 * 
 * @param {HTMLCanvasElement} canvas: The canvas element for rendering.
 */
export function meshGeneration(canvas: HTMLCanvasElement)
{
    const scene = createScene();
    const renderer = createRenderer(canvas);
    const camera = createCamera(renderer);

    const vertices = getVertices();
    const indices = getIndices();

    let mesh = createMesh(vertices, indices);
    scene.add(mesh);

    const axesHelper = new THREE.AxesHelper(5);     
    scene.add(axesHelper);

    const perf = createOverlay(renderer);
    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setAnimationLoop(() => {
        perf.begin();

        controls.update();
        renderer.render(scene, camera);

        perf.end();
    });
    
    /**
     * Update the mesh based on the new configuration.
     */
    function updateGeomtry()
    {
        const newVertices = getVertices();
        const newIndices = getIndices();

        scene.remove(mesh);
        
        mesh.geometry.dispose();
        mesh.material.dispose();

        mesh = createMesh(newVertices, newIndices);
        scene.add(mesh);
    }
    onMeshGenerationConfigChange(updateGeomtry);
}

/**
 * Create a THREE.js mesh object from raw vertex and index data.
 * 
 * @param {Float32Array} vertices Vertex positions.
 * @param {number[]} indices Triangle indices.
 * @returns {THREE.Mesh} A THREE.js wireframe mesh.
 */
function createMesh(vertices: Float32Array, indices: Array<number>)
{
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3, false));
    geometry.setIndex(indices);

    const material = new THREE.MeshBasicMaterial({ wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);

    // const pointsMaterial = new THREE.PointsMaterial({ size: 0.1 });
    // const points = new THREE.Points(geometry, pointsMaterial);

    // return points;
    return mesh;
}

/**
 * Get vertices based on the current mesh generation configuration.
 * 
 * @returns {Float32Array} Vertex positions.
 */
function getVertices()
{
    const { geometry, resolution } = getMeshGenerationConfig();

    switch(geometry) {
        case 'box':
            return CubeVertices();
        case 'sphere':
            return SphereVertices(5, resolution, resolution);
        case 'plane':
            return PlaneVertices(10, 10, resolution, resolution);
        case 'cylinder':
            return CylinderVertices(5, 10, resolution, resolution);
        case 'torus':
            return TorusVertices(5, 1, resolution, resolution);
        default:
            return new Float32Array();
    }
}

/**
 * Get indices based on the current mesh generation configuration.
 * 
 * @returns {number[]} Triangle indices.
 */
function getIndices()
{
    const { geometry, resolution } = getMeshGenerationConfig();

    switch(geometry) {
        case 'box':
            return CubeIndices();
        case 'sphere':
            return SphereIndices(resolution, resolution);
        case 'plane':
            return PlaneIndices(resolution, resolution);
        case 'cylinder':
            return CylinderIndices(resolution, resolution);
        case 'torus':
            return TorusIndices(resolution, resolution);
        default:
            return [];
    }
}

/**
 * Generates the vertex positions for a unit cube centered at the origin.
 * Each vertex is represented by three consecutive floating-point values (x, y, z).
 *
 * The cube spans from -1 to +1 along each axis.
 *
 * @returns {Float32Array} A flat array containing the 3D positions of the cube's 8 vertices.
 */
function CubeVertices() {
    return new Float32Array([
        -1.0, -1.0, -1.0, // v0
         1.0, -1.0, -1.0, // v1
         1.0,  1.0, -1.0, // v2
        -1.0,  1.0, -1.0, // v3
        -1.0, -1.0,  1.0, // v4
         1.0, -1.0,  1.0, // v5
         1.0,  1.0,  1.0, // v6
        -1.0,  1.0,  1.0, // v7
    ]);
}

/**
 * Generates the triangle indices that define the cube’s 12 triangles (2 per face).
 * 
 * The indices refer to the vertices returned by `CubeVertices()`
 * 
 * Faces:
 * - Back:  (v0, v1, v2, v3)
 * - Front: (v4, v5, v6, v7)
 * - Bottom: (v0, v1, v5, v4)
 * - Top: (v2, v3, v7, v6)
 * - Left: (v0, v3, v7, v4)
 * - Right: (v1, v2, v6, v5)
 * 
 * @returns {number[]} An array of vertex indices describing the cube’s faces as triangles.
 */
function CubeIndices() {
    return [
        0, 1, 2,/* f0 */ 2, 3, 0,/* f1 */ // back face
        4, 5, 6,/* f2 */ 6, 7, 4,/* f3 */ // front face
        0, 1, 5,/* f4 */ 5, 4, 0,/* f5 */ // bottom face
        2, 3, 7,/* f6 */ 7, 6, 2,/* f7 */ // top face
        0, 3, 7,/* f8 */ 7, 4, 0,/* f9 */ // left face
        1, 2, 6,/* f10 */ 6, 5, 1,/* f11 */ // right face
    ];
}

/**
 * Generates the vertex positions for a plane mesh centered at the origin.
 * 
 * The plane lies on the XY-plane (Z = 0), extending from -width/2 to +width/2 along the X-axis
 * and from -height/2 to +height/2 along the Y-axis.
 * 
 * @param {number} [width=1] - Total width of the plane in world units.
 * @param {number} [height=1] - Total height of the plane in world units.
 * @param {number} [widthSegments=10] - Number of subdivisions along the X-axis (width direction).
 * @param {number} [heightSegments=10] - Number of subdivisions along the Y-axis (height direction).
 * 
 * @returns {Float32Array} A flat array of 3D vertex coordinates (x, y, z) for the plane.
 */
function PlaneVertices(
    width: number = 1,
    height: number = 1,
    widthSegments: number = 10,
    heightSegments: number = 10
) {
    const vertexPositions: number[] = [];

    const widthStep = width / widthSegments;
    const heightStep = height / heightSegments;

    for (let i = 0; i <= widthSegments; i++) {
        for (let j = 0; j <= heightSegments; j++) {
            const x = i * widthStep - width / 2;
            const y = j * heightStep - height / 2;
            vertexPositions.push(x, y, 0);
        }
    }

    return new Float32Array(vertexPositions);
}

/**
 * Generates the triangle indices that define the faces of the plane mesh.
 * 
 * The indices refer to the vertex array produced by `PlaneVertices()`
 * 
 * Each quad cell is divided into two triangles:
 * ```
 *  tl ---- tr
 *   |    / |
 *   |   /  |
 *   |  /   |
 *  bl ---- br
 * ```
 * where:
 * - `bl`: bottom-left vertex
 * - `br`: bottom-right vertex
 * - `tl`: top-left vertex
 * - `tr`: top-right vertex
 * 
 * @param {number} [widthSegments=10] - Number of subdivisions along the X-axis (width direction).
 * @param {number} [heightSegments=10] - Number of subdivisions along the Y-axis (height direction).
 * 
 * @returns {number[]} An array of vertex indices forming triangles for the entire plane mesh.
 */
function PlaneIndices(
    widthSegments: number = 10,
    heightSegments: number = 10
) {
    const indices: number[] = [];

    for (let w = 0; w < widthSegments; w++) {
        for (let h = 0; h < heightSegments; h++) {
            const curr = w * (heightSegments + 1) + h;

            const bl = curr;
            const br = bl + 1;
            const tl = curr + (heightSegments + 1);
            const tr = tl + 1;

            // First triangle (bottom-left)
            indices.push(bl, br, tl);
            // Second triangle (top-right)
            indices.push(br, tr, tl);
        }
    }

    return indices;
}

/**
 * Generates vertex positions for a sphere mesh centered at the origin.
 * 
 * The vertices are generated in the following order:
 *      1. The north pole vertex (0, 0, +radius)
 *      2. Rings of vertices arranged by increasing θ (from north to south)
 *      3. The south pole vertex (0, 0, -radius)
 * 
 * @param {number} [radius=1] - Radius of the sphere.
 * @param {number} [rings=8] - Number of horizontal subdivisions (latitude lines, excluding poles).
 * @param {number} [segments=16] - Number of vertical subdivisions (longitude lines).
 *
 * @returns {Float32Array} A flat array of 3D vertex coordinates (x, y, z) for the sphere mesh.
 */
function SphereVertices(
    radius: number = 1, 
    rings: number = 8, 
    segments: number = 16,
) {
    const vertexPositions: number[] = [];

    // North pole
    vertexPositions.push(0, 0, radius);

    const thetaStep = Math.PI / (rings + 1);
    const phiStep = 2 * Math.PI / segments;

    // Rings between poles
    for (let ring = 1; ring <= rings; ring++) {
        const theta = thetaStep * ring;

        for (let segment = 1; segment <= segments; segment++) {
            const phi = phiStep * segment;

            const x = radius * Math.sin(theta) * Math.cos(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(theta);

            vertexPositions.push(x, y, z);
        }
    }

    // South pole
    vertexPositions.push(0, 0, -radius);

    return new Float32Array(vertexPositions);
}

/**
 * Generates triangle indices for the sphere mesh.
 * 
 * The indices define triangles connecting the vertices produced by `SphereVertices()`.
 * The sphere consists of:
 * - A **top cap** (connecting the north pole to the first ring)
 * - Multiple **middle rings** (connecting adjacent rings)
 * - A **bottom cap** (connecting the last ring to the south pole)
 * 
 * @param {number} [rings=8] - Number of horizontal subdivisions (latitude lines, excluding poles).
 * @param {number} [segments=16] - Number of vertical subdivisions (longitude lines).
 * 
 * @returns {number[]} A flat array of vertex indices representing the sphere’s triangle faces.
 */
function SphereIndices(
    rings: number = 8, 
    segments: number = 16
) {
    const indices: number[] = [];

    // Top cap (north pole)
    for (let segment = 0; segment < segments; segment++) {
        indices.push(0, 1 + segment, 1 + (segment + 1) % segments);
    }

    // Middle rings
    for (let ring = 0; ring < rings - 1; ring++) {
        for (let segment = 0; segment < segments; segment++) {
            const bl = 1 + ring * segments + segment;
            const br = 1 + ring * segments + (segment + 1) % segments;
            const tl = bl + segments;
            const tr = br + segments;

            indices.push(bl, tl, br);
            indices.push(br, tl, tr);
        }
    }

    // Bottom cap (south pole)
    const lastIdx = (2 + rings * segments) - 1;
    const base = 1 + (rings - 1) * segments;

    for (let segment = 0; segment < segments; segment++) {
        indices.push(lastIdx, base + (segment + 1) % segments, base + segment);
    }

    return indices;
}

/**
 * Generates vertex positions for a cylinder mesh centered at the origin.
 * 
 * The cylinder extends along the Z-axis, from -height/2 to +height/2, with its circular caps 
 * 
 * Vertices are ordered as follows:
 *      1. The top center vertex (north cap)
 *      2. Rings of vertices evenly spaced along the height
 *      3. The bottom center vertex (south cap)
 * 
 * @param {number} [radius=1] - Radius of the cylinder in world units.
 * @param {number} [height=1] - Total height of the cylinder.
 * @param {number} [rings=10] - Number of subdivisions along the cylinder’s height (excluding caps).
 * @param {number} [segments=10] - Number of subdivisions around the cylinder’s circumference.
 *
 * @returns {Float32Array} A flat array of 3D vertex coordinates (x, y, z) representing the cylinder mesh.
 */
function CylinderVertices(
    radius: number = 1,
    height: number = 1,
    rings: number = 10,
    segments: number = 10
) {
    const vertexPositions: number[] = [];

    // Top center vertex (north cap)
    vertexPositions.push(0, 0, height / 2);

    const phiStep = 2 * Math.PI / segments;

    // Body vertices (interpolated between top and bottom)
    for (let ring = 1; ring <= rings; ring++) {
        for (let segment = 1; segment <= segments; segment++) {
            const phi = phiStep * segment;

            const x = radius * Math.cos(phi);
            const y = radius * Math.sin(phi);
            const z = height / 2 - (height * ring) / (rings + 1);

            vertexPositions.push(x, y, z);
        }
    }

    // Bottom center vertex (south cap)
    vertexPositions.push(0, 0, -height / 2);

    return new Float32Array(vertexPositions);
}

/**
 * Generates triangle indices for the cylinder mesh.
 * 
 * The indices define the top cap, bottom cap, and side wall of the cylinder.
 * 
 * The mesh structure is divided into:
 * - **Top cap:** Triangles fan out from the top center vertex to the first ring of vertices.
 * - **Body:** Each rectangular section between rings is split into two triangles.
 * - **Bottom cap:** Triangles fan inward to the bottom center vertex.
 * 
 * @param {number} [rings=10] - Number of height subdivisions (excluding caps).
 * @param {number} [segments=10] - Number of angular subdivisions around the cylinder.
 * 
 * @returns {number[]} An array of vertex indices forming triangles for the cylinder mesh.
 */
function CylinderIndices(
    rings: number = 10,
    segments: number = 10
) {
    const indices: number[] = [];

    // Top cap
    for (let segment = 0; segment < segments; segment++) {
        indices.push(0, 1 + segment, 1 + (segment + 1) % segments);
    }

    // Body (side walls)
    for (let ring = 0; ring < rings - 1; ring++) {
        for (let segment = 0; segment < segments; segment++) {
            const bl = 1 + ring * segments + segment;
            const br = 1 + ring * segments + (segment + 1) % segments;
            const tl = bl + segments;
            const tr = br + segments;

            indices.push(bl, tl, br);
            indices.push(br, tl, tr);
        }
    }

    // Bottom cap
    const lastIdx = (2 + rings * segments) - 1;
    const base = 1 + (rings - 1) * segments;

    for (let segment = 0; segment < segments; segment++) {
        indices.push(lastIdx, base + (segment + 1) % segments, base + segment);
    }

    return indices;
}

/**
 * Generates the vertex positions for a torus mesh.
 *
 * The resulting vertices form a grid of size `radialSegments × tubularSegments`,
 * where each vertex position is represented by three consecutive floats (x, y, z).
 *
 * @param {number} [majorRadius=1] Distance from the torus center to the center of the tube.
 * @param {number} [minorRadius=1] Radius of the tube cross-section.
 * @param {number} [radialSegments=10] Number of subdivisions around the main ring (major circle).
 * @param {number} [tubularSegments=10] Number of subdivisions around the tube cross-section.
 *
 * @returns {Float32Array} A flat array of vertex coordinates.
 */
function TorusVertices(
    majorRadius: number = 1,
    minorRadius: number = 1,
    radialSegments: number = 10,
    tubularSegments: number = 10
)
{
    const vertexPositions: Array<number> = [];

    const thetaStep = 2 * Math.PI / radialSegments;
    const phiStep = 2 * Math.PI / tubularSegments;

    for (let i = 1; i <= radialSegments; i++) {
        const theta = thetaStep * i;

        const base = new THREE.Vector3(
            majorRadius * Math.cos(theta),
            majorRadius * Math.sin(theta),
            0
        );

        for (let j = 1; j <= tubularSegments; j++) {
            const phi = phiStep * j;

            const offset = new THREE.Vector3(
                minorRadius * Math.sin(phi) * Math.cos(theta),
                minorRadius * Math.sin(phi) * Math.sin(theta),
                minorRadius * Math.cos(phi)
            );

            offset.add(base);

            vertexPositions.push(offset.x, offset.y, offset.z);
        }
    }

    return new Float32Array(vertexPositions);
}

/**
 * Generates triangle indices defining the faces of a torus mesh.
 *
 * @param {number} [radialSegments=10] Number of subdivisions around the main ring (major circle).
 * @param {number} [tubularSegments=10] Number of subdivisions around the tube cross-section.
 *
 * @returns {number[]} A flat array of triangle vertex indices.
 */
function TorusIndices(
    radialSegments: number = 10,
    tubularSegments: number = 10
)
{
    const indices: Array<number> = [];

    for (let i = 0; i < radialSegments; i++) {
        for (let j = 0; j < tubularSegments; j++) {
            const bl = i * tubularSegments + j;
            const br = i * tubularSegments + ((j + 1) % tubularSegments);
            const tl = ((i + 1) % radialSegments) * tubularSegments + j;
            const tr = ((i + 1) % radialSegments) * tubularSegments + ((j + 1) % tubularSegments);

            // Two triangles forming one quad
            indices.push(br, tr, tl, br, tl, bl);
        }
    }

    return indices;
}