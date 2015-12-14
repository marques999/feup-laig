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
function ObjectDisc(scene, color, position) {

	GamePiece.call(this, scene, position);

	this.defaultMaterial = new CGFappearance(scene);
	this.cylinder = new MyCylinder(scene, 1.0, 0.65, 0.65, 16, 32);
	this.circle = new MyCircle(scene, 32, 0.65);

	if (color == 'black') {
		this.defaultMaterial.setDiffuse(0.05, 0.05, 0.05, 0.6);
		this.defaultMaterial.setAmbient(0.05, 0.05, 0.05, 0.2);
		this.defaultMaterial.setSpecular(1.0, 1.0, 1.0, 0.5);
		this.defaultMaterial.setShininess(30);
	}
	else if (color == 'white') {
		this.defaultMaterial.setDiffuse(0.95, 0.95, 0.95, 0.6);
		this.defaultMaterial.setAmbient(0.95, 0.95, 0.95, 0.2);
		this.defaultMaterial.setSpecular(1.0, 1.0, 1.0, 0.5);
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
	this.scene.translate(0.0, 0.0, 1.0);
	this.circle.display();
	this.scene.translate(0.0, 0.0, -1.0);
	this.scene.scale(1.0, -1.0, -1.0);
	this.circle.display();
	this.scene.popMatrix();
 };

 ObjectDisc.prototype.setColor = function(color) {
	
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