


function draw_scene() {

	var gl = application_state.gl;
	var vert_attr = application_state.vertex_attributes;

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clearColor(0, 0, .2, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//function perspectiveNO(out, fovy, aspect, near, far) {    
	mat4.perspective(application_state.projection_matrix, 100, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

	mat4.identity(application_state.camera_matrix);
	mat4.translate(application_state.camera_matrix, application_state.camera_matrix, [0, 0, -3]);
	mat4.rotateY(application_state.camera_matrix, application_state.camera_matrix, Math.PI * -.5 + Math.sin(window.performance.now()*5e-3)*0.2);
	mat4.rotateX(application_state.camera_matrix, application_state.camera_matrix, Math.PI * .5 + Math.sin(window.performance.now()*1e-2)*0.1);


	gl.enable(gl.DEPTH_TEST);

	gl.bindBuffer(gl.ARRAY_BUFFER, application_state.vertex_buffer);
	//void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);

	//One vertex is 12 bytes so we need a stride of 24 for the normals	
	gl.vertexAttribPointer(vert_attr.position_happy, application_state.vertex_buffer.itemSize, gl.FLOAT, false, 48, 0);
	gl.vertexAttribPointer(vert_attr.position_sad, application_state.vertex_buffer.itemSize, gl.FLOAT, false, 48, 24);

	//Bind normals
	gl.vertexAttribPointer(vert_attr.normal_happy, application_state.vertex_buffer.itemSize, gl.FLOAT, false, 48, 12);
	gl.vertexAttribPointer(vert_attr.normal_sad, application_state.vertex_buffer.itemSize, gl.FLOAT, false, 48, 36);
	
	//Set matrices
	gl.uniformMatrix4fv(vert_attr.projection_matrix, false, application_state.projection_matrix);
	gl.uniformMatrix4fv(vert_attr.camera_matrix, false, application_state.camera_matrix);

	//Set sadness	
	gl.uniform1f(vert_attr.interpolation_value, Math.sin(window.performance.now()*1e-3)*0.7+0.5);	//We go a bit out of bounds for the fun of it

	//Set light direction	
	gl.uniform3f(vert_attr.light_direction, -0.6, 0.3, -0.4);
	

	//Drawcall	
	gl.drawArrays(gl.TRIANGLES, 0, application_state.triangle_count*3);

	window.requestAnimationFrame(draw_scene);

}
