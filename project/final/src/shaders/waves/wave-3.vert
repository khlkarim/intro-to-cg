attribute vec3 position;

uniform float uTime;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

float getHeight(vec2 position) {
    float w1 = 0.3 * sin(0.8 * position.x + 1.0 * position.y - uTime);
    float w2 = 0.2 * cos(2.0 * position.x + 0.8 * position.y - 2.0 * uTime);
    return w1 + w2;
}

void main() {
    vec3 displacement = vec3(0.0, 0.0, getHeight(position.xy));
    vec3 displacedPosition = position + displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0 );
}