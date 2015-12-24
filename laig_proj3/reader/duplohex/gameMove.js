function GameMove(board) {
	this.board = board;
	this.totalFrames = 0;
	this.moves = [];
	this.reset();
};
//--------------------------------------------------------
GameMove.prototype = Object.create(Object.prototype);
GameMove.prototype.constructor = GameMove;
//--------------------------------------------------------
GameMove.prototype.push = function(moveId, moveX, moveY) {
	this.moves.push([moveId, moveX, moveY]);
	this.totalFrames++;
};
//--------------------------------------------------------
GameMove.prototype.empty = function() {
	return this.currentFrame >= this.moves.length;
};
//--------------------------------------------------------
GameMove.prototype.reset = function() {
	this.currentFrame = 0;
	this.initialMove = true;
	this.nextTurn = 0;
};
//--------------------------------------------------------
GameMove.prototype.step = function() {

	if (this.currentFrame >= this.moves.length) {
		return;
	}

	var queueTop = this.moves[this.currentFrame];
	this.board.processFrame(queueTop[0], queueTop[1], queueTop[2]);
	this.currentFrame++;

	if (this.initialMove) {
		this.board.rotateCamera = true;
		this.initialMove = false;
	}
	else if (this.nextTurn++ == 1) {
		this.nextTurn = 0;
		this.board.rotateCamera = true;
	}
};