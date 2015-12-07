function ObjectBox(scene, position, color, discs, rings) {
	
	MyPrimitive.call(this, scene);

	this.numberDiscs = discs;
	this.numberRings = rings;
	this.playerColor = color;
	this.posX = position[0];
	this.posY = position[1];
	this.posZ = position[2];

	this.nextDisc = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	}

	this.nextRing = {
		x: 0.0,
		y: 0.0,
		z: 0.0
	}

	this.currentDiscStack = 0;
	this.currentRingStack = 0;
	this.discPicking = {};
	this.ringPicking = {};
	this.discs = [];
	this.rings = [];
	this.discs[0] = [];
	this.rings[0] = [];
	this.cube = new MyCube(scene);

	for (var i = 0; i < this.numberDiscs; i++) {
		this.placeDisc(this.playerColor);
	}

	for (var i = 0; i < this.numberRings; i++) {
		this.placeRing(this.playerColor);
	}
};

ObjectBox.prototype = Object.create(MyPrimitive.prototype);
ObjectBox.prototype.constructor = ObjectBox;

ObjectBox.prototype.generateRandom = function() {
	var randomDirection = Math.random() < 0.5 ? 1 : -1;
	return randomDirection * Math.random() * 0.06;
}

ObjectBox.prototype.placeDisc = function(color) {

	var nextPosition = {
		x: this.nextDisc.z + this.generateRandom(),
		y: this.nextDisc.y,
		z: this.nextDisc.x + this.generateRandom()
	};
		
	this.nextDisc.y = (this.nextDisc.y + 1) % 3;
	var currentStack = this.discs[this.currentDiscStack];

	if (this.nextDisc.y == 0) {
		
		this.nextDisc.x = (this.nextDisc.x + 2) % 6;
		this.currentDiscStack++;
		this.discs[this.currentDiscStack] = [];

		if (this.nextDisc.x == 0) {
			this.nextDisc.z += 2;
		}
	}

	currentStack.push(new ObjectDisc(this.scene, color, nextPosition));
};

ObjectBox.prototype.placeRing = function(color) {

	var nextPosition = {
		x: this.nextRing.z + this.generateRandom(),
		y: this.nextRing.y,
		z: this.nextRing.x + this.generateRandom()
	};
		
	this.nextRing.y = (this.nextRing.y + 1) % 3;
	var currentStack = this.rings[this.currentRingStack];
	
	if (this.nextRing.y == 0) {
		
		this.nextRing.x = (this.nextRing.x + 2) % 6;
		this.currentRingStack++;
		this.rings[this.currentRingStack] = [];

		if (this.nextRing.x == 0) {
			this.nextRing.z += 2;
		}
	}

	currentStack.push(new ObjectRing(this.scene, color, nextPosition));
};

ObjectBox.prototype.removePiece = function(pickingId) {

	if (this.discPicking[pickingId] != undefined) {
		this.removeDisc(pickingId);
	}
	else if (this.ringPicking[pickingId] != undefined) {
		this.removeRing(pickingId);
	}
}

ObjectBox.prototype.removeDisc = function(pickingId) {
	
	var currentStack = this.discPicking[pickingId];
	
	if (this.discs[currentStack].length > 0) {
		this.discs[currentStack].pop();
		this.numberDiscs--;
	}
	else {
		delete this.discs[currentStack];
	}
}

ObjectBox.prototype.removeRing = function(pickingId) {

	var currentStack = this.ringPicking[pickingId];
	
	if (this.rings[currentStack].length > 0) {
		this.rings[currentStack].pop();
		this.numberRings--;
	}
	else {
		delete this.rings[currentStack];
	}
};

ObjectBox.prototype.getRings = function() {
	return this.numberRings;
}

ObjectBox.prototype.getDiscs = function() {
	return this.numberDiscs;
}

ObjectBox.prototype.display = function() {

	this.scene.translate(this.posX, this.posY, this.posZ);
	this.scene.pushMatrix();		
		this.scene.translate(0.0, 0.0, 11.0);
		this.scene.scale(18.0, 2.0, 1.0);
		this.cube.display();		
		this.scene.translate(0.0, 0.0, -11.0);
		this.cube.display();
		this.scene.translate(0.0, 0.0, 1.0);
		this.scene.scale(1.0/18.0, 1.0, 10.0);
		this.cube.display();
		this.scene.translate(17.0, 0.0, 0.0);
		this.cube.display();
		this.scene.translate(-8.1, 0.0, 0.0);
		this.scene.scale(0.8, 1.0, 1.0);
		this.cube.display();
	this.scene.popMatrix();	
	this.scene.translate(5.0, 0.0, 5.0);

	for (var i = 0; i < this.discs.length; i++) {

		var currentStack = this.discs[i];
		var numberPieces = this.discs[i].length;
		var j = 0;

		for (; j < numberPieces; j++) {
			
			var currentPosition = currentStack[j].position;
			this.scene.translate(currentPosition.x, currentPosition.y, currentPosition.z);
			this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);

			if (j == numberPieces -1) {
				this.discPicking[this.scene.registerPicking(currentStack[j])] = i;
			}
			else {
				this.scene.defaultPicking();
			}

			currentStack[j].display();	

			this.scene.rotate(Math.PI/2, 1.0, 0.0, 0.0);		
			this.scene.translate(-currentPosition.x, -currentPosition.y, -currentPosition.z);
		}
	}

	this.scene.translate(10.0, 0.0, 0.0);

	for (var i = 0; i < this.rings.length; i++) {

		var currentStack = this.rings[i];
		var numberPieces = this.rings[i].length;
		var j = 0;

		for (; j < numberPieces; j++) {
			
			var currentPosition = currentStack[j].position;
			this.scene.translate(currentPosition.x, currentPosition.y, currentPosition.z);
			this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);

			if (j == numberPieces -1) {
				this.ringPicking[this.scene.registerPicking(currentStack[j])] = i;
			}
			else {
				this.scene.defaultPicking();
			}

			currentStack[j].display();	

			this.scene.rotate(Math.PI/2, 1.0, 0.0, 0.0);		
			this.scene.translate(-currentPosition.x, -currentPosition.y, -currentPosition.z);
		}
	}

	this.scene.translate(-5.0, 0.0, -5.0);
	this.scene.translate(-this.posX, -this.posY, -this.posZ);
 };