function MyRectangle(scene, minX, minY, maxX, maxY) {

	MyPrimitive.call(this, scene);

	this.minX = minX || 0.0;
	this.minY = minY || 0.0;
	this.maxX = maxX || 1.0;
	this.maxY = maxY || 1.0;

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

	this.texCoords = [
		0.0, 1.0,
		1.0, 1.0,
		0.0, 0.0,
		1.0, 0.0
	];

	this.ampS = 1.0;
	this.ampT = 1.0;
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype = Object.create(MyPrimitive.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.updateTexCoords = function(ampS, ampT) {

	if (this.ampS == ampS && this.ampT == ampT) {
		return;
	}

	this.ampS = ampS;
	this.ampT = ampT;
    var maxS = Math.abs(this.maxX - this.minX) / this.ampS;
    var maxT = Math.abs(this.maxY - this.minY) / this.ampT;

    this.texCoords = [
		0.0, maxT,
		maxS, maxT,
		0.0, 0.0,
		maxS, 0.0
	];

	this.updateTexCoordsGLBuffers();
};