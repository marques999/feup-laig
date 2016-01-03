/**
 * construtor default da classe 'GameBoard'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco, Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @return {null}
 */
function GameBoard(scene) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.basePos = [0.0, 0.0, 0.0];
	this.baseSize = [1.0, 1.0];
	this.boxPos = [3.0, 0.0, 17.0];
	this.borderAngle = Math.sin(Math.PI / 3);
	this.doubleAngle = 2.0 * this.borderAngle;
	//--------------------------------------------------------
	this.cells = [];
	this.gameMode = 'pvp'
	this.numberRows = 7;
	this.numberColumns = 7;
	this.numberCells = this.numberRows * this.numberColumns;
	this.playerColor = 'white';
	//--------------------------------------------------------
	this.basePos[0] = this.basePos[0] - (this.baseSize[0] / 5.0) * 1.875 * (this.numberColumns - 1);
	this.basePos[1] = this.basePos[1];
	this.basePos[2] = this.basePos[2] + (this.baseSize[1] / 5.0) * 3.75 * this.borderAngle * (this.numberRows - 1);
	//--------------------------------------------------------
	this.player1 = {
		color: 'white',
		cpu: false,
		discs: 24,
		rings: 24,
		stuck: false
	};
	//--------------------------------------------------------
	this.player2 = {
		color: 'black',
		cpu: false,
		discs: 24,
		rings: 24,
		stuck: false
	};
	//--------------------------------------------------------
	this.cylinder = new MyCylinder(scene, 1.0, 1.0, 1.0, 20, 6);
	this.base = new MyRectangle(scene, 0.0, 1.0, 1.0, 0.0);
	this.whiteBorder = new ObjectBorder(scene, this.numberRows, 'white');
	this.blackBorder = new ObjectBorder(scene, this.numberColumns, 'black');
	this.pieces = new PieceController(scene, this, this.player1, this.player2);
	this.historyPieces = new HistoryController(scene, this, this.player1, this.player2);
	this.clock1 = new ObjectClock(scene, this.player1);
	this.clock2 = new ObjectClock(scene, this.player2);
	//--------------------------------------------------------
	this.hexTexture = new CGFtexture(this.scene, "resources/hexagon.png");
	this.hoverTexture = new CGFtexture(this.scene, "resources/hexagon_hover.png");
	this.baseTexture = new CGFtexture(this.scene, "resources/duplohex_base.png");
	//--------------------------------------------------------
	this.resetDefaults();
	this.currentMatrix = 'default';
	this.pieceController = this.pieces;
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
	//--------------------------------------------------------
	this.currentMatrix = currentMatrix;
	var thisMatrix = null;
	//--------------------------------------------------------
	this.resetCells();
	this.resetController();
	//--------------------------------------------------------
	if (this.currentMatrix == 'diagonal') {
		thisMatrix = this.diagonalMatrix;
	}
	else if (this.currentMatrix == 'small') {
		thisMatrix = this.smallMatrix;
	}
	else {
		return false;
	}
	//--------------------------------------------------------
	for (var i = 0; i < thisMatrix.length; i++) {
		//--------------------------------------------------------
		var currentPiece = thisMatrix[i];
		var cellIndex =  this.cellIndex(currentPiece[1], currentPiece[2]);
		var pieceObject = this.pieces.placeRandom.apply(this.pieces, currentPiece);
		//--------------------------------------------------------
		if (pieceObject.isDisc()) {
			this.cells[cellIndex].insertDisc(pieceObject);
		}
		else {
			this.cells[cellIndex].insertRing(pieceObject);
		}
	}
};
//--------------------------------------------------------
GameBoard.prototype.updateMovieMatrix = function() {
	//--------------------------------------------------------
	if (this.currentMatrix == 'diagonal') {
		for (var i = 0; i < this.diagonalMatrix.length; i++) {
			this.historyPieces.placeRandom.apply(this.historyPieces, this.diagonalMatrix[i]);
		}
	}
	//--------------------------------------------------------
	else if (this.currentMatrix == 'small') {
		for (var i = 0; i < this.smallMatrix.length; i++) {
			this.historyPieces.placeRandom.apply(this.historyPieces, this.smallMatrix[i]);
		}
	}
};
//--------------------------------------------------------
GameBoard.prototype.updateMode = function(gameMode) {

	if (gameMode == 'pvp') {
		this.player1.cpu = false;
		this.player2.cpu = false;
	}
	else if (gameMode == 'pvb') {
		this.player1.cpu = false;
		this.player2.cpu = true;
	}
	else if (gameMode == 'bvb') {
		this.player1.cpu = true;
		this.player2.cpu = true;
	}

	this.gameMode = gameMode;
};
//--------------------------------------------------------
GameBoard.prototype.updatePlayer = function(gameMode, playerColor) {

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

	if (gameMode != null) {
		this.updateMode(gameMode);
	}

	this.playerColor = playerColor;
	this.updateMatrix(this.currentMatrix);
};
//--------------------------------------------------------
GameBoard.prototype.updateTimeout = function(playerTimeout) {
	this.playerTimeout = playerTimeout;
};
//--------------------------------------------------------
GameBoard.prototype.resetBoard = function(gameMode, playerColor) {
	this.gameRunning = false;
	this.pieceController.stopAnimation();
	this.resetDefaults();
	this.updatePlayer(this.gameMode, this.playerColor);
	this.scene.switchSceneView();
};
//--------------------------------------------------------
GameBoard.prototype.resetCells = function(gameMode, playerColor) {

	for (var i = 0; i < this.cells.length; i++) {
		this.cells[i].reset();
	}
};
//--------------------------------------------------------
GameBoard.prototype.resetController = function() {
	this.player1.discs = this.player1.rings = 24;
	this.player2.discs = this.player2.rings = 24;
	this.pieces.resetPieces();
	this.historyPieces.resetPieces();
	this.pieceController = this.pieces;
};
//--------------------------------------------------------
GameBoard.prototype.resetDefaults = function() {
	//--------------------------------------------------------
	this.animationActive = 0;
	this.currentPlayer = null;
	this.historyStack = new GameStack(this);
	this.piecePlayed = null;
	this.rotateCamera = false;
	//--------------------------------------------------------
	this.elapsedMillis = 0.0;
	this.elapsedPlayerTime = 0.0;
	//--------------------------------------------------------
	this.movieDelay = 200;
	this.movieFrame = 0;
	this.movieMode = false;
	this.moviePaused = false;
	this.moviePlaying = false;
	this.movieRotated = false;
	this.movieRotationDone = true;
	this.movieSpeed = 1.8;
	//--------------------------------------------------------
	this.botPlaying = false;
	this.botCanPlay = false;
	this.gameRunning = false;
	this.testMode = false;
	//--------------------------------------------------------
	this.unselectActiveCell();
	this.unselectHints();
	this.clock1.resetClock();
	this.clock2.resetClock();
};
//--------------------------------------------------------
GameBoard.prototype.getPlayer = function() {
	return this.currentPlayer;
};
//--------------------------------------------------------
GameBoard.prototype.getPlayedPiece = function() {

	if (this.piecePlayed != null && this.piecePlayed != undefined) {

		if (this.piecePlayed.isDisc()) {
			return 'disc';
		}

		if (this.piecePlayed.isRing()) {
			return 'ring';
		}
	}

	return 'null';
};
//--------------------------------------------------------
GameBoard.prototype.onDisconnect = function() {
	this.gameRunning = false;
};
//--------------------------------------------------------
GameBoard.prototype.changeTurn = function() {

	if (this.currentPlayer == this.player1) {
		this.currentPlayer = this.player2;
	}
	else {
		this.currentPlayer = this.player1;
	}

	if (this.currentPlayer.cpu) {
		this.botPlaying = true;
		this.scene.disablePicking();
	}
	else {
		this.botPlaying = false;
		this.botCanPlay = false;
		this.scene.enablePicking();
	}

	if (!this.movieMode) {
		this.rotateCamera = true;
		this.elapsedPlayerTime = 0.0;
		this.animationActive = 1;
	}
};
//--------------------------------------------------------
GameBoard.prototype.serializeBoard = function() {

	var boardLength = this.cells.length;
	var serializedString = "[";

	for (var i = 0; i < boardLength; i++) {

		var x = ~~(i / this.numberColumns);
		var y = i % this.numberColumns;

		if (y == 0) {

			if (x == 0) {
				serializedString += "[";
			}
			else {
				serializedString += ",[";
			}
		}

		serializedString += this.cells[i].getSymbol();

		if (y == this.numberColumns - 1) {
			serializedString += "]";
		}
		else {
			serializedString += ",";
		}
	}

	serializedString += "]";

	return serializedString;
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
		this.elapsedPlayerTime = 0.0;
		this.piecePlayed = currentPiece;
	}
};
//--------------------------------------------------------
GameBoard.prototype.registerUndo = function(previousPiece) {

	if (this.historyStack.empty()) {
		this.initialMove = true;
		this.piecePlayed = null;
		this.nextTurn = 0;
		this.changeTurn();
	}
	else if (this.nextTurn-- == 0) {
		this.nextTurn = 1;
		this.piecePlayed = previousPiece;
		this.changeTurn();
	}
	else {
		this.piecePlayed = previousPiece;
	}
};
//--------------------------------------------------------
GameBoard.prototype.onAnimationFinished = function() {

	if (!this.gameRunning || this.movieMode) {
		return;
	}

	var serializedBoard = this.serializeBoard();
	this.server.requestStatus(serializedBoard, this.player1, this.player2);
	this.server.requestStuck(serializedBoard, this.currentPlayer);

	if (this.botPlaying) {
		this.botCanPlay = true;
	}
}
//--------------------------------------------------------
GameBoard.prototype.setServer = function(server) {
	this.server = server;
};
//--------------------------------------------------------
GameBoard.prototype.startGame = function(server) {
	//--------------------------------------------------------
	if (this.currentPlayer.cpu) {
		if (this.currentPlayer.color == 'white') {
			this.botPlaying = true;
			this.botCanPlay = true;
			this.scene.disablePicking();
			this.botDelay = (Math.random() * 1.5) + 1.0;
		}
	}
	else {
		this.scene.enablePicking();
	}
	//--------------------------------------------------------
	if (this.currentPlayer == this.player2) {
		this.scene.rotateCamera();
	}
	//--------------------------------------------------------
	this.initialMove = true;
	this.gameRunning = true;
	this.nextTurn = 0;
};
//--------------------------------------------------------
GameBoard.prototype.botTurn = function() {
	//--------------------------------------------------------
	var serializedBoard = this.serializeBoard();
	//--------------------------------------------------------
	if (this.piecePlayed == null) {
		this.server.requestBotAction(serializedBoard, 'disc', this.initialMove);
	}
	else {
		if (this.piecePlayed.isDisc()) {
			this.server.requestBotAction(serializedBoard, 'ring', this.initialMove);
		}
		else {
			this.server.requestBotAction(serializedBoard, 'disc', this.initialMove);
		}
	}
};
//--------------------------------------------------------
GameBoard.prototype.undoMovement = function() {
	//--------------------------------------------------------
	if (this.animationBusy() || this.historyStack.empty() || this.initialMove) {
		return;
	}
	//--------------------------------------------------------
	this.rotateCamera = false;
	this.elapsedPlayerTime = 0.0;
	this.animationActive = 0;
	this.toggleCell(this.selectedCellId);
	this.pieces.unselectActivePiece();
	this.unselectHints();
	//--------------------------------------------------------
	var lastMove = this.historyStack.pop();
	var sourceCell = this.cellIndex(lastMove[0].getX(), lastMove[0].getY());
	//--------------------------------------------------------
	if (lastMove[0].isDisc()) {
		this.cells[sourceCell].removeDisc();
	}
	else {
		this.cells[sourceCell].removeRing();
	}
	//--------------------------------------------------------
	if (lastMove[1] != null) {
		//--------------------------------------------------------
		var destCellX = ~~(lastMove[1] / this.numberColumns);
		var destCellY = lastMove[1] % this.numberColumns;
		var destinationCell = this.cells[lastMove[1]];
		//--------------------------------------------------------
		this.pieceController.placePiece(lastMove[0].id, destCellX, destCellY, true);
		//--------------------------------------------------------
		if (lastMove[0].isDisc()) {
			destinationCell.insertDisc(lastMove[0]);
		}
		else {
			destinationCell.insertRing(lastMove[0]);
		}
	}
	else {
		this.pieceController.placeOnStack(lastMove[0], this.currentPlayer.cpu);
	}
	//--------------------------------------------------------
	this.registerUndo(lastMove[2]);
};
//--------------------------------------------------------
GameBoard.prototype.display = function() {
	this.scene.resetPicking();
	this.displayBoard();
	this.pieceController.display();
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
		this.scene.translate(-1.0, 0.0, -(this.numberColumns - 1.0) * this.doubleAngle - 0.5 / this.borderAngle);
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
GameBoard.prototype.backupSelection = function() {
	this.previousSelectedPiece = this.selectedPieceId;
	this.previousSelectedCell = this.selectedCellId;
	this.toggleCell(this.selectedCellId);
	this.unselectHints();
};
//--------------------------------------------------------
GameBoard.prototype.restoreSelection = function() {
	this.unselectActiveCell();
	this.selectedPieceId = this.previousSelectedPiece;
	this.toggleCell(this.previousSelectedCell);
	this.updatePlaceHints();
};
//--------------------------------------------------------
GameBoard.prototype.exitMovie = function() {

	if (!this.movieRotationDone || this.animationActive == 1) {
		return false;
	}

	if (this.movieRotated) {
		this.scene.rotateCamera();
	}

	this.stopMovie();
	this.movieSpeed = 1.8;
	this.movieDelay = 200;
	this.movieMode = false;
	this.pieceController = this.pieces;

	if (this.initialMove && this.botPlaying) {
		this.botCanPlay = true;
	}

	if (!this.botPlaying) {
		this.scene.enablePicking();
	}

	this.restoreSelection();
	return true;
};
//--------------------------------------------------------
GameBoard.prototype.pauseMovie = function() {

	if (!this.movieRotationDone) {
		return;
	}

	this.moviePaused = !this.moviePaused;
};
//--------------------------------------------------------
GameBoard.prototype.resetMovie = function() {
	//--------------------------------------------------------
	if (!this.movieRotationDone) {
		return;
	}
	//--------------------------------------------------------
	this.moviePaused = false;
	this.moviePlaying = true;
	this.movieFrame = 0;
	this.elapsedMillis = 0.0;
	//--------------------------------------------------------
	this.historyStack.resetMovie();
	this.historyPieces.stopAnimation();
	this.historyPieces.resetPieces();
	this.updateMovieMatrix();
};
//--------------------------------------------------------
GameBoard.prototype.rotateMovie = function() {

	if (!this.movieRotationDone || this.animationActive) {
		return;
	}

	this.scene.rotateCamera();
	this.movieRotated = !this.movieRotated;
	this.movieRotationDone = false;
};
//--------------------------------------------------------
GameBoard.prototype.startMovie = function() {
	this.scene.disablePicking();
	this.backupSelection();
	this.movieRotationDone = true;
	this.resetMovie();
	this.pieceController = this.historyPieces;
	this.movieRotated = false;
	this.movieMode = true;
};
//--------------------------------------------------------
GameBoard.prototype.stopMovie = function() {

	if (!this.movieRotationDone) {
		return;
	}

	this.moviePaused = false;
	this.moviePlaying = false;
	this.historyStack.resetMovie();
	this.historyPieces.stopAnimation();
};
//--------------------------------------------------------
GameBoard.prototype.movieLength = function() {
	return this.historyStack.getLength();
};
//--------------------------------------------------------
GameBoard.prototype.skipMovieFrame = function() {
	while (this.pieceController.update(this.movieSpeed)) {
		this.elapsedMillis = 9999;
	}
};
//--------------------------------------------------------
GameBoard.prototype.onRotationDone = function() {

	if (this.movieMode) {
		this.movieRotationDone = true;
		return true;
	}

	if (this.movieRotated) {
		this.movieRotated = false;
		return true;
	}

	if (!this.gameRunning) {
		return false;
	}

	this.rotateCamera = false;
	this.animationActive = 0;

	if (this.initialMove && this.botPlaying) {
		this.botCanPlay = true;
	}

	return true;
};
//--------------------------------------------------------
GameBoard.prototype.handleStatus = function(responseText) {

	if (responseText == 'p1Wins') {

		if (this.player1.color == 'white') {
			$('#whiteWins').modal();
		}
		else {
			$('#blackWins').modal();
		}

		this.gameRunning = false;
	}
	else if (responseText == 'p2Wins') {

		if (this.player2.color == 'white') {
			$('#whiteWins').modal();
		}
		else {
			$('#blackWins').modal();
		}

		this.gameRunning = false;
	}
	else if (responseText == 'p1Defeated') {

		if (this.player1.color == 'white') {
			$('#whiteDefeated').modal();
		}
		else {
			$('#blackDefeated').modal();
		}

		this.gameRunning = false;
	}
	else if (responseText == 'p2Defeated') {

		if (this.player2.color == 'white') {
			$('#whiteDefeated').modal();
		}
		else {
			$('#blackDefeated').modal();
		}

		this.gameRunning = false;
	}
};
//--------------------------------------------------------
GameBoard.prototype.handleStuck = function(playerStuck) {
	this.currentPlayer.stuck = playerStuck;
};
//--------------------------------------------------------
GameBoard.prototype.checkBotTurn = function(deltaTime) {

	if (this.botCanPlay) {

		this.elapsedMillis += deltaTime;

		if (this.elapsedMillis >= this.botDelay) {
			this.botCanPlay = false;
			this.botDelay = (Math.random() * 1.5) + 1.0;
			this.elapsedMillis = 0.0;
			this.botTurn();
		}
	}
};
//--------------------------------------------------------
GameBoard.prototype.checkTimeout = function(deltaTime) {
	//--------------------------------------------------------
	if (this.animationActive == 0 && !this.rotateCamera) {
		this.elapsedPlayerTime += deltaTime;
	}
	//--------------------------------------------------------
	if (this.elapsedPlayerTime > this.playerTimeout) {
		//--------------------------------------------------------
		if (this.currentPlayer == this.player1) {
			this.handleStatus("p1Defeated");
		}
		else {
			this.handleStatus("p2Defeated");
		}
	}
};
//--------------------------------------------------------
GameBoard.prototype.update = function(currTime, lastUpdate) {

	if (this.movieMode && this.moviePaused) {
		return;
	}

	if (lastUpdate == 0) {
		lastUpdate = currTime;
	}

	var deltaTime = currTime - lastUpdate;
	var deltaTimeMillis = deltaTime / 1000;

	if (this.movieMode && this.moviePlaying) {
		var animationPlaying = this.historyPieces.update(deltaTimeMillis * this.movieSpeed);
		this.updateMovie(deltaTime);
	}
	else {
		this.clock1.update(this.player1.discs, this.player1.rings);
		this.clock2.update(this.player2.discs, this.player2.rings);
		var animationPlaying = this.pieceController.update(deltaTimeMillis);
	}

	if (!this.gameRunning && !this.movieMode) {
		return;
	}

	if (this.animationActive == 1 && !animationPlaying) {

		this.animationActive = 0;
		this.unselectActiveCell();

		if (!this.movieMode && this.rotateCamera) {
			this.scene.rotateCamera();
		}
	}
	else if (this.animationActive == 0 && animationPlaying) {
		this.animationActive = 1;
	}

	if (this.movieMode) {
		return;
	}

	if (this.animationActive == 0 && !this.rotateCamera) {

		if (this.currentPlayer == this.player1) {
			this.clock1.updateClock(deltaTime);
		}
		else {
			this.clock2.updateClock(deltaTime);
		}
	}

	if (this.currentPlayer.cpu) {
		this.checkBotTurn(deltaTimeMillis);
	}
	else {
		this.checkTimeout(deltaTimeMillis);
	}
};
//--------------------------------------------------------
GameBoard.prototype.updatePlaceHints = function() {

	var selectedPiece = this.pieceController.pieceAt(this.selectedPieceId);

	if (selectedPiece == null || selectedPiece == undefined) {
		return;
	}

	if (!selectedPiece.wasPlaced()) {

		for (var i = 0; i < this.numberCells; i++) {

			if (this.currentPlayer.stuck) {
				!this.cells[i].isTwopiece() && this.cells[i].select();;
			}
			else {
				this.cells[i].isEmpty() && this.cells[i].select();
			}
		}
	}
	else if (this.updateMoveHints() == 0) {
		selectedPiece.setColor("red");
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

	if (cellX < 0 || cellY < 0 || cellX >= this.numberRows || cellY >= this.numberColumns) {
		return false;
	}

	var selectedCell = this.cells[this.cellIndex(cellX, cellY)];
	var selectedPiece = this.pieceController.pieceAt(this.selectedPieceId);

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
GameBoard.prototype.pieceAnimationActive = function() {
	return this.animationActive != 0;
};
//--------------------------------------------------------
GameBoard.prototype.updateMoveHints = function() {

	var selectedPiece = this.pieceController.pieceAt(this.selectedPieceId);
	var sourceIndex = this.cellIndex(selectedPiece.getX(), selectedPiece.getY());
	var numberHints = 0;

	if (this.initialMove || this.cells[sourceIndex].isTwopiece()) {
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

		var destinationX = selectedPiece.getX() + neighbourCells[j][0];
		var destinationY = selectedPiece.getY() + neighbourCells[j][1];
		var destinationIndex = this.cellIndex(destinationX, destinationY);

		if (this.validateMove(destinationX, destinationY)) {
			this.cells[destinationIndex].select();
			numberHints++;
		}
	}

	return numberHints;
}
//--------------------------------------------------------
GameBoard.prototype.unselectHints = function() {

	if (this.cells == null || this.cells == undefined) {
		return;
	}

	for (var i = 0; i < this.cells.length; i++) {
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

	if (selectedId == undefined || selectedId == null || selectedId > this.numberCells) {
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

	if (this.movieMode) {
		return;
	}

	var selectedPiece = this.pieceController.pieceAt(this.selectedPieceId);
	var selectedCellX = ~~(this.selectedCellId / this.numberColumns);
	var selectedCellY = this.selectedCellId % this.numberColumns;
	var serializedBoard = this.serializeBoard();

	if (this.botPlaying || this.testMode) {
		this.onPlacePiece();
	}
	else if (selectedPiece.wasPlaced()) { // MOVE

		if (selectedPiece.isDisc()) {
			this.server.requestMoveDisc(serializedBoard, selectedPiece.getX() + 1,
				selectedPiece.getY() + 1, selectedCellX + 1, selectedCellY + 1, this.initialMove);
		}
		else {
			this.server.requestMoveRing(serializedBoard, selectedPiece.getX() + 1,
				selectedPiece.getY() + 1, selectedCellX + 1, selectedCellY + 1, this.initialMove);
		}
	}
	else { // PLACE

		if (selectedPiece.isDisc()) {
			this.server.requestPlaceDisc(serializedBoard, selectedCellX + 1, selectedCellY + 1, this.initialMove);
		}
		else {
			this.server.requestPlaceRing(serializedBoard, selectedCellX + 1, selectedCellY + 1, this.initialMove);
		}
	}
};
//--------------------------------------------------------
GameBoard.prototype.onPlacePiece = function() {

	var selectedPiece = this.pieceController.pieceAt(this.selectedPieceId);
	var selectedCellX = ~~(this.selectedCellId / this.numberColumns);
	var selectedCellY = this.selectedCellId % this.numberColumns;
	var sourceCell = this.cellIndex(selectedPiece.getX(), selectedPiece.getY());
	var destinationCell = this.cells[this.selectedCellId];

	if (selectedPiece.wasPlaced()) { // MOVE

		this.historyStack.push(selectedPiece, sourceCell, this.piecePlayed);

		if (selectedPiece.isDisc()) {
			this.cells[sourceCell].removeDisc();
		}
		else {
			this.cells[sourceCell].removeRing();
		}
	}
	else { // PLACE
		this.historyStack.push(selectedPiece, null, this.piecePlayed);
	}

	this.pieceController.placePiece(this.selectedPieceId, selectedCellX, selectedCellY);
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
	this.pieceController.unselectActivePiece();
	this.unselectActiveCell();
};
//--------------------------------------------------------
GameBoard.prototype.updateMovie = function(delta) {

	if (this.animationActive) {
		return;
	}

	this.elapsedMillis += delta;

	if (this.elapsedMillis >= this.movieDelay) {

		if (this.historyStack.movieFinished()) {
			this.stopMovie();
		}
		else {
			this.historyStack.movieStep();
			this.movieFrame++;
		}

		this.elapsedMillis = 0;
	}
};
//--------------------------------------------------------
GameBoard.prototype.unserializeAction = function(serializedMove) {

	var unserializedMove = serializedMove.match(/[^,()]+/g);

	if (unserializedMove == null || unserializedMove.length < 1) {
		return false;
	}

	var actionType = unserializedMove[0];

	if (actionType != 'moveAction' && actionType != 'placeAction') {
		return false;
	}

	if (actionType == 'moveAction' && unserializedMove.length != 4) {
		return false;
	}

	if (actionType == 'placeAction' && unserializedMove.length != 3) {
		return false;
	}

	var actionPiece = unserializedMove[1];

	if (actionPiece != 'disc' && actionPiece != 'ring') {
		return false;
	}

	var sourceCoordinatesString = unserializedMove[2].split('-');
	var sourceCoordinates = sourceCoordinatesString.map(parseFloat);

	if (actionType == 'moveAction') {

		var destinationCoordinatesString = unserializedMove[3].split('-');
		var destinationCoordinates = destinationCoordinatesString.map(parseFloat);
		this.processBotMove(actionPiece,
			sourceCoordinates[0], sourceCoordinates[1],
			destinationCoordinates[0], destinationCoordinates[1]
		);
	}
	else {
		this.processBotPlace(actionPiece, sourceCoordinates[0], sourceCoordinates[1]);
	}

	return true;
}
//--------------------------------------------------------
GameBoard.prototype.processBotMove = function(piece, fromX, fromY, toX, toY) {

	var sourceCell = this.cellIndex(fromX - 1, fromY - 1);
	var destinationCell = this.cellIndex(toX - 1, toY - 1) + 1;
	var validMove = false;
	var sourcePiece = null;

	if (piece == 'disc') {
		sourcePiece = this.numberCells + this.cells[sourceCell].getDiscId() + 1;
		validMove = true;
	}
	else if (piece == 'ring') {
		sourcePiece = this.numberCells + this.cells[sourceCell].getRingId() + 1;
		validMove = true;
	}

	if (validMove) {
		this.updatePicking(sourcePiece);
		this.updatePicking(destinationCell);
	}
	else {
		this.onResetPlace();
	}
};
//--------------------------------------------------------
GameBoard.prototype.processBotPlace = function(piece, toX, toY) {

	var sourcePiece = null;
	var destinationCell = this.cellIndex(toX - 1, toY - 1) + 1;

	if (this.currentPlayer.color == 'white') {

		if (piece == 'disc') {
			sourcePiece = this.numberCells + this.pieceController.randomWhiteDisc() + 1;
		}
		else if (piece == 'ring') {
			sourcePiece = this.numberCells +  + this.pieceController.randomWhiteRing() + 1;
		}
	}
	else {

		if (piece == 'disc') {
			sourcePiece = this.numberCells +  + this.pieceController.randomBlackDisc() + 1;
		}
		else if (piece == 'ring') {
			sourcePiece = this.numberCells +  + this.pieceController.randomBlackRing() + 1;
		}
	}

	if (sourcePiece != null) {
		this.updatePicking(sourcePiece);
		this.updatePicking(destinationCell);
	}
	else {
		this.onResetPlace();
	}
};
//--------------------------------------------------------
GameBoard.prototype.animationBusy = function() {
	return this.movieMode || this.rotateCamera || this.animationActive;
};
//--------------------------------------------------------
GameBoard.prototype.processFrame = function(sourcePiece, destinationCell) {
	var sourceCell = this.cellIndex(sourcePiece.getX(), sourcePiece.getY());
	this.updatePicking(sourceCell + 1);
	this.historyPieces.placePiece(sourcePiece.getId(), sourcePiece.getX(), sourcePiece.getY());
};
//--------------------------------------------------------
GameBoard.prototype.updatePicking = function(selectedId) {

	if (!this.gameRunning || this.animationActive) {
		return;
	}

	var id = this.pieceController.selectPiece(selectedId);

	if (id == null) {
		this.toggleCell(selectedId - 1);
	}
	else {
		this.selectedPieceId = id;
	}

	this.unselectHints();

	// situação : utilizador seleccionou primeiro uma peça da stack
	// resposta : mostra as jogadas disponiveis para a peça selecionada
	if (this.selectedPieceId != null && this.selectedPieceId != -1) {
		this.updatePlaceHints();
	}

	// situação : utilizador seleccionou primeiro uma célula do tabuleiro
	// resposta : marcar essa célula, aguardando por uma segunda ordem do utilizador
	if (this.selectedPieceId == -1 && this.selectedCellId != null) {
		this.selectedPieceId = null;
		this.pieceController.unselectActivePiece();
		this.unselectActiveCell();
	}

	// situação : utilizador seleccionou uma peça e uma célula do tabuleiro
	// resposta : realizar  a jogada, caso esta seja possível
	if (this.selectedPieceId != null && this.selectedCellId != null) {
		this.placePieceHandler();
		this.unselectHints();
	}
};