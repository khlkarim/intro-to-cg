// ================================================================
// Uniforms (global parameters provided by the host application)
// ================================================================

// Time since start of the program (used to animate waves)
uniform float uTime;

// Controls the phase speed of waves
uniform float uSpeed;

// Number of waves to sum up (<= MAX_ITR)
uniform int uNbIterations;

// Scaling factor for amplitude across wave layers
uniform float uAmplitudeMultiplier;

// Scaling factor for frequency across wave layers
uniform float uFrequencyMultiplier;

// Standard transformation matrices provided by Three.js
uniform mat4 viewMatrix;         // Camera view transform
uniform mat4 modelMatrix;        // Model-to-world transform
uniform mat4 projectionMatrix;   // Projection transform (e.g. perspective)

// ================================================================
// Attributes (per-vertex inputs from geometry)
// ================================================================

attribute vec3 position;  // Vertex position (object space)

// ================================================================
// Varyings (passed from vertex shader to fragment shader)
// ================================================================

varying vec3 vNormal;     // Interpolated normal (world space, displaced)
varying vec3 vPosition;   // Interpolated position (world space, displaced)

// ================================================================
// Constants
// ================================================================

const int MAX_ITR = 32; // Hard upper limit of FBM iterations

// ================================================================
// Data Structures
// ================================================================

// Represents a single sine wave component
struct Wave {
    vec2 origin;     // Origin of wave propagation (in 2D plane)
    vec2 direction;  // Propagation direction (normalized)
    float amplitude; // Wave height
    float frequency; // Wave frequency (spatial scale)
    float speed;     // Wave speed (time scaling)
};

// ================================================================
// Utility Functions
// ================================================================

/**
 * Compute sinusoidal displacement of a wave direction at a given position.
 */
float Sin(vec2 pos, Wave w) {
    float t = w.speed * uTime;
    float s = dot(pos - w.origin, normalize(w.direction));

    return w.amplitude * sin(w.frequency * s + t);
}

/**
 * Compute the surface normal induced by a wave at a given position.
 * Approximates slope using partial derivatives of the sinusoidal displacement.
 */
vec3 SinNormal(vec2 pos, Wave w) {
    float t = w.speed * uTime;
    float s = dot(pos - w.origin, normalize(w.direction));

    vec3 dZdX = vec3(1, 0, w.amplitude * w.frequency * w.direction.x * cos(w.frequency * s + t));
    vec3 dZdY = vec3(0, 1, w.amplitude * w.frequency * w.direction.y * cos(w.frequency * s + t));
    
    return normalize(cross(dZdX, dZdY));
}

/**
 * Deterministically generate a pseudo-random 2D unit direction
 * based on the integer index i.
 * Golden angle is used to distribute directions.
 */
vec2 randomDir(int i) {
    float angle = float(i) * 2.399963229728653; // ~golden angle in radians
    return vec2(cos(angle), sin(angle));
}

/**
 * Deterministically generate a pseudo-random 2D origin
 * to spatially distribute waves.
 */
vec2 randomOrigin(int i) {
    // A simple hash-like deterministic offset pattern
    return vec2(
        fract(sin(float(i) * 12.9898) * 43758.5453),
        fract(sin(float(i) * 78.233) * 12345.6789)
    ) * 200.0 - 100.0; // Spread origins roughly in [-100, 100] range
}

/**
 * Initialize a default wave with fixed amplitude and frequency,
 * and dynamic phase controlled by uSpeed.
 */
Wave initWave() {
    Wave wave;
    wave.direction = randomDir(-1);
    wave.amplitude = 1.0;
    wave.frequency = 0.3;
    wave.speed = uSpeed;
    return wave;
}

// ================================================================
// Sum of Sines Displacement
// ================================================================

/**
 * Compute the displaced position of a vertex using a sum of sine waves.
 * - Repeatedly adds waves with scaled amplitude and frequency.
 * - Returns displaced (x, y, z) position in object space.
 */
vec3 SumOfSines(vec2 pos) {
    Wave wave = initWave();

    float amplitudeMulti = uAmplitudeMultiplier;
    float frequencyMulti = uFrequencyMultiplier;

    float sum = 0.0;
    float amplitudeSum = 0.0;

    for (int i = 0; i < MAX_ITR; i++) {
        if (i >= uNbIterations) break;

        wave.direction = randomDir(i);
        wave.origin = randomOrigin(i);

        sum += Sin(pos, wave);
        amplitudeSum += wave.amplitude;

        // scale amplitude and frequency for next layer
        wave.amplitude *= amplitudeMulti;
        wave.frequency *= frequencyMulti;
    }

    return vec3(pos.xy, sum / amplitudeSum);
}

/**
 * Compute the displaced surface normal using a sum of sine waves.
 * - Averages normals across layers.
 */
vec3 SumOfSinesNormal(vec2 pos) {
    Wave wave = initWave();

    float amplitudeMulti = uAmplitudeMultiplier;
    float frequencyMulti = uFrequencyMultiplier;

    vec3 normal = vec3(0.0);
    float amplitudeSum = 0.0;

    for (int i = 0; i < MAX_ITR; i++) {
        if (i >= uNbIterations) break;

        wave.direction = randomDir(i);
        wave.origin = randomOrigin(i);

        normal += SinNormal(pos, wave);
        amplitudeSum += wave.amplitude;

        wave.amplitude *= amplitudeMulti;
        wave.frequency *= frequencyMulti;
    }

    return normalize(normal / amplitudeSum);
}

// ================================================================
// Vertex Shader Entry Point
// ================================================================

void main() {
    // Compute displaced position in object space
    vec3 displaced = SumOfSines(position.xy);

    // Transform displaced vertex into world space
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vPosition = worldPos.xyz;

    // Compute displaced normal in world space
    vNormal = (modelMatrix * vec4(SumOfSinesNormal(position.xy), 0.0)).xyz;

    // Final clip-space position
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
