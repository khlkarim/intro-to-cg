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

// Direction of incoming light in world space
uniform vec3 uLightDir;

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

void main() {
    // ----------------------------
    // Base colors
    // ----------------------------
    vec3 lightColor = vec3(1.0);                     // White light
    vec3 waterColor = vec3(0.333, 0.561, 0.706);     // #558fb4 bluish water tint

    // ----------------------------
    // Normalize inputs
    // ----------------------------
    vec3 normal = normalize(vNormal);                          // Ensure unit normal
    vec3 lightDir = normalize(uLightDir);                      // Incoming light direction
    vec3 viewDir = normalize(cameraPosition - vPosition);      // Camera-to-fragment direction

    // ----------------------------
    // Ambient lighting (constant low-level light)
    // ----------------------------
    float ambientStrength = 0.3;
    vec3 ambient = ambientStrength * waterColor;

    // ----------------------------
    // Diffuse lighting (Lambertian reflection)
    // ----------------------------
    float diff = max(dot(normal, -lightDir), 0.0);
    vec3 diffuse = 2.0 * diff * waterColor;   // Multiplied by 2.0 for stronger effect

    // ----------------------------
    // Specular highlights (Blinn/Phong-like)
    // ----------------------------
    vec3 reflectDir = reflect(-lightDir, normal);   // Reflection of light vector
    float shininess = 100.0;                        // Surface glossiness
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);

    // ----------------------------
    // Fresnel effect (angle-dependent reflection strength)
    // ----------------------------
    float F0 = 0.02;   // Base reflectivity at normal incidence
    float fresnel = F0 + (1.0 - F0) *
                   pow(1.0 - max(dot(viewDir, normal), 0.0), 5.0);

    vec3 specular = fresnel * spec * lightColor;

    // ----------------------------
    // Final color contribution
    // ----------------------------
    vec3 result = ambient + diffuse + specular;

    // Output fragment color (fully opaque)
    gl_FragColor = vec4(result, 1.0);
}
