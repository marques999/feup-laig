/**
 * construtor default da classe 'ObjectDigit'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @param {Number} minS - coordenada S do vértice superior esquerdo do retângulo
 * @param {Number} maxS - coordenada S do vértice superior esquerdo do retângulo
 * @return {null}
 */
function ObjectDigit(scene, minS, maxS) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.vertices = [
		0.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		0.0, 2.0, 0.0,
		1.0, 2.0, 0.0
	];
	//--------------------------------------------------------
	this.indices = [
		0, 1, 2, 3
	];
	//--------------------------------------------------------
	this.normals = [
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	];
	//--------------------------------------------------------
	this.texCoords = [
		minS, 1.0,
		maxS, 1.0,
		minS, 0.0,
		maxS, 0.0
	];
	//--------------------------------------------------------
	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
	this.initGLBuffers();
};
//--------------------------------------------------------
ObjectDigit.prototype = Object.create(MyPrimitive.prototype);
ObjectDigit.prototype.constructor = ObjectDigit;
//--------------------------------------------------------