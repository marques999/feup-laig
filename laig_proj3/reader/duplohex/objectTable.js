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
	this.wood = new CGFappearance(scene);
	this.wood.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.wood.setDiffuse(0.8, 0.8, 0.8, 1.0);
	this.wood.setSpecular(0.8, 0.8, 0.8, 0.2);
	this.wood.setShininess(40);
	this.wood.loadTexture("../scenes/images/table.png");
	//--------------------------------------------------------
	this.metal = new CGFappearance(scene);
	this.metal.setAmbient(0.4, 0.4, 0.4, 1.0);
	this.metal.setDiffuse(0.4, 0.4, 0.4, 0.8);
	this.metal.setSpecular(0.6, 0.6, 0.6, 1.0);
	this.metal.setShininess(10);
};

ObjectTable.prototype = Object.create(MyPrimitive.prototype);
ObjectTable.prototype.constructor = ObjectTable;

/**
 * desenha a primitva 'ObjectTable' na respetiva cena
 * @return {null}
 */
ObjectTable.prototype.display = function() {
	//--------------------------------------------------------
	this.scene.pushMatrix();
	this.scene.translate(-2.35, 1.75, 1.35);
	this.scene.scale(0.3, 3.5, 0.3);
	this.metal.apply();
	this.cube.display();
	this.scene.popMatrix();
	//--------------------------------------------------------
	this.scene.pushMatrix();
	this.scene.translate(2.35, 1.75, 1.35);
	this.scene.scale(0.3, 3.5, 0.3);
	this.cube.display();
	this.scene.popMatrix();
	//--------------------------------------------------------
	this.scene.pushMatrix();
	this.scene.translate(-2.35, 1.75, -1.35);
	this.scene.scale(0.3, 3.5, 0.3);
	this.cube.display();
	this.scene.popMatrix();
	//--------------------------------------------------------
	this.scene.pushMatrix();
	this.scene.translate(2.35, 1.75, -1.35);
	this.scene.scale(0.3, 3.5, 0.3);
	this.cube.display();
	this.scene.popMatrix();
	//--------------------------------------------------------
	this.scene.pushMatrix();
	this.scene.translate(0.0, 3.65, 0.0);
	this.scene.scale(5.0, 0.3, 3.0);
	this.wood.apply();
	this.cube.display();
	this.scene.popMatrix();
};