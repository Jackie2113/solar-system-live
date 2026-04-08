varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vUv = uv;
    // Calculate the normal vector facing the camera
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}