//This is just an ugly hack since the gl-matrix library is intended as a module and I am a bit unfamiliar with those y0et.
mat4 = document.glmatrix_exports.mat4;




class ApplicationState {
	constructor () {
		this.projection_matrix = mat4.create();
		this.camera_matrix = mat4.create();
		this.vertex_attributes = {};		
	}
}


const application_state = new ApplicationState();



function init_vertex_buffers(happy_mesh, sad_mesh) {
	const gl = application_state.gl;
	//We will put the vertices and normals of both buffers in interleaved

	//Prepare buffer
	application_state.triangle_count = happy_mesh.triangles.length;
	application_state.vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, application_state.vertex_buffer);
	application_state.vertex_buffer.itemSize = 3;	//x, y, z
	application_state.vertex_buffer.numItems = application_state.triangle_count*12;	//(3 vertices, 3 normal vertices) times 2
	
	var vertices = new Float32Array(application_state.triangle_count * 36);

	function wvx(index, vertex_offset, vertex) {
		vertices[index*36 + vertex_offset*3 + 0] = vertex.x;
		vertices[index*36 + vertex_offset*3 + 1] = vertex.y;
		vertices[index*36 + vertex_offset*3 + 2] = vertex.z;
	}

	//Fill in buffer - every other normal
	var tri_h = happy_mesh.triangles;
	var tri_s = sad_mesh.triangles;

	if (tri_h.length != tri_s.length) {
		throw new Error("Mesh vertex count mismatch between sad and happy face!");
	}

	for (const i in tri_h) {

		wvx(i, 0, tri_h[i].a);
		wvx(i, 1, tri_h[i].normal);

		wvx(i, 2, tri_s[i].a);
		wvx(i, 3, tri_s[i].normal);

		wvx(i, 4, tri_h[i].b);
		wvx(i, 5, tri_h[i].normal);

		wvx(i, 6, tri_s[i].b);
		wvx(i, 7, tri_s[i].normal);

		wvx(i, 8, tri_h[i].c);
		wvx(i, 9, tri_h[i].normal);

		wvx(i, 10, tri_s[i].c);
		wvx(i, 11, tri_s[i].normal);



	}

	//Bind buffer to data
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


}


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
