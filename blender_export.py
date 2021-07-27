#This is just pasted in the interactive console for now

with open('face.polygons', 'wb') as outfile:
	for polygon in D.objects['Cube.002'].data.polygons:
		outfile.write(struct.pack('HHH', *polygon.vertices))

with open('happy.vertices', 'wb') as outfile:
	for vertex in D.objects['Cube.003'].data.vertices:
		outfile.write(struct.pack('ffffff', *vertex.co, *vertex.normal))

with open('sad.vertices', 'wb') as outfile:
	for vertex in D.objects['Cube.002'].data.vertices:
		outfile.write(struct.pack('ffffff', *vertex.co, *vertex.normal))

