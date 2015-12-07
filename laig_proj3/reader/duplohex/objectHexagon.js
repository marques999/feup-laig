/**
 * construtor default da classe 'ObjectHexagon'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectHexagon(scene) {
	this.circle = new MyCircle(scene, 6, 1.0);
	GamePiece.call(this, scene, null);
};

ObjectHexagon.prototype = Object.create(GamePiece.prototype);
ObjectHexagon.prototype.constructor = ObjectHexagon;

ObjectHexagon.prototype.display = function() {
	this.circle.display();
};

ObjectHexagon.prototype.getDisc = function() {
	return this.disc;
}

ObjectHexagon.prototype.getRing = function() {
	return this.ring;
}

ObjectHexagon.prototype.removeDisc = function() {
	this.disc = null;
}

ObjectHexagon.prototype.removeRing = function() {
	this.ring = null;
}

ObjectHexagon.prototype.insertDisc = function(disc) {
	this.disc = disc;
}

ObjectHexagon.prototype.insertRing = function(ring) {
	this.ring = ring;
}

ObjectHexagon.prototype.hasDisc = function() {
	return this.disc != null;
}

ObjectHexagon.prototype.hasRing = function() {
	return this.ring != null;
}