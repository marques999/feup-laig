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
	this.numberRows = 7;
	this.numberColumns = 7;
	this.numberCells = this.numberRows * this.numberColumns;
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
		this.scene.pushMatrix();
		this.scene.translate(x * Math.cos(30*Math.PI/180), y + 0.5*x*Math.cos(30*Math.PI/180), 0.0);
		this.scene.scale(0.5, 0.5, 0.5);
		this.hexagon.display();
		this.scene.popMatrix();
	}

	this.scene.popMatrix();
 };