/**
 * construtor default da classe 'PieceController'
 * @constructor
 * @author Carlos Samouco, Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @param {GameBoard} board - referência para a primitiva "tabuleiro"
 * @param {Object} player1 - estrutura de dados do jogador 1
 * @param {Object} player2 - estrutura de dados do jogador 2
 * @return {null}
*/
function PieceController(scene, board, player1, player2) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.numberDiscs = 24;
	this.numberRings = 24;
	this.numberStacks = 8;
	//--------------------------------------------------------
	this.horizontalSpace = 2.1;
	this.verticalSpace = 0.9;
	this.stackSpace = 5.0;
	//--------------------------------------------------------
	this.player1 = player1;
	this.player2 = player2;
	this.board = board;
	//--------------------------------------------------------
	this.defaultAngle = 2 * Math.cos(Math.PI / 6) / 3;
	this.scaleFactor = [1.5 / 5.0, 1.3 / 5.0, 1.5 / 5.0];
	this.pieceSize = [board.baseSize[0] * this.scaleFactor[0], board.baseSize[1] * this.scaleFactor[1], board.baseSize[0] * this.scaleFactor[2]];
	this.boardHeight = (board.baseSize[0] + board.baseSize[1]) / 20 * 1.3;
	this.basePos = board.basePos;
	this.boxPos = board.boxPos;
	this.numberCells = board.numberCells;
	this.selectedPiece = null;
	//--------------------------------------------------------
	this.initialize();
};
//--------------------------------------------------------
PieceController.prototype = Object.create(MyPrimitive.prototype);
PieceController.prototype.constructor = PieceController;
//--------------------------------------------------------
PieceController.prototype.generateRandom = function() {
	return (Math.random() < 0.5 ? 1 : -1) * Math.random() * 0.06;
};
//--------------------------------------------------------
PieceController.prototype.initialize = function() {
	this.pieces = [];
	this.p1RingStacks = [];
	this.p1DiscStacks = [];
	this.p2RingStacks = [];
	this.p2DiscStacks = [];
	//--------------------------------------------------------
	this.p1Discs_start = 0;
	this.p1Discs_end = this.p1Discs_start + this.player1.discs;
	this.p1Rings_start = this.p1Discs_end;
	this.p1Rings_end = this.p1Rings_start + this.player1.rings;
	//--------------------------------------------------------
	this.p2Discs_start = this.p1Rings_end;
	this.p2Discs_end = this.p2Discs_start + this.player2.discs;
	this.p2Rings_start = this.p2Discs_end;
	this.p2Rings_end = this.p2Rings_start + this.player2.rings;
	//--------------------------------------------------------
	for (var i = this.p1Discs_start; i < this.p1Discs_end; i++) {

		var nStack = i % this.numberStacks;

		if (this.p1DiscStacks[nStack] == undefined) {
			this.p1DiscStacks[nStack] = [];
		}

		this.pieces[i] = new ObjectDisc(this.scene, this.player1.color,
		[
			(nStack % 2) * this.horizontalSpace + this.generateRandom() + this.boxPos[0],
			this.p1DiscStacks[nStack].length + this.boxPos[1] - this.boardHeight,
			Math.floor(nStack / 2) * this.horizontalSpace + this.generateRandom() + this.boxPos[2]
		]);

		this.p1DiscStacks[nStack].push(i);
	}
	//--------------------------------------------------------
	for (var i = this.p1Rings_start; i < this.p1Rings_end; i++) {

		var nStack = (i - this.p1Rings_start) % this.numberStacks;

		if (this.p1RingStacks[nStack] == undefined) {
			this.p1RingStacks[nStack] = [];
		}

		this.pieces[i] = new ObjectRing(this.scene, this.player1.color,
		[
			(nStack % 2) * this.horizontalSpace + this.generateRandom() + this.stackSpace + this.boxPos[0],
			this.p1RingStacks[nStack].length * this.verticalSpace + this.boxPos[1] - this.boardHeight,
			Math.floor(nStack / 2) * this.horizontalSpace + this.generateRandom() + this.boxPos[2]
		]);

		this.p1RingStacks[nStack].push(i);
	}
	//--------------------------------------------------------
	for (var i = this.p2Discs_start; i < this.p2Discs_end; i++) {

		var nStack = (i - this.p2Discs_start) % this.numberStacks;

		if (this.p2DiscStacks[nStack] == undefined) {
			this.p2DiscStacks[nStack] = [];
		}

		this.pieces[i] = new ObjectDisc(this.scene, this.player2.color,
		[
			-((nStack % 2) * this.horizontalSpace + this.generateRandom() + this.boxPos[0]),
			+(this.p2DiscStacks[nStack].length + this.boxPos[1] - this.boardHeight),
			-(Math.floor(nStack / 2) * this.horizontalSpace + this.generateRandom() + this.boxPos[2])
		]);

		this.p2DiscStacks[nStack].push(i);
	}
	//--------------------------------------------------------
	for (var i = this.p2Rings_start; i < this.p2Rings_end; i++) {

		var nStack = (i - this.p2Rings_start) % this.numberStacks;

		if (this.p2RingStacks[nStack] == undefined) {
			this.p2RingStacks[nStack] = [];
		}

		this.pieces[i] = new ObjectRing(this.scene, this.player2.color,
		[
			-((nStack % 2) * this.horizontalSpace + this.generateRandom() + this.stackSpace + this.boxPos[0]),
			+(this.p2RingStacks[nStack].length * this.verticalSpace + this.boxPos[1] - this.boardHeight),
			-(Math.floor(nStack / 2) * this.horizontalSpace + this.generateRandom() + this.boxPos[2])
		]);

		this.p2RingStacks[nStack].push(i);
	}
	//--------------------------------------------------------
	this.stackLength = [];
	this.stackLength["p1Discs"] = this.p1DiscStacks.length;
	this.stackLength["p1Rings"] = this.p1RingStacks.length;
	this.stackLength["p2Discs"] = this.p2DiscStacks.length;
	this.stackLength["p2Rings"] = this.p2RingStacks.length;
};
//--------------------------------------------------------
PieceController.prototype.display = function() {

	this.scene.pushMatrix();
	this.scene.scale(this.pieceSize[0], this.pieceSize[1], this.pieceSize[2]);

	for (var i = 0; i < this.pieces.length; i++) {

		this.scene.pushMatrix();
		var piecePosition = this.pieces[i].position;

		if (this.animation != null && this.animationId == i) {
			this.scene.multMatrix(this.animation.update());
		}
		else {
			this.scene.translate(piecePosition[0], piecePosition[1], piecePosition[2]);
		}

		this.scene.rotate(Math.PI / 2, -1.0, 0.0, 0.0);
		this.scene.registerPicking(this.pieces[i]);
		this.pieces[i].display();
		this.scene.popMatrix();
	}

	this.scene.popMatrix();
 };
