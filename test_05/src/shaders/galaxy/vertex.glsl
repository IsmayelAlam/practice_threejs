uniform float uTime;
uniform float uSize;

attribute float aScale;
attribute vec3 aRandom;

varying vec3 vColor;

void main(){
    vec4 modelPos = modelMatrix * vec4(position, 1.0);

    float angle = atan(modelPos.x, modelPos.z);
    float distanceToCenter = length(modelPos.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset;

    modelPos.x = cos(angle) * distanceToCenter + aRandom.x;
    modelPos.y = aRandom.y;
    modelPos.z = sin(angle) * distanceToCenter + aRandom.z;

    vec4 mvPos = viewMatrix * modelPos;

    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = uSize * aScale;
    gl_PointSize *= ( 1.0 / -mvPos.z );

    vColor = color;
}