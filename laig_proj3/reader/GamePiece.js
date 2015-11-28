function GamePiece(scene) {
	MyPrimitive.call(this, scene);
};

GamePiece.prototype = Object.create(MyPrimitive.prototype);
GamePiece.prototype.constructor = GamePiece;

GamePiece.prototype.setX = function(xCoord) {
	this.X = xCoord;
};

GamePiece.prototype.setY = function(yCoord) {
	this.Y = yCoord;
};