//--------------------------------------------------------
PieceController.prototype.removeFromStack = function(pieceId) {

	if (pieceId < this.p1Discs_end) {

		var nStack = pieceId % this.numberStacks;
		var top = this.p1DiscStacks[nStack].length - 1;

		if (this.p1DiscStacks[nStack][top] == pieceId) {
			this.p1DiscStacks[nStack].pop();
			this.player1.discs--;
		}

		if (this.selectedPiece == pieceId){
			this.selectedPiece = null;
		}
	}
	else if (pieceId >= this.p1Rings_start && pieceId < this.p1Rings_end) {

		var nStack = (pieceId - this.p1Rings_start) % this.numberStacks;
		var top = this.p1RingStacks[nStack].length - 1;

		if (this.p1RingStacks[nStack][top] == pieceId) {
			this.p1RingStacks[nStack].pop();
			this.player1.rings--;
		}

		if (this.selectedPiece == pieceId){
			this.selectedPiece = null;
		}
	}
	else if (pieceId >= this.p2Discs_start && pieceId < this.p2Discs_end){

		var nStack = (pieceId - this.p2Discs_start) % this.numberStacks;
		var top = this.p2DiscStacks[nStack].length - 1;

		if (this.p2DiscStacks[nStack][top] == pieceId) {
			this.p2DiscStacks[nStack].pop();
			this.player2.discs--;
		}

		if (this.selectedPiece == pieceId){
			this.selectedPiece = null;
		}
	}
	else if (pieceId >= this.p2Rings_start && pieceId < this.p2Rings_end) {

		var nStack = (pieceId - this.p2Rings_start) % this.numberStacks;
		var top = this.p2RingStacks[nStack].length - 1;

		if (this.p2RingStacks[nStack][top] == pieceId) {
			this.p2RingStacks[nStack].pop();
			this.player2.rings--;
		}

		if (this.selectedPiece == pieceId){
			this.selectedPiece = null;
		}
	}
};
//--------------------------------------------------------
PieceController.prototype.placePiece = function(pieceId, x, y)  {
	//--------------------------------------------------------
	var piece = this.pieces[pieceId];
	//--------------------------------------------------------
	if (!piece.wasPlaced()) {
		this.removeFromStack(pieceId);
	}
	//--------------------------------------------------------
	piece.setColor('default');
	//--------------------------------------------------------
	var newX = 2.5 * x + this.basePos[0] / this.pieceSize[0];
	var newY = this.basePos[1] / this.pieceSize[1];
	var newZ = -2.5 * this.defaultAngle * x - 5 * this.defaultAngle * y + this.basePos[2] / this.pieceSize[2];
	//--------------------------------------------------------
	var piecePosition = this.pieces[pieceId].position;
	var pieceDistance = vec3.dist([newX, newY + 6, newZ], piecePosition);
	//--------------------------------------------------------
	this.animation = new LinearAnimation(pieceDistance * 0.2,
	[
		piecePosition,
		[piecePosition[0], piecePosition[1] + 3.0, piecePosition[2]],
		[newX, newY + 3.0, newZ],
		[newX, newY, newZ]
	]);
	//--------------------------------------------------------
	this.animationId = pieceId;
	this.animation.start();
	//--------------------------------------------------------
	piece.setPosition(newX, newY, newZ);
	piece.setColor('default');
	piece.place(x, y);
};
//--------------------------------------------------------
PieceController.prototype.randomBlackDisc = function() {
	
	if (this.player1.color == 'white') {
		return this.randomPiece(this.p2DiscStacks, "p2Discs");
	}

	return this.randomPiece(this.p1DiscStacks, "p1Discs");
};
//--------------------------------------------------------
PieceController.prototype.randomBlackRing = function() {
	
	if (this.player1.color == 'white') {
		return this.randomPiece(this.p2RingStacks, "p2Rings");
	}

	return this.randomPiece(this.p1RingStacks, "p1Rings");
};
//--------------------------------------------------------
PieceController.prototype.randomWhiteDisc = function() {
	
	if (this.player1.color == 'white') {
		return this.randomPiece(this.p1DiscStacks, "p1Discs");
	}

	return this.randomPiece(this.p2DiscStacks, "p2Discs");
};
//--------------------------------------------------------
PieceController.prototype.randomWhiteRing = function() {
	
	if (this.player1.color == 'white') {
		return this.randomPiece(this.p1RingStacks, "p1Rings");
	}

	return this.randomPiece(this.p2RingStacks, "p2Rings");
};
//--------------------------------------------------------
PieceController.prototype.randomPiece = function(playerStack, stackName) {
	
	var stackId = this.stackLength[stackName] - 1;
	var stackLength = playerStack[stackId].length - 1;
	
	if (stackLength == 0) {
		this.stackLength[stackName]--;
	}

	return playerStack[stackId][stackLength];
};
//--------------------------------------------------------
PieceController.prototype.placeRandom = function(typeId, x, y)  {
	//--------------------------------------------------------
	var pieceId = 0;
	var pieceName = null;
	//--------------------------------------------------------
	if (typeId == 1) {
		pieceId = this.randomBlackDisc();
		pieceName = 'disc';
	}
	else if (typeId == 2) {
		pieceId = this.randomWhiteDisc();
		pieceName = 'disc';
	}
	else if (typeId == 4) {
		pieceId = this.randomBlackRing();
		pieceName = 'ring';
	}
	else if (typeId == 8) {
		pieceId = this.randomWhiteRing();
		pieceName = 'ring';
	}
	else {
		return false;
	}
	//--------------------------------------------------------
	this.removeFromStack(pieceId);
	var piece = this.pieces[pieceId];
	var newX = 2.5 * x + this.basePos[0] / this.pieceSize[0];
	var newY = this.basePos[1] / this.pieceSize[1];
	var newZ = -2.5 * this.defaultAngle * x - 5 * this.defaultAngle * y + this.basePos[2] / this.pieceSize[2];
	//--------------------------------------------------------
	piece.setPosition(newX, newY, newZ);
	piece.setColor('default');
	piece.place(x, y);
	//--------------------------------------------------------
	return pieceName;
};
//--------------------------------------------------------
PieceController.prototype.pieceAt = function(pieceId) {
	return this.pieces[pieceId];
};
//--------------------------------------------------------
PieceController.prototype.update = function(delta) {

	if (this.animationId == null) {
		return false;
	}

	this.animation.step(delta);

	if (this.animation.active) {
		return true;
	}

	this.animationId = null;

	return false;
};
//--------------------------------------------------------
PieceController.prototype.unselectActivePiece = function() {

	if (this.selectedPiece != null && this.selectedPiece < this.pieces.length) {
		this.pieces[this.selectedPiece].setColor('default');
	}

	this.selectedPiece = null;
};
//--------------------------------------------------------
PieceController.prototype.selectPiece = function(pickingId) {

	if (pickingId >= this.numberCells + 1 && pickingId <= this.numberCells + this.pieces.length) {

		var id = pickingId - this.numberCells - 1;
		var currentPlayer = this.board.getPlayer();

		if (this.selectedPiece == id) {
			this.unselectActivePiece();
			return -1;
		}

		if (this.selectedPiece == null) {
			this.selectedPiece = id;
		}
		else {
			this.pieces[this.selectedPiece].setColor('default');
		}

		if (currentPlayer.color != this.pieces[id].getColor() || !this.board.validateSecond(this.pieces[id])) {
			this.selectedPiece = id;
			this.pieces[id].setColor('red');
			return -1;
		}

		if (this.pieces[id].wasPlaced()) {
			this.selectedPiece = id;
			this.pieces[id].setColor('yellow');
			return id;
		}

		if (id < this.p1Discs_end) {

			var nStack = id % this.numberStacks;
			var top = this.p1DiscStacks[nStack].length - 1;

			if (this.p1DiscStacks[nStack][top] == id) {
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');
				return id;
			}
		}
		else if (id >= this.p1Rings_start && id < this.p1Rings_end){

			var nStack = (id - this.p1Rings_start) % this.numberStacks;
			var top = this.p1RingStacks[nStack].length - 1;

			if (this.p1RingStacks[nStack][top] == id) {
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');
				return id;
			}
		}
		else if (id >= this.p2Discs_start && id < this.p2Discs_end) {

			var nStack = (id - this.p2Discs_start) % this.numberStacks;
			var top = this.p2DiscStacks[nStack].length - 1;

			if (this.p2DiscStacks[nStack][top] == id) {
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');
				return id;
			}
		}
		else {

			var nStack = (id - this.p2Rings_start) % this.numberStacks;
			var top = this.p2RingStacks[nStack].length - 1;

			if (this.p2RingStacks[nStack][top] == id) {
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');
				return id;
			}
		}

		this.selectedPiece = id;
		this.pieces[id].setColor('red');
		return -1;
	}
};