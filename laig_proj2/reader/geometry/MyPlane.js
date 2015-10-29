/**
 * construtor default da classe 'MyPlane'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} nrDivs - número de divisões do plano em comprimento e largura
 * @return {null}
 */
function MyPlane(scene, nrDivs) {

	CGFobject.call(this, scene);

	this.nrDivs = nrDivs;
	this.patchLength = 1.0 / nrDivs;
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.initBuffers();
};

MyPlane.prototype = Object.create(MyPrimitive.prototype);
MyPlane.prototype.constructor = MyPlane;

/**
 * inicializa os buffers WebGL da primitiva 'MyPlane'
 * @return {null}
 */
MyPlane.prototype.initBuffers = function() {

	var yCoord = 0.0;
	var tCoord = 1.0;

	for (var j = 0; j <= this.nrDivs; j++) {

		var xCoord = 0.0;

		for (var i = 0; i <= this.nrDivs; i++) {

			this.vertices.push(xCoord, yCoord, 0.0);
			this.texCoords.push(xCoord, tCoord);
			this.normals.push(0.0, 0.0, 1.0);

			xCoord += this.patchLength;
		}

		yCoord += this.patchLength;
		tCoord -= this.patchLength;
	}

	var vertexNumber = 0;

	for (var j = 0; j < this.nrDivs; j++) {

		for (var i = 0; i <= this.nrDivs; i++) {
			this.indices.push(vertexNumber);
			this.indices.push(vertexNumber++ + this.nrDivs + 1);
		}

		if (j + 1 < this.nrDivs) {
			this.indices.push(vertexNumber + this.nrDivs);
			this.indices.push(vertexNumber);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
	this.initGLBuffers();
};