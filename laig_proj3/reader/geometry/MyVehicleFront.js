/**
 * construtor default da classe 'MyVehicleFront'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function MyVehicleFront(scene) {

	MyPrimitive.call(this, scene);

	var P1_1 = [-0.5, 2.5, 3.0, 1.0];
	var P1_2 = [0.0, 3.0, 2.0, 1.0];
	var P1_3 = [0.0, 3.0, 1.0, 1.0];
	var P1_4 = [-0.5, 2.5, 0.0, 1.0];
	var P2_1 = [0.0, 2.0, 3.0, 1.0];
	var P2_2 = [1.0, 2.0, 2.0, 1.0];
	var P2_3 = [1.0, 2.0, 1.0, 1.0];
	var P2_4 = [0.0, 2.0, 0.0, 1.0];
	var P3_1 = [0.0, 1.0, 3.0, 1.0];
	var P3_2 = [3.0, 1.0, 2.0, 1.0];
	var P3_3 = [3.0, 1.0, 1.0, 1.0];
	var P3_4 = [0.0, 1.0, 0.0, 1.0];
	var P4_1 = [-0.5, 0.5, 3.0, 1.0];
	var P4_2 = [0.0, 0.0, 2.0, 1.0];
	var P4_3 = [0.0, 0.0, 1.0, 1.0];
	var P4_4 = [-0.5, 0.5, 0.0, 1.0];

	this.FRONT = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_1 = [0.0, 0.0, 0.0, 1.0];
	P1_2 = [1.0, 0.0, 0.0, 1.0];
	P1_3 = [2.0, 0.0, 0.0, 1.0];
	P1_4 = [2.5, -0.5, 0.0, 1.0];
	P2_1 = [0.0, 1.0, 1.0, 1.0];
	P2_2 = [1.0, 1.0, 1.0, 1.0];
	P2_3 = [2.0, 1.0, 1.0, 1.0];
	P2_4 = [3.0, 0.0, 1.0, 1.0];
	P3_1 = [0.0, 1.0, 2.0, 1.0];
	P3_2 = [1.0, 1.0, 2.0, 1.0];
	P3_3 = [2.0, 1.0, 2.0, 1.0];
	P3_4 = [3.0, 0.0, 2.0, 1.0];
	P4_1 = [0.0, 0.0, 3.0, 1.0];
	P4_2 = [1.0, 0.0, 3.0, 1.0];
	P4_3 = [2.0, 0.0, 3.0, 1.0];
	P4_4 = [2.5, -0.5, 3.0, 1.0];

	this.FRONT_TOP = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_1 = [2.5, 0.5, 0.0, 1.0];
	P1_2 = [2.0, 0.0, 0.0, 1.0];
	P1_3 = [1.0, 0.0, 0.0, 1.0];
	P1_4 = [0.0, 0.0, 0.0, 1.0];
	P2_1 = [3.0, 0.0, 1.0, 1.0];
	P2_2 = [2.0, -0.5, 1.0, 1.0];
	P2_3 = [1.0, -0.5, 1.0, 1.0];
	P2_4 = [0.0, -0.5, 1.0, 1.0];
	P3_1 = [3.0, 0.0, 2.0, 1.0];
	P3_2 = [2.0, -0.5, 2.0, 1.0];
	P3_3 = [1.0, -0.5, 2.0, 1.0];
	P3_4 = [0.0, -0.5, 2.0, 1.0];
	P4_1 = [2.5, 0.5, 3.0, 1.0];
	P4_2 = [2.0, 0.0, 3.0, 1.0];
	P4_3 = [1.0, 0.0, 3.0, 1.0];
	P4_4 = [0.0, 0.0, 3.0, 1.0];

	this.FRONT_DOWN = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_1 = [2.5, 2.5, 0.0, 1.0];
	P1_2 = [2.0, 3.0, 0.0, 1.0];
	P1_3 = [1.0, 3.0, 0.0, 1.0];
	P1_4 = [0.0, 3.0, 0.0, 1.0];
	P2_1 = [3.0, 2.0, 0.0, 1.0];
	P2_2 = [2.0, 2.0, -0.8, 1.0];
	P2_3 = [1.0, 2.0, -0.8, 1.0];
	P2_4 = [0.0, 2.0, -0.8, 1.0];
	P3_1 = [3.0, 1.0, 0.0, 1.0];
	P3_2 = [2.0, 1.0, -0.8, 1.0];
	P3_3 = [1.0, 1.0, -0.8, 1.0];
	P3_4 = [0.0, 1.0, -0.8, 1.0];
	P4_1 = [2.5, 0.5, 0.0, 1.0];
	P4_2 = [2.0, 0.0, 0.0, 1.0];
	P4_3 = [1.0, 0.0, 0.0, 1.0];
	P4_4 = [0.0, 0.0, 0.0, 1.0];

	this.FRONT_LEFT = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	P1_1 = [0.0, 3.0, 0.0, 1.0];
	P1_2 = [1.0, 3.0, 0.0, 1.0];
	P1_3 = [2.0, 3.0, 0.0, 1.0];
	P1_4 = [2.5, 2.5, 0.0, 1.0];
	P2_1 = [0.0, 2.0, 0.8, 1.0];
	P2_2 = [1.0, 2.0, 0.8, 1.0];
	P2_3 = [2.0, 2.0, 0.8, 1.0];
	P2_4 = [3.0, 2.0, 0.0, 1.0];
	P3_1 = [0.0, 1.0, 0.8, 1.0];
	P3_2 = [1.0, 1.0, 0.8, 1.0];
	P3_3 = [2.0, 1.0, 0.8, 1.0];
	P3_4 = [3.0, 1.0, 0.0, 1.0];
	P4_1 = [0.0, 0.0, 0.0, 1.0];
	P4_2 = [1.0, 0.0, 0.0, 1.0];
	P4_3 = [2.0, 0.0, 0.0, 1.0];
	P4_4 = [2.5, 0.5, 0.0, 1.0];

	this.FRONT_RIGHT = new MyPatch(this.scene, 20, 20, 3, 3,
	[
		[P1_1, P1_2, P1_3, P1_4],
		[P2_1, P2_2, P2_3, P2_4],
		[P3_1, P3_2, P3_3, P3_4],
		[P4_1, P4_2, P4_3, P4_4]
	]);

	this.CHOMP = new CGFappearance(scene);
	this.METAL = new CGFappearance(scene);
	this.CHOMP.loadTexture("scenes/images/vehicle_chomp.png");
	this.METAL.loadTexture("scenes/images/vehicle_metal.png");
};

MyVehicleFront.prototype = Object.create(MyPrimitive.prototype);
MyVehicleFront.prototype.constructor = MyVehicleFront;

/**
 * desenha a primitva 'MyVehicleFront' na XMLScene correspondente
 * @return {null}
 */
MyVehicleFront.prototype.display = function() {
	this.CHOMP.apply();
	this.FRONT.display();
	this.scene.translate(-3.0, 3.0, 0.0);
	this.METAL.apply();
	this.FRONT_TOP.display();
	this.scene.translate(0.0, -3.0, 0.0);
	this.FRONT_DOWN.display();
	this.scene.translate(0.0, 0.0, 0.0);
	this.FRONT_LEFT.display();
	this.scene.translate(0.0, 0.0, 3.0);
	this.FRONT_RIGHT.display();
 };