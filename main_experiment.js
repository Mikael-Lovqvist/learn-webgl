
function start_experiment() {
	var status = document.getElementById('status');

	status.innerText += 'Loading meshes\n';
	var happy_mesh, sad_mesh;
	application_state.gl = get_gl_context(document.getElementById("canvas"));	

	if (!application_state.gl) {
		status.innerText += '[FAILURE] - Could not get webgl context!\n';
	}


	function check_if_everything_is_ready() {


		if (application_state.happy_vertices_ready && application_state.sad_vertices_ready && application_state.face_polygons_ready && !application_state.meshes_ready) {
			
			if (application_state.buffers.happy.length != application_state.buffers.sad.length) {
				throw new Error("Vertex count mismatch between sad and happy face!");
			}
			
			const vbuf = gl.createBuffer();
			const fa = new Float32Array(application_state.buffers.happy.length + application_state.buffers.sad.length);
			
			fa.set(application_state.buffers.happy, 0);
			fa.set(application_state.buffers.sad, application_state.buffers.happy.length);


			gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
			vbuf.itemSize = 3
			vbuf.numItems = fa.length;
			gl.bufferData(gl.ARRAY_BUFFER, fa, gl.STATIC_DRAW);
			application_state.buffers.vertices = vbuf;
			


			const ibuf = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, application_state.buffers.face_polygons, gl.STATIC_DRAW);

			application_state.buffers.index_buffer = ibuf;




			application_state.meshes_ready = true;
		}



		if (application_state.meshes_ready && application_state.shaders_ready) {
			status.innerText += "Let's rock!\n";

			draw_scene();

		}
	}

	function check_if_shaders_are_loaded() {
		if (application_state.vertex_shader && application_state.fragment_shader) {
			status.innerText += 'Shaders loaded\n';

			link_shaders().then(program => {
				application_state.shader_program = program;
				application_state.shaders_ready = true;
				check_if_everything_is_ready();
			})

		}
	}


	load_vertex_data('happy.vertices', 'happy').then(() => {
		status.innerText += "Loaded happy vertices\n";
		application_state.happy_vertices_ready = true;
		check_if_everything_is_ready();
	})

	load_vertex_data('sad.vertices', 'sad').then(() => {
		status.innerText += "Loaded sad vertices\n";
		application_state.sad_vertices_ready = true;
		check_if_everything_is_ready();
	})

	load_polygon_data('face.polygons', 'face_polygons').then(polygons => {
		status.innerText += "Loaded face polygons\n";
		application_state.face_polygons_ready = true;
		check_if_everything_is_ready();
	})

	get_shader('t1.frag', application_state.gl.FRAGMENT_SHADER).then(shader => {
		status.innerText += 'Fragment shader loaded\n';
		application_state.fragment_shader = shader;
		check_if_shaders_are_loaded();
	}).catch(info => {
		console.log(`Error loading fragment shader: ${info}`);
	});	

	get_shader('t1.vert', application_state.gl.VERTEX_SHADER).then(shader => {
		status.innerText += 'Vertex shader loaded\n';
		application_state.vertex_shader = shader;
		check_if_shaders_are_loaded();
	}).catch(info => {
		console.log(`Error loading vertex shader: ${info}`);
	});	

}

