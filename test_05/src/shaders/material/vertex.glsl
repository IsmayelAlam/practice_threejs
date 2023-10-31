void main(){
    vec4 modelPos = modelMatrix * vec4(position, 1.0);
    vec4 mvPos = viewMatrix * modelPos;

    gl_Position = projectionMatrix * mvPos;

}