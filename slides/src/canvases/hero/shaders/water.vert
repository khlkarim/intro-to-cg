// ================================================================
// Uniforms (global parameters provided by the host application)
// ================================================================

// Time since start of the program (used to animate waves)
uniform float uTime;

// Controls the phase speed of waves
uniform float uSpeed;

// Number of fractal iterations to compute in FBM (<= MAX_ITR_FBM)
uniform int uNbIterations;

// Scaling factor for amplitude across FBM octaves
uniform float uAmplitudeMultiplier;

// Scaling factor for frequency across FBM octaves
uniform float uFrequencyMultiplier;

// Standard transformation matrices provided by the rendering engine
uniform mat4 viewMatrix;         // Camera view transform
uniform mat4 modelMatrix;        // Model-to-world transform
uniform mat3 normalMatrix;       // Model-to-world transform for normals
uniform mat4 modelViewMatrix;    // Model + View transform
uniform mat4 projectionMatrix;   // Projection transform (e.g. perspective)

// ================================================================
// Attributes (per-vertex inputs from geometry)
// ================================================================

attribute vec3 normal;    // Vertex normal (object space)
attribute vec3 position;  // Vertex position (object space)

// ================================================================
// Varyings (passed from vertex shader to fragment shader)
// ================================================================

varying vec3 vNormal;     // Interpolated normal (world space, displaced)
varying vec3 vPosition;   // Interpolated position (world space, displaced)

// ================================================================
// Constants
// ================================================================

const int MAX_ITR_FBM = 32; // Hard upper limit of FBM iterations

// ================================================================
// Data Structures
// ================================================================

// Represents a single wave
struct Wave {
    vec2 direction;  // Propagation direction (normalized)
    float amplitude; // Wave height
    float frequency; // Wave frequency (spatial scale)
    float phase;     // Wave phase offset (time scaling)
};

// ================================================================
// Utility Functions
// ================================================================

/**
 * Compute sinusoidal displacement of a wave direction at a given position.
 */
float Sin(vec2 pos, Wave w) {
    float t = uTime * w.phase;
    float x = dot(pos - vec2(100.0, 100.0), normalize(w.direction));

    x += w.amplitude * w.frequency * sin(w.frequency * x + t);
    
    return w.amplitude * sin(w.frequency * x + t);
}

/**
 * Compute the surface normal induced by a wave at a given position.
 * Approximates slope using partial derivatives of the sinusoidal displacement.
 */
vec3 SinNormal(vec2 pos, Wave w) {
    float A = w.amplitude;
    float k = w.frequency;
    float t = uTime * w.phase;

    float arg = dot(pos, normalize(w.direction)) * k + t;
    vec2 dir = normalize(w.direction);

    // Partial derivatives of heightfield wrt x and y
    float dZdX = A * k * cos(arg) * dir.x;
    float dZdY = A * k * cos(arg) * dir.y;

    return normalize(vec3(-dZdX, -dZdY, 1.0));
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
 * Initialize a default wave with fixed amplitude and frequency,
 * and dynamic phase controlled by uSpeed.
 */
Wave initWave() {
    Wave wave;
    wave.direction = randomDir(-1);
    wave.amplitude = 1.0;
    wave.frequency = 0.3;
    wave.phase = uSpeed;
    return wave;
}

// ================================================================
// Fractal Brownian Motion (FBM) based displacement
// ================================================================

/**
 * Compute the displaced position of a vertex using FBM of sinusoidal waves.
 * - Repeatedly adds waves with scaled amplitude and frequency.
 * - Returns displaced (x, y, z) position in object space.
 */
vec3 FBMPosition(vec2 pos) {
    Wave wave = initWave();

    float amplitudeMulti = uAmplitudeMultiplier;
    float frequencyMulti = uFrequencyMultiplier;

    float sum = 0.0;
    float amplitudeSum = 0.0;

    for (int i = 0; i < MAX_ITR_FBM; i++) {
        if(i >= uNbIterations) break;

        wave.direction = randomDir(i);

        sum += Sin(pos, wave);
        amplitudeSum += wave.amplitude;

        // scale amplitude and frequency for next octave
        wave.amplitude *= amplitudeMulti;
        wave.frequency *= frequencyMulti;
    }

    return vec3(pos.xy, sum / amplitudeSum);
}

/**
 * Compute the displaced surface normal using FBM of sinusoidal waves.
 * - Averages normals across octaves.
 */
vec3 FBMNormal(vec2 pos) {
    Wave wave = initWave();

    float amplitudeMulti = uAmplitudeMultiplier;
    float frequencyMulti = uFrequencyMultiplier;

    vec3 normal = vec3(0.0);
    float amplitudeSum = 0.0;

    for (int i = 0; i < MAX_ITR_FBM; i++) {
        if(i >= uNbIterations) break;

        wave.direction = randomDir(i);

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
    vec3 displaced = FBMPosition(position.xy);

    // Transform displaced vertex into world space
    vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
    vPosition = worldPos.xyz;

    // Compute displaced normal in world space
    vNormal = (modelMatrix * vec4(FBMNormal(position.xy), 0.0)).xyz;

    // Final clip-space position
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
