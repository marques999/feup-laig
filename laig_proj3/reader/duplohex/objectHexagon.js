/**
 * construtor default da classe 'ObjectHexagon'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco, Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectHexagon(scene) {
	
	GamePiece.call(this, scene, null);
	//--------------------------------------------------------	
	this.circle = new MyCircle(scene, 6, 1.0);
	this.selected = false;
	this.disc = null;
	this.ring = null;
};

ObjectHexagon.prototype = Object.create(GamePiece.prototype);
ObjectHexagon.prototype.constructor = ObjectHexagon;

ObjectHexagon.prototype.display = function() {
	this.circle.display();
};

ObjectHexagon.prototype.getDisc = function() {
	return this.disc;
};

ObjectHexagon.prototype.getRing = function() {
	return this.ring;
};

ObjectHexagon.prototype.removeDisc = function() {
	this.disc = null;
};

ObjectHexagon.prototype.removeRing = function() {
	this.ring = null;
};

ObjectHexagon.prototype.setDisc = function(disc) {
	this.disc = disc;
};

ObjectHexagon.prototype.setRing = function(ring) {
	this.ring = ring;
};

ObjectHexagon.prototype.hasDisc = function() {
	return this.disc != null;
};

ObjectHexagon.prototype.hasRing = function() {
	return this.ring != null;
};

ObjectHexagon.prototype.isEmpty = function() {
	return this.disc == null && this.ring == null;
};

ObjectHexagon.prototype.isTwopiece = function() {
	return this.disc != null && this.ring != null;
}

ObjectHexagon.prototype.isSingle = function() {
	return !this.isEmpty && !this.isTwopiece;
}

ObjectHexagon.prototype.select = function() {
	this.selected = true;
}

ObjectHexagon.prototype.unselect = function() {
	this.selected = false;
}