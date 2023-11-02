void main() {    
    float distToCenter = 0.05 / distance(gl_PointCoord, vec2(0.5)) - 0.1;

    gl_FragColor = vec4(1.0, 1.0, 1.0, distToCenter);
}