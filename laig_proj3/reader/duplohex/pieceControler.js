function PieceControler(scene, discs, rings, baseSize, basePos, boxPos) {
	
	MyPrimitive.call(this, scene);

	this.numberDiscs = discs;
	this.numberRings = rings;	
	this.selectedPiece = null;	
	this.baseSize = baseSize;
	this.basePos = basePos;
	this.boxPos = boxPos;

	this.pieces = [];	
	this.blackRingStacks = [];	
	this.blackDiscStacks = [];	
	this.whiteRingStacks = [];	
	this.whiteDiscStacks = [];
	this.creatPieces(discs, rings);	
	
};

PieceControler.prototype = Object.create(MyPrimitive.prototype);
PieceControler.prototype.constructor = PieceControler;

PieceControler.prototype.generateRandom = function() {
	var randomDirection = Math.random() < 0.5 ? 1 : -1;
	return randomDirection * Math.random() * 0.06;
}

PieceControler.prototype.creatPieces = function(nDiscs, nRings) {

	for(var i = 0; i < nDiscs; i++) {

		var nStack = i % 8;

		if(this.blackDiscStacks[nStack] == undefined) {
			this.blackDiscStacks[nStack] = [];
		}
		
		var piecePos = {
			x:  (nStack % 2) * 2.1 + this.generateRandom() + this.boxPos['x'],
			y: 	this.blackDiscStacks[nStack].length * 1.0 + this.boxPos['y'],
			z:  Math.floor(nStack / 2) * 2.1 + this.generateRandom() + this.boxPos['z']
		};

		this.pieces[i] = new ObjectDisc(this.scene, 'black', piecePos);		
		this.blackDiscStacks[nStack].push(i);
	} 

	for(var i = nDiscs; i < nDiscs + nRings; i++) {

		var nStack = (i - nDiscs) % 8;

		if(this.blackRingStacks[nStack] == undefined) {
			this.blackRingStacks[nStack] = [];
		}
		
		var piecePos = {
			x:  (nStack % 2) * 2.1 + this.generateRandom() + 5 + this.boxPos['x'],
			y: 	this.blackRingStacks[nStack].length * 0.9 + this.boxPos['y'],
			z:  Math.floor(nStack / 2) * 2.1 + this.generateRandom() + this.boxPos['z']
		};

		this.pieces[i] = new ObjectRing(this.scene, 'black', piecePos);		
		this.blackRingStacks[nStack].push(i);
	} 

	for(var i = nDiscs + nRings; i < nDiscs*2 + nRings; i++) {

		var nStack = i % 8;

		if(this.whiteDiscStacks[nStack] == undefined) {
			this.whiteDiscStacks[nStack] = [];
		}
		
		var piecePos = {
			x:  -((nStack % 2) * 2.1 + this.generateRandom() + this.boxPos['x']),
			y: 	+(this.whiteDiscStacks[nStack].length * 1.0 + this.boxPos['y']),
			z:  -(Math.floor(nStack / 2) * 2.1 + this.generateRandom() + this.boxPos['z'])
		};

		this.pieces[i] = new ObjectDisc(this.scene, 'white', piecePos);		
		this.whiteDiscStacks[nStack].push(i);
	} 

	for(var i = nDiscs*2 + nRings; i < nDiscs*2 + nRings*2; i++) {

		var nStack = (i - nDiscs) % 8;

		if(this.whiteRingStacks[nStack] == undefined) {
			this.whiteRingStacks[nStack] = [];
		}
		
		var piecePos = {
			x:  -((nStack % 2) * 2.1 + this.generateRandom() + 5 + this.boxPos['x']),
			y: 	+(this.whiteRingStacks[nStack].length * 0.9 + this.boxPos['y']),
			z:  -(Math.floor(nStack / 2) * 2.1 + this.generateRandom() + this.boxPos['z'])
		};

		this.pieces[i] = new ObjectRing(this.scene, 'white', piecePos);	
		this.whiteRingStacks[nStack].push(i);
	} 
}

