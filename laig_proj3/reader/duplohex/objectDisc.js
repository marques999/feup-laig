/**
 * construtor default da classe 'ObjectDisc'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} radius - raio da esfera
 * @param {Number} stacks - número de secções da esfera em altura
 * @param {Number} slices - número de secçoes da esfera em torno do raio
 * @return {null}
 */
function ObjectDisc(scene, color, height, radius) {

	GamePiece.call(this, scene);

	this.material = new CGFappearance(scene);
	this.cylinder = new MyCylinder(scene, height, radius, radius, 16, 32);
	this.circle = new MyCircle(scene, 32, radius);
	this.height = height;

	if (color == 'black') {
		this.material.setDiffuse(0.05, 0.05, 0.05, 0.6);
		this.material.setAmbient(0.05, 0.05, 0.05, 0.2);
		this.material.setSpecular(1.0, 1.0, 1.0, 0.5);
		this.material.setShininess(30);
	}
	else if (color == 'white') {
		this.material.setDiffuse(0.95, 0.95, 0.95, 0.6);
		this.material.setAmbient(0.95, 0.95, 0.95, 0.2);
		this.material.setSpecular(1.0, 1.0, 1.0, 0.5);
		this.material.setShininess(30);
	}
};

ObjectDisc.prototype = Object.create(GamePiece.prototype);
ObjectDisc.prototype.constructor = ObjectDisc;

/**
 * inicializa os buffers WebGL da primitiva 'ObjectDisc'
 * @return {null}
 */
ObjectDisc.prototype.display = function() {
	this.material.apply();
	this.scene.pushMatrix();
	this.cylinder.display();
	this.scene.translate(0.0, 0.0, this.height);
	this.circle.display();
	this.scene.translate(0.0, 0.0, -this.height);
	this.scene.scale(1.0, -1.0, -1.0);
	this.circle.display();
	this.scene.popMatrix();
 };