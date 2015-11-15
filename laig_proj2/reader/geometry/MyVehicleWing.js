/**
 * construtor default da classe 'MyVehicleWing'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function MyVehicleWing(scene) {

	MyPrimitive.call(this, scene);

	var P1_1 = [3.0, 0.2, 0.0, 1.0];
	var P1_2 = [1.6, 0.2, 1.0, 1.0];
	var P1_3 = [0.2, 0.1, 2.0, 1.0];
	var P1_4 = [-1.0, 0.0, 3.0, 1.0];
	var P2_1 = [2.0, 0.2, 0.0, 1.0];
	var P2_2 = [0.94, 0.2, 1.0, 1.0];
	var P2_3 = [0.17, 0.1, 2.0, 1.0];
	var P2_4 = [-1.17, 0.0, 3.0, 1.0];
	var P3_1 = [1.0, 0.2, 0.0, 1.0];
	var P3_2 = [0.23, 0.2, 1.0, 1.0];
	var P3_3 = [-1.0, 0.1, 2.0, 1.0];
	var P3_4 = [-1.33, 0.0, 3.0, 1.0];
	var P4_1 = [0.0, 0.2, 0.0, 1.0];
	var P4_2 = [-0.5, 0.2, 1.0, 1.0];
	var P4_3 = [-1.0, 0.1, 2.0, 1.0];
	var P4_4 = [-1.5, 0.0, 3.0, 1.0];

	this.ASA_UP = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_1 = [-1.0, 0.0, 3.0, 1.0];
	P1_2 = [0.2, -0.1, 2.0, 1.0];
	P1_3 = [1.6, -0.2, 1.0, 1.0];
	P1_4 = [3.0, -0.2, 0.0, 1.0];
	P2_1 = [-1.17, 0.0, 3.0, 1.0];
	P2_2 = [0.17, -0.1, 2.0, 1.0];
	P2_3 = [0.94, -0.2, 1.0, 1.0];
	P2_4 = [2.0, -0.2, 0.0, 1.0];
	P3_1 = [-1.33, 0.0, 3.0, 1.0];
	P3_2 = [-1.0, -0.1, 2.0, 1.0];
	P3_3 = [0.23, -0.2, 1.0, 1.0];
	P3_4 = [1.0, -0.2, 0.0, 1.0];
	P4_1 = [-1.5, 0.0, 3.0, 1.0];
	P4_2 = [-1.0, -0.1, 2.0, 1.0];
	P4_3 = [-0.5, -0.2, 1.0, 1.0];
	P4_4 = [0.0, -0.2, 0.0, 1.0];

	this.ASA_DOWN = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_1 = [0.0,  0.2, 0.0, 1.0];
	P1_2 = [-0.5, 0.2, 1.0, 1.0];
	P1_3 = [-1.0, 0.1, 2.0, 1.0];
	P1_4 = [-1.5, 0.0, 3.0, 1.0];
	P2_1 = [0.0,  0.0, 0.0, 1.0];
	P2_2 = [-0.5, 0.0, 1.0, 1.0];
	P2_3 = [-1.0, 0.0, 2.0, 1.0];
	P2_4 = [-1.5, 0.0, 3.0, 1.0];
	P3_1 = [0.0,  -0.2, 0.0, 1.0];
	P3_2 = [-0.5, -0.2, 1.0, 1.0];
	P3_3 = [-1.0, -0.1, 2.0, 1.0];
	P3_4 = [-1.5, -0.0, 3.0, 1.0];

	this.ASA_SIDE1 = new MyPatch(this.scene, 20, 20, 2, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4]
	]);

	P1_1 = [-1.0, 0.0, 3.0, 1.0];
	P1_2 = [0.2, 0.1, 2.0, 1.0];
	P1_3 = [1.6, 0.2, 1.0, 1.0];
	P1_4 = [3.0, 0.2, 0.0, 1.0];
	P2_1 = [-1.0, 0.0, 3.0, 1.0];
	P2_2 = [0.2, 0.0, 2.0, 1.0];
	P2_3 = [1.6, 0.0, 1.0, 1.0];
	P2_4 = [3.0, 0.0, 0.0, 1.0];
	P3_1 = [-1.0, 0.0, 3.0, 1.0];
	P3_2 = [0.2, -0.1, 2.0, 1.0];
	P3_3 = [1.6, -0.2, 1.0, 1.0];
	P3_4 = [3.0, -0.2, 0.0, 1.0];

	this.ASA_SIDE2 = new MyPatch(this.scene, 20, 20, 2, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4]
	]);

	this.RED = new CGFappearance(scene);
	this.RED.loadTexture("scenes/images/vehicle_wing.png");
};

MyVehicleWing.prototype = Object.create(MyPrimitive.prototype);
MyVehicleWing.prototype.constructor = MyVehicleWing;

/**
 * desenha a primitva 'MyVehicleWing' na XMLScene correspondente
 * @return {null}
 */
MyVehicleWing.prototype.display = function() {
	this.RED.apply();
	this.scene.scale(0.6, 1.0, 1.5);
	this.ASA_UP.display();
	this.ASA_DOWN.display();
	this.ASA_SIDE1.display();
	this.ASA_SIDE2.display();
 };