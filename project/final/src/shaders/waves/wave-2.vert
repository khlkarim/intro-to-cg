attribute vec3 position;

uniform float uTime;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

float getHeight(vec2 position) {
    return sin(length(position.xy) + uTime);
}

void main() {
    vec3 displacement = vec3(0.0, 0.0, getHeight(position.xy));
    vec3 displacedPosition = position + displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0 );
}

