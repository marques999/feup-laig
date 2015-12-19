function GameMove(board) {
	//--------------------------------------------------------
	this.board = board;
	this.currentFrame = 0;
	this.totalFrames = 0;
	this.moves = [];
	//--------------------------------------------------------
};

GameMove.prototype = Object.create(Object.prototype);
GameMove.prototype.constructor = GameMove;

GameMove.prototype.push = function(moveId, moveX, moveY) {
	this.moves.push({id: moveId, x: moveX, y: moveY});
	this.totalFrames++;
};

GameMove.prototype.empty = function() {
	return this.currentFrame >= this.moves.length;
};

GameMove.prototype.reset = function() {
	this.currentFrame = 0;
};

GameMove.prototype.step = function() {
	
	if (this.empty()) {
		return;
	}

	var queueTop = this.moves[this.currentFrame];
	this.board.processFrame(queueTop.id, queueTop.x, queueTop.y);
	this.currentFrame++;
};