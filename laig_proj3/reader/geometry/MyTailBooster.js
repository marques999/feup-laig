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
	this.THRUSTER = new CGFappearance(scene);
	this.THRUSTER.loadTexture("scenes/images/vehicle_thruster.png");
};
//--------------------------------------------------------
MyTailBooster.prototype = Object.create(MyPrimitive.prototype);
MyTailBooster.prototype.constructor = MyTailBooster;
//--------------------------------------------------------
MyTailBooster.prototype.display = function() {
	this.THRUSTER.apply();
	this.BOOSTER1.display();
	this.scene.scale(1.0, -1.0, 1.0);
	this.BOOSTER1.display();
};