/**
 * construtor default da classe 'MyTriangle'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @param {Number[]} v1 - vetor de coordenadas (x, y, z) do vértice esquerdo da base do triângulo
 * @param {Number[]} v2 - vetor de coordenadas (x, y, z) do vértice direito da base do triângulo
 * @param {Number[]} v3 - vetor de coordenadas (x, y, z) do vértice de topo do triângulo
 * @return {null}
 */
function MyTriangle(scene, v1, v2, v3) {

	MyPrimitive.call(this, scene);

	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;
	this.ampS = 0.0;
	this.ampT = 0.0;

	this.a = Math.sqrt((v3[0] - v2[0]) * (v3[0] - v2[0]) +
					   (v3[1] - v2[1]) * (v3[1] - v2[1]) +
					   (v3[2] - v2[2]) * (v3[2] - v2[2]));

	this.b = Math.sqrt((v1[0] - v3[0]) * (v1[0] - v3[0]) +
					   (v1[1] - v3[1]) * (v1[1] - v3[1]) +
					   (v1[2] - v3[2]) * (v1[2] - v3[2]));

	this.c = Math.sqrt((v2[0] - v1[0]) * (v2[0] - v1[0]) +
					   (v2[1] - v1[1]) * (v2[1] - v1[1]) +
					   (v2[2] - v1[2]) * (v2[2] - v1[2]));

	var vertexBminusA = vec3.create();
	var vertexCminusA = vec3.create();

	this.vertexNormal = vec3.create();
	this.cosBeta = (this.a * this.a - this.b * this.b + this.c * this.c) / (2 * this.a * this.c);
	this.sinBeta = Math.sin(Math.acos(this.cosBeta));

	vec3.subtract(vertexBminusA, this.v2, this.v1);
	vec3.subtract(vertexCminusA, this.v3, this.v1);
	vec3.cross(this.vertexNormal, vertexBminusA, vertexCminusA);
	vec3.normalize(this.vertexNormal, this.vertexNormal);

	this.initBuffers();
};

MyTriangle.prototype = Object.create(MyPrimitive.prototype);
MyTriangle.prototype.constructor = MyTriangle;

/**
 * inicializa os buffers WebGL da primitiva 'MyTriangle'
 * @return {null}
 */
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

/**
 * atualiza as coordenadas de textura do triângulo com os valores recebidos
 * @param {Number} ampS - factor de amplificação na coordenada S
 * @param {Number} ampT - factor de amplificação na coordenada T
 * @return {null}
 */
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