function MyTriangle(scene, v1, v2, v3) {

    MyPrimitive.call(this, scene);

    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;

    this.a = Math.sqrt((v3[0] - v2[0]) * (v3[0] - v2[0]) + 
			 		   (v3[1] - v2[1]) * (v3[1] - v2[1]) +
			 		   (v3[2] - v2[2]) * (v3[2] - v2[2]));

	this.b = Math.sqrt((v1[0] - v3[0]) * (v1[0] - v3[0]) + 
			 		   (v1[1] - v3[1]) * (v1[1] - v3[1]) +
			 		   (v1[2] - v3[2]) * (v1[2] - v3[2]));

	this.c = Math.sqrt((v2[0] - v1[0]) * (v2[0] - v1[0]) + 
					   (v2[1] - v1[1]) * (v2[1] - v1[1]) +
					   (v2[2] - v1[2]) * (v2[2] - v1[2]));

	var angleBeta = Math.acos((this.a * this.a - this.b * this.b + this.c * this.c) / (2 * this.a * this.c));
	var vertexBminusA = vec3.create();
	var vertexCminusA = vec3.create();

	this.vertexNormal = vec3.create();
	this.cosBeta = Math.cos(angleBeta);
	this.sinBeta = Math.sin(angleBeta);

	vec3.subtract(vertexBminusA, this.v2, this.v1);
	vec3.subtract(vertexCminusA, this.v3, this.v1);
	vec3.cross(this.vertexNormal, vertexBminusA, vertexCminusA);
	vec3.normalize(this.vertexNormal, this.vertexNormal);

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

	this.normals = [
		this.vertexNormal[0], this.vertexNormal[1], this.vertexNormal[2],
		this.vertexNormal[0], this.vertexNormal[1], this.vertexNormal[2],
		this.vertexNormal[0], this.vertexNormal[1], this.vertexNormal[2]
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
		0.0, 0.0,
		this.c / this.ampS, 0.0,
		(this.c - this.a * this.cosBeta) / this.ampS, (this.a * this.sinBeta) / this.ampT,
    ];

    this.updateTexCoordsGLBuffers();
};