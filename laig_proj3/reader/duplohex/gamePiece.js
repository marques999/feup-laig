/**
 * construtor default da classe 'GamePiece'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @param {Number} id - número identificador de picking da peça
 * @param {String} color - cor da peça para inicialização dos materiais
 * @param {Array} position - posição absoluta da peça
 * @return {null}
 */
function GamePiece(scene, id, position, color) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.id = id;
	this.position = position;
	this.cellX = null;
	this.cellY = null;
	this.color = color;
	this.placed = false;
	this.materials = [];
	//--------------------------------------------------------
	if (color == 'black') {
		this.materials["default"] = new CGFappearance(scene);
		this.materials["default"].setDiffuse(0.05, 0.05, 0.05, 0.6);
		this.materials["default"].setAmbient(0.08, 0.08, 0.08, 0.2);
		this.materials["default"].setSpecular(1.0, 1.0, 1.0, 0.5);
		this.materials["default"].setShininess(30);
	}
	else if (color == 'white') {
		this.materials["default"] = new CGFappearance(scene);
		this.materials["default"].setDiffuse(0.7, 0.7, 0.7, 0.6);
		this.materials["default"].setAmbient(0.50, 0.50, 0.50, 0.2);
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
//--------------------------------------------------------
GamePiece.prototype = Object.create(MyPrimitive.prototype);
GamePiece.prototype.constructor = GamePiece;
//--------------------------------------------------------
GamePiece.prototype.isDisc = function() {
	return false;
};
//--------------------------------------------------------
GamePiece.prototype.isRing = function() {
	return false;
};
//--------------------------------------------------------
GamePiece.prototype.place = function(x, y) {
	this.cellX = x;
	this.cellY = y;
	this.placed = true;
};
//--------------------------------------------------------
GamePiece.prototype.wasPlaced = function() {
	return this.placed;
};
//--------------------------------------------------------
GamePiece.prototype.getColor = function() {
	return this.color;
};
//--------------------------------------------------------
GamePiece.prototype.getId = function() {
	return this.id;
};
//--------------------------------------------------------
GamePiece.prototype.getX = function() {
	return this.cellX;
};
//--------------------------------------------------------
GamePiece.prototype.getY = function() {
	return this.cellY;
};
//--------------------------------------------------------
GamePiece.prototype.setColor = function(color) {
	this.material = this.materials[color];
};
//--------------------------------------------------------
GamePiece.prototype.setPosition = function(coordX, coordY, coordZ) {
	this.position[0] = coordX;
	this.position[1] = coordY;
	this.position[2] = coordZ;
};
//--------------------------------------------------------
GamePiece.prototype.reset = function() {
	this.placed = false;
};