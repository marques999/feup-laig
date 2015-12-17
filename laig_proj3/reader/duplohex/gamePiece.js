function GamePiece(scene, position, color) {

	MyPrimitive.call(this, scene);

	this.coords = [0.0, 0.0, 0.0];
	this.position = position;
	this.cellX = null;
	this.cellY = null;
	this.color = color;	

	this.materials = {};

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

GamePiece.prototype = Object.create(MyPrimitive.prototype);
GamePiece.prototype.constructor = GamePiece;

GamePiece.prototype.setCoords = function(coordX, coordY, coordZ) {

	this.coords = [
		coordX, coordY, coordZ
	];

	this.position = [
		coordX * 0.75, coordY * Math.cos(30*Math.PI/180) + 0.5*coordX*Math.cos(30*Math.PI/180), 0.0
	];
};

GamePiece.prototype.setPosition = function(coordX, coordY, coordZ) {

	this.position = [
		coordX, coordY, coordZ
	];
};

GamePiece.prototype.place = function(x, y) {
	this.cellX = x;
	this.cellY = y;
}

GamePiece.prototype.wasPlaced = function() {
	return this.cellX != null && this.cellY != null;
}

GamePiece.prototype.setColor = function(color) {
	this.material = this.materials[color];
};

GamePiece.prototype.getColor = function() {
	return this.material;
};