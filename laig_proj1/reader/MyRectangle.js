function MyRectangle(scene, vertexA, vertexB) {

	CGFobject.call(this, scene);

	this.minX = vertexA[0];
	this.minY = vertexA[1];
	this.maxX = vertexB[0];
	this.maxY = vertexB[1];
	this.width = this.maxX - this.minX;
	this.height = this.maxY - this.minY;

	this.vertices = [
	    this.minX, this.minY, 0.0,
		this.maxX, this.minY, 0.0,
		this.minX, this.maxY, 0.0,
		this.maxX, this.maxY, 0.0
	];

	this.indices = [
		0, 1, 2,
		3, 2, 1
	];

	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.setTexture = function(factorS, factorT) {

	this.minS = 0.0;
	this.minT = 0.0;
    this.maxS = this.width / factorS;
    this.maxT = this.height / factorT;

    this.texCoords = [
		this.minS, this.minT,
		this.maxS, this.minT,
		this.minS, this.maxT,
		this.maxS, this.maxT
	];
};