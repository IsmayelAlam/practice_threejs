varying vec2 vUv;

void main() {
    vec4 modelPos = modelMatrix * vec4(position, 1.0);
    vec4 viewPos = viewMatrix * modelPos;
    
    gl_Position = projectionMatrix * viewPos;
    vUv = uv;
}