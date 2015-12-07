/**
 * construtor default da classe 'GameBoard'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function GameBoard(scene) {

	MyPrimitive.call(this, scene);

	//--------------------------------------------------------	
	this.baseXsize = 5.0;
	this.baseYsize = 5.0;

	this.baseXpos = -2.25;
	this.baseYpos = 0.0;
	this.baseZpos = -4.5*Math.cos(30*Math.PI/180);

	this.numberRows = 7;
	this.numberColumns = 7;
	this.numberCells = this.numberRows * this.numberColumns;
	//--------------------------------------------------------

	//--------------------------------------------------------

	this.hexagon = new MyCircle(scene, 6);
	this.cylinder = new MyCylinder(scene, 1.0, 1.0, 1.0, 20, 6);
	this.base = new MyRectangle(scene, 0.0, 1.0, 1.0, 0.0);		
	this.pieceHolder = new ObjectBox(scene, this.baseXsize, this.baseYsize);
	this.cells = [];
	this.pieces = [];
	this.piecesId = [];
	//--------------------------------------------------------

	this.hexTexture = new CGFtexture(this.scene, "scenes/images/hexagon.png");
	this.hoverTexture = new CGFtexture(this.scene, "scenes/images/hexagon_hover.png");
	this.baseTexture = new CGFtexture(this.scene, "scenes/images/hex_board.png");
	//--------------------------------------------------------

	this.pieces[0] = new ObjectDisc(scene, 'black');
	this.pieces[1] = new ObjectDisc(scene, 'white');
	this.pieces[2] = new ObjectRing(scene, 'white');
	this.pieces[3] = new ObjectRing(scene, 'black');
	this.pieces[4] = new ObjectRing(scene, 'white');
	this.pieces[0].setPosition(3, 0, 15);
	this.pieces[1].setPosition(4, 0, 17);	
	this.pieces[2].setPosition(8, 0, 15);	
	this.pieces[3].setPosition(8.5, 1.0, 15);	
	this.pieces[4].setPosition(10.0, 0.0, 17);
	//---------------------------------------------------------

	this.seq = [];
	this.seqR = -1;
	this.selectedId=0;
	this.seq[0] = [0,1,2];
	this.seq[1] = [3,3,4];
	this.seq[2] = [0,2,2];
	this.seq[3] = [2,5,4];
	this.seq[4] = [1,4,0];
	this.seq[5] = [3,3,3];
	this.seq[6] = [0,3,2];
	this.seq[7] = [3,3,2];
	this.seq[8] = [4,1,2];
	//---------------------------------------------------------

	this.defaultMaterial = new CGFappearance(scene);
	this.HEX_MATERIAL = new CGFappearance(scene);
	this.HEX_MATERIAL.setSpecular(0.2, 0.2, 0.2, 0.6);
	this.HEX_MATERIAL.setDiffuse(0.2, 0.2, 0.2, 0.8);
	this.HEX_MATERIAL.setAmbient(0.1, 0.1, 0.1, 0.2);
	this.HEX_MATERIAL.setTexture(this.hexTexture);

	for (var i = 0; i < this.numberCells; i++) {
		this.cells[i] = new ObjectHexagon(scene);
		this.registerPicking(i);
		this.cells[i].setCoords(~~(i / this.numberColumns), i % this.numberRows, 0.0);
	}
};

GameBoard.prototype = Object.create(MyPrimitive.prototype);
GameBoard.prototype.constructor = GameBoard;

/**
 * desenha a primitva 'gameBoard' na XMLScene correspondente
 * @return {null}
 */
