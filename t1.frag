precision mediump float;

varying vec3 normal;

void main(void) {
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * dot(normal, normalize(vec3(2, -1, 3)));
}
