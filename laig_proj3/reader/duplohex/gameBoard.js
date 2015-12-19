/**
 * construtor default da classe 'GameBoard'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function GameBoard(scene) {
	//--------------------------------------------------------		
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
	};
	//--------------------------------------------------------	
	this.player2 = {
		color: 'black',
		discs: 19,
		rings: 19,
		next: false
	};
	//--------------------------------------------------------
	this.hexagon = new MyCircle(scene, 6);
	this.cylinder = new MyCylinder(scene, 1.0, 1.0, 1.0, 20, 6);
	this.base = new MyRectangle(scene, 0.0, 1.0, 1.0, 0.0);		
	this.table = new ObjectTable(scene);
	this.box = new ObjectBox(scene);
	this.numberDiscs = 19;
	this.numberRings = 19;
	this.pieces = new PieceController(scene, this, this.player1, this.player2);	
	this.cells = [];
	this.clock1 = new ObjectClock(scene, this.player1);
	this.clock2 = new ObjectClock(scene, this.player2);
	this.guiInterface = null;
	this.animationActive = 0;
	//--------------------------------------------------------
	this.moviePlaying = false;
	this.movieFrame = 0;
	this.moviePaused = false;
	this.movieSpeed = 2;
	this.movieDelay = 200;
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
	this.historyStack = new GameMove(this);

	this.historyStack.push(14, 4, 1);
	this.historyStack.push(10, 0, 2);
	this.historyStack.push(22, 5, 1);
	this.historyStack.push(24, 2, 2);
	/*this.HEX_MATERIAL = new CGFappearance(scene);
	this.HEX_MATERIAL.setSpecular(0.2, 0.2, 0.2, 0.6);
	this.HEX_MATERIAL.setDiffuse(0.2, 0.2, 0.2, 0.8);
	this.HEX_MATERIAL.setAmbient(0.1, 0.1, 0.1, 0.2);
	this.HEX_MATERIAL.setTexture(this.hexTexture);*/

	for (var i = 0; i < this.numberCells; i++) {
		this.cells[i] = new ObjectHexagon(scene);
		this.cells[i].setCoords(~~(i / this.numberColumns), i % this.numberColumns, 0.0);
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
		var y = i % this.numberColumns;
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

		if (y == 0 || x == 0 || x == this.numberRows - 1 || y == this.numberColumns - 1) {	
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
		this.scene.rotate(Math.PI/2, 0.0, 1.0, 0.0);
		this.scene.scale(this.baseSize[0]*3.0, 5.0, this.baseSize[1]*3.0);	
		this.table.display();
	this.scene.popMatrix();

	this.scene.rotate(Math.PI/2, 0.0, 1.0, 0.0);
	this.scene.translate(this.baseSize[0]*5.0, 0.0, this.baseSize[0]);
	this.clock1.display();
	this.scene.translate(-this.baseSize[0]*5.0, 0.0, -this.baseSize[0]);
	this.scene.rotate(-Math.PI, 0.0, 1.0, 0.0);
	this.scene.translate(this.baseSize[0]*5.0, 0.0, this.baseSize[0]);
	this.clock2.display();
	this.scene.translate(-this.baseSize[0]*5.0, 0.0, -this.baseSize[0]);
	this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);

	this.scene.pushMatrix();						
		this.scene.scale(this.baseSize[0]*7.5, 1.0, this.baseSize[1]*9.0);	
		this.scene.translate(-0.5, -0.5, 0.5);					
		this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);		
		this.scene.registerPicking(this.base);			
		this.base.display();	
	this.scene.popMatrix();


	this.scene.pushMatrix();
		//this.box.display();		
	this.scene.popMatrix();
};
//--------------------------------------------------------	
GameBoard.prototype.setPosition = function(position) {
	this.basePos = position;
};
//--------------------------------------------------------	
GameBoard.prototype.startMovie = function() {
	this.moviePlaying = true;
	this.resetMovie();
};
//--------------------------------------------------------	
GameBoard.prototype.pauseMovie = function() {
	this.moviePaused = !this.moviePaused;
};
//--------------------------------------------------------	
GameBoard.prototype.setInterface = function(guiInterface) {
	this.guiInterface = guiInterface;
	this.guiInterface.initGame(this);
}
//--------------------------------------------------------	
GameBoard.prototype.resetMovie = function() {
	this.moviePaused = false;
	this.movieFrame = 0;
	this.movieSpeed = 2;
	this.movieDelay = 200;
};
//--------------------------------------------------------
GameBoard.prototype.skipFrame = function() {
	while (this.pieces.update(this.movieSpeed)) {
		this.elapsedMillis = 5000;
	}
};
//--------------------------------------------------------	
GameBoard.prototype.stopMovie = function() {
	this.moviePlaying = false;
	this.historyStack.reset();
};
//--------------------------------------------------------	
GameBoard.prototype.setDimensions = function(newWidth, newHeight) {
	this.baseSize = [newWidth, newHeight];
};
//--------------------------------------------------------	
GameBoard.prototype.setPlayer1 = function(playerState) {
	this.player1.discs = playerState.discs;
	this.player1.rings = playerState.rings;
};
//--------------------------------------------------------	
GameBoard.prototype.setPlayer2 = function(playerState) {
	this.player2.discs = playerState.discs;
	this.player2.rings = playerState.rings;
};
//--------------------------------------------------------	
GameBoard.prototype.update = function(currTime, lastUpdate) {
		
	this.clock1.update(currTime, lastUpdate);
	this.clock2.update(currTime, lastUpdate);

	if (lastUpdate == 0) {
		lastUpdate = currTime;
	}

	var delta = currTime - lastUpdate;

	if (this.moviePaused) {
		return;
	}

	if (this.moviePlaying) {
		var animationPlaying = this.pieces.update(delta * this.movieSpeed * 0.0008); 
		this.updateMovie(delta);
	}
	else {
		var animationPlaying = this.pieces.update(delta * 0.001); 
	}
	
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
//--------------------------------------------------------	
GameBoard.prototype.isDisc = function(selectedId) {
	return selectedId < this.numberDiscs || (selectedId >= this.numberDiscs + this.numberRings && selectedId < this.numberDiscs*2 + this.numberRings);
};
//--------------------------------------------------------	
GameBoard.prototype.updatePlaceHints = function() {

	if (!this.pieces.pieceAt(this.selectedPieceId).wasPlaced()) {
		for (var i = 0; i < this.numberCells; i++) {
			var currentCell = this.cells[i];
			if (currentCell.isEmpty()) {
				currentCell.select();
			}
		}
	}
	else if (this.updateMoveHints() == 0) {
		this.pieces.pieceAt(this.selectedPieceId).setColor("red");
	}	
};
//--------------------------------------------------------	
GameBoard.prototype.validateMove = function(cellX, cellY) {

	if (cellX < 0 || cellX >= this.numberRows) {
		return false;
	}

	if (cellY < 0 || cellY >= this.numberColumns) {
		return false;
	}
		
	var selectedCell = this.cells[this.cellIndex(cellX, cellY)];

	if (selectedCell.disc != null && selectedCell.ring == null && this.pieces.isRing(this.selectedPieceId)) {		
		return true;
	}
	
	if (selectedCell.ring != null && selectedCell.disc == null && this.pieces.isDisc(this.selectedPieceId)) {		
		return true;
	}

	return false;
};
//--------------------------------------------------------	
GameBoard.prototype.cellIndex = function(x, y) {
	return x * this.numberColumns + y;
};
//--------------------------------------------------------	
GameBoard.prototype.updateMoveHints = function() {

	var selectedPiece = this.pieces.pieceAt(this.selectedPieceId);
	var sourceIndex = this.cellIndex(selectedPiece.cellX, selectedPiece.cellY);
	var i = 0;

	if (this.cells[sourceIndex].isTwopiece()) {
		return 0;
	}

	var neighbourCells = [
		[-1, +1],
		[+1, -1],
		[-1, +0],
		[+1, +0],
		[+0, +1],
		[+0, -1]
	];

	for (var j = 0; j < neighbourCells.length; j++) {

		var destinationX = selectedPiece.cellX + neighbourCells[j][0];
		var destinationY = selectedPiece.cellY + neighbourCells[j][1];
		var destinationIndex = this.cellIndex(destinationX, destinationY);

		if (this.validateMove(destinationX, destinationY)) {
			this.cells[destinationIndex].select();	
			i++;		
		}
	}

	return i;
}

GameBoard.prototype.unselectHints = function() {

	for (var i = 0; i < this.numberCells; i++) {
		if (this.cells[i].selected && i != this.selectedCellId) {
			this.cells[i].unselect();
		}
	}
};

GameBoard.prototype.unselectActiveCell = function() {

	if (this.selectedCellId != null && this.selectedCellId != undefined) {
		this.cells[this.selectedCellId].unselect();
		this.selectedPieceId = null;
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
	}
};

GameBoard.prototype.placePieceHandler = function() {
	
	var selectedPiece = this.pieces.pieceAt(this.selectedPieceId);
	var index = this.cellIndex(selectedPiece.cellX,  selectedPiece.cellY);
	
	if (selectedPiece.wasPlaced()) {
		
		if (this.pieces.isDisc(this.selectedPieceId)) {
			this.cells[index].disc = null;
		}
		else {
			this.cells[index].ring = null;
		}
	}

	this.pieces.placePiece(this.selectedPieceId, ~~(this.selectedCellId/this.numberColumns), this.selectedCellId % this.numberColumns);
	
	if (this.pieces.isDisc(this.selectedPieceId)) {
		this.cells[this.selectedCellId].disc = selectedPiece.color;
	}
	else {
		this.cells[this.selectedCellId].ring = selectedPiece.color;
	}	
};

GameBoard.prototype.updateMovie = function(delta) {

	if (this.animationActive) {
		return;
	}

	this.elapsedMillis += delta;

	if (this.elapsedMillis >= this.movieDelay) {
		
		if (this.historyStack.empty()) {
			this.moviePlaying = false;
			this.resetMovie();
		}
		else {
			this.historyStack.step();
			this.movieFrame++;
		}

		this.elapsedMillis = 0;
	}
};

GameBoard.prototype.processFrame = function(id, x, y) {
	this.updatePicking(this.cellIndex(x, y) + 1);
	this.pieces.placePiece(id, x, y);
};

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

	// mostra as hints disponiveis se houver uma peça selecionada
	if (this.selectedPieceId != null && this.selectedPieceId != -1) {
		this.unselectHints();
		this.updatePlaceHints();		
	}
	else {
		this.unselectHints();
	}

	// utilizador seleccionou uma célula primeiro
	if (this.selectedPieceId == -1 && this.selectedCellId != null) {
		this.selectedPieceId = null;
		this.pieces.unselectActivePiece();		
	}

	// utilizador seleccionou a célula de destino
	if (this.selectedPieceId != null && this.selectedCellId != null) {
		this.placePieceHandler();		
		this.unselectHints();
	}
};