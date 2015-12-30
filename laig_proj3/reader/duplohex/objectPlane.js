/**
 * construtor default da classe 'ObjectPlane'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @param {Number} nrDivs - número de divisões do plano
 * @return {null}
 */
function ObjectPlane(scene, nrDivs) {
	//--------------------------------------------------------
	MyPrimitive.call(this,scene);
	//--------------------------------------------------------
	this.nrDivs = nrDivs || 1;
	this.patchLength = 1.0 / nrDivs;
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.initBuffers();
};
//--------------------------------------------------------
ObjectPlane.prototype = Object.create(MyPrimitive.prototype);
ObjectPlane.prototype.constructor = ObjectPlane;
//--------------------------------------------------------
ObjectPlane.prototype.initBuffers = function() {
	//--------------------------------------------------------
	var yCoord = 0.5;
	var tCoord = 0.0;
	var vertexNumber = 0;
	//--------------------------------------------------------
	for (var j = 0; j <= this.nrDivs; j++, tCoord += this.patchLength) {

		var xCoord = -0.5;
		var sCoord = 0.0;

		for (var i = 0; i <= this.nrDivs; i++, sCoord += this.patchLength, xCoord += this.patchLength) {
			this.vertices.push(xCoord, yCoord, 0.0);
			this.normals.push(0.0, 0.0, 1.0);
			this.texCoords.push(sCoord);
			this.texCoords.push(tCoord);
		}

		yCoord -= this.patchLength;
	}
	//--------------------------------------------------------
	for (var j = 0; j < this.nrDivs; j++) {

		for (var i = 0; i <= this.nrDivs; i++, vertexNumber++) {
			this.indices.push(vertexNumber);
			this.indices.push(vertexNumber + this.nrDivs + 1);
		}

		if (j + 1 < this.nrDivs) {
			this.indices.push(vertexNumber + this.nrDivs);
			this.indices.push(vertexNumber);
		}
	}
	//--------------------------------------------------------
	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
	this.initGLBuffers();
};