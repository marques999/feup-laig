/**
 * construtor default da classe 'ObjectClockDigit'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @param {Number} minX - coordenada X do vértice superior esquerdo do retângulo
 * @param {Number} maxY - coordenada Y do vértice superior esquerdo do retângulo
 * @param {Number} maxX - coordenada X do vértice inferior direito do retângulo
 * @param {Number} minY - coordenada Y do vértice inferior direito do retângulo
 * @return {null}
 */
function ObjectClockDigit(scene, minS, maxS) {

	MyPrimitive.call(this, scene);

	this.vertices = [
		-0.5, -1.0, 0.0,
		0.5, -1.0, 0.0,
		-0.5, 1.0, 0.0,
		0.5, 1.0, 0.0
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
		minS, 1.0,
		maxS, 1.0,
		minS, 0.0,
		maxS, 0.0
	];

	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
	this.initGLBuffers();
};

ObjectClockDigit.prototype = Object.create(MyPrimitive.prototype);
ObjectClockDigit.prototype.constructor = ObjectClockDigit;