/**
 * construtor default da classe 'ObjectCube'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectCube(scene) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.rectangle = new MyRectangle(scene, -0.5, 0.5, 0.5, -0.5);
	this.fullAngle = Math.PI;
	this.halfAngle = Math.PI / 2;
};
//--------------------------------------------------------
ObjectCube.prototype = Object.create(MyPrimitive.prototype);
ObjectCube.prototype.constructor = ObjectCube;
//--------------------------------------------------------
ObjectCube.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.translate(0.0, 0.0, 0.5);
	this.rectangle.display();
	this.scene.translate(0.0, 0.0, -1.0);
	this.scene.rotate(-this.fullAngle, 0, 1, 0);
	this.rectangle.display();
	this.scene.rotate(+this.fullAngle, 0, 1, 0);
	this.scene.translate(-0.5, 0.0, 0.5);
	this.scene.rotate(-this.halfAngle, 0, 1, 0);
	this.rectangle.display();
	this.scene.rotate(+this.halfAngle, 0, 1, 0);
	this.scene.translate(1.0, 0.0, 0.0);
	this.scene.rotate(+this.halfAngle, 0, 1, 0);
	this.rectangle.display();
	this.scene.rotate(-this.halfAngle, 0, 1, 0);
	this.scene.translate(-0.5, 0.5, 0.0);
	this.scene.rotate(-this.halfAngle, 1, 0, 0);
	this.rectangle.display();
	this.scene.rotate(+this.halfAngle, 1, 0, 0);
	this.scene.translate(0.0, -1.0, 0.0);
	this.scene.rotate(+this.halfAngle, 1, 0, 0);
	this.rectangle.display();
	this.scene.popMatrix();
 };