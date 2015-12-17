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
	this.basePos = [-2.25, 0.0, -4.5*Math.cos(30*Math.PI/180)];
	this.baseSize = [5.0, 5.0];
	this.boxPos = [4, -0.4, 17];
	this.elapsedMillis = 0.0;
	//--------------------------------------------------------	
	this.currentId = 0;
	this.numberRows = 7;
	this.numberColumns = 7;
	this.numberCells = this.numberRows * this.numberColumns;
	//--------------------------------------------------------
	this.player1 = {
		color: 'white',
		discs: 21,
		rings: 18,
		next: true
	}
	//--------------------------------------------------------	
	this.player2 = {
		color: 'black',
		discs: 19,
		rings: 19,
		next: false
	}
	//--------------------------------------------------------
	this.hexagon = new MyCircle(scene, 6);
	this.cylinder = new MyCylinder(scene, 1.0, 1.0, 1.0, 20, 6);
	this.base = new MyRectangle(scene, 0.0, 1.0, 1.0, 0.0);		
	this.box = new ObjectBox(scene);
	this.numberDiscs = 19;
	this.numberRings = 19;
	this.pieces = new PieceController(scene, this, this.player1, this.player2);	
	this.cells = [];
	this.clock = new ObjectClock(scene);
	this.score1 = new ObjectScore(scene);
	this.score2 = new ObjectScore(scene);
	this.animationActive = 0;
	//--------------------------------------------------------
	this.hexTexture = new CGFtexture(this.scene, "scenes/images/hexagon.png");
	this.hoverTexture = new CGFtexture(this.scene, "scenes/images/hexagon_hover.png");
	this.baseTexture = new CGFtexture(this.scene, "scenes/images/hex_board.png");
	//--------------------------------------------------------
	this.gameModes = ['pvp', 'pvb', 'bvb'];
	this.gameBoard = ['default', 'small', 'diagonal'];
	//--------------------------------------------------------
	this.gameSettings = {
		mode: 'pvp',
		board: 'default',
		difficulty: 0,
	};

	this.defaultMaterial = new CGFappearance(scene);
	/*this.HEX_MATERIAL = new CGFappearance(scene);
	this.HEX_MATERIAL.setSpecular(0.2, 0.2, 0.2, 0.6);
	this.HEX_MATERIAL.setDiffuse(0.2, 0.2, 0.2, 0.8);
	this.HEX_MATERIAL.setAmbient(0.1, 0.1, 0.1, 0.2);
	this.HEX_MATERIAL.setTexture(this.hexTexture);*/

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
	this.currentId = 0;
		
	this.scene.pushMatrix();
	this.scene.scale(this.baseSize[0], 1.0, this.baseSize[1]); 
	this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);
	this.scene.translate(this.basePos[0], this.basePos[2], this.basePos[1]);
	this.hexTexture.bind();

	for (var i = 0; i < this.numberCells; i++) {

		var x = ~~(i / this.numberColumns);
		var y = i % this.numberRows;
		var currentPosition = this.cells[i].position;

		this.scene.translate(currentPosition[0], currentPosition[1], currentPosition[2]);
		this.scene.scale(0.5, 0.5, 0.5);
		this.scene.registerPicking(this.cells[i]);

		if (this.cells[i].selected) {
			this.hexTexture.unbind();
			this.hoverTexture.bind();
			this.cells[i].display();
			this.hoverTexture.unbind();
			this.hexTexture.bind();
		}
		else {
			this.cells[i].display();			
		}

		if (y == 0 || x == 0 || y == this.numberRows - 1 || x == this.numberColumns - 1) {	
			this.hexTexture.unbind();
			this.scene.translate(0.0, 0.0, -1.0);					
			this.cylinder.display();
			this.scene.translate(0.0, 0.0, 1.0);
			this.hexTexture.bind();
		}

		this.scene.scale(2.0, 2.0, 2.0);
		this.scene.translate(-currentPosition[0], -currentPosition[1], -currentPosition[2]);
	}
	this.hexTexture.unbind();
	this.scene.popMatrix();
	this.pieces.display();
	this.defaultMaterial.apply();

	this.scene.pushMatrix();						
		this.scene.scale(this.baseSize[0]*8.0, 1.0, this.baseSize[1]*16.0);	
		this.scene.translate(-0.5, -0.5, 0.5);					
		this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);		
		this.scene.registerPicking(this.base);			
		this.base.display();	
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-12.0, 4.0, 0.0);
		this.clock.display();
		this.scene.translate(6.0, 0.0, 0.0);
		this.score1.display();
		this.scene.translate(0.0, 4.0, 0.0);
		this.score2.display();
		this.scene.translate(6.0, -8.0, 0.0);
	this.scene.popMatrix();

	this.scene.pushMatrix();
		//this.box.display();		
	this.scene.popMatrix();
};

