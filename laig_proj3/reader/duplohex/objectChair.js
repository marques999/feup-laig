/**
 * construtor default da classe 'ObjectChair'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectChair(scene) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.cube = new ObjectCube(scene);
	//--------------------------------------------------------
	this.materials = [];
	this.materials["default"] = new CGFappearance(scene);
	//--------------------------------------------------------
	this.materials["wood"] = new CGFappearance(scene);
	this.materials["wood"].setAmbient(0.3, 0.3, 0.3, 1.0);
	this.materials["wood"].setDiffuse(0.4, 0.2, 0.0, 1.0);
	this.materials["wood"].setSpecular(0.4, 0.2, 0.0, 0.1);
	this.materials["wood"].setShininess(120);
	//--------------------------------------------------------
	this.materials["metal"] = new CGFappearance(scene);
	this.materials["metal"].setAmbient(0.4, 0.4, 0.4, 1.0);
	this.materials["metal"].setDiffuse(0.4, 0.4, 0.4, 0.8);
	this.materials["metal"].setSpecular(0.6, 0.6, 0.6, 1.0);
	this.materials["metal"].setShininess(10);
};
//--------------------------------------------------------
ObjectChair.prototype = Object.create(MyPrimitive.prototype);
ObjectChair.prototype.constructor = ObjectChair;
//--------------------------------------------------------
ObjectChair.prototype.display = function() {
	//--------------------------------------------------------
	// perna posterior esquerda
	this.scene.pushMatrix();
	this.scene.translate(-0.85, 0.85, 0.85);
	this.scene.scale(0.3, 2.0, 0.3);
	this.materials["metal"].apply();
	this.cube.display();
	this.scene.popMatrix();
	//--------------------------------------------------------
	// perna posterior direita
	this.scene.pushMatrix();
	this.scene.translate(0.85, 0.85, 0.85);
	this.scene.scale(0.3, 2.0, 0.3);
	this.cube.display();
	this.scene.popMatrix();
	//--------------------------------------------------------
	// perna anterior esquerda
	this.scene.pushMatrix();
	this.scene.translate(-0.85, 0.85, -0.85);
	this.scene.scale(0.3, 2.0, 0.3);
	this.cube.display();
	this.scene.popMatrix();
	//--------------------------------------------------------
	// perna anterior direita
	this.scene.pushMatrix();
	this.scene.translate(0.85, 0.85, -0.85);
	this.scene.scale(0.3, 2.0, 0.3);
	this.cube.display();
	this.scene.popMatrix();
	//--------------------------------------------------------
	// tampo
	this.scene.pushMatrix();
	this.scene.translate(0.0, 2.0, 0.0);
	this.scene.scale(2.0, 0.3, 2.0);
	this.materials["wood"].apply();
	this.cube.display();
	this.scene.popMatrix();
	//--------------------------------------------------------
	// costas
	this.scene.pushMatrix();
	this.scene.translate(0.0, 3.5, -0.85);
	this.scene.scale(2.0, 2.8, 0.3);
	this.cube.display();
	this.scene.popMatrix();
	this.materials["default"].apply();
};