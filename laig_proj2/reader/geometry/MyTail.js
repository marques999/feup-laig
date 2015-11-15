/**
 * construtor default da classe 'MyTail'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function MyTail(scene) {

	MyPrimitive.call(this, scene);

	var P1_1 = [0.0, 0.0, 0.0, 1.0];
	var P1_2 = [1.0, 0.0, 0.0, 1.0];
	var P1_3 = [2.0, 0.0, 0.0, 1.0];
	var P1_4 = [2.4, 0.0, 0.0, 1.0];
	var P2_1 = [0.0, 1.0, 0.0, 1.0];
	var P2_2 = [1.0, 1.0, 0.0, 1.0];
	var P2_3 = [1.1, 1.0, 0.0, 1.0];
	var P2_4 = [1.5, 1.0, 0.0, 1.0];
	var P3_1 = [0.0, 2.0, 0.0, 1.0];
	var P3_2 = [0.5, 2.0, 0.0, 1.0];
	var P3_3 = [0.7, 2.0, 0.0, 1.0];
	var P3_4 = [0.9, 2.0, 0.0, 1.0];
	var P4_1 = [0.0, 3.0, 0.0, 1.0];
	var P4_2 = [0.2, 3.0, 0.0, 1.0];
	var P4_3 = [0.4, 3.0, 0.0, 1.0];
	var P4_4 = [0.5, 3.0, 0.0, 1.0];

	this.TOP_WING1 = new MyPatch(scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_4 = [0.0, 0.0, 0.0, 1.0];
	P1_3 = [1.0, 0.0, 0.0, 1.0];
	P1_2 = [2.0, 0.0, 0.0, 1.0];
	P1_1 = [2.4, 0.0, 0.0, 1.0];
	P2_4 = [0.0, 1.0, 0.0, 1.0];
	P2_3 = [1.0, 1.0, 0.0, 1.0];
	P2_2 = [1.1, 1.0, 0.0, 1.0];
	P2_1 = [1.5, 1.0, 0.0, 1.0];
	P3_4 = [0.0, 2.0, 0.0, 1.0];
	P3_3 = [0.5, 2.0, 0.0, 1.0];
	P3_2 = [0.7, 2.0, 0.0, 1.0];
	P3_1 = [0.9, 2.0, 0.0, 1.0];
	P4_4 = [0.0, 3.0, 0.0, 1.0];
	P4_3 = [0.2, 3.0, 0.0, 1.0];
	P4_2 = [0.4, 3.0, 0.0, 1.0];
	P4_1 = [0.5, 3.0, 0.0, 1.0];

	this.TOP_WING2 = new MyPatch(scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_1 = [2.4, 0.0, 0.0, 1.0];
	P1_2 = [2.4, 0.0, 0.1, 1.0];
	P1_3 = [2.4, 0.0, 0.15, 1.0];
	P1_4 = [2.4, 0.0, 0.2, 1.0];
	P2_1 = [1.5, 1.0, 0.0, 1.0];
	P2_2 = [1.5, 1.0, 0.1, 1.0];
	P2_3 = [1.5, 1.0, 0.15, 1.0];
	P2_4 = [1.5, 1.0, 0.2, 1.0];
	P3_1 = [0.9, 2.0, 0.0, 1.0];
	P3_2 = [0.9, 2.0, 0.1, 1.0];
	P3_3 = [0.9, 2.0, 0.15, 1.0];
	P3_4 = [0.9, 2.0, 0.2, 1.0];
	P4_1 = [0.5, 3.0, 0.0, 1.0];
	P4_2 = [0.5, 3.0, 0.1, 1.0];
	P4_3 = [0.5, 3.0, 0.15, 1.0];
	P4_4 = [0.5, 3.0, 0.2, 1.0];

	this.TOP_WING_SIDE1 = new MyPatch(scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	this.TOP_WING_SIDE2 = new MyRectangle(scene, 0, 3, 0.2, 0);
	this.TOP_WING_SIDE3 = new MyRectangle(scene, 0, 0.5, 0.2, 0);
	this.RED = new CGFappearance(scene);
	this.METAL = new CGFappearance(scene);
	this.RED.loadTexture("scenes/images/vehicle_red.png");
	this.METAL.loadTexture("scenes/images/vehicle_metal.png");
};

MyTail.prototype = Object.create(MyPrimitive.prototype);
MyTail.prototype.constructor = MyTail;

/**
 * desenha a primitva 'MyTail' na XMLScene correspondente
 * @return {null}
 */
MyTail.prototype.display = function() {

	this.RED.apply();
	this.scene.pushMatrix();
	this.scene.translate(0.0, 0.0, -0.1);
	this.TOP_WING1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0.0, 0.0, 0.1);
	this.TOP_WING2.display();
	this.scene.popMatrix();

	this.METAL.apply();
	this.scene.pushMatrix();
	this.scene.translate(0.0, 0.0, -0.1);
	this.TOP_WING_SIDE1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0.0, 0.0, -0.1);
	this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
	this.TOP_WING_SIDE2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0.0, 3.0, -0.1);
	this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
	this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);
	this.TOP_WING_SIDE3.display();
	this.scene.popMatrix();
 };