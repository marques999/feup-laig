function MyTriangle(scene, v1, v2, v3) {

    MyPrimitive.call(this, scene);

    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;

    this.a = Math.sqrt((v1[0] - v3[0]) * (v1[0] - v3[0]) + 
			 		   (v1[1] - v3[1]) * (v1[1] - v3[1]) +
			 		   (v1[2] - v3[2]) * (v1[2] - v3[2]));

	this.b = Math.sqrt((v2[0] - v1[0]) * (v2[0] - v1[0]) + 
			 		   (v2[1] - v1[1]) * (v2[1] - v1[1]) +
			 		   (v2[2] - v1[2]) * (v2[2] - v1[2]));

	this.c = Math.sqrt((v3[0] - v2[0]) * (v3[0] - v2[0]) + 
			 		   (v3[1] - v2[1]) * (v3[1] - v2[1]) +
			 		   (v3[2] - v2[2]) * (v3[2] - v2[2]));

	this.beta = Math.acos((this.a*this.a - this.b*this.b + this.c * this.c) / (2 * this.a * this.c));
	this.alpha = Math.acos((-this.a*this.a + this.b*this.b + this.c * this.c) / (2 * this.b * this.c));
	this.gamma = Math.acos((this.a*this.a + this.b*this.b - this.c * this.c) / (2 * this.a * this.b));
	this.initBuffers();
};

MyTriangle.prototype = Object.create(MyPrimitive.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function() {
	
	this.vertices = [
		this.v1[0], this.v1[1], this.v1[2],
		this.v2[0], this.v2[1], this.v2[2],
		this.v3[0], this.v3[1], this.v3[2]
	];

	this.indices = [
		0, 1, 2,
	];

	var vertexBminusA = vec3.create();
	var vertexCminusA = vec3.create();
	var vertexNormal = vec3.create();
	
	vec3.subtract(vertexBminusA, this.v2, this.v1);
	vec3.subtract(vertexCminusA, this.v3, this.v1);
	vec3.cross(vertexNormal, vertexBminusA, vertexCminusA);
	vec3.normalize(vertexNormal, vertexNormal);

	this.normals = [
		vertexNormal[0], vertexNormal[1], vertexNormal[2],
		vertexNormal[0], vertexNormal[1], vertexNormal[2],
		vertexNormal[0], vertexNormal[1], vertexNormal[2]
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyTriangle.prototype.updateTexCoords = function(ampS, ampT) {

	if (this.ampS == ampS && this.ampT == ampT) {
		return;
	}

	this.ampS = ampS;
	this.ampT = ampT;

	this.texCoords = [
	  0.0, 1.0 / this.ampT,
	  (this.b - this.a * Math.cos(this.beta)) / this.ampS, 1.0 / this.ampT,
	  1.0 / this.ampS, this.c / this.ampT
    ];

    this.updateTexCoordsGLBuffers();
};