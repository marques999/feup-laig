/**
 * construtor default da classe 'Asa'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function Asa(scene) {

	MyPrimitive.call(this, scene);
	this.scene = scene;

    var ASA_UP_P1_1 = [3.0, 0.2, 0.0, 1.0];
	var ASA_UP_P1_2 = [2.4, 0.2, 1.0, 1.0];
	var ASA_UP_P1_3 = [1.6, 0.1, 2.0, 1.0];
	var ASA_UP_P1_4 = [0.6, 0.0, 3.0, 1.0];

	var ASA_UP_P2_1 = [2.0, 0.2, 0.0, 1.0];
	var ASA_UP_P2_2 = [1.4, 0.2, 1.0, 1.0];
	var ASA_UP_P2_3 = [0.8, 0.1, 2.0, 1.0];
	var ASA_UP_P2_4 = [0.6, 0.0, 3.0, 1.0];

	var ASA_UP_P3_1 = [1.8, 0.2, 0.0, 1.0];
	var ASA_UP_P3_2 = [1.2, 0.2, 1.0, 1.0];
	var ASA_UP_P3_3 = [0.6, 0.1, 2.0, 1.0];
	var ASA_UP_P3_4 = [0.4, 0.0, 3.0, 1.0];

	var ASA_UP_P4_1 = [0.0, 0.2, 0.0, 1.0];
	var ASA_UP_P4_2 = [0.0, 0.2, 1.0, 1.0];
	var ASA_UP_P4_3 = [0.0, 0.1, 2.0, 1.0];
	var ASA_UP_P4_4 = [0.0, 0.0, 3.0, 1.0];

	var ASA_UP_Points = [[ASA_UP_P1_1, ASA_UP_P1_2, ASA_UP_P1_3, ASA_UP_P1_4],
						[ASA_UP_P2_1, ASA_UP_P2_2, ASA_UP_P2_3, ASA_UP_P2_4],
						[ASA_UP_P3_1, ASA_UP_P3_2, ASA_UP_P3_3, ASA_UP_P3_4],
						[ASA_UP_P4_1, ASA_UP_P4_2, ASA_UP_P4_3, ASA_UP_P4_4]];
		
    this.ASA_UP = new MyPatch(this.scene, 20, 20, 3, 3, ASA_UP_Points);

    var ASA_DOWN_P1_4 = [3.0, -0.2, 0.0, 1.0];
	var ASA_DOWN_P1_3 = [2.4, -0.2, 1.0, 1.0];
	var ASA_DOWN_P1_2 = [1.6, -0.1, 2.0, 1.0];
	var ASA_DOWN_P1_1 = [0.6, 0.0, 3.0, 1.0];

	var ASA_DOWN_P2_4 = [2.0, -0.2, 0.0, 1.0];
	var ASA_DOWN_P2_3 = [1.4, -0.2, 1.0, 1.0];
	var ASA_DOWN_P2_2 = [0.8, -0.1, 2.0, 1.0];
	var ASA_DOWN_P2_1 = [0.6, 0.0, 3.0, 1.0];

	var ASA_DOWN_P3_4 = [1.8, -0.2, 0.0, 1.0];
	var ASA_DOWN_P3_3 = [1.2, -0.2, 1.0, 1.0];
	var ASA_DOWN_P3_2 = [0.6, -0.1, 2.0, 1.0];
	var ASA_DOWN_P3_1 = [0.4, 0.0, 3.0, 1.0];

	var ASA_DOWN_P4_4 = [0.0, -0.2, 0.0, 1.0];
	var ASA_DOWN_P4_3 = [0.0, -0.2, 1.0, 1.0];
	var ASA_DOWN_P4_2 = [0.0, -0.1, 2.0, 1.0];
	var ASA_DOWN_P4_1 = [0.0, 0.0, 3.0, 1.0];

	var ASA_DOWN_Points = [[ASA_DOWN_P1_1, ASA_DOWN_P1_2, ASA_DOWN_P1_3, ASA_DOWN_P1_4],
							[ASA_DOWN_P2_1, ASA_DOWN_P2_2, ASA_DOWN_P2_3, ASA_DOWN_P2_4],
							[ASA_DOWN_P3_1, ASA_DOWN_P3_2, ASA_DOWN_P3_3, ASA_DOWN_P3_4],
							[ASA_DOWN_P4_1, ASA_DOWN_P4_2, ASA_DOWN_P4_3, ASA_DOWN_P4_4]];

    this.ASA_DOWN = new MyPatch(this.scene, 20, 20, 3, 3, ASA_DOWN_Points);

    var ASA_SIDE1_P1_1 = [0.0, 0.2, 0.0, 1.0];
	var ASA_SIDE1_P1_2 = [0.0, 0.2, 1.0, 1.0];
	var ASA_SIDE1_P1_3 = [0.0, 0.1, 2.0, 1.0];
	var ASA_SIDE1_P1_4 = [0.0, 0.0, 3.0, 1.0];

	var ASA_SIDE1_P2_1 = [0.0, 0.0, 0.0, 1.0];
	var ASA_SIDE1_P2_2 = [0.0, 0.0, 1.0, 1.0];
	var ASA_SIDE1_P2_3 = [0.0, 0.0, 2.0, 1.0];
	var ASA_SIDE1_P2_4 = [0.0, 0.0, 3.0, 1.0];

	var ASA_SIDE1_P3_1 = [0.0, 0.0, 0.0, 1.0];
	var ASA_SIDE1_P3_2 = [0.0, 0.0, 1.0, 1.0];
	var ASA_SIDE1_P3_3 = [0.0, 0.0, 2.0, 1.0];
	var ASA_SIDE1_P3_4 = [0.0, 0.0, 3.0, 1.0];

	var ASA_SIDE1_P4_1 = [0.0, -0.2, 0.0, 1.0];
	var ASA_SIDE1_P4_2 = [0.0, -0.2, 1.0, 1.0];
	var ASA_SIDE1_P4_3 = [0.0, -0.1, 2.0, 1.0];
	var ASA_SIDE1_P4_4 = [0.0, -0.0, 3.0, 1.0];

	var ASA_SIDE1_Points = [[ASA_SIDE1_P1_1, ASA_SIDE1_P1_2, ASA_SIDE1_P1_3, ASA_SIDE1_P1_4],
							[ASA_SIDE1_P2_1, ASA_SIDE1_P2_2, ASA_SIDE1_P2_3, ASA_SIDE1_P2_4],
							[ASA_SIDE1_P3_1, ASA_SIDE1_P3_2, ASA_SIDE1_P3_3, ASA_SIDE1_P3_4],
							[ASA_SIDE1_P4_1, ASA_SIDE1_P4_2, ASA_SIDE1_P4_3, ASA_SIDE1_P4_4]];

    this.ASA_SIDE1 = new MyPatch(this.scene, 20, 20, 3, 3, ASA_SIDE1_Points);

    var ASA_SIDE2_P1_4 = [3.0, 0.2, 0.0, 1.0];
	var ASA_SIDE2_P1_3 = [2.4, 0.2, 1.0, 1.0];
	var ASA_SIDE2_P1_2 = [1.6, 0.1, 2.0, 1.0];
	var ASA_SIDE2_P1_1 = [0.6, 0.0, 3.0, 1.0];

	var ASA_SIDE2_P2_4 = [3.0, 0.0, 0.0, 1.0];
	var ASA_SIDE2_P2_3 = [2.4, 0.0, 1.0, 1.0];
	var ASA_SIDE2_P2_2 = [1.6, 0.0, 2.0, 1.0];
	var ASA_SIDE2_P2_1 = [0.6, 0.0, 3.0, 1.0];

	var ASA_SIDE2_P3_4 = [3.0, 0.0, 0.0, 1.0];
	var ASA_SIDE2_P3_3 = [2.4, 0.0, 1.0, 1.0];
	var ASA_SIDE2_P3_2 = [1.6, 0.0, 2.0, 1.0];
	var ASA_SIDE2_P3_1 = [0.6, 0.0, 3.0, 1.0];

	var ASA_SIDE2_P4_4 = [3.0, -0.2, 0.0, 1.0];
	var ASA_SIDE2_P4_3 = [2.4, -0.2, 1.0, 1.0];
	var ASA_SIDE2_P4_2 = [1.6, -0.1, 2.0, 1.0];
	var ASA_SIDE2_P4_1 = [0.6, 0.0, 3.0, 1.0];

	var ASA_SIDE2_Points = [[ASA_SIDE2_P1_1, ASA_SIDE2_P1_2, ASA_SIDE2_P1_3, ASA_SIDE2_P1_4],
							[ASA_SIDE2_P2_1, ASA_SIDE2_P2_2, ASA_SIDE2_P2_3, ASA_SIDE2_P2_4],
							[ASA_SIDE2_P3_1, ASA_SIDE2_P3_2, ASA_SIDE2_P3_3, ASA_SIDE2_P3_4],
							[ASA_SIDE2_P4_1, ASA_SIDE2_P4_2, ASA_SIDE2_P4_3, ASA_SIDE2_P4_4]];

    this.ASA_SIDE2 = new MyPatch(this.scene, 20, 20, 3, 3, ASA_SIDE2_Points);
	
	this.initBuffers();
};

Asa.prototype = Object.create(MyPrimitive.prototype);
Asa.prototype.constructor = Asa;

Asa.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.scale(0.6,1.0,1.5);
    this.ASA_UP.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.6,1.0,1.5);   
    this.ASA_DOWN.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.6,1.0,1.5);   
    this.ASA_SIDE1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.6,1.0,1.5);   
    this.ASA_SIDE2.display();
    this.scene.popMatrix();

 };