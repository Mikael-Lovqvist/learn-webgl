
function draw_scene() {

	var gl = application_state.gl;
	var vert_attr = application_state.vertex_attributes;

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clearColor(0.7, 0.7, 1, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//function perspectiveNO(out, fovy, aspect, near, far) {    
	mat4.perspective(application_state.projection_matrix, 100, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

	mat4.identity(application_state.camera_matrix);
	mat4.translate(application_state.camera_matrix, application_state.camera_matrix, [0, 0, -3]);
	mat4.rotateY(application_state.camera_matrix, application_state.camera_matrix, Math.PI * -.5);
	mat4.rotateX(application_state.camera_matrix, application_state.camera_matrix, Math.PI * .5);


	gl.enable(gl.DEPTH_TEST);

	gl.bindBuffer(gl.ARRAY_BUFFER, application_state.vertex_buffer);
	//void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);

	//One vertex is 12 bytes so we need a stride of 24 for the normals	
	gl.vertexAttribPointer(vert_attr.position, application_state.vertex_buffer.itemSize, gl.FLOAT, false, 24, 0);

	//Bind normals
	gl.vertexAttribPointer(vert_attr.normal, application_state.vertex_buffer.itemSize, gl.FLOAT, false, 24, 12);	//Offset
	
	//Set matrices
	gl.uniformMatrix4fv(vert_attr.projection_matrix, false, application_state.projection_matrix);
	gl.uniformMatrix4fv(vert_attr.camera_matrix, false, application_state.camera_matrix);

	//Drawcall	
	gl.drawArrays(gl.TRIANGLES, 0, application_state.triangle_count*3);



}
