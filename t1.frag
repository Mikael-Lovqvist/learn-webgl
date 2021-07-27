precision mediump float;

varying vec3 normal;
uniform vec3 light_direction;

varying float interpolation_value_out;

const vec3 happy_color =  vec3(0.2, 0.5, 0.4);
const vec3 sad_color = vec3(0.5, 0.2, 0.2);

void main(void) {
	gl_FragColor = vec4(dot(normal, light_direction) * (sad_color * interpolation_value_out + happy_color * (1.0 - interpolation_value_out)), 1);
}
