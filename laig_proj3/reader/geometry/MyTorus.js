/**
 * construtor default da classe 'MyTorus'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} radius - raio da esfera
 * @param {Number} stacks - número de secções da esfera em altura
 * @param {Number} slices - número de secçoes da esfera em torno do raio
 * @return {null}
 */
function MyTorus(scene, radius, center, stacks, slices) {

	MyPrimitive.call(this, scene);

	this.radius = radius;
	this.center = center;
	this.slices = slices;
	this.stacks = stacks;
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.initBuffers();
};

MyTorus.prototype = Object.create(MyPrimitive.prototype);
MyTorus.prototype.constructor = MyTorus;

/**
 * inicializa os buffers WebGL da primitiva 'MyTorus'
 * @return {null}
 */
MyTorus.prototype.initBuffers = function() {

	var texelLengthS = 1.0 / this.slices;
	var texelLengthT = 1.0 / this.stacks;
	var phiIncrement = (2 * Math.PI) / this.slices;
	var thetaIncrement = (2 * Math.PI) / this.stacks;
	var stackIncrement = 1.0 / this.stacks;
	var sCoord = 1.0;
	var vertexNumber = 1;
	var phi = 0;

	for (var i = 0; i <= this.slices; i++) {

		var theta = 2 * Math.PI;
		var y = 0;
		var tCoord = 0.0;
		var deltaX = Math.cos(phi);
		var deltaZ = Math.sin(phi);
		
		for (var j = 0; j <= this.stacks; j++) {

			var x = deltaX * (this.center + this.radius * Math.cos(theta));
			var z = deltaZ * (this.center + this.radius * Math.cos(theta));

			this.vertices.push(x, y, z);
			this.normals.push(x, y, z);
			this.texCoords.push(sCoord, tCoord);

			if (i > 0 && j > 0) {

				this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber + this.stacks + 1);
				this.indices.push(vertexNumber + this.stacks, vertexNumber, vertexNumber - 1);

				vertexNumber++;
			}

			theta -= thetaIncrement;
			y += stackIncrement;
			tCoord += texelLengthT;
		}

		if (i > 0) {
			vertexNumber++;
		}

		phi += phiIncrement;
		sCoord -= texelLengthS;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};