/**
 * construtor default da classe 'ObjectDisc'
 * @constructor
 * @augments GamePiece
 * @author Carlos Samouco, Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @param {Number} id - número identificador de picking da peça
 * @param {String} color - cor da peça para inicialização dos materiais
 * @param {Array} position - posição absoluta da peça
 * @return {null}
 */
function ObjectDisc(scene, id, color, position) {
	//--------------------------------------------------------
	GamePiece.call(this, scene, id, position, color);
	//--------------------------------------------------------
	this.cylinder = new MyCylinder(scene, 1.0, 0.65, 0.65, 16, 32);
	this.circle = new MyCircle(scene, 32, 0.65);
};
//--------------------------------------------------------
ObjectDisc.prototype = Object.create(GamePiece.prototype);
ObjectDisc.prototype.constructor = ObjectDisc;
//--------------------------------------------------------
ObjectDisc.prototype.display = function() {
	this.material.apply();
	this.cylinder.display();
	this.scene.translate(0.0, 0.0, 1.0);
	this.circle.display();
	this.scene.translate(0.0, 0.0, -1.0);
	this.scene.scale(1.0, -1.0, -1.0);
	this.circle.display();
	this.scene.scale(1.0, -1.0, -1.0);
};
//--------------------------------------------------------
ObjectDisc.prototype.isDisc = function() {
	return true;
};
//--------------------------------------------------------
ObjectDisc.prototype.isRing = function() {
	return false;
};