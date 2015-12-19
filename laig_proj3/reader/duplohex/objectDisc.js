/**
 * construtor default da classe 'ObjectDisc'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco, Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @param {Number} color - cor da peça para inicialização dos materiais
 * @param {Number} position - posição absoluta da peça
 * @return {null}
 */
function ObjectDisc(scene, color, position) {
	//--------------------------------------------------------
	GamePiece.call(this, scene, position, color);
	//--------------------------------------------------------
	this.cylinder = new MyCylinder(scene, 1.0, 0.65, 0.65, 16, 32);
	this.circle = new MyCircle(scene, 32, 0.65);
};

ObjectDisc.prototype = Object.create(GamePiece.prototype);
ObjectDisc.prototype.constructor = ObjectDisc;

/**
 * desenha a primitva 'ObjectDisc' na respetiva cena
 * @return {null}
 */
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