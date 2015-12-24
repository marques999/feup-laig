/**
 * construtor default da classe 'ObjectHexagon'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco, Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectHexagon(scene) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.circle = new MyCircle(scene, 6, 1.0);
	//--------------------------------------------------------
	this.defaultAngle = Math.cos(Math.PI/6);
	this.position = [0.0, 0.0, 0.0];
	this.selected = false;
	this.disc = null;
	this.ring = null;
};
//--------------------------------------------------------
ObjectHexagon.prototype = Object.create(MyPrimitive.prototype);
ObjectHexagon.prototype.constructor = ObjectHexagon;
//--------------------------------------------------------
ObjectHexagon.prototype.setCoords = function(coordX, coordY, coordZ) {
	this.position[0] = coordX * 0.75;
	this.position[1] = coordY * this.defaultAngle + 0.5 * coordX * this.defaultAngle;
	this.position[2] = coordZ;
};
//--------------------------------------------------------
ObjectHexagon.prototype.display = function() {
	this.circle.display();
};
//--------------------------------------------------------
ObjectHexagon.prototype.getDisc = function() {
	return this.disc;
};
//--------------------------------------------------------
ObjectHexagon.prototype.getRing = function() {
	return this.ring;
};
//--------------------------------------------------------
ObjectHexagon.prototype.removeDisc = function() {
	this.disc = null;
};
//--------------------------------------------------------
ObjectHexagon.prototype.removeRing = function() {
	this.ring = null;
};
//--------------------------------------------------------
ObjectHexagon.prototype.insertDisc = function(disc) {
	this.disc = disc.color;
};
//--------------------------------------------------------
ObjectHexagon.prototype.insertRing = function(ring) {
	this.ring = ring.color;
};
//--------------------------------------------------------
ObjectHexagon.prototype.hasDisc = function() {
	return this.disc != null;
};
//--------------------------------------------------------
ObjectHexagon.prototype.hasRing = function() {
	return this.ring != null;
};
//--------------------------------------------------------
ObjectHexagon.prototype.isEmpty = function() {
	return this.disc == null && this.ring == null;
};
//--------------------------------------------------------
ObjectHexagon.prototype.isTwopiece = function() {
	return this.disc != null && this.ring != null;
};
//--------------------------------------------------------
ObjectHexagon.prototype.isSingle = function() {
	return !this.isEmpty && !this.isTwopiece;
};
//--------------------------------------------------------
ObjectHexagon.prototype.select = function() {
	this.selected = true;
};
//--------------------------------------------------------
ObjectHexagon.prototype.unselect = function() {
	this.selected = false;
};
ObjectHexagon.prototype.reset = function() {
	this.selected = false;
	this.disc = null;
	this.ring = null;
};