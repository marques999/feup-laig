/**
 * construtor default da classe 'MyVehicleBody'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function MyVehicleBody(scene) {

	MyPrimitive.call(this, scene);

	var P1_1 = [3.0, 0.0, 0.0, 1.0];
	var P1_2 = [2.0, 0.0, 0.0, 1.0];
	var P1_3 = [1.0, 0.0, 0.0, 1.0];
	var P1_4 = [0.0, 0.0, 0.0, 1.0];
	var P2_1 = [3.0, 1.0, 1.0, 1.0];
	var P2_2 = [2.0, 1.0, 1.0, 1.0];
	var P2_3 = [1.0, 1.0, 1.0, 1.0];
	var P2_4 = [0.0, 1.0, 1.0, 1.0];
	var P3_1 = [3.0, 1.0, 2.0, 1.0];
	var P3_2 = [2.0, 1.0, 2.0, 1.0];
	var P3_3 = [1.0, 1.0, 2.0, 1.0];
	var P3_4 = [0.0, 1.0, 2.0, 1.0];
	var P4_1 = [3.0, 0.0, 3.0, 1.0];
	var P4_2 = [2.0, 0.0, 3.0, 1.0];
	var P4_3 = [1.0, 0.0, 3.0, 1.0];
	var P4_4 = [0.0, 0.0, 3.0, 1.0];

	this.TOP = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P4_1, P4_2, P4_3, P4_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P1_1, P1_2, P1_3, P1_4]
	]);

	P1_1 = [3.0, 0.0, 0.0, 1.0];
	P1_2 = [2.0, 0.0, 0.0, 1.0];
	P1_3 = [1.0, 0.0, 0.0, 1.0];
	P1_4 = [0.0, 0.0, 0.0, 1.0];
	P2_1 = [3.0, -0.5, 1.0, 1.0];
	P2_2 = [2.0, -0.5, 1.0, 1.0];
	P2_3 = [1.0, -0.5, 1.0, 1.0];
	P2_4 = [0.0, -0.5, 1.0, 1.0];
	P3_1 = [3.0, -0.5, 2.0, 1.0];
	P3_2 = [2.0, -0.5, 2.0, 1.0];
	P3_3 = [1.0, -0.5, 2.0, 1.0];
	P3_4 = [0.0, -0.5, 2.0, 1.0];
	P4_1 = [3.0, 0.0, 3.0, 1.0];
	P4_2 = [2.0, 0.0, 3.0, 1.0];
	P4_3 = [1.0, 0.0, 3.0, 1.0];
	P4_4 = [0.0, 0.0, 3.0, 1.0];

	this.DOWN = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_1 = [3.0, 3.0, 0.0, 1.0];
	P1_2 = [2.0, 3.0, 0.0, 1.0];
	P1_3 = [1.0, 3.0, 0.0, 1.0];
	P1_4 = [0.0, 3.0, 0.0, 1.0];
	P2_1 = [3.0, 2.0, -0.8, 1.0];
	P2_2 = [2.0, 2.0, -0.8, 1.0];
	P2_3 = [1.0, 2.0, -0.8, 1.0];
	P2_4 = [0.0, 2.0, -0.8, 1.0];
	P3_1 = [3.0, 1.0, -0.8, 1.0];
	P3_2 = [2.0, 1.0, -0.8, 1.0];
	P3_3 = [1.0, 1.0, -0.8, 1.0];
	P3_4 = [0.0, 1.0, -0.8, 1.0];
	P4_1 = [3.0, 0.0, 0.0, 1.0];
	P4_2 = [2.0, 0.0, 0.0, 1.0];
	P4_3 = [1.0, 0.0, 0.0, 1.0];
	P4_4 = [0.0, 0.0, 0.0, 1.0];

	this.LEFT = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_1 = [0.0, 3.0, 0.0, 1.0];
	P1_2 = [1.0, 3.0, 0.0, 1.0];
	P1_3 = [2.0, 3.0, 0.0, 1.0];
	P1_4 = [3.0, 3.0, 0.0, 1.0];
	P2_1 = [0.0, 2.0, 0.8, 1.0];
	P2_2 = [1.0, 2.0, 0.8, 1.0];
	P2_3 = [2.0, 2.0, 0.8, 1.0];
	P2_4 = [3.0, 2.0, 0.8, 1.0];
	P3_1 = [0.0, 1.0, 0.8, 1.0];
	P3_2 = [1.0, 1.0, 0.8, 1.0];
	P3_3 = [2.0, 1.0, 0.8, 1.0];
	P3_4 = [3.0, 1.0, 0.8, 1.0];
	P4_1 = [0.0, 0.0, 0.0, 1.0];
	P4_2 = [1.0, 0.0, 0.0, 1.0];
	P4_3 = [2.0, 0.0, 0.0, 1.0];
	P4_4 = [3.0, 0.0, 0.0, 1.0];

	this.RIGHT = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	this.BODY = new CGFappearance(scene);
	this.BODY.loadTexture("scenes/images/vehicle_body.png");
};

MyVehicleBody.prototype = Object.create(MyPrimitive.prototype);
MyVehicleBody.prototype.constructor = MyVehicleBody;

/**
 * desenha a primitva 'MyVehicleBody' na XMLScene correspondente
 * @return {null}
 */
MyVehicleBody.prototype.display = function() {
	this.BODY.apply();
	this.scene.translate(-3.0, 3.0, 0.0);
	this.TOP.display();
	this.scene.translate(0.0, -3.0, 0.0);
	this.DOWN.display();
	this.scene.translate(0.0, 0.0, 0.0);
	this.LEFT.display();
	this.scene.translate(0.0, 0.0, 3.0);
	this.RIGHT.display();
 };