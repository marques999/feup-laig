/**
 * construtor default da classe 'MyRectangle'
 * @param {GCFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Float} minX - coordenada X do vértice superior esquerdo do retângulo
 * @param {Float} maxY - coordenada Y do vértice superior esquerdo do retângulo
 * @param {Float} maxX - coordenada X do vértice inferior direito do retângulo
 * @param {Float} minY - coordenada Y do vértice inferior direito do retângulo
 * @class
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
 * inicializa buffers WebGL da primitiva
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
 * atualiza coordenadas de textura do retângulo com os factores recebidos
 * @param {Float} ampS - factor de amplificação na coordenada S
 * @param {Float} ampT - factor de amplificação na coordenada T
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