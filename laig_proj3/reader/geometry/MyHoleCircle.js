/**
 * construtor default da classe 'MyHoleCircle'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} radius - raio da esfera
 * @param {Number} stacks - número de secções da esfera em altura
 * @param {Number} slices - número de secçoes da esfera em torno do raio
 * @return {null}
 */
function MyHoleCircle(scene, slices, width) {

	CGFobject.call(this, scene);

	this.indices = [];
	this.normals = [];
	this.slices = slices;
	this.radius = 1.0 - width;
	this.texCoords = [];
	this.vertices = [];
	this.initBuffers();
};

MyHoleCircle.prototype = Object.create(CGFobject.prototype);
MyHoleCircle.prototype.constructor = MyHoleCircle;

/**
 * inicializa os buffers WebGL da primitiva 'MyHoleCircle'
 * @return {null}
 */
MyHoleCircle.prototype.initBuffers = function() {

	var theta = 0;
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var vertexNumber = 0;

	for (var i = 0; i <= this.slices; i++) {

		var x = Math.cos(theta);
		var y = Math.sin(theta);
		this.vertices.push(this.radius * x, this.radius * y, 0);
		this.texCoords.push(this.radius * x * 0.5 + 0.5, 0.5 - this.radius * y * 0.5);
		this.normals.push(0, 0, 1);
		this.vertices.push(x, y, 0);
		this.texCoords.push(x * 0.5 + 0.5, 0.5 - y * 0.5);
		this.normals.push(0, 0, 1);

		theta += thetaIncrement;
	}

	for (var i = 0; i < this.slices; i++) {

		this.indices.push(vertexNumber, vertexNumber + 1, vertexNumber + 3);
		this.indices.push(vertexNumber, vertexNumber + 3, vertexNumber + 2);

		vertexNumber += 2;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};