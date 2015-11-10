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
	this.asa = new Asa(scene);
    	
	this.initBuffers();
};

MyVehicle.prototype = Object.create(MyPrimitive.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.0, 1.0);
    this.asa.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.0, -1.0);
    this.scene.scale(1.0, -1.0, -1.0);
    this.asa.display();
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