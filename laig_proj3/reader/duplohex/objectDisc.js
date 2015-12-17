/**
 * construtor default da classe 'ObjectDisc'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco, Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} radius - raio da esfera
 * @param {Number} stacks - número de secções da esfera em altura
 * @param {Number} slices - número de secçoes da esfera em torno do raio
 * @return {null}
 */
function ObjectDisc(scene, color, position) {

	GamePiece.call(this, scene, position);
	//--------------------------------------------------------
	this.cylinder = new MyCylinder(scene, 1.0, 0.65, 0.65, 16, 32);
	this.circle = new MyCircle(scene, 32, 0.65);
	this.materials = {};
	//--------------------------------------------------------
	if (color == 'black') {
		this.materials["default"] = new CGFappearance(scene);
		this.materials["default"].setDiffuse(0.05, 0.05, 0.05, 0.6);
		this.materials["default"].setAmbient(0.05, 0.05, 0.05, 0.2);
		this.materials["default"].setSpecular(1.0, 1.0, 1.0, 0.5);
		this.materials["default"].setShininess(30);
	}
	else if (color == 'white') {
		this.materials["default"] = new CGFappearance(scene);
		this.materials["default"].setDiffuse(0.95, 0.95, 0.95, 0.6);
		this.materials["default"].setAmbient(0.95, 0.95, 0.95, 0.2);
		this.materials["default"].setSpecular(1.0, 1.0, 1.0, 0.5);
		this.materials["default"].setShininess(30);
	}
	//--------------------------------------------------------
	this.materials["yellow"] = new CGFappearance(scene);
	this.materials["yellow"].setDiffuse(0.9, 0.9, 0.05, 0.6);
	this.materials["yellow"].setAmbient(0.1, 0.9, 0.1, 0.2);
	this.materials["yellow"].setSpecular(1.0, 1.0, 1.0, 0.5);
	this.materials["yellow"].setShininess(30);
	//--------------------------------------------------------
	this.materials["red"] = new CGFappearance(scene);
	this.materials["red"].setDiffuse(0.9, 0.05, 0.05, 0.6);
	this.materials["red"].setAmbient(0.9, 0.05, 0.05, 0.2);
	this.materials["red"].setSpecular(1.0, 1.0, 1.0, 0.5);
	this.materials["red"].setShininess(30);
	//--------------------------------------------------------
	this.material = this.materials["default"];
};

ObjectDisc.prototype = Object.create(GamePiece.prototype);
ObjectDisc.prototype.constructor = ObjectDisc;

ObjectDisc.prototype.display = function() {
	this.material.apply();
	this.cylinder.display();
	this.scene.translate(0.0, 0.0, 1.0);
	this.circle.display();
	this.scene.translate(0.0, 0.0, -1.0);
	this.scene.scale(1.0, -1.0, -1.0);
	this.circle.display();
	this.scene.scale(1.0, -1.0, -1.0);
 };

ObjectDisc.prototype.setColor = function(color) {
	this.material = this.materials[color];
};