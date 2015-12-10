function MyHoleCircle(scene, slices, width) {

	CGFobject.call(this, scene);

	this.indices = [];
	this.normals = [];	
	this.slices = slices;	
	this.width = 1 - width;
	this.stackIncrement = this.height / this.stacks;
	this.texCoords = [];
	this.vertices = [];
	this.initBuffers();
	

};

MyHoleCircle.prototype = Object.create(CGFobject.prototype);
MyHoleCircle.prototype.constructor = MyHoleCircle;

MyHoleCircle.prototype.initBuffers = function() {

	var theta = 0;
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var vertexNumber = 0;
	var r = this.width;
	
	for (var i = 0; i <= this.slices; i++) {

		var x = Math.cos(theta);
		var y = Math.sin(theta);

		this.vertices.push(r*x, r*y, 0);
		this.texCoords.push(x * 0.5 + 0.5, 0.5 - y * 0.5);
		this.normals.push(0, 0, 1);

		this.vertices.push(x, y, 0);
		this.texCoords.push(x * 0.5 + 0.5, 0.5 - y * 0.5);
		this.normals.push(0, 0, 1);

		theta += thetaIncrement;
	}

	for (var i = 0; i < this.slices; i++) {
		this.indices.push(vertexNumber, vertexNumber + 1, vertexNumber + 3);
		this.indices.push(vertexNumber, vertexNumber + 3, vertexNumber + 2);
		vertexNumber += 2;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};