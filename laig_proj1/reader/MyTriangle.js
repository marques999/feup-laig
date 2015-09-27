function MyTriangle(scene, left, middle, right)
{
    CGFobject.call(this, scene);

    this.vertexA = left;
    this.vertexB = middle;
    this.vertexC = right;

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

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;