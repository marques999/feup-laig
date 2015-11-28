/**
 * construtor default da classe 'MyBoard'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function MyBoard(scene) {

	MyPrimitive.call(this, scene);

	this.hexagon = new MyCircle(scene, 6);
	this.cells = [];
	this.pieces = [];
	this.piecesId = [];
	this.pieces[22] = [new MyRing(scene, 'white', 0.25, 1.0), new MyDisc(scene, 'black', 2.0, 0.75)];
	this.pieces[31] = [new MyRing(scene, 'black', 0.25, 1.0), new MyDisc(scene, 'white', 2.0, 0.75)];
	this.pieces[9] = [new MyDisc(scene, 'black', 2.0, 0.75)];
	this.pieces[14] = [new MyRing(scene, 'white', 0.25, 1.0)];
	this.pieces[17] = [new MyDisc(scene, 'white', 2.0, 0.75)];

	this.numberRows = 7;
	this.numberColumns = 7;
	this.HEX_MATERIAL = new CGFappearance(scene);
	this.HEX_MATERIAL.setSpecular(0.2, 0.2, 0.2, 0.6);
	this.HEX_MATERIAL.setDiffuse(0.2, 0.2, 0.2, 0.8);
	this.HEX_MATERIAL.setAmbient(0.1, 0.1, 0.1, 0.2);
	this.numberCells = this.numberRows * this.numberColumns;

	for (var i = 0; i < this.numberCells; i++) {
		var x = i % this.numberColumns;
		var y = i / this.numberRows;
		this.cells[i] = new MyHexagon(scene, 6);
		this.cells[i].setX(x * Math.cos(30*Math.PI/180));
		this.cells[i].setY(y + 0.5*x*Math.cos(30*Math.PI/180));
	}
};

MyBoard.prototype = Object.create(MyPrimitive.prototype);
MyBoard.prototype.constructor = MyBoard;

/**
 * desenha a primitva 'MyBoard' na XMLScene correspondente
 * @return {null}
 */
MyBoard.prototype.display = function() {

	this.scene.pushMatrix();
	
	this.scene.translate(0.0, 0.0,20.0);
	this.scene.rotate(3 * Math.PI/2, 1, 0, 0);
	this.scene.scale(5.0, 5.0, 1.0);

	for(var i= 0; i < this.numberCells; i++) {
		
		var x = i % this.numberColumns;
		var y = i / this.numberRows;
		var currentCell = this.cells[i];
		var currentPieces = this.pieces[i];

		this.scene.pushMatrix();
		this.scene.translate(currentCell.X, currentCell.Y, 0.0);
		this.scene.scale(0.5, 0.5, 0.5);
		this.HEX_MATERIAL.apply();
		
		currentCell.display();
		
		if (currentPieces != null && currentPieces != undefined) {
			this.scene.scale(0.7, 0.7, 0.7);

			if (currentPieces[0] != undefined) {
					currentPieces[0].display();
			}
			
			if (currentPieces[1] != undefined) {
				currentPieces[1].display();
			}		
		}
	
		this.scene.popMatrix();
	}
	
	this.scene.popMatrix();
 };