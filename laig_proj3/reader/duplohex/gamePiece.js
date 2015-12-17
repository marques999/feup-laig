function GamePiece(scene, position) {

	MyPrimitive.call(this, scene);

	this.coords = [0.0, 0.0, 0.0];
	this.position = position;
	this.placed = false;
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

GamePiece.prototype.place = function() {
	this.placed = true;
}