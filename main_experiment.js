
function start_experiment() {
	var status = document.getElementById('status');

	status.innerText += 'Loading meshes\n';
	var happy_mesh, sad_mesh;
	application_state.gl = get_gl_context(document.getElementById("canvas"));	

	if (!application_state.gl) {
		status.innerText += '[FAILURE] - Could not get webgl context!\n';
	}


	function check_if_everything_is_ready() {
		if (application_state.meshes_ready && application_state.shaders_ready) {
			status.innerText += "Let's rock!\n";

			draw_scene();

		}
	}

	function check_if_meshes_are_loaded() {
		if (happy_mesh && sad_mesh && application_state.gl) {
			status.innerText += 'Mesh load complete\nCreating buffers\n';
			init_vertex_buffers(happy_mesh, sad_mesh);
			status.innerText += 'Buffers created\n';
			application_state.meshes_ready = true;
			check_if_everything_is_ready();
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


	get_stl('happy.stl').then(mesh => {
		happy_mesh = mesh;
		status.innerText += 'Happy mesh loaded\n';
		check_if_meshes_are_loaded();
	});

	get_stl('sad.stl').then(mesh => {
		sad_mesh = mesh;
		status.innerText += 'Sad mesh loaded\n';
		check_if_meshes_are_loaded();
	});	

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

