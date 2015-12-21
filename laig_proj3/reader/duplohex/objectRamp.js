/**
 * construtor default da classe 'ObjectRamp'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectRamp(scene) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.defaultSize = 2.5 * Math.cos(Math.PI/4);
	this.triangle1 = new MyTriangle(scene, [0.0, 0.0, 0.0], [0.0, 0.0, this.defaultSize], [0.0, this.defaultSize, 0.0]);
	this.triangle2 = new MyTriangle(scene, [0.0, 0.0, 0.0], [0.0, this.defaultSize, 0.0], [0.0, 0.0, this.defaultSize]);
	this.rectangle = new MyRectangle(scene, 0.0, Math.sqrt(2.5 * 2.5), 0.5, 0.0);
};
//--------------------------------------------------------
ObjectRamp.prototype = Object.create(MyPrimitive.prototype);
ObjectRamp.prototype.constructor = ObjectRamp;
//--------------------------------------------------------
ObjectRamp.prototype.display = function() {
	this.scene.pushMatrix();
	this.triangle1.display();
	this.scene.translate(0.5, 0.0, 0.0);
	this.triangle2.display();
	this.scene.translate(-0.5, 0.0, this.defaultSize);
	this.scene.rotate(Math.PI/4,- 1.0, 0.0, 0.0);
	this.rectangle.display();
	this.scene.popMatrix();
};