PieceControler.prototype.display = function() {
	
	this.scene.pushMatrix();
	this.scene.scale(this.baseSize['x']*1.5/5.0, this.baseSize['z']*1.3/5.0, this.baseSize['x']*1.5/5.0);			
		
	for(var i = 0; i < this.pieces.length; i++) {

		this.scene.pushMatrix();	
		if(this.animation != null && this.animationId == i) {
			this.scene.multMatrix(this.animation.update());
		}
		else {
			this.scene.translate(this.pieces[i].position['x'], this.pieces[i].position['y'], this.pieces[i].position['z']);
		}
		this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);			
		this.scene.registerPicking(this.pieces[i]);
		this.pieces[i].display();				
		this.scene.popMatrix();
	}	

	this.scene.popMatrix();
 }


 PieceControler.prototype.placePiece = function(pieceId, x, y)  {
	
	if(pieceId < this.numberDiscs) {
		
		var nStack = pieceId % 8;	
		var top = this.blackDiscStacks[nStack].length - 1;

		if(this.blackDiscStacks[nStack][top] == pieceId) {
			this.blackDiscStacks[nStack].pop();
		} 		

		if(this.selectedPiece == pieceId){		
			this.selectedPiece = null;				
		}	
	}
	else if(pieceId >= this.numberDiscs && pieceId < this.numberDiscs + this.numberRings){			
		
		var nStack = (pieceId - this.numberDiscs) % 8;	
		var top = this.blackRingStacks[nStack].length - 1;
		
		if(this.blackRingStacks[nStack][top] == pieceId) {
			this.blackRingStacks[nStack].pop();
		} 		
		if(this.selectedPiece == pieceId){		
			this.selectedPiece = null;	
		}		
	}
	else if(pieceId >= this.numberDiscs + this.numberRings && pieceId < this.numberDiscs*2 + this.numberRings){			
		
		var nStack = (pieceId - this.numberDiscs + this.numberRings) % 8;	
		var top = this.whiteDiscStacks[nStack].length - 1;
		
		if(this.whiteDiscStacks[nStack][top] == pieceId) {
			this.whiteDiscStacks[nStack].pop();
		} 		
		
		if(this.selectedPiece == pieceId){		
			this.selectedPiece = null;	
		}		
	}
	else {			
		
		var nStack = (pieceId - this.numberDiscs*2 + this.numberRings) % 8;	
		var top = this.whiteRingStacks[nStack].length - 1;
		
		if(this.whiteRingStacks[nStack][top] == pieceId) {
			this.whiteRingStacks[nStack].pop();
		} 		
		
		if(this.selectedPiece == pieceId){		
			this.selectedPiece = null;	
		}		
	}

	var piece = this.pieces[pieceId].setColor('default');
		
	var x2 = (this.baseSize['x']/2 + this.baseSize['x']/4)*2/3*x +  this.baseSize['x']*(this.basePos['x']/1.5);
	var y2 = this.basePos['y'];
	var z2 = -(this.baseSize['z']/2)*2/3*x*Math.cos(30*Math.PI/180) - this.baseSize['z']*y*2/3*Math.cos(30*Math.PI/180) - this.baseSize['z']*(this.basePos['z']/1.5);


	var piecePos = [piece.position['x'], piece.position['y'], piece.position['z']];

	var dist = vec3.dist([x2, y2 + 6, z2], piecePos);
					
	this.animation = new LinearAnimation(dist*0.20, [piecePos, [piece.position['x'], 3.0, piece.position['z']], [x2, y2 + 3, z2], [x2, y2, z2]])
	
	this.animationId = pieceId;
	this.animation.start();	
	
	piece.setPosition(x2, y2, z2);
	piece.setColor();	
}

PieceControler.prototype.update = function(delta) {
	if(this.animationId != null) {		
		this.animation.step(delta);
		
		if (!this.animation.active) {					
			this.animationId = null;
			return 0;			
		}

		return 1;
	}

	return 0;		
}

PieceControler.prototype.unselectActivePiece = function() {
	
	if (this.selectedPiece != null && this.selectedPiece < this.pieces.length) {
		this.pieces[this.selectedPiece].setColor('default');		
	}

	this.selectedPiece = null;
}

PieceControler.prototype.selectPiece = function(pickingId) {

	/*if(this.animation != null && this.animation.active) {
		return null;
	}*/

	if (pickingId >= 50 && pickingId <= 49 + this.pieces.length) {	
		
		var id = pickingId - 50;
		
		if(this.selectedPiece == id) {		
			this.unselectActivePiece();	
			return null;
		}

		if(this.selectedPiece == null){		
			this.selectedPiece = id;				
		}
		else {
			this.pieces[this.selectedPiece].setColor();
		}	

		if(id < this.numberDiscs) {
			var nStack = id % 8;
			var top = this.blackDiscStacks[nStack].length - 1;
			
			if (this.blackDiscStacks[nStack][top] == id || this.blackDiscStacks[nStack].indexOf(id) == -1) {		
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');							
				return id;	
			}
		}
		else if(id >= this.numberDiscs && id < this.numberDiscs + this.numberRings){

			var nStack = (id - this.numberDiscs) % 8;
			var top = this.blackRingStacks[nStack].length - 1;
			if(this.blackRingStacks[nStack][top] == id || this.blackRingStacks[nStack].indexOf(id) == -1) {		
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');					
				return id;	
			}			
		}
		else if(id >= this.numberDiscs + this.numberRings && id < this.numberDiscs*2 + this.numberRings) {
			var nStack = (id - this.numberDiscs + this.numberRings) % 8;
			var top = this.whiteDiscStacks[nStack].length - 1;
			if(this.whiteDiscStacks[nStack][top] == id || this.whiteDiscStacks[nStack].indexOf(id) == -1) {		
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');					
				return id;	
			}			
		}
		else {
			var nStack = (id - this.numberDiscs*2 + this.numberRings) % 8;
			var top = this.whiteRingStacks[nStack].length - 1;
			if(this.whiteRingStacks[nStack][top] == id || this.whiteRingStacks[nStack].indexOf(id) == -1) {		
				this.selectedPiece = id;
				this.pieces[id].setColor('yellow');					
				return id;	
			}			
		}
				
		this.selectedPiece = id;
		this.pieces[id].setColor('red');	
		return -1;						
	}
}