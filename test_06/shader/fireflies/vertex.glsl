uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

void main() {
    vec4 modelPos = modelMatrix * vec4(position, 1.0);
    modelPos.y += sin(uTime + position.y * position.z * uSize) * .1;

    vec4 viewPos = viewMatrix * modelPos;
    
    gl_Position = projectionMatrix * viewPos;
    gl_PointSize = uSize * uPixelRatio * (1.0 / -viewPos.z);
}