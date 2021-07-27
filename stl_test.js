/*
	UINT8[80]    – Header                 -     80 bytes                           
	UINT32       – Number of triangles    -      4 bytes

	foreach triangle                      - 50 bytes:
	    REAL32[3] – Normal vector             - 12 bytes
	    REAL32[3] – Vertex 1                  - 12 bytes
	    REAL32[3] – Vertex 2                  - 12 bytes
	    REAL32[3] – Vertex 3                  - 12 bytes
	    UINT16    – Attribute byte count      -  2 bytes
	end

	source: https://en.wikipedia.org/wiki/STL_(file_format)#Binary_STL

*/



class Vertex {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	get_size() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
}

class Triangle {
	constructor(a, b, c, normal) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.normal = normal;
	}

	get_size() {
		return this.a.get_size() + this.b.get_size() + this.c.get_size();
	}
}

class Mesh {
	constructor(triangles) {
		this.triangles = triangles;
	}
}

function read_uint32(buffer) {
	var view = new Uint32Array(buffer);
	return view[0];
}


function read_triangle(buffer) {
	var bufslice = buffer.slice(0, 48);
	var real_view = new Float32Array(bufslice);


	var result = new Triangle(
		new Vertex(real_view[3], real_view[4], real_view[5]),		//a
		new Vertex(real_view[6], real_view[7], real_view[8]),		//b
		new Vertex(real_view[9], real_view[10], real_view[11]),		//c
		new Vertex(real_view[0], real_view[1], real_view[2]),		//Normal
	);

/*	//Hardcoded sanity check for now to figure out an issue
	if (result.get_size() > 1000) {		
		console.error('view', real_view, 'slice', bufslice, 'data', new Uint8Array(bufslice));
		throw new Error("Sanity check failed on triangle");
	}
*/
	return result;
}





function get_stl(url) {

	return new Promise((success, failure) => {
		//This promise should of course deal with failures too but this is outside of the scope of this experiment

		var req = new XMLHttpRequest();
		
		req.responseType = 'arraybuffer';

		req.addEventListener('load', event => {
			//Here we just assume that we got the file since proper fetching is outside the scope of this experiment
			var data = event.target.response;

			var header = data.slice(0, 80);
			
			var triangles = read_uint32(data.slice(80, 84));

			//Each triangle is located at 84 + i*50
			var triangle_list = new Array();
			for (var i=0; i<triangles; i++) {
				triangle_list.push(read_triangle(data.slice(84+i*50, 84+(i+1)*50)));
			}
			
			success(new Mesh(triangle_list));			

		});

		req.open('GET', url, true);
		req.send();

	})


}

