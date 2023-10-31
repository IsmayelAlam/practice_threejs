uniform float uTime;
uniform float uWaveSpeed;
uniform float uBigWavesElevation;
uniform vec2 uBigWaveFreq;

varying vec2 vUv;

void main(){
  vec4 modelPos = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPos.x * uBigWaveFreq.x + uTime * uWaveSpeed) * 
                    sin(modelPos.z * uBigWaveFreq.y + uTime * uWaveSpeed) * 
                    uBigWavesElevation;

  modelPos.y += elevation;

  gl_Position = projectionMatrix * viewMatrix * modelPos;
  vUv = uv;
}