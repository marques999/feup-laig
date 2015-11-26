function MyCircle(scene, slices) {

	CGFobject.call(this, scene);

	this.indices = [];
	this.normals = [];
	this.slices = slices;
	this.texCoords = [];
	this.vertices = [];
	this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function() {

	var theta = 0;
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var vertexNumber = 1;

	this.vertices.push(0, 0, 0);
	this.texCoords.push(0.5, 0.5);
	this.normals.push(0, 0, 1);

	for (var i = 0; i <= this.slices; i++) {

		var x = Math.cos(theta);
		var y = Math.sin(theta);

		this.vertices.push(x, y, 0);
		this.texCoords.push(x * 0.5 + 0.5, 0.5 - y * 0.5);
		this.normals.push(0, 0, 1);

		theta += thetaIncrement;
	}

	for (var i = 0; i < this.slices; i++, vertexNumber++) {
		this.indices.push(vertexNumber, vertexNumber + 1, 0);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};