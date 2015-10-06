function MyRectangle(scene, minX, maxY, maxX, minY) {

	MyPrimitive.call(this, scene);

	this.minX = minX || 0.0;
	this.minY = minY || 0.0;
	this.maxX = maxX || 1.0;
	this.maxY = maxY || 1.0;
	this.ampS = 1.0;
	this.ampT = 1.0;
	this.width = this.maxX - this.minX;
	this.height = this.maxY - this.minY;
	this.initBuffers();
};

MyRectangle.prototype = Object.create(MyPrimitive.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function() {

	this.vertices = [
	    this.minX, this.minY, 0.0,
		this.maxX, this.minY, 0.0,
		this.minX, this.maxY, 0.0,
		this.maxX, this.maxY, 0.0
	];

	this.indices = [
		0, 1, 2, 3,
	];

	this.normals = [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	];

	this.texCoords = [
		0.0, 1.0,
		1.0, 1.0,
		0.0, 0.0,
		1.0, 0.0
	];

	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
	this.initGLBuffers();
};

MyRectangle.prototype.updateTexCoords = function(ampS, ampT) {

	if (this.ampS == ampS && this.ampT == ampT) {
		return;
	}

	this.ampS = ampS;
	this.ampT = ampT;
    var maxS = this.width / this.ampS;
    var maxT = this.height / this.ampT;

    this.texCoords = [
		0.0, maxT,
		maxS, maxT,
		0.0, 0.0,
		maxS, 0.0
	];

	this.updateTexCoordsGLBuffers();
};