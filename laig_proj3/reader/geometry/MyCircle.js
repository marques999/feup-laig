/**
 * construtor default da classe 'MyCircle'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} slices - número de divisões do círculo em torno do raio
 * @return {null}
 */
function MyCircle(scene, slices) {

	CGFobject.call(this, scene);

	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.slices = slices;
	this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

/**
 * inicializa os buffers WebGL da primitiva 'MyCircle'
 * @return {null}
 */
MyCircle.prototype.initBuffers = function() {
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var vertexNumber = 1;
	this.vertices.push(0, 0, 0);
	this.texCoords.push(0.5, 0.5);
	this.normals.push(0, 0, 1);

	for (var i = 0; i <= this.slices; i++) {
		var x = Math.cos(thetaIncrement * i);
		var y = Math.sin(thetaIncrement * i);
		this.vertices.push(x, y, 0);
		this.texCoords.push(x * 0.5 + 0.5, 0.5 - y * 0.5);
		this.normals.push(0, 0, 1);

		if (i > 0) {
			this.indices.push(vertexNumber++, vertexNumber, 0);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};