uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFreq;
uniform float uTime;

attribute vec3 position;
attribute float aRandom;

varying vec3 vColor;

void main(){
  vec4 modelPos = modelMatrix * vec4(position, 1.0);
  modelPos.z += sin(modelPos.x * uFreq.x + uTime) * 0.1;
  modelPos.z += sin(modelPos.y * uFreq.y + uTime) * 0.1;

  // vec4 viewPos = viewMatrix * modelPos;
  // vec4 projectionPos = projectionMatrix * viewPos;

  gl_Position = projectionMatrix * viewMatrix * modelPos;

  vColor = position;
}