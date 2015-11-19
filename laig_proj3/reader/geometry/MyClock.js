/**
 * construtor default da classe 'MyTailBooster'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function MyClock(scene) {

	MyPrimitive.call(this, scene);

	for (var i = 0; i < 10; i++) {
		this.DIGITS[i] = new MyClockDigit(scene, 0.1 * i, 0.1 * (i + 1));
	}
};

MyClock.prototype = Object.create(MyPrimitive.prototype);
MyClock.prototype.constructor = MyTailBooster;

/**
 * desenha a primitva 'MyTailBooster' na XMLScene correspondente
 * @return {null}
 */
MyClock.prototype.display = function() {
	this.THRUSTER.apply();
	this.BOOSTER1.display();
	this.scene.scale(1.0, -1.0, 1.0);
	this.BOOSTER1.display();
};