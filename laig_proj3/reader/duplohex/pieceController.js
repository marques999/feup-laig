/**
 @author Carlos Samouco, Diogo Marques
*/
function PieceController(scene, board, player1, player2) {

	MyPrimitive.call(this, scene);
	//--------------------------------------------------------	
	this.numberDiscs = 24;
	this.numberRings = 24;
	//--------------------------------------------------------	
	this.p1Discs = player1.discs;
	this.p1Rings = player1.rings;
	this.p2Discs = player2.discs;
	this.p2Rings = player2.rings;
	this.player1 = player1;
	this.player2 = player2;
	//--------------------------------------------------------	
	this.gameBoard = board;
	this.selectedPiece = null;
	this.baseSize = board.baseSize;
	this.basePos = board.basePos;
	this.boxPos = board.boxPos;
	//--------------------------------------------------------	
	this.pieces = [];
	this.p1RingStacks = [];
	this.p1DiscStacks = [];
	this.p2RingStacks = [];
	this.p2DiscStacks = [];
	//--------------------------------------------------------	
	this.initialize();
};

PieceController.prototype = Object.create(MyPrimitive.prototype);
PieceController.prototype.constructor = PieceController;

PieceController.prototype.generateRandom = function() {
	var randomDirection = Math.random() < 0.5 ? 1 : -1;
	return randomDirection * Math.random() * 0.06;
}

PieceController.prototype.initialize = function() {

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

		var nStack = i % 8;

		if (this.p1DiscStacks[nStack] == undefined) {
			this.p1DiscStacks[nStack] = [];
		}

		this.pieces[i] = new ObjectDisc(this.scene, this.player1.color,
		[
			(nStack % 2) * 2.1 + this.generateRandom() + this.boxPos[0],
			this.p1DiscStacks[nStack].length * 1.0 + this.boxPos[1],
			Math.floor(nStack / 2) * 2.1 + this.generateRandom() + this.boxPos[2]
		]);

		this.p1DiscStacks[nStack].push(i);
	}
	//--------------------------------------------------------	
	for (var i = this.p1Rings_start; i < this.p1Rings_end; i++) {

		var nStack = (i - this.p1Rings_start) % 8;

		if (this.p1RingStacks[nStack] == undefined) {
			this.p1RingStacks[nStack] = [];
		}

		this.pieces[i] = new ObjectRing(this.scene, this.player1.color,
		[
			(nStack % 2) * 2.1 + this.generateRandom() + 5 + this.boxPos[0],
			this.p1RingStacks[nStack].length * 0.9 + this.boxPos[1],
			Math.floor(nStack / 2) * 2.1 + this.generateRandom() + this.boxPos[2]
		]);

		this.p1RingStacks[nStack].push(i);
	}
	//--------------------------------------------------------	
	for (var i = this.p2Discs_start; i < this.p2Discs_end; i++) {

		var nStack = (i - this.p2Discs_start) % 8;

		if (this.p2DiscStacks[nStack] == undefined) {
			this.p2DiscStacks[nStack] = [];
		}

		this.pieces[i] = new ObjectDisc(this.scene, this.player2.color,
		[
			-((nStack % 2) * 2.1 + this.generateRandom() + this.boxPos[0]),
			+(this.p2DiscStacks[nStack].length * 1.0 + this.boxPos[1]),
			-(Math.floor(nStack / 2) * 2.1 + this.generateRandom() + this.boxPos[2])
		]);

		this.p2DiscStacks[nStack].push(i);
	}
	//--------------------------------------------------------	
	for (var i = this.p2Rings_start; i < this.p2Rings_end; i++) {

		var nStack = (i - this.p2Rings_start) % 8;

		if (this.p2RingStacks[nStack] == undefined) {
			this.p2RingStacks[nStack] = [];
		}

		this.pieces[i] = new ObjectRing(this.scene, this.player2.color,
		[
			-((nStack % 2) * 2.1 + this.generateRandom() + 5 + this.boxPos[0]),
			+(this.p2RingStacks[nStack].length * 0.9 + this.boxPos[1]),
			-(Math.floor(nStack / 2) * 2.1 + this.generateRandom() + this.boxPos[2])
		]);

		this.p2RingStacks[nStack].push(i);
	}
}

PieceController.prototype.display = function() {

	this.scene.pushMatrix();
	this.scene.scale(this.baseSize[0]*1.5/5.0, this.baseSize[1]*1.3/5.0, this.baseSize[0]*1.5/5.0);

	for (var i = 0; i < this.pieces.length; i++) {

		this.scene.pushMatrix();
		var piecePosition = this.pieces[i].position;

		if (this.animation != null && this.animationId == i) {
			this.scene.multMatrix(this.animation.update());
		}
		else {
			this.scene.translate(piecePosition[0], piecePosition[1], piecePosition[2]);
		}

		this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);
		this.scene.registerPicking(this.pieces[i]);
		this.pieces[i].display();
		this.scene.popMatrix();
	}
	
	this.scene.popMatrix();
 };

