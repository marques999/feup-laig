function GameMove(board) {
	this.board = board;
	this.totalFrames = 0;
	this.moves = [];
	this.resetMovie();
};
//--------------------------------------------------------
GameMove.prototype = Object.create(Object.prototype);
GameMove.prototype.constructor = GameMove;
//--------------------------------------------------------
GameMove.prototype.push = function(selectedPiece, sourceCell, previousPiece) {
	this.moves.push([selectedPiece, sourceCell, previousPiece]);
	this.totalFrames++;
};
//--------------------------------------------------------
GameMove.prototype.pop = function() {
	this.totalFrames--;
	return this.moves.pop();
};
//--------------------------------------------------------
GameMove.prototype.empty = function() {
	return this.moves.length <= 0;
}
//--------------------------------------------------------
GameMove.prototype.movieFinished = function() {
	return this.currentFrame >= this.totalFrames;
};
//--------------------------------------------------------
GameMove.prototype.resetMovie = function() {
	this.currentFrame = 0;
};
//--------------------------------------------------------
GameMove.prototype.movieStep = function() {

	if (!this.movieFinished()) {
		var queueTop = this.moves[this.currentFrame];
		this.board.processFrame(queueTop[0], queueTop[1]);
		this.currentFrame++;
	}
};