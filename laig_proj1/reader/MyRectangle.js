/**
 * construtor default da classe 'MyRectangle'
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} minX - coordenada X do vértice superior esquerdo do retângulo
 * @param {Number} maxY - coordenada Y do vértice superior esquerdo do retângulo
 * @param {Number} maxX - coordenada X do vértice inferior direito do retângulo
 * @param {Number} minY - coordenada Y do vértice inferior direito do retângulo
 * @constructor
 */
function MyRectangle(scene, minX, maxY, maxX, minY) {

	MyPrimitive.call(this, scene);

	this.minX = minX;
	this.minY = minY;
	this.maxX = maxX;
	this.maxY = maxY;
	this.ampS = 0.0;
	this.ampT = 0.0;
	this.width = this.maxX - this.minX;
	this.height = this.maxY - this.minY;
	this.initBuffers();
};

MyRectangle.prototype = Object.create(MyPrimitive.prototype);
MyRectangle.prototype.constructor = MyRectangle;

/**
 * inicializa os buffers WebGL da primitiva 'MyRectangle'
 * @return {null}
 */
MyRectangle.prototype.initBuffers = function() {

	this.vertices = [
		this.minX, this.minY, 0.0,
		this.maxX, this.minY, 0.0,
		this.minX, this.maxY, 0.0,
		this.maxX, this.maxY, 0.0
	];

	this.indices = [
		0, 1, 2, 3
	];

	this.normals = [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	];

	this.texCoords = [
		0.0, 1.0,
		1.0, 1.0,
		0.0, 0.0,
		1.0, 0.0
	];

	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
	this.initGLBuffers();
};

/**
 * atualiza as coordenadas de textura do retângulo com os valores recebidos
 * @param {Number} ampS - factor de amplificação na coordenada S
 * @param {Number} ampT - factor de amplificação na coordenada T
 * @return {null}
 */
MyRectangle.prototype.updateTexCoords = function(ampS, ampT) {

	if (this.ampS == ampS && this.ampT == ampT) {
		return;
	}

	this.ampS = ampS;
	this.ampT = ampT;
	var maxS = this.width / this.ampS;
	var maxT = this.height / this.ampT;

	this.texCoords = [
		0.0, maxT,
		maxS, maxT,
		0.0, 0.0,
		maxS, 0.0
	];

	this.updateTexCoordsGLBuffers();
};