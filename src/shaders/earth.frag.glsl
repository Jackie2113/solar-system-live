uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform vec3 sunDirection;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vec3 normal = normalize(vNormal);
    
    // Dot product tells us how directly the light hits the surface (-1 to 1)
    float intensity = dot(normal, normalize(sunDirection));
    
    // Smooth the transition line between day and night (twilight zone)
    float mixAmount = smoothstep(-0.2, 0.2, intensity);
    
    vec4 dayColor = texture2D(dayTexture, vUv);
    vec4 nightColor = texture2D(nightTexture, vUv);
    
    // Mix the two textures based on the lighting intensity
    gl_FragColor = mix(nightColor, dayColor, mixAmount);
}