GameBoard.prototype.display = function() {

	this.scene.pushMatrix();
	this.scene.scale(1.0, 1.0, 1.0);
		this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
	this.scene.translate(0.0, 0.0, 0.0);
	this.scene.pushMatrix();
	this.scene.scale(this.baseXsize, 1.0, this.baseYsize); 
	this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);
	this.scene.translate(this.baseXpos, this.baseZpos, this.baseYpos);
	this.HEX_MATERIAL.apply();

	for(var i= 0; i < this.numberCells; i++) {


		var x = ~~(i / this.numberColumns);
		var y = i % this.numberRows;
		var currentPosition = this.cells[i].position;

		this.scene.pushMatrix();
		this.scene.translate(currentPosition.x, currentPosition.y, currentPosition.z);
		this.scene.scale(0.5, 0.5, 0.5);
		this.scene.registerForPick(i+1, this.cells[i]);
		
		if (this.selectedId == i + 1) {
			this.hoverTexture.bind();
			this.cells[i].display();
			this.hoverTexture.unbind();
			this.hexTexture.bind();
		}
		else {
			this.cells[i].display();
		}
		
		
		if(y == 0 || x == 0 || y == 6 || x == 6) {	
			this.scene.translate(0.0, 0.0, -1.0);
			this.defaultMaterial.apply();
			this.cylinder.display();
			this.HEX_MATERIAL.apply();
		}

		this.scene.popMatrix();
	}
	
	this.defaultMaterial.apply();
	this.scene.registerForPick(this.numberCells+1, this.base);
	this.scene.popMatrix();
	this.scene.pushMatrix();						
	this.scene.scale(this.baseXsize*7.0, 1.0, this.baseYsize*12.0);	
	this.scene.translate(-0.5, -0.5, 0.5);					
	this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);					
	this.base.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(-0.5, -0.25, 17.0);
	this.pieceHolder.display();
	this.scene.popMatrix();	

	this.scene.pushMatrix();
	this.scene.translate(-17.5, -0.25, -29.0);		
	this.pieceHolder.display();
	this.scene.popMatrix();	

	this.scene.pushMatrix();
	this.scene.scale(this.baseXsize*1.5/5.0, this.baseYsize*1.3/5.0, this.baseXsize*1.5/5.0);			
 
	/*for(var i = 0; i < this.pieces.length; i++) {
		
		var currentPosition = this.pieces[i].coords;
		this.scene.pushMatrix();
			
		if(this.animation != null && this.animationId == i) {
			this.scene.multMatrix(this.animation.update());
		}
		else {
			this.scene.translate(currentPosition.x, currentPosition.y, currentPosition.z);
		}
		
		this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);		
		this.pieces[i].display();
		this.scene.popMatrix();
	}
*/
	this.scene.popMatrix();
	this.scene.popMatrix();
 };

GameBoard.prototype.registerPicking = function(cellId) {
	this.piecesId[cellId+1] = this.cells[cellId];
	
}

 GameBoard.prototype.placePiece = function(pieceId, dstX, dstY)  {

	var piece = this.pieces[pieceId];	
	var x2 = (this.baseXsize/2 + this.baseXsize/4)*2/3*x +  this.baseXsize*(this.baseXpos/1.5);
	var y2 = this.baseYpos;
	var z2 = -(this.baseYsize/2) * 2 / 3 * dstX*Math.cos(30*Math.PI/180) - this.baseYsize*dstY*2/3*Math.cos(30*Math.PI/180) - this.baseYsize*(this.baseZpos/1.5);
	var dist = vec3.dist([x2, y2 + 6, z2], piece.coords);
					
	this.animation = new LinearAnimation(dist*0.20, [[piece.coords[0], piece.coords[1], piece.coords[2]],[piece.coords[0], 3.0, piece.coords[2]], [x2, y2 + 3, z2], [x2, y2, z2]])
	this.animationId = pieceId;
	this.animation.start();	
	this.pieces[pieceId].setCoords(x2, y2, z2);
};

GameBoard.prototype.update = function(delta) {
	if(this.animationId != null) {		
		this.animation.step(delta);
		if (!this.animation.active) {			
			this.animationId = null;			
		}
	}		
	if(this.animationId == null){
		this.seqR++;
		if(this.seqR < this.seq.length)
			this.placePiece(this.seq[this.seqR][0], this.seq[this.seqR][1], this.seq[this.seqR][2]);
	}
}

GameBoard.prototype.updatePicking = function(selectedId) {
	this.selectedId = selectedId;
}