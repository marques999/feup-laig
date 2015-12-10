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
	this.elapsedMillis = 0.0;
	this.baseXpos = -2.25;
	this.baseYpos = 0.0;
	this.baseZpos = -4.5*Math.cos(30*Math.PI/180);
	this.currentId = 0;
	this.numberRows = 7;
	this.numberColumns = 7;
	this.numberCells = this.numberRows * this.numberColumns;
	//--------------------------------------------------------

	this.player1 = {
		color: 'white',
		discs: 24,
		rings: 24,
		next: true
	}

	this.player2 = {
		color: 'black',
		discs: 24,
		rings: 24,
		next: false
	}
	//--------------------------------------------------------

	this.hexagon = new MyCircle(scene, 6);
	this.cylinder = new MyCylinder(scene, 1.0, 1.0, 1.0, 20, 6);
	this.base = new MyRectangle(scene, 0.0, 1.0, 1.0, 0.0);		
	this.p1Holder = new ObjectBox(scene, [0.0, 0.0, 0.0], 'black', 12, 6);
	this.p2Holder = new ObjectBox(scene, [-17.5, -0.25, -29.0], 'white', 1, 1);
	this.cells = [];
	this.clock = new ObjectClock(scene);
	this.score1 = new ObjectScore(scene);
	this.score2 = new ObjectScore(scene);
	this.pieces = [];
	this.piecesId = [];
	//--------------------------------------------------------

	this.hexTexture = new CGFtexture(this.scene, "scenes/images/hexagon.png");
	this.hoverTexture = new CGFtexture(this.scene, "scenes/images/hexagon_hover.png");
	this.baseTexture = new CGFtexture(this.scene, "scenes/images/hex_board.png");
	//--------------------------------------------------------

	this.gameModes = ['pvp', 'pvb', 'bvb'];
	this.gameBoard = ['default', 'small', 'diagonal'];

	this.gameSettings = {
		mode: 'pvp',
		board: 'default',
		difficulty: 0,
	};


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

	this.scene.resetPicking();
	this.scene.pushMatrix();
	this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
	this.scene.translate(0.0, 0.0, 0.0);
	this.currentId = 0;
	this.scene.pushMatrix();
	this.scene.scale(this.baseXsize, 1.0, this.baseYsize); 
	this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);
	this.scene.translate(this.baseXpos, this.baseZpos, this.baseYpos);
	this.HEX_MATERIAL.apply();

	for(var i = 0; i < this.numberCells; i++) {

		var x = ~~(i / this.numberColumns);
		var y = i % this.numberRows;
		var currentPosition = this.cells[i].position;

		this.scene.pushMatrix();
		this.scene.translate(currentPosition.x, currentPosition.y, currentPosition.z);
		this.scene.scale(0.5, 0.5, 0.5);
		this.scene.registerPicking(this.cells[i]);
		
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
	this.scene.popMatrix();
	this.scene.pushMatrix();						
	this.scene.scale(this.baseXsize*7.0, 1.0, this.baseYsize*12.0);	
	this.scene.translate(-0.5, -0.5, 0.5);					
	this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);		
	this.scene.registerPicking(this.base);			
	this.base.display();
	this.scene.popMatrix();
	this.scene.popMatrix();
	
	this.scene.translate(-12.0, 4.0, 0.0);
	this.clock.display();
	this.scene.translate(6.0, 0.0, 0.0);
	this.score1.display();
	this.scene.translate(0.0, 4.0, 0.0);
	this.score2.display();
	this.scene.translate(6.0, -8.0, 0.0);
	this.scene.pushMatrix();

	this.scene.scale(this.baseXsize*1.5/5.0, this.baseYsize*1.5/5.0, this.baseXsize*1.5/5.0);	
	this.p1Holder.display();
	//this.p2Holder.updatePicking();
	this.p2Holder.display();		
	this.scene.popMatrix();

	/*for(var i = 0; i < this.pieces.length; i++) {
		
		var currentPosition = this.pieces[i].position;
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
 };


GameBoard.prototype.setPlayer1 = function(playerState) {
	this.player1.discs = playerState.discs;
	this.player1.rings = playerState.rings;
	console.log(this.player1.discs);
	console.log(this.player1.rings);
};


GameBoard.prototype.registerCellPicking = function(cellId) {
	this.scene.registerForPick(++this.currentId, this.cells[cellId]);
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

GameBoard.prototype.update = function(currTime, lastUpdate) {
/*	if(this.animationId != null) {		
		this.animation.step(delta);
		if (!this.animation.active) {			
			this.animationId = null;			
		}
	}		
	if(this.animationId == null){
		this.seqR++;
		if(this.seqR < this.seq.length)
			this.placePiece(this.seq[this.seqR][0], this.seq[this.seqR][1], this.seq[this.seqR][2]);
	}*/

	this.clock.update(currTime, lastUpdate);
	this.elapsedMillis += currTime - lastUpdate;

	this.player1.discs = this.p1Holder.getDiscs();
	this.player1.rings = this.p1Holder.getRings();
	this.player2.discs = this.p2Holder.getDiscs();
	this.player2.rings = this.p2Holder.getRings();
	this.score1.update(this.player1.discs, this.player1.rings);
	this.score2.update(this.player2.discs, this.player2.rings);
}

GameBoard.prototype.updatePicking = function(selectedId) {
	this.selectedId = selectedId;
	this.p1Holder.removePiece(selectedId);
}