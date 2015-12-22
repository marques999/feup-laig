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
	this.basePos = [0.0, 0.0, 0.0];
	this.baseSize = [5.0, 5.0];
	this.boxPos = [3, 0.0, 17];
	this.borderAngle = Math.sin(Math.PI/3);
	this.doubleAngle = 2.0 * this.borderAngle;
	this.elapsedMillis = 0.0;
	//--------------------------------------------------------
	this.cells = [];
	this.currentId = 0;
	this.numberRows = 7;
	this.numberColumns = 7;
	this.numberCells = this.numberRows * this.numberColumns;
	//--------------------------------------------------------
	this.basePos[0] = this.basePos[0] - (this.baseSize[0] / 5.0) * 1.875*(this.numberColumns - 1);
	this.basePos[1] = this.basePos[1];
	this.basePos[2] = this.basePos[2] + (this.baseSize[1] / 5.0) * 3.75 * this.borderAngle * (this.numberRows - 1);
	//--------------------------------------------------------
	this.player1 = {
		color: 'white',
		discs: 24,
		rings: 24,
		stuck: false
	};
	//--------------------------------------------------------
	this.player2 = {
		color: 'black',
		discs: 24,
		rings: 24,
		stuck: false
	};
	//--------------------------------------------------------
	this.cylinder = new MyCylinder(scene, 1.0, 1.0, 1.0, 20, 6);
	this.base = new MyRectangle(scene, 0.0, 1.0, 1.0, 0.0);
	this.chair = new ObjectChair(scene);
	this.table = new ObjectTable(scene);
	this.whiteBorder = new ObjectBorder(scene, this.numberRows, 'white');
	this.blackBorder = new ObjectBorder(scene, this.numberColumns, 'black');
	this.pieces = new PieceController(scene, this, this.player1, this.player2);
	this.clock1 = new ObjectClock(scene, this.player1);
	this.clock2 = new ObjectClock(scene, this.player2);
	//--------------------------------------------------------
	this.gameRunning = false;
	this.animationActive = 0;
	this.moviePlaying = false;
	this.movieFrame = 0;
	this.moviePaused = false;
	this.movieSpeed = 2;
	this.movieDelay = 200;
	//--------------------------------------------------------
	this.hexTexture = new CGFtexture(this.scene, "resources/hexagon.png");
	this.hoverTexture = new CGFtexture(this.scene, "resources/hexagon_hover.png");
	this.baseTexture = new CGFtexture(this.scene, "resources/duplohex_base.png");
	//--------------------------------------------------------
	this.currentPlayer = null;
	this.guiInterface = null;
	this.piecePlayed = null;
	this.testMode = true;
	//--------------------------------------------------------
	this.historyStack = new GameMove(this);
	this.historyStack.push(14, 4, 1);
	this.historyStack.push(10, 0, 2);
	this.historyStack.push(22, 5, 1);
	this.historyStack.push(24, 2, 2);
	//--------------------------------------------------------
	this.smallMatrix = [
		// BLACK DISCS
		[1, 0, 0],
		[1, 0, 2],
		[1, 0, 4],
		[1, 0, 6],
		[1, 6, 1],
		[1, 6, 3],
		[1, 6, 5],
		// BLACK RINGS
		[4, 0, 1],
		[4, 0, 3],
		[4, 0, 5],
		[4, 6, 2],
		[4, 6, 4],
		// WHITE DISCS
		[2, 2, 0],
		[2, 4, 0],
		[2, 6, 0],
		[2, 1, 6],
		[2, 3, 6],
		[2, 5, 6],
		// WHITE RINGS
		[8, 1, 0],
		[8, 3, 0],
		[8, 5, 0],
		[8, 2, 6],
		[8, 4, 6],
		[8, 6, 6],
	];
	//--------------------------------------------------------
	this.diagonalMatrix = [
		// BLACK DISCS
		[1, 0, 0],
		[1, 2, 2],
		[1, 4, 4],
		// BLACK RINGS
		[4, 5, 1],
		[4, 3, 3],
		[4, 1, 5],
		[4, 6, 6],
		// WHITE DISCS
		[2, 0, 6],
		[2, 2, 4],
		[2, 4, 2],
		// WHITE RINGS
		[8, 1, 1],
		[8, 6, 0],
		[8, 5, 5],
	]
	//--------------------------------------------------------
	this.currentMatrix = 'small';
	this.defaultMaterial = new CGFappearance(scene);
	this.HEX_MATERIAL = new CGFappearance(scene);
	this.HEX_MATERIAL.setSpecular(0.2, 0.2, 0.2, 0.6);
	this.HEX_MATERIAL.setDiffuse(0.2, 0.2, 0.2, 0.8);
	this.HEX_MATERIAL.setAmbient(0.1, 0.1, 0.1, 0.2);
	this.HEX_MATERIAL.setTexture(this.hexTexture);
	//--------------------------------------------------------
	for (var i = 0; i < this.numberCells; i++) {
		this.cells[i] = new ObjectHexagon(scene);
		this.cells[i].setCoords(~~(i / this.numberColumns), i % this.numberColumns, 0.0);
	}
};
//--------------------------------------------------------
GameBoard.prototype = Object.create(MyPrimitive.prototype);
GameBoard.prototype.constructor = GameBoard;
//--------------------------------------------------------
GameBoard.prototype.updateMatrix = function(currentMatrix) {

	this.currentMatrix = currentMatrix;
	this.initialMove = true;
	this.nextTurn = 0;
	this.resetController();

	if (currentMatrix == 'diagonal') {
		this.applyMatrix(this.diagonalMatrix);
	}
	else if (currentMatrix == 'small') {
		this.applyMatrix(this.smallMatrix);
	}
};
//--------------------------------------------------------
GameBoard.prototype.applyMatrix = function(currentMatrix) {

	for (var i = 0; i < currentMatrix.length; i++) {
		var currentPiece = currentMatrix[i];
		var cellIndex =  this.cellIndex(currentPiece[1], currentPiece[2]);
		var pieceName = this.pieces.placeRandom.apply(this.pieces, currentPiece);
	}
}
//--------------------------------------------------------
GameBoard.prototype.getPlayer = function() {
	return this.currentPlayer;
};
//--------------------------------------------------------
GameBoard.prototype.resetController = function() {
	this.player1.discs = 24;
	this.player1.rings = 24;
	this.player2.discs = 24;
	this.player2.rings = 24;
	this.pieces = new PieceController(this.scene, this, this.player1, this.player2);
};
//--------------------------------------------------------
GameBoard.prototype.updatePlayer = function(playerColor) {

	if (playerColor == 'whitePlayer') {
		this.player1.color = 'white';
		this.player2.color = 'black';
		this.currentPlayer = this.player1;
	}
	else {
		this.player1.color = 'black';
		this.player2.color = 'white';
		this.currentPlayer = this.player2;
	}

	this.updateMatrix(this.currentMatrix);
};
//--------------------------------------------------------
GameBoard.prototype.changeTurn = function() {

	if (this.currentPlayer.color == this.player1.color) {
		this.currentPlayer = this.player2;
	}
	else {
		this.currentPlayer = this.player1;
	}
};
//--------------------------------------------------------
GameBoard.prototype.registerTurn = function(currentPiece) {

	if (this.initialMove) {
		this.changeTurn();
		this.initialMove = false;
	}
	else if (this.nextTurn++ == 1) {
		this.nextTurn = 0;
		this.piecePlayed = null;
		this.changeTurn();
	}
	else {
		this.piecePlayed = currentPiece;
	}
};
//--------------------------------------------------------
GameBoard.prototype.setServer = function(server) {
	this.server = server;
};
//--------------------------------------------------------
GameBoard.prototype.startGame = function(server) {
	this.gameRunning = true;
};
//--------------------------------------------------------
GameBoard.prototype.display = function() {

	this.scene.resetPicking();
	this.currentId = 0;
	this.displayBoard();
	this.displayPieces();
	this.displayBase();
	this.scene.pushMatrix();
		this.scene.translate(0.0, -(this.baseSize[0] + this.baseSize[1]) / 20.0, 0.0);
		this.displayBorder();
		this.scene.rotate(Math.PI / 2, 0.0, 1.0, 0.0);
		this.displayClock();
	this.scene.popMatrix();
};
//--------------------------------------------------------
GameBoard.prototype.displayBase = function() {
	this.scene.pushMatrix();
	this.baseTexture.bind()
	this.scene.scale(this.baseSize[0] * 8.0, 1.0, this.baseSize[1] * 15.0);
	this.scene.translate(-0.5, -(this.baseSize[0] + this.baseSize[1]) / 10.0, 0.5);
	this.scene.rotate(Math.PI / 2, -1.0, 0.0, 0.0);
	this.scene.registerPicking(this.base);
	this.base.display();
	this.baseTexture.unbind();
	this.scene.popMatrix();
};
//--------------------------------------------------------
GameBoard.prototype.displayBoard = function() {
	//--------------------------------------------------------
	this.scene.pushMatrix();
	this.scene.translate(this.basePos[0], this.basePos[1], this.basePos[2]);
	this.scene.scale(this.baseSize[0], (this.baseSize[0] + this.baseSize[1]) / 10.0, this.baseSize[1]);
	this.scene.rotate(Math.PI/2, -1.0, 0.0, 0.0);
	this.hexTexture.bind();
	//--------------------------------------------------------
	for (var i = 0; i < this.numberCells; i++) {
		//--------------------------------------------------------
		var x = ~~(i / this.numberColumns);
		var y = i % this.numberColumns;
		var currentPosition = this.cells[i].position;
		//--------------------------------------------------------
		this.scene.translate(currentPosition[0], currentPosition[1], currentPosition[2]);
		this.scene.scale(0.5, 0.5, 0.5);
		this.scene.registerPicking(this.cells[i]);
		//--------------------------------------------------------
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
		//--------------------------------------------------------
		if (y == 0 || x == 0 || x == this.numberRows - 1 || y == this.numberColumns - 1) {
			this.hexTexture.unbind();
			this.scene.translate(0.0, 0.0, -1.0);
			this.cylinder.display();
			this.scene.translate(0.0, 0.0, 1.0);
			this.hexTexture.bind();
		}
		//--------------------------------------------------------
		this.scene.scale(2.0, 2.0, 2.0);
		this.scene.translate(-currentPosition[0], -currentPosition[1], -currentPosition[2]);
	}
	//--------------------------------------------------------
	this.hexTexture.unbind();
	this.scene.popMatrix();
};
//--------------------------------------------------------
GameBoard.prototype.displayBorder = function() {

	this.scene.pushMatrix();
	this.scene.translate(this.basePos[0], this.basePos[1], this.basePos[2]);
	this.scene.scale(this.baseSize[0] * 0.5, (this.baseSize[0] + this.baseSize[1]) * 0.1, this.baseSize[1] * 0.5);
	this.scene.pushMatrix();
		this.scene.translate(-this.doubleAngle * this.borderAngle + 0.5, 0.0, this.doubleAngle);
		this.scene.rotate(Math.PI / 6, 0.0, 1.0, 0.0);
		this.scene.rotate(Math.PI / 2, -1.0, 0.0, 0.0);
		this.whiteBorder.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(this.numberRows * this.doubleAngle * this.borderAngle - 0.5, 0.0, -this.numberRows * this.borderAngle - this.numberColumns * this.doubleAngle + this.borderAngle);
		this.scene.rotate(7 * Math.PI / 6, 0.0, 1.0, 0.0);
		this.scene.rotate(Math.PI / 2, -1.0, 0.0, 0.0);
		this.whiteBorder.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(Math.ceil(this.numberRows / 2) + ~~(this.numberRows / 2) * 2.0 - !(this.numberRows & 1)*0.5, 0.0, 0.5 / this.borderAngle - (-!(this.numberRows & 1)*0.5 + ~~(this.numberRows/2)) * this.doubleAngle);
		this.scene.rotate(Math.PI / 2, 0.0, 1.0, 0.0);
		this.scene.rotate(Math.PI / 2, -1.0, 0.0, 0.0);
		this.blackBorder.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(-1.0, 0.0, -(this.numberColumns - 1) * this.doubleAngle - 0.5 / this.borderAngle);
		this.scene.rotate(-Math.PI / 2, 0.0, 1.0, 0.0);
		this.scene.rotate(-Math.PI / 2, 1.0, 0.0, 0.0);
		this.blackBorder.display();
	this.scene.popMatrix();
	this.scene.popMatrix();
};
//--------------------------------------------------------
GameBoard.prototype.displayClock = function() {
	this.scene.pushMatrix();
		this.scene.translate(this.baseSize[0] * this.numberRows * 0.725, 0.0, this.baseSize[0] * this.numberColumns / 6.0);
		this.scene.scale(this.baseSize[0] / 5.0, (this.baseSize[0] + this.baseSize[1]) / 10.0, this.baseSize[1] / 5.0);
		this.clock1.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
		this.scene.translate(-this.baseSize[0] * this.numberRows * 0.725, 0.0, -this.baseSize[0] * this.numberColumns / 6.0);
		this.scene.scale(this.baseSize[0] / 5.0, (this.baseSize[0] + this.baseSize[1]) / 10.0, this.baseSize[1] / 5.0);
		this.scene.rotate(Math.PI, 0.0, 1.0, 0.0);
		this.clock2.display();
	this.scene.popMatrix();
};
//--------------------------------------------------------
GameBoard.prototype.displayPieces = function() {
	this.pieces.display();
	this.defaultMaterial.apply();
};
//--------------------------------------------------------
GameBoard.prototype.displayChair = function() {
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI / 2, 0.0, 1.0, 0.0);
	this.scene.scale(this.baseSize[0] * 2.25, 7.5, this.baseSize[1]);
	this.scene.translate(0.0, 0.0, -this.baseSize[0]);
	this.chair.display();
	this.scene.translate(0.0, 0.0, this.baseSize[0]);
	this.scene.rotate(Math.PI, 0.0, 1.0, 0.0);
	this.scene.translate(0.0, 0.0, -this.baseSize[0]);
	this.chair.display();
	this.scene.popMatrix();
};
//--------------------------------------------------------
GameBoard.prototype.displayTable = function() {
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI / 2, 0.0, 1.0, 0.0);
	this.scene.scale(this.baseSize[0] * 3.0, 5.0, this.baseSize[1] * 3.0);
	this.table.display();
	this.scene.popMatrix();
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
GameBoard.prototype.update = function(currTime, lastUpdate) {

	this.clock1.update(currTime, lastUpdate, this.gameRunning);
	this.clock2.update(currTime, lastUpdate, this.gameRunning);

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
	}
	else if (this.animationActive == 0 && animationPlaying) {
		this.animationActive = 1;
	}
};
//--------------------------------------------------------
GameBoard.prototype.updatePlaceHints = function() {

	if (!this.pieces.pieceAt(this.selectedPieceId).wasPlaced()) {

		for (var i = 0; i < this.numberCells; i++) {

			var validateCell = this.cells[i].isEmpty();

			if (this.currentPlayer.stuck) {
				validateCell = validateCell || !this.cells[i].isTwopiece();
			}

			if (validateCell) {
				this.cells[i].select();
			}
		}
	}
	else if (this.updateMoveHints() == 0) {
		this.pieces.pieceAt(this.selectedPieceId).setColor("red");
	}
};
//--------------------------------------------------------
GameBoard.prototype.validateSecond = function(nextPiece) {

	if (this.piecePlayed != null) {
		return (this.piecePlayed.isDisc() && nextPiece.isRing()) ||	(this.piecePlayed.isRing() && nextPiece.isDisc());
	}

	return true;
}
//--------------------------------------------------------
GameBoard.prototype.validateMove = function(cellX, cellY) {

	if (cellX < 0 || cellX >= this.numberRows) {
		return false;
	}

	if (cellY < 0 || cellY >= this.numberColumns) {
		return false;
	}

	var selectedCell = this.cells[this.cellIndex(cellX, cellY)];
	var selectedPiece = this.pieces.pieceAt(this.selectedPieceId);

	if (selectedCell.hasDisc() && !selectedCell.hasRing() && selectedPiece.isRing()) {
		return true;
	}

	if (selectedCell.hasRing() && !selectedCell.hasDisc() && selectedPiece.isDisc()) {
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
//--------------------------------------------------------
GameBoard.prototype.unselectHints = function() {

	for (var i = 0; i < this.numberCells; i++) {
		if (this.cells[i].selected && i != this.selectedCellId) {
			this.cells[i].unselect();
		}
	}
};
//--------------------------------------------------------
GameBoard.prototype.unselectActiveCell = function() {

	if (this.selectedCellId != null && this.selectedCellId != undefined) {
		this.cells[this.selectedCellId].unselect();
		this.selectedCellId = null;
		this.selectedPieceId = null;
	}
};
//--------------------------------------------------------
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
//--------------------------------------------------------
GameBoard.prototype.placePieceHandler = function() {

	var selectedPiece = this.pieces.pieceAt(this.selectedPieceId);
	var selectedCellX = ~~(this.selectedCellId/this.numberColumns);
	var selectedCellY = this.selectedCellId % this.numberColumns;

	if (this.testMode) {

		var sourceCell = this.cellIndex(selectedPiece.cellX, selectedPiece.cellY);
		var selectedCell = this.cells[this.selectedCellId];

		if (selectedPiece.wasPlaced()) {

			if (selectedPiece.isDisc()) {
				this.cells[sourceCell].removeDisc();
			}
			else {
				this.cells[sourceCell].removeRing();
			}
		}

		this.pieces.placePiece(this.selectedPieceId, ~~(this.selectedCellId / this.numberColumns), this.selectedCellId % this.numberColumns);

		if (selectedPiece.isDisc()) {
			selectedCell.insertDisc(selectedPiece);
		}
		else {
			selectedCell.insertRing(selectedPiece);
		}

		this.registerTurn(selectedPiece);
	}
	else if (selectedPiece.wasPlaced()) { // MOVE

		if (selectedPiece.isDisc()) {
			this.server.requestMoveDisc(selectedPiece.cellX + 1, selectedPiece.cellY + 1,
				selectedCellX + 1, selectedCellY + 1);
		}
		else {
			this.server.requestMoveRing(selectedPiece.cellX + 1, selectedPiece.cellY + 1,
				selectedCellX + 1, selectedCellY + 1);
		}
	}
	else { // PLACE

		if (selectedPiece.isDisc()) {
			this.server.requestPlaceDisc(selectedCellX + 1, selectedCellY + 1);
		}
		else {
			this.server.requestPlaceRing(selectedCellX + 1, selectedCellY + 1);
		}
	}

	this.unselectHints();
};
//--------------------------------------------------------
GameBoard.prototype.onPlacePiece = function() {

	var selectedPiece = this.pieces.pieceAt(this.selectedPieceId);
	var selectedCellX = ~~(this.selectedCellId / this.numberColumns);
	var selectedCellY = this.selectedCellId % this.numberColumns;
	var sourceCell = this.cellIndex(selectedPiece.cellX, selectedPiece.cellY);
	var destinationCell =  this.cells[this.selectedCellId];

	if (selectedPiece.wasPlaced()) {

		if (selectedPiece.isDisc()) {
			this.cells[sourceCell].removeDisc();
		}
		else {
			this.cells[sourceCell].removeRing();
		}
	}

	this.pieces.placePiece(this.selectedPieceId, selectedCellX, selectedCellY);
	this.registerTurn(selectedPiece);

	if (selectedPiece.isDisc()) {
		destinationCell.insertDisc(selectedPiece);
	}
	else {
		destinationCell.insertRing(selectedPiece);
	}
};
//--------------------------------------------------------
GameBoard.prototype.onResetPlace = function() {

	this.selectedPieceId = null;
	this.pieces.unselectActivePiece();

	if (this.selectedCellId != undefined && this.selectedCellId != null) {
		this.cells[this.selectedCellId].unselect();
		this.selectedCellId = null;
	}
};
//--------------------------------------------------------
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
//--------------------------------------------------------
GameBoard.prototype.processFrame = function(id, x, y) {
	this.updatePicking(this.cellIndex(x, y) + 1);
	this.pieces.placePiece(id, x, y);
};
//--------------------------------------------------------
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
	}
};