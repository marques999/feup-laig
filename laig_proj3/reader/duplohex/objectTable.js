/**
 * construtor default da classe 'ObjectTable'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectTable(scene) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.cube = new ObjectCube(scene);
	//--------------------------------------------------------
	this.materials = [];
	this.materials["default"] = new CGFappearance(scene);
	//--------------------------------------------------------
	this.materials["wood"] = new CGFappearance(scene);
	this.materials["wood"].setAmbient(0.5, 0.5, 0.5, 1.0);
	this.materials["wood"].setDiffuse(0.8, 0.8, 0.8, 1.0);
	this.materials["wood"].setSpecular(0.8, 0.8, 0.8, 0.2);
	this.materials["wood"].setShininess(40);
	this.materials["wood"].loadTexture("../scenes/images/table.png");
	//--------------------------------------------------------
	this.materials["metal"] = new CGFappearance(scene);
	this.materials["metal"].setAmbient(0.4, 0.4, 0.4, 1.0);
	this.materials["metal"].setDiffuse(0.4, 0.4, 0.4, 0.8);
	this.materials["metal"].setSpecular(0.6, 0.6, 0.6, 1.0);
	this.materials["metal"].setShininess(10);
};
//--------------------------------------------------------
ObjectTable.prototype = Object.create(MyPrimitive.prototype);
ObjectTable.prototype.constructor = ObjectTable;
//--------------------------------------------------------
ObjectTable.prototype.display = function() {
	this.scene.pushMatrix();
	this.materials["metal"].apply();
	this.scene.scale(0.3, 3.5, 0.3);
	this.scene.translate(-2.35/0.3, 1.75/3.5, 1.35/0.3);
	this.cube.display();
	this.scene.translate(4.7/0.3, 0.0, 0.0);
	this.cube.display();
	this.scene.translate(-4.7/0.3, 0.0, -2.7/0.3);
	this.cube.display();
	this.scene.translate(4.7/0.3, 0.0, 0.0);
	this.cube.display();
	this.scene.scale(1.0/0.3, 1.0/3.5, 1.0/0.3);
	this.scene.translate(-2.35, 1.75, 1.35);
	this.scene.scale(5.0, 0.5, 3.0);
	this.materials["wood"].apply();
	this.cube.display();
	this.scene.popMatrix();
	this.materials["default"].apply();
};