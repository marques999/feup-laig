function GamePiece(scene, position) {

	MyPrimitive.call(this, scene);

	this.coords = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	};

	this.position = position;
};

GamePiece.prototype = Object.create(MyPrimitive.prototype);
GamePiece.prototype.constructor = GamePiece;

GamePiece.prototype.setCoords = function(coordX, coordY, coordZ) {
    
    this.coords = {
    	x: coordX,
    	y: coordY,
    	z: coordZ 
	};

	this.position = {
		x: coordX * 0.75,
		y: coordY * Math.cos(30*Math.PI/180) + 0.5*coordX*Math.cos(30*Math.PI/180),
		z: 0.0
	};
};

GamePiece.prototype.setPosition = function(coordX, coordY, coordZ) {
	
	this.position = {
		x: coordX,
		y: coordY,
		z: coordZ 
	};
};