GameBoard.prototype.setPosition = function(position) {
	this.basePos = position;
};

GameBoard.prototype.setDimensions = function(newWidth, newHeight) {
	this.baseSize = [newWidth, newHeight];
};

GameBoard.prototype.setPlayer1 = function(playerState) {
	this.player1.discs = playerState.discs;
	this.player1.rings = playerState.rings;
};

GameBoard.prototype.setPlayer2 = function(playerState) {
	this.player2.discs = playerState.discs;
	this.player2.rings = playerState.rings;
};

GameBoard.prototype.update = function(currTime, lastUpdate) {
		
	this.clock.update(currTime, lastUpdate);
	this.score1.update(this.pieces.p1Discs, this.pieces.p1Rings);
	this.score2.update(this.pieces.p2Discs, this.pieces.p2Rings);
	
	var delta = currTime -lastUpdate;
	var animationPlaying = this.pieces.update(delta * 0.001); 

	this.elapsedMillis += delta;

	if (this.animationActive == 1 && !animationPlaying) {
		this.animationActive = 0;
		this.unselectActiveCell();
		this.selectedCellId = null;
		this.selectedPieceId = null;		
	}
	else if (this.animationActive == 0 && animationPlaying) {
		this.animationActive = 1;
	}
};

GameBoard.prototype.isDisc = function(selectedId) {

	return selectedId < this.numberDiscs || (selectedId >= this.numberDiscs + this.numberRings && selectedId < this.numberDiscs*2 + this.numberRings);
}

GameBoard.prototype.updatePlaceHints = function(selectedId) {
	
	for (var i = 0; i < this.numberCells; i++) {
		var currentCell = this.cells[i];
		if (currentCell.isEmpty()) {
			currentCell.select();
		}
	}

}

GameBoard.prototype.updateMoveHints = function(playerState) {
	if (this.selectedCellId == null) {
		return;
	}

	var selectedCell = this.cells[this.selectedCellId];
	var playerColor = playerState.color;
console.log(selectedCell.getDisc());
console.log(selectedCell.getRing());
	if (selectedCell.getDisc() == playerColor) {
		
		console.log("current playeer owns disc");
	}
	else if (selectedCell.getRing() == playerColor) {

		console.log("!current player owns ring")
	}
	else {
		console.log("no moves found!");;
	}
}

GameBoard.prototype.unselectHints = function() {

	for (var i = 0; i < this.numberCells; i++) {
		if (this.cells[i].selected && i != this.selectedCellId) {
			this.cells[i].unselect();
		}
	}
}

GameBoard.prototype.unselectActiveCell = function() {

	if (this.selectedCellId != null && this.selectedCellId != undefined) {
		this.cells[this.selectedCellId].unselect();
		this.selectedPieceId = null;
	}
}

GameBoard.prototype.insertDisc = function(x, y, player) {

	var index = x * this.numberColumns + y;
	if (index > 0 && index < this.numberCells) {
		this.cells[index].setDisc(player.color);
	}
};

GameBoard.prototype.insertRing = function(x, y, player) {

	var index = x * this.numberColumns + y;
	if (index > 0 && index < this.numberCells) {
		this.cells[index].setRing(player.color);
	}
};

GameBoard.prototype.toggleCell = function(selectedId) {

	if (selectedId > this.numberCells) {
		return;
	}

	if (this.selectedCellId == selectedId) {
		this.cells[this.selectedCellId].unselect();
		this.selectedCellId = null;
	}
	else {

		if (this.selectedCellId != undefined && this.selectedCellId != null) {
			this.cells[this.selectedCellId].unselect();
		}
	
		this.selectedCellId = selectedId;
		this.cells[this.selectedCellId].select();	
		this.updateMoveHints(this.player1);
	}
}

GameBoard.prototype.updatePicking = function(selectedId) {
	
	if (this.animationActive) {
		return;
	}

	var id = this.pieces.selectPiece(selectedId);
		
	if (id == null) {
		this.toggleCell(selectedId - 1);
	}
	else {
		this.selectedPieceId = id;
	} 

	// utilizador seleccionou uma célula primeiro
	if (this.selectedPieceId == -1 && this.selectedCellId != null) {
		this.selectedPieceId = null;
		this.pieces.unselectActivePiece();
	}

	// utilizador seleccionou a célula de destino
	if (this.selectedPieceId != null && this.selectedCellId != null) {
		this.pieces.placePiece(this.selectedPieceId, ~~(this.selectedCellId/7), this.selectedCellId % 7);
		this.unselectHints();
	}
};