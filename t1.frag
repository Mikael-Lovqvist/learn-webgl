precision mediump float;

varying vec3 normal;
uniform vec3 light_direction;

varying float interpolation_value_out;

const vec4 happy_color = vec4(0.5, 0.2, 0.2, 1.0);
const vec4 sad_color = vec4(0.2, 0.2, 0.5, 1.0);

void main(void) {
	gl_FragColor = dot(normal, light_direction) * (sad_color * interpolation_value_out + happy_color * (1.0 - interpolation_value_out));
}
