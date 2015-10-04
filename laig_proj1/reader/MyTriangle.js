function MyTriangle(scene, vertexA, vertexB, vertexC) {

    MyPrimitive.call(this, scene);

    this.vertexA = vertexA;
    this.vertexB = vertexB;
    this.vertexC = vertexC;
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initBuffers();
	this.initGLBuffers();
};

MyTriangle.prototype = Object.create(MyPrimitive.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {
	
	this.vertices = [
		this.vertexA[0], this.vertexA[1], this.vertexA[2],
		this.vertexB[0], this.vertexB[1], this.vertexB[2],
		this.vertexC[0], this.vertexC[1], this.vertexC[2]
	];

	this.indices = [
		0, 1, 2,
	];

	var vertexBminusA = vec3.create();
	var vertexCminusA = vec3.create();
	var vertexNormal = vec3.create();
	
	vec3.subtract(vertexBminusA, this.vertexB, this.vertexA);
	vec3.subtract(vertexCminusA, this.vertexC, this.vertexA);
	vec3.cross(vertexNormal, vertexBminusA, vertexCminusA);
	vec3.normalize(vertexNormal, vertexNormal);

	this.normals = [
		vertexNormal[0], vertexNormal[1], vertexNormal[2],
		vertexNormal[0], vertexNormal[1], vertexNormal[2],
		vertexNormal[0], vertexNormal[1], vertexNormal[2]
	];
};

MyTriangle.prototype.updateTexCoords = function(ampS, ampT) {};