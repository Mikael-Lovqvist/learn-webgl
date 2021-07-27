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
	//In this first experiment we will just put the happy_mesh straight in

	//Prepare buffer
	application_state.triangle_count = happy_mesh.triangles.length;
	application_state.vertex_buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, application_state.vertex_buffer);
	application_state.vertex_buffer.itemSize = 3;	//(a, b, c, normal) × (x, y, z)
	application_state.vertex_buffer.numItems = application_state.triangle_count*6;	//3 vertices, 3 normal vertices
	
	var vertices = new Float32Array(application_state.triangle_count * 18);

	//In the very first test we will just skip normals

	//Fill in buffer - every other normal
	var tri = happy_mesh.triangles;
	for (const i in tri) {
		vertices[i*18+0] = tri[i].a.x;
		vertices[i*18+1] = tri[i].a.y;
		vertices[i*18+2] = tri[i].a.z;

		vertices[i*18+3] = tri[i].normal.x;
		vertices[i*18+4] = tri[i].normal.y;
		vertices[i*18+5] = tri[i].normal.z;

		vertices[i*18+6] = tri[i].b.x;
		vertices[i*18+7] = tri[i].b.y;
		vertices[i*18+8] = tri[i].b.z;

		vertices[i*18+9] = tri[i].normal.x;
		vertices[i*18+10] = tri[i].normal.y;
		vertices[i*18+11] = tri[i].normal.z;

		vertices[i*18+12] = tri[i].c.x;
		vertices[i*18+13] = tri[i].c.y;
		vertices[i*18+14] = tri[i].c.z;

		vertices[i*18+15] = tri[i].normal.x;
		vertices[i*18+16] = tri[i].normal.y;
		vertices[i*18+17] = tri[i].normal.z;

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



			vertex_attributes.position = gl.getAttribLocation(shader_program, "v_position");

			if (vertex_attributes.position == -1) {
				throw new Error("Could not get vertex attribute: v_position");
			}

			gl.enableVertexAttribArray(vertex_attributes.position);



			vertex_attributes.normal = gl.getAttribLocation(shader_program, "v_normal");

			if (vertex_attributes.normal == -1) {
				throw new Error("Could not get vertex attribute: v_normal");
			}

			gl.enableVertexAttribArray(vertex_attributes.normal);


			vertex_attributes.projection_matrix = gl.getUniformLocation(shader_program, "uPMatrix");
			vertex_attributes.camera_matrix = gl.getUniformLocation(shader_program, "uMVMatrix");

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
