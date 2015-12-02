/**
 * construtor default da classe 'ObjectHexagon'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} slices - número de divisões do círculo em torno do raio
 * @return {null}
 */
function ObjectHexagon(scene, slices, radius) {

	GamePiece.call(this, scene);

	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.radius = radius || 1.0;
	this.slices = slices;
	this.initBuffers();
};

ObjectHexagon.prototype = Object.create(GamePiece.prototype);
ObjectHexagon.prototype.constructor = ObjectHexagon;

/**
 * inicializa os buffers WebGL da primitiva 'ObjectHexagon'
 * @return {null}
 */
ObjectHexagon.prototype.initBuffers = function() {

	var halfRadius = this.radius / 2;
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var vertexNumber = 1;
	this.vertices.push(0, 0, 0);
	this.texCoords.push(halfRadius, halfRadius);
	this.normals.push(0, 0, 1);

	for (var i = 0; i <= this.slices; i++) {

		var x = this.radius * Math.cos(thetaIncrement * i);
		var y = this.radius * Math.sin(thetaIncrement * i);
		this.vertices.push(x, y, 0);
		this.texCoords.push(x * halfRadius + halfRadius, halfRadius - y * halfRadius);
		this.normals.push(0, 0, 1);

		if (i > 0) {
			this.indices.push(vertexNumber++, vertexNumber, 0);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};