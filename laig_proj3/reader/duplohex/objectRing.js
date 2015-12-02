/**
 * construtor default da classe 'ObjectRing'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} radius - raio da esfera
 * @param {Number} stacks - número de secções da esfera em altura
 * @param {Number} slices - número de secçoes da esfera em torno do raio
 * @return {null}
 */
function ObjectRing(scene, color, inner, height)  {

	GamePiece.call(this, scene);

	this.material = new CGFappearance(scene);
	this.invertedCylinder = new MyCylinderInverted(scene, height, 1.0, 1.0, 16, 32);
	this.cylinder = new MyCylinder(scene, height, 1.0, 1.0, 16, 32);
	this.hole = new MyCircleHole(scene, 32, inner);
	this.inner = 1.0 - inner;
	this.height = height;

	if (color == 'black') {
		this.material.setDiffuse(0.05, 0.05, 0.05, 0.6);
		this.material.setAmbient(0.05, 0.05, 0.05, 0.2);
		this.material.setSpecular(1.0, 1.0, 1.0, 0.1);
		this.material.setShininess(30);
	}
	else if (color == 'white') {
		this.material.setDiffuse(0.95, 0.95, 0.95, 0.6);
		this.material.setAmbient(0.95, 0.95, 0.95, 0.2);
		this.material.setSpecular(1.0, 1.0, 1.0, 0.1);
		this.material.setShininess(30);
	}
};

ObjectRing.prototype = Object.create(GamePiece.prototype);
ObjectRing.prototype.constructor = ObjectRing;

/**
 * inicializa os buffers WebGL da primitiva 'ObjectRing'
 * @return {null}
 */
ObjectRing.prototype.display = function() {
	this.material.apply();
	this.scene.pushMatrix();
	this.scene.translate(0.0, 0.0, this.height);
	this.hole.display();
	this.scene.translate(0.0, 0.0, -this.height);
	this.cylinder.display();
	this.scene.scale(1.0, -1.0, -1.0);
	this.hole.display();
	this.scene.scale(this.inner, -this.inner, -1.0);
	this.invertedCylinder.display();
	this.scene.popMatrix();
 };