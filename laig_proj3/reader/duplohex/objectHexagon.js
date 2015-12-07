/**
 * construtor default da classe 'ObjectHexagon'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectHexagon(scene) {
	GamePiece.call(this, scene, new MyCircle(scene, 6, 1.0));
};

ObjectHexagon.prototype = Object.create(GamePiece.prototype);
ObjectHexagon.prototype.constructor = ObjectHexagon;

/**
 * inicializa os buffers WebGL da primitiva 'ObjectHexagon'
 * @return {null}
 */
ObjectHexagon.prototype.initBuffers = function() {

	var thetaIncrement = Math.PI / 3;
	var vertexNumber = 1;
	this.vertices.push(0, 0, 0);
	this.texCoords.push(0.5, 0.5);
	this.normals.push(0, 0, 1);

	for (var i = 0; i <= 6; i++) {

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

ObjectHexagon.prototype.display = function() {
	this.object.display();
};