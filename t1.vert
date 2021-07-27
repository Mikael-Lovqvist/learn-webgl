attribute vec3 position_happy;
attribute vec3 position_sad;
attribute vec3 normal_happy;
attribute vec3 normal_sad;

uniform float interpolation_value;

uniform mat4 camera_matrix;
uniform mat4 projection_matrix;

varying vec3 normal;
varying float interpolation_value_out;

void main(void) {

	normal = (projection_matrix * camera_matrix * vec4(normal_happy * (1.-interpolation_value) + normal_sad * interpolation_value, 0)).xyz;
	vec3 position = position_happy * (1.-interpolation_value) + position_sad * interpolation_value;
	gl_Position = projection_matrix * camera_matrix * vec4(position, 2.5);
	interpolation_value_out = interpolation_value;
	
}