PieceController.prototype.placePiece = function(pieceId, x, y)  {
	//--------------------------------------------------------	
	if (pieceId < this.p1Discs_end) {

		var nStack = pieceId % 8;
		var top = this.p1DiscStacks[nStack].length - 1;

		if (this.p1DiscStacks[nStack][top] == pieceId) {
			this.p1DiscStacks[nStack].pop();
			this.gameBoard.insertDisc(x, y, this.player1);
			this.player1.discs--;
		}

		if (this.selectedPiece == pieceId){
			this.selectedPiece = null;
		}
	}
	//--------------------------------------------------------	
	else if (pieceId >= this.p1Rings_start && pieceId < this.p1Rings_end){

		var nStack = (pieceId - this.p1Rings_start) % 8;
		var top = this.p1RingStacks[nStack].length - 1;

		if (this.p1RingStacks[nStack][top] == pieceId) {
			this.p1RingStacks[nStack].pop();
			this.gameBoard.insertRing(x, y, this.player1);
			this.player1.rings--;
		}

		if (this.selectedPiece == pieceId){
			this.selectedPiece = null;
		}
	}
	//--------------------------------------------------------	
	else if (pieceId >= this.p2Discs_start && pieceId < this.p2Discs_end){

		var nStack = (pieceId - this.p2Discs_start) % 8;
		var top = this.p2DiscStacks[nStack].length - 1;

		if (this.p2DiscStacks[nStack][top] == pieceId) {
			this.p2DiscStacks[nStack].pop();
			this.gameBoard.insertDisc(x, y, this.player2);
			this.player2.discs--;
		}

		if (this.selectedPiece == pieceId){
			this.selectedPiece = null;
		}
	}
	//--------------------------------------------------------	
	else if (pieceId >= this.p2Rings_start && pieceId < this.p2Rings_end) {

		var nStack = (pieceId - this.p2Rings_start) % 8;
		var top = this.p2RingStacks[nStack].length - 1;

		if (this.p2RingStacks[nStack][top] == pieceId) {
			this.p2RingStacks[nStack].pop();
			this.gameBoard.insertRing(x, y, this.player2);
			this.player2.rings--;
		}

		if (this.selectedPiece == pieceId){
			this.selectedPiece = null;
		}
	}
	//--------------------------------------------------------	
	var piece = this.pieces[pieceId];

	piece.setColor('default');

	var x2 = (this.baseSize[0]/2 + this.baseSize[0]/4)*2/3*x +  this.baseSize[0]*(this.basePos[0]/1.5);
	var y2 = this.basePos[1];
	var z2 = -(this.baseSize[1]/2)*2/3*x*Math.cos(30*Math.PI/180) - this.baseSize[1]*y*2/3*Math.cos(30*Math.PI/180) - this.baseSize[1]*(this.basePos[2]/1.5);

	var piecePosition = this.pieces[pieceId].position;
	var dist = vec3.dist([x2, y2 + 6, z2], piecePosition);

	this.animation = new LinearAnimation(dist*0.20, [piecePosition, [piecePosition[0], 3.0, piecePosition[2]], [x2, y2 + 3, z2], [x2, y2, z2]]);
	this.animationId = pieceId;
	this.animation.start();

	piece.setPosition(x2, y2, z2);
	piece.setColor('default');
	piece.place();
}

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

PieceController.prototype.unselectActivePiece = function() {

	if (this.selectedPiece != null && this.selectedPiece < this.pieces.length) {
		this.pieces[this.selectedPiece].setColor('default');
	}

	this.selectedPiece = null;
}

PieceController.prototype.selectPiece = function(pickingId) {

	/*if(this.animation != null && this.animation.active) {
		return null;
	}*/

	if (pickingId >= 50 && pickingId <= 49 + this.pieces.length) {

		this.gameBoard.unselectHints();
		var id = pickingId - 50;

		if (this.selectedPiece == id) {
			this.unselectActivePiece();
			return -1;
		}

		if (this.selectedPiece == null){
			this.selectedPiece = id;
		}
		else {
			this.pieces[this.selectedPiece].setColor('default');
		}

		if (id < this.p1Discs_end) {
			// player1 disc
			var nStack = id % 8;
			var top = this.p1DiscStacks[nStack].length - 1;

			if (this.p1DiscStacks[nStack][top] == id || this.p1DiscStacks[nStack].indexOf(id) == -1) {
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');		
				this.gameBoard.updatePlaceHints(id);
				return id;
			}
		}
		else if (id >= this.p1Rings_start && id < this.p1Rings_end){
			// player 1 ring
			var nStack = (id - this.p1Rings_start) % 8;
			var top = this.p1RingStacks[nStack].length - 1;

			if (this.p1RingStacks[nStack][top] == id || this.p1RingStacks[nStack].indexOf(id) == -1) {
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');
				this.gameBoard.updatePlaceHints(id);
				return id;
			}
		}
		else if (id >= this.p2Discs_start && id < this.p2Discs_end) {
			// player 2 discs
			var nStack = (id - this.p2Discs_start) % 8;
			var top = this.p2DiscStacks[nStack].length - 1;

			if (this.p2DiscStacks[nStack][top] == id || this.p2DiscStacks[nStack].indexOf(id) == -1) {
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');
				this.gameBoard.updatePlaceHints(id);
				return id;
			}
		}
		else {
			// player 2 rings
			var nStack = (id - this.p2Rings_start) % 8;
			var top = this.p2RingStacks[nStack].length - 1;

			if(this.p2RingStacks[nStack][top] == id || this.p2RingStacks[nStack].indexOf(id) == -1) {
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');
				this.gameBoard.updatePlaceHints(id);
				return id;
			}
		}

		this.selectedPiece = id;
		this.pieces[id].setColor('red');
		return -1;
	}
}