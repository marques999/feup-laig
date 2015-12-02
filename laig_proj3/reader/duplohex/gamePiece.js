function GamePiece(scene, xCoord, yCoord) {

	MyPrimitive.call(this, scene);

	this.X = xCoord || 0.0;
	this.Y = yCoord || 0.0;
};

GamePiece.prototype = Object.create(MyPrimitive.prototype);
GamePiece.prototype.constructor = GamePiece;

GamePiece.prototype.setX = function(xCoord) {
	this.X = xCoord;
};

GamePiece.prototype.setY = function(yCoord) {
	this.Y = yCoord;
};