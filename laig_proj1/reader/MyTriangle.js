function MyTriangle(scene, vertexA, vertexB, vertexC) {

    CGFobject.call(this, scene);

    this.vertexA = vertexA;
    this.vertexB = vertexB;
    this.vertexC = vertexC;

	this.vertices = [
		this.vertexA[0], this.vertexA[1], this.vertexA[2],
		this.vertexB[0], this.vertexB[1], this.vertexB[2],
		this.vertexC[0], this.vertexC[1], this.vertexC[2]
	];

	this.indices = [
		0, 1, 2,
	];

	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
	];

	this.texCoords = [
		0.0, 0.0,
		0.5, 0.5,
		1.0, 1.0
	]

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.setTextureFactor = function(factorS, factorT) {

	this.minS = 0.0;
	this.minT = 0.0;
    this.maxS = this.width / factorS;
    this.maxT = this.height / factorT;

    this.texCoords = [
		this.minS, this.minT,
		this.maxS, this.minT,
		this.minS, this.maxT,
	];
};