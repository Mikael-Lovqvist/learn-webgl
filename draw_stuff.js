


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

	//void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);

	//One vertex is 12 bytes so we need a stride of 24 for the normals	

	gl.bindBuffer(gl.ARRAY_BUFFER, application_state.buffers.vertices);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, application_state.buffers.index_buffer);

	gl.vertexAttribPointer(vert_attr.position_happy, application_state.buffers.vertices.itemSize, gl.FLOAT, false, 24, 0);
	gl.vertexAttribPointer(vert_attr.position_sad, application_state.buffers.vertices.itemSize, gl.FLOAT, false, 24, application_state.buffers.happy.length*4);

	//Bind normals
	gl.vertexAttribPointer(vert_attr.normal_happy, application_state.buffers.vertices.itemSize, gl.FLOAT, false, 24, 12);
	gl.vertexAttribPointer(vert_attr.normal_sad, application_state.buffers.vertices.itemSize, gl.FLOAT, false, 24, 12+application_state.buffers.happy.length*4);

	//Set matrices
	gl.uniformMatrix4fv(vert_attr.projection_matrix, false, application_state.projection_matrix);
	gl.uniformMatrix4fv(vert_attr.camera_matrix, false, application_state.camera_matrix);

	//Set sadness	
	gl.uniform1f(vert_attr.interpolation_value, Math.sin(window.performance.now()*1e-3)*0.7+0.5);	//We go a bit out of bounds for the fun of it

	//Set light direction	
	gl.uniform3f(vert_attr.light_direction, -0.4, 0.4, -0.8);
	

	//Drawcall	
	gl.drawElements(gl.TRIANGLES, application_state.buffers.face_polygons.length, gl.UNSIGNED_SHORT, 0);


	window.requestAnimationFrame(draw_scene);

}
