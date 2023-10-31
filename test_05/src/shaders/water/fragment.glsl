varying vec2 vUv;

void main()
{
    vec3 uvColor = vec3(vUv, 1.0);

    gl_FragColor = vec4(uvColor, 1.0);
}