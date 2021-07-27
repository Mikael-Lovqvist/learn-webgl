attribute vec3 v_position;
attribute vec3 v_normal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;


varying vec3 normal;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(v_position, 2.5);
	gl_PointSize = 3.0;
	normal = v_normal;
}