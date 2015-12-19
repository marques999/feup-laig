/**
 * construtor default da classe 'ObjectBorder'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @param {Number} size - qwertyuiop asdfghjkl zxcvbnm
 * @param {Number} color - qwertyuiop asdfghjkl zxcvbnm
 * @return {null}
 */
function ObjectBorder(scene, size, color) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.color = color;
	this.numberCells = size - 1;
	this.defaultAngle = Math.sin(Math.PI / 3);
	this.invertedAngle = Math.sin(Math.PI / 6);
	this.defaultTangent = Math.tan(Math.PI / 6);
	this.defaultScale = 0.5 / this.defaultAngle + 2.0 * size * this.defaultAngle;
	this.material = new CGFappearance(scene);
	//--------------------------------------------------------
	this.plane = new ObjectPlane(scene, 16);
	this.rectangle = new MyRectangle(scene, 0.0, 0.5, this.defaultScale, 0.0);
	this.triangle = new MyTriangle(scene, [0.0, 0.0, 0.0], [2.0 * this.defaultAngle, 0.0, 0.0], [this.defaultAngle, 0.5, 0.0]);
	this.halfTriangle = new MyTriangle(scene, [0.0, 0.0, 0.0], [0.5 / this.defaultAngle, 0.0, 0.0], [0.5 * this.defaultAngle, 0.5 * this.invertedAngle, 0.0]);
	this.halfTriangle2 = new MyTriangle(scene, [0.0, 0.0, 0.0], [0.5 / this.defaultAngle, 0.0, 0.0], [0.5 * this.defaultTangent * this.invertedAngle, 0.5 * this.defaultTangent * this.defaultAngle, 0.0]);
	this.customCircle1 = new CustomCircle(scene, 20, 0.5, Math.PI / 6);
	this.customCircle2 = new CustomCircle(scene, 20, 0.5, Math.PI / 3);
	this.customCylinder1 = new CustomCylinder(scene, 0.5, 0.5, 0.5, 20, 20, Math.PI / 6);
	this.customCylinder2 = new CustomCylinder(scene, 0.5, 0.5, 0.5, 20, 20, Math.PI / 3);
	//--------------------------------------------------------
	if (color == 'white') {
		this.material.setDiffuse(0.95, 0.95, 0.95, 0.6);
		this.material.setAmbient(0.95, 0.95, 0.95, 0.2);
		this.material.setSpecular(1.0, 1.0, 1.0, 0.5);
		this.material.setShininess(30);
	}
	else {
		this.material.setDiffuse(0.05, 0.05, 0.05, 0.6);
		this.material.setAmbient(0.05, 0.05, 0.05, 0.2);
		this.material.setSpecular(1.0, 1.0, 1.0, 0.5);
		this.material.setShininess(30);
	}
};

ObjectBorder.prototype = Object.create(MyPrimitive.prototype);
ObjectBorder.prototype.constructor = ObjectBorder;

/**
 * inicializa os buffers WebGL da primitiva 'ObjectBorder'
 * @return {null}
 */
ObjectBorder.prototype.display = function() {

	this.scene.pushMatrix();
		this.material.apply();
		this.scene.rotate(Math.PI / 2, 1.0, 0.0, 0.0);
		this.scene.translate(0.0, -0.5, 0.5);
		this.rectangle.display();
		this.scene.translate(0.0, 0.5, -0.5);
		this.scene.rotate(Math.PI / 2, -1.0, 0.0, 0.0);
		this.scene.scale(this.defaultScale, 0.5, 1.0);
		this.scene.translate(0.5, -0.5, 0.0);
		this.plane.display();
	this.scene.popMatrix();

	if (this.color == 'white') {
		this.displayWhite();
	}
	else {
		this.displayBlack();
	}
};

ObjectBorder.prototype.displayBlack = function() {

	this.scene.pushMatrix();
		this.scene.rotate(4 * Math.PI / 3, 0.0, 0.0, 1.0);
		this.customCircle1.display();
		this.scene.translate(0.0, 0.0, -0.5);
		this.customCylinder1.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
	this.halfTriangle2.display();
	this.scene.translate(0.5 /this.defaultAngle, 0.0, 0.0);

	for (var i = 0; i < this.numberCells; i++) {
		this.triangle.display();
		this.scene.translate(2 * this.defaultAngle, 0.0, 0.0);
	}

	this.triangle.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(this.defaultScale, 0.0, 0.0);
		this.scene.rotate(Math.PI / 2, 0.0, 0.0, -1.0);
		this.customCircle2.display();
		this.scene.translate(0.0, 0.0, -0.5);
		this.customCylinder2.display();
	this.scene.popMatrix();
};

ObjectBorder.prototype.displayWhite = function() {

	this.scene.pushMatrix();
		this.scene.translate(this.defaultScale, 0.0, 0.0);
		this.scene.rotate(Math.PI / 2, 0.0, 0.0, -1.0);
		this.customCircle1.display();
		this.scene.translate(0.0, 0.0, -0.5);
		this.customCylinder1.display();
	this.scene.popMatrix();
	this.scene.pushMatrix();
	this.triangle.display();

	for (var i = 0; i < this.numberCells; i++) {
		this.scene.translate(2.0 * this.defaultAngle, 0.0, 0.0);
		this.triangle.display();
	}

	this.scene.translate(2.0 * this.defaultAngle, 0.0, 0.0);
	this.halfTriangle.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(5 * Math.PI / 6, 0.0, 0.0, -1.0);
		this.customCircle2.display();
		this.scene.translate(0.0, 0.0, -0.5);
		this.customCylinder2.display();
	this.scene.popMatrix();
};