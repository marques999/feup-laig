/**
 * construtor default da classe 'GameStack'
 * @constructor
 * @augments Object
 * @author Diogo Marques
 * @return {null}
 */
function GameStack(board) {
	this.board = board;
	this.historyStack = [];
	this.undoStack = [];
	this.resetMovie();
};
//--------------------------------------------------------
GameStack.prototype = Object.create(Object.prototype);
GameStack.prototype.constructor = GameStack;
//--------------------------------------------------------
GameStack.prototype.pushMove = function(moveId, moveX, moveY) {
	this.historyStack.push([moveId, moveX, moveY]);
};
//--------------------------------------------------------
GameStack.prototype.pushUndo = function(selectedPiece, sourceCell, previousPiece) {
	this.undoStack.push([selectedPiece, sourceCell, previousPiece]);
};
//--------------------------------------------------------
GameStack.prototype.pop = function() {
	return this.undoStack.pop();
};
//--------------------------------------------------------
GameStack.prototype.empty = function() {
	return this.undoStack.length <= 0;
}
//--------------------------------------------------------
GameStack.prototype.getLength = function() {
	return this.historyStack.length;
};
//--------------------------------------------------------
GameStack.prototype.movieFinished = function() {
	return this.currentFrame >= this.historyStack.length;
};
//--------------------------------------------------------
GameStack.prototype.resetMovie = function() {
	this.currentFrame = 0;
};
//--------------------------------------------------------
GameStack.prototype.movieStep = function() {

	if (!this.movieFinished()) {
		var queueTop = this.historyStack[this.currentFrame];
		this.board.processFrame(queueTop[0], queueTop[1], queueTop[2]);
		this.currentFrame++;
	}
};