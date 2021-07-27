//This is just an ugly hack since the gl-matrix library is intended as a module and I am a bit unfamiliar with those y0et.
mat4 = document.glmatrix_exports.mat4;




class ApplicationState {
	constructor () {
		this.projection_matrix = mat4.create();
		this.camera_matrix = mat4.create();
		this.vertex_attributes = {};
		this.buffers = {};
	}
}


const application_state = new ApplicationState();







function get_gl_context(canvas) {		
	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	if (gl) {
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		return gl;
	}
}





function link_shaders() {

	return new Promise((success, failure) => {
		var gl = application_state.gl;
		var vertex_attributes = application_state.vertex_attributes;
		shader_program = gl.createProgram();
		gl.attachShader(shader_program, application_state.vertex_shader);
		gl.attachShader(shader_program, application_state.fragment_shader);
		gl.linkProgram(shader_program);		

		if (gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
			gl.useProgram(shader_program);

			function load_vertex_attribute(name) {
				const attribute_index = gl.getAttribLocation(shader_program, name);

				if (attribute_index == -1) {
					throw new Error(`Could not get vertex attribute: ${name}`);
				}

				vertex_attributes[name] = attribute_index;
				gl.enableVertexAttribArray(attribute_index);


			}

			function load_uniform_attribute(name) {
				const attribute_index = gl.getUniformLocation(shader_program, name);
				if (attribute_index == null) {
					throw new Error(`Could not get uniform attribute: ${name}`);
				}
				vertex_attributes[name] = attribute_index;
			}


			load_vertex_attribute('position_happy');
			load_vertex_attribute('position_sad');
			load_vertex_attribute('normal_happy');
			load_vertex_attribute('normal_sad');


			load_uniform_attribute('projection_matrix');
			load_uniform_attribute('camera_matrix');
			load_uniform_attribute('interpolation_value');

			load_uniform_attribute('light_direction');


			success(shader_program);

		} else {
			failure();
		}
	});

}


function get_shader(url, shader_type) {

	return new Promise((success, failure) => {
		//This promise should of course deal with failures too but this is outside of the scope of this experiment

		var req = new XMLHttpRequest();
		
		req.responseType = 'text';

		req.addEventListener('load', event => {
			//Here we just assume that we got the file since proper fetching is outside the scope of this experiment

			var gl = application_state.gl;
			var shader = gl.createShader(shader_type);
			gl.shaderSource(shader, event.target.response);
			gl.compileShader(shader);


			if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				success(shader);
			} else {
				failure(gl.getShaderInfoLog(shader));
			}
			
		});

		req.open('GET', url, true);
		req.send();

	})


}



function load_vertex_data(url, name) {

	return new Promise((success, failure) => {

		const gl = application_state.gl;
		const req = new XMLHttpRequest();
		
		req.responseType = 'arraybuffer';

		req.addEventListener('load', event => {						
			const float_array = new Float32Array(event.target.response);
			application_state.buffers[name] = float_array;
			
			success();

		});

		req.open('GET', url, true);
		req.send();


	});

}


function load_polygon_data(url, name) {

	return new Promise((success, failure) => {

		const gl = application_state.gl;
		const req = new XMLHttpRequest();
		
		req.responseType = 'arraybuffer';

		req.addEventListener('load', event => {						
			const int_array = new Uint16Array(event.target.response);
			application_state.buffers[name] = int_array;
			
			success();

		});

		req.open('GET', url, true);
		req.send();


	});

}
