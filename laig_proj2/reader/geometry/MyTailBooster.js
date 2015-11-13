/**
 * construtor default da classe 'MyTailBooster'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function MyTailBooster(scene) {
	MyPrimitive.call(this, scene);
	this.BOOSTER1 = new MyCylinder(scene, 1, 0.4, 0.7, 20, 20);
};

MyTailBooster.prototype = Object.create(MyPrimitive.prototype);
MyTailBooster.prototype.constructor = MyTailBooster;

/**
 * desenha a primitva 'MyTailBooster' na XMLScene correspondente
 * @return {null}
 */
MyTailBooster.prototype.display = function() {
	this.BOOSTER1.display();
	this.scene.scale(1.0, -1.0, 1.0);
	this.BOOSTER1.display();
};