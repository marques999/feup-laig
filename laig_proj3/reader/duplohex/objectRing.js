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
function ObjectRing(scene, color, position) {

	GamePiece.call(this, scene, position);

	this.defaultMaterial = new CGFappearance(scene);
	this.invertedCylinder = new MyCylinderInverted(scene, 0.9, 1.0, 1.0, 16, 32);
	this.cylinder = new MyCylinder(scene, 0.9, 1.0, 1.0, 16, 32);
	this.hole = new MyCircleHole(scene, 32, 0.35);

	if (color == 'black') {
		this.defaultMaterial.setDiffuse(0.05, 0.05, 0.05, 0.6);
		this.defaultMaterial.setAmbient(0.05, 0.05, 0.05, 0.2);
		this.defaultMaterial.setSpecular(1.0, 1.0, 1.0, 0.1);
		this.defaultMaterial.setShininess(30);
	}
	else if (color == 'white') {
		this.defaultMaterial.setDiffuse(0.95, 0.95, 0.95, 0.6);
		this.defaultMaterial.setAmbient(0.95, 0.95, 0.95, 0.2);
		this.defaultMaterial.setSpecular(1.0, 1.0, 1.0, 0.1);
		this.defaultMaterial.setShininess(30);
	}

	this.materialYellow = new CGFappearance(scene);
	this.materialYellow.setDiffuse(0.9, 0.9, 0.05, 0.6);
	this.materialYellow.setAmbient(0.1, 0.9, 0.1, 0.2);
	this.materialYellow.setSpecular(1.0, 1.0, 1.0, 0.5);
	this.materialYellow.setShininess(30);

	this.materialRed = new CGFappearance(scene);
	this.materialRed.setDiffuse(0.9, 0.05, 0.05, 0.6);
	this.materialRed.setAmbient(0.9, 0.05, 0.05, 0.2);
	this.materialRed.setSpecular(1.0, 1.0, 1.0, 0.5);
	this.materialRed.setShininess(30);

	this.material = this.defaultMaterial;
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
	this.scene.translate(0.0, 0.0, 0.85);
	this.hole.display();
	this.scene.translate(0.0, 0.0, -0.85);
	this.cylinder.display();
	this.scene.scale(1.0, -1.0, -1.0);
	this.hole.display();
	this.scene.scale(0.65, -0.65, -1.0);
	this.invertedCylinder.display();
	this.scene.popMatrix();
 };

ObjectRing.prototype.setColor = function(color) {
	
	if (color == 'red') {
		this.material = this.materialRed;
	}
	else if (color == 'yellow') {
		this.material = this.materialYellow;
	}
	else {
		this.material = this.defaultMaterial;
	}

	return this;
 };