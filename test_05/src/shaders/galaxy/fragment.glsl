varying vec3 vColor;

void main() {
    float strength = 1.0 - distance(gl_PointCoord, vec2(0.5));
    strength = pow(strength, 10.0);

    vec3 color = mix(vec3(strength), vColor, strength); 
    
    gl_FragColor = vec4(color, 1.0);
}