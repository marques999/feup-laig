/**
 * construtor default da classe 'objectBox'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectBox(scene) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.cube = new ObjectCube(scene);
};

ObjectBox.prototype = Object.create(MyPrimitive.prototype);
ObjectBox.prototype.constructor = ObjectBox;

/**
 * desenha a primitva 'ObjectBox' na respetiva cena
 * @return {null}
 */
ObjectBox.prototype.display = function() {

	this.scene.pushMatrix()
	this.scene.pushMatrix();
	this.scene.scale(12.0, 2.0, 0.8);
	this.cube.display();
	this.scene.translate(0.0, 0.0, 13.0);
	this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0.0, 0.0, 0.8);
	this.scene.scale(0.8, 2.0, 9.6);
	this.cube.display();
	this.scene.translate(14.0, 0.0, 0.0);
	this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(5.5, 0.0, 0.8);
	this.scene.scale(0.75, 1.7, 10.0);
	this.cube.display();
	this.scene.popMatrix();
	this.scene.popMatrix();
 };