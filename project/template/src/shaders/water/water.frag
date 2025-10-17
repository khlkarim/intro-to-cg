// ================================================================
// Precision Qualifiers
// ================================================================
// These specify the precision level for different GLSL types.
// - highp: highest precision (used for calculations requiring accuracy)
// - lowp: lower precision (sufficient for textures, cheaper to compute)

precision highp int;
precision highp float;
precision lowp sampler2D;
precision lowp samplerCube;

// ================================================================
// Uniforms (global parameters provided by the host application)
// ================================================================

// Position of the light source in world space
uniform vec3 uLightPos;

// Position of the camera in world space (for view direction & reflections)
uniform vec3 cameraPosition;

// ================================================================
// Varyings (interpolated per-fragment inputs from the vertex shader)
// ================================================================

// Surface normal at this fragment (world space, displaced by vertex shader)
varying vec3 vNormal;

// Fragment position in world space
varying vec3 vPosition;

// ================================================================
// Fragment Shader Entry Point
// ================================================================

void main() {}
