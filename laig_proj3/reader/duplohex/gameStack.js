function GameStack(board) {
	this.board = board;
	this.moves = [];
	this.resetMovie();
};
//--------------------------------------------------------
GameStack.prototype = Object.create(Object.prototype);
GameStack.prototype.constructor = GameStack;
//--------------------------------------------------------
GameStack.prototype.push = function(selectedPiece, sourceCell, previousPiece) {
	this.moves.push([selectedPiece, sourceCell, previousPiece]);
};
//--------------------------------------------------------
GameStack.prototype.pop = function() {
	return this.moves.pop();
};
//--------------------------------------------------------
GameStack.prototype.empty = function() {
	return this.moves.length <= 0;
}
//--------------------------------------------------------
GameStack.prototype.getLength = function() {
	return this.moves.length;
};
//--------------------------------------------------------
GameStack.prototype.movieFinished = function() {
	return this.currentFrame >= this.moves.length;
};
//--------------------------------------------------------
GameStack.prototype.resetMovie = function() {
	this.currentFrame = 0;
};
//--------------------------------------------------------
GameStack.prototype.movieStep = function() {

	if (!this.movieFinished()) {
		var queueTop = this.moves[this.currentFrame];
		this.board.processFrame(queueTop[0], queueTop[1]);
		this.currentFrame++;
	}
};