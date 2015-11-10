/**
 * construtor default da classe 'MyVehicle'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function MyVehicle(scene) {

	MyPrimitive.call(this, scene);
	this.scene = scene;

    var L_P1_1 = [0.0, 1.5, 0.0, 1.0];
	var L_P1_2 = [1.5, 3.0, 0.0, 1.0];
	var L_P1_3 = [3.0, 3.0, 0.0, 1.0];
	var L_P1_4 = [4.5, 2.9, 0.0, 1.0];

	var L_P2_1 = [0.0, 0.75, 0.0, 1.0];
	var L_P2_2 = [1.5, 2.0, 0.0, 5.0];
	var L_P2_3 = [3.0, 2.0, 0.0, 5.0];
	var L_P2_4 = [4.5, 2.0, 0.0, 1.0];

	var L_P3_1 = [0.0, 0.25, 0.0, 1.0];
	var L_P3_2 = [1.5, 1.0, -0.1, 1.0];
	var L_P3_3 = [3.0, 1.0, -0.1, 1.0];
	var L_P3_4 = [4.5, 1.0, 0.0, 1.0];

	var L_P4_1 = [0.0, 0.0, 0.0, 1.0];
	var L_P4_2 = [1.5, 0.0, -0.2, 1.0];
	var L_P4_3 = [3.0, 0.0, -0.2, 1.0];
	var L_P4_4 = [4.5, 0.0, 0.0, 1.0];

	var LCPoints = [[L_P1_1, L_P1_2, L_P1_3, L_P1_4], [L_P2_1, L_P2_2, L_P2_3, L_P2_4], [L_P3_1, L_P3_2, L_P3_3, L_P3_4], [L_P4_1, L_P4_2, L_P4_3, L_P4_4]];
	
    this.carLeftSide = new MyPatch(this.scene, 20, 20, 3, 3, LCPoints);


    var L_P1_1 = [0.0, 1.5, 0.0, 1.0];
	var L_P1_2 = [1.5, 3.0, 0.0, 1.0];
	var L_P1_3 = [3.0, 3.0, 0.0, 1.0];
	var L_P1_4 = [4.5, 2.9, 0.0, 1.0];

	var L_P2_1 = [0.0, 0.75, 0.0, 1.0];
	var L_P2_2 = [1.5, 2.0, 0.0, 5.0];
	var L_P2_3 = [3.0, 2.0, 0.0, 5.0];
	var L_P2_4 = [4.5, 2.0, 0.0, 1.0];

	var L_P3_1 = [0.0, 0.25, 0.0, 1.0];
	var L_P3_2 = [1.5, 1.0, -0.1, 1.0];
	var L_P3_3 = [3.0, 1.0, -0.1, 1.0];
	var L_P3_4 = [4.5, 1.0, 0.0, 1.0];

	var L_P4_1 = [0.0, 0.0, 0.0, 1.0];
	var L_P4_2 = [1.5, 0.0, -0.2, 1.0];
	var L_P4_3 = [3.0, 0.0, -0.2, 1.0];
	var L_P4_4 = [4.5, 0.0, 0.0, 1.0];

	LCPoints = [[L_P1_4, L_P1_3, L_P1_2, L_P1_1], [L_P2_4, L_P2_3, L_P2_2, L_P2_1], [L_P3_4, L_P3_3, L_P3_2, L_P3_1], [L_P4_4, L_P4_3, L_P4_2, L_P4_1]];
	
    this.carRightSide = new MyPatch(this.scene, 20, 20, 3, 3, LCPoints);
	

    this.floor
	
	this.initBuffers();
};

MyVehicle.prototype = Object.create(MyPrimitive.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.0, 1.0);
    this.carLeftSide.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.0, -1.0);
    this.carRightSide.display();
    this.scene.popMatrix();
 };


//PLAIN PAPER

 /*
    var P1_1 = [0.0, 3.0, 0.0, 1.0];
	var P1_2 = [1.0, 3.0, 0.0, 1.0];
	var P1_3 = [2.0, 3.0, 0.0, 1.0];
	var P1_4 = [3.0, 3.0, 0.0, 1.0];

	var P2_1 = [0.0, 2.0, 0.0, 1.0];
	var P2_2 = [1.0, 2.0, 0.0, 5.0];
	var P2_3 = [2.0, 2.0, 0.0, 5.0];
	var P2_4 = [3.0, 2.0, 0.0, 1.0];

	var P3_1 = [0.0, 1.0, 0.0, 1.0];
	var P3_2 = [1.0, 1.0, 0.0, 1.0];
	var P3_3 = [2.0, 1.0, 0.0, 1.0];
	var P3_4 = [3.0, 1.0, 0.0, 1.0];

	var P4_1 = [0.0, 0.0, 0.0, 1.0];
	var P4_2 = [1.0, 0.0, 0.0, 1.0];
	var P4_3 = [2.0, 0.0, 0.0, 1.0];
	var P4_4 = [3.0, 0.0, 0.0, 1.0];*/