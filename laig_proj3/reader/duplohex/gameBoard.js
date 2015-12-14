/**
 * construtor default da classe 'GameBoard'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function GameBoard(scene) {

	MyPrimitive.call(this, scene);

	//--------------------------------------------------------	
	
	this.elapsedMillis = 0.0;
	this.baseSize = {
			x:  5.0,						
			z:  5.0
	};
	this.basePos = {
			x:  -2.25,			
			y:  0.0,
			z:  -4.5*Math.cos(30*Math.PI/180)
	};
	this.boxPos = {
			x:  4,			
			y:  -0.4,
			z:  17
	};	
	this.currentId = 0;
	this.numberRows = 7;
	this.numberColumns = 7;
	this.numberCells = this.numberRows * this.numberColumns;
	//--------------------------------------------------------

	this.player1 = {
		color: 'white',
		discs: 24,
		rings: 24,
		next: true
	}

	this.player2 = {
		color: 'black',
		discs: 24,
		rings: 24,
		next: false
	}
	//--------------------------------------------------------

	this.hexagon = new MyCircle(scene, 6);
	this.cylinder = new MyCylinder(scene, 1.0, 1.0, 1.0, 20, 6);
	this.base = new MyRectangle(scene, 0.0, 1.0, 1.0, 0.0);		
	this.box = new ObjectBox(scene);
	this.pieces = new PieceControler(scene, 19, 19, this.baseSize, this.basePos, this.boxPos);	
	this.cells = [];
	this.clock = new ObjectClock(scene);
	this.score1 = new ObjectScore(scene);
	this.score2 = new ObjectScore(scene);
	this.animationActive = 0;
	//--------------------------------------------------------

	this.hexTexture = new CGFtexture(this.scene, "scenes/images/hexagon.png");
	this.hoverTexture = new CGFtexture(this.scene, "scenes/images/hexagon_hover.png");
	this.baseTexture = new CGFtexture(this.scene, "scenes/images/hex_board.png");
	//--------------------------------------------------------

	this.gameModes = ['pvp', 'pvb', 'bvb'];
	this.gameBoard = ['default', 'small', 'diagonal'];

	this.gameSettings = {
		mode: 'pvp',
		board: 'default',
		difficulty: 0,
	};

	this.defaultMaterial = new CGFappearance(scene);
	/*this.HEX_MATERIAL = new CGFappearance(scene);
	this.HEX_MATERIAL.setSpecular(0.2, 0.2, 0.2, 0.6);
	this.HEX_MATERIAL.setDiffuse(0.2, 0.2, 0.2, 0.8);
	this.HEX_MATERIAL.setAmbient(0.1, 0.1, 0.1, 0.2);
	this.HEX_MATERIAL.setTexture(this.hexTexture);*/

	for (var i = 0; i < this.numberCells; i++) {
		this.cells[i] = new ObjectHexagon(scene);
		this.cells[i].setCoords(~~(i / this.numberColumns), i % this.numberRows, 0.0);
	}	
};

GameBoard.prototype = Object.create(MyPrimitive.prototype);
GameBoard.prototype.constructor = GameBoard;

/**
 * desenha a primitva 'gameBoard' na XMLScene correspondente
 * @return {null}
 */
GameBoard.prototype.display = function() {

	this.scene.resetPicking();
	this.currentId = 0;
		
	this.scene.pushMatrix();
	this.scene.scale(this.baseSize['x'], 1.0, this.baseSize['z']); 
	this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);
	this.scene.translate(this.basePos['x'], this.basePos['z'], this.basePos['y']);
		
	for (var i = 0; i < this.numberCells; i++) {

		var x = ~~(i / this.numberColumns);
		var y = i % this.numberRows;
		var currentPosition = this.cells[i].position;

		this.scene.pushMatrix();
			this.scene.translate(currentPosition.x, currentPosition.y, currentPosition.z);
			this.scene.scale(0.5, 0.5, 0.5);
			this.scene.registerPicking(this.cells[i]);

			if (this.selectedCelldId == i + 1) {
				this.hoverTexture.bind();
				this.cells[i].display();
				this.hoverTexture.unbind();
				}
			else {
				this.hexTexture.bind();
				this.cells[i].display();
				this.hexTexture.unbind();
			}

			if(y == 0 || x == 0 || y == 6 || x == 6) {	
				this.scene.translate(0.0, 0.0, -1.0);					
				this.cylinder.display();

			}
		this.scene.popMatrix();
	}
	
	this.scene.popMatrix();
	this.pieces.display();
	this.defaultMaterial.apply();

	this.scene.pushMatrix();						
		this.scene.scale(this.baseSize['x']*8.0, 1.0, this.baseSize['z']*16.0);	
		this.scene.translate(-0.5, -0.5, 0.5);					
		this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);		
		this.scene.registerPicking(this.base);			
		this.base.display();	
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-12.0, 4.0, 0.0);
		this.clock.display();
		this.scene.translate(6.0, 0.0, 0.0);
		this.score1.display();
		this.scene.translate(0.0, 4.0, 0.0);
		this.score2.display();
		this.scene.translate(6.0, -8.0, 0.0);
	this.scene.popMatrix();

	this.scene.pushMatrix();
		//this.box.display();		
	this.scene.popMatrix();
};

GameBoard.prototype.setPlayer1 = function(playerState) {
	this.player1.discs = playerState.discs;
	this.player1.rings = playerState.rings;
	console.log(this.player1.discs);
	console.log(this.player1.rings);
};

GameBoard.prototype.update = function(currTime, lastUpdate) {
	
	this.clock.update(currTime, lastUpdate);
	this.elapsedMillis += currTime - lastUpdate;
	this.score1.update(this.player1.discs, this.player1.rings);
	this.score2.update(this.player2.discs, this.player2.rings);

	var res = this.pieces.update((currTime - lastUpdate)*0.001); 

	if(this.animationActive == 1 && res == 0) {
		this.animationActive = 0;
		this.selectedCelldId = null;
		this.selectedPieceId = null;		
	}
	else if(this.animationActive == 0 && res == 1) {
		this.animationActive = 1;
	}
	
}

GameBoard.prototype.updatePicking = function(selectedId) {
	
	if (this.animationActive) {
		return;
	}

	var id = this.pieces.selectPiece(selectedId);
		
	if(id == null) {
		
		if(selectedId < 50) {
			this.selectedCelldId = selectedId;	
		}		
	}
	else {
		this.selectedPieceId = id;
	} 

	if(this.selectedPieceId == -1 && this.selectedCelldId != null) {
		this.selectedCelldId = null;
		this.selectedPieceId = null;
		this.pieces.unselectActivePiece();
	}

	if(this.selectedPieceId != null && this.selectedCelldId != null) {
		this.pieces.placePiece(this.selectedPieceId, Math.floor((this.selectedCelldId - 1)/7), (this.selectedCelldId - 1) % 7);			
	}
}