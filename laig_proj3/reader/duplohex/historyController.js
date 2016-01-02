/**
 * construtor default da classe 'HistoryController'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @param {GameBoard} board - referência para a primitiva "tabuleiro"
 * @param {Object} player1 - estrutura de dados do jogador 1
 * @param {Object} player2 - estrutura de dados do jogador 2
 * @return {null}
*/
function HistoryController(scene, board, player1, player2) {
	PieceController.call(this, scene, board, player1, player2);
};
//--------------------------------------------------------
HistoryController.prototype = Object.create(PieceController.prototype);
HistoryController.prototype.constructor = HistoryController;
//--------------------------------------------------------
HistoryController.prototype.removeFromStack = function(pieceId) {

	if (pieceId < this.p1Discs_end) {

		var nStack = pieceId % this.numberStacks;
		var top = this.p1DiscStacks[nStack].length - 1;

		if (this.p1DiscStacks[nStack][top] == pieceId) {
			this.p1DiscStacks[nStack].pop();
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
		}

		if (this.selectedPiece == pieceId){
			this.selectedPiece = null;
		}
	}
};