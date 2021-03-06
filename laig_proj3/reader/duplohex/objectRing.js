/**
 * construtor default da classe 'ObjectRing'
 * @constructor
 * @augments GamePiece
 * @author Carlos Samouco, Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @param {Number} id - número identificador de picking da peça
 * @param {String} color - cor da peça para inicialização dos materiais
 * @param {Array} position - posição absoluta da peça
 * @return {null}
 */
function ObjectRing(scene, id, color, position) {
	//--------------------------------------------------------
	GamePiece.call(this, scene, id, position, color);
	//--------------------------------------------------------
	this.invertedCylinder = new MyCylinderInverted(scene, 0.9, 1.0, 1.0, 16, 32);
	this.cylinder = new MyCylinder(scene, 0.9, 1.0, 1.0, 16, 32);
	this.hole = new MyCircleHole(scene, 32, 0.35);
};
//--------------------------------------------------------
ObjectRing.prototype = Object.create(GamePiece.prototype);
ObjectRing.prototype.constructor = ObjectRing;
//--------------------------------------------------------
ObjectRing.prototype.display = function() {
	this.material.apply();
	this.scene.pushMatrix();
	this.scene.translate(0.0, 0.0, 0.85);
	this.hole.display();
	this.scene.translate(0.0, 0.0, -0.85);
	this.cylinder.display();
	this.scene.scale(1.0, -1.0, -1.0);
	this.hole.display();
	this.scene.scale(0.65, -0.65, -1.0);
	this.invertedCylinder.display();
	this.scene.popMatrix();
};
//--------------------------------------------------------
ObjectRing.prototype.isDisc = function() {
	return false;
};
//--------------------------------------------------------
ObjectRing.prototype.isRing = function() {
	return true;
};