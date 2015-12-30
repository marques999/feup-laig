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
	this.defaultAngle = Math.cos(Math.PI / 6);
	this.position = [0.0, 0.0, 0.0];
	this.discId = null;
	this.ringId = null;
	this.selected = false;
	this.value = 0x00;
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
ObjectHexagon.prototype.getDiscId = function() {
	return this.discId;
};
//--------------------------------------------------------
ObjectHexagon.prototype.getRingId = function() {
	return this.ringId;
};
//--------------------------------------------------------
ObjectHexagon.prototype.getDiscColor = function() {

	if ((this.value & 0x03) == 0x01) {
		return 'black';
	}

	if ((this.value & 0x03) == 0x02) {
		return 'white';
	}

	return null;
};
//--------------------------------------------------------
ObjectHexagon.prototype.getRingColor = function() {

	if ((this.value & 0x0C) == 0x04) {
		return 'black';
	}

	if ((this.value & 0x0C) == 0x08) {
		return 'white';
	}

	return null;
};
//--------------------------------------------------------
ObjectHexagon.prototype.getSymbol = function() {
	return this.value;
}
//--------------------------------------------------------
ObjectHexagon.prototype.insertDisc = function(disc) {

	if (disc.getColor() == 'white') {
		this.value |= 0x02;
	}
	else if (disc.getColor() == 'black') {
		this.value |= 0x01;
	}

	this.discId = disc.getId();
};
//--------------------------------------------------------
ObjectHexagon.prototype.insertRing = function(ring) {

	if (ring.getColor() == 'white') {
		this.value |= 0x08;
	}
	else if (ring.getColor() == 'black') {
		this.value |= 0x04;
	}

	this.ringId = ring.getId();
};
//--------------------------------------------------------
ObjectHexagon.prototype.removeDisc = function() {
	this.value &= ~0x03;
};
//--------------------------------------------------------
ObjectHexagon.prototype.removeRing = function() {
	this.value &= ~0x0C;
};
//--------------------------------------------------------
ObjectHexagon.prototype.hasDisc = function() {
	return (this.value & 0x03) == 0x01 || (this.value & 0x03) == 0x02;
};
//--------------------------------------------------------
ObjectHexagon.prototype.hasRing = function() {
	return (this.value & 0x0C) == 0x04 || (this.value & 0x0C) == 0x08;
};
//--------------------------------------------------------
ObjectHexagon.prototype.isEmpty = function() {
	return this.value == 0x00;
};
//--------------------------------------------------------
ObjectHexagon.prototype.isTwopiece = function() {
	return this.hasDisc() && this.hasRing();
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
//--------------------------------------------------------
ObjectHexagon.prototype.reset = function() {
	this.discId = null;
	this.ringId = null;
	this.selected = false;
	this.value = 0x00;
};