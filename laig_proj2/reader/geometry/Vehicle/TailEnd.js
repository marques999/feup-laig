/**
 * construtor default da classe 'TailEnd'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function TailEnd(scene) {

	MyPrimitive.call(this, scene);
	this.scene = scene;

    var P1_1 = [0.0, 0.0, 0.0, 1.0];                     
	var P1_2 = [0.0, 1.0, 0.0, 1.0]; 
	var P1_3 = [0.0, 2.0, 0.0, 1.0]; 
	var P1_4 = [0.0, 3.0, 0.0, 1.0]; 
 
	var P2_1 = [0.0, -0.5, 1.0, 1.0]; 
	var P2_2 = [0.0, 1.0, 1.0, 1.0]; 
	var P2_3 = [0.0, 2.0, 1.0, 1.0]; 
	var P2_4 = [0.0, 3.0, 1.0, 1.0]; 
 
	var P3_1 = [0.0, -0.5, 2.0, 1.0]; 
	var P3_2 = [0.0, 1.0, 2.0, 1.0]; 
	var P3_3 = [0.0, 2.0, 2.0, 1.0]; 
	var P3_4 = [0.0, 3.0, 2.0, 1.0]; 
 
	var P4_1 = [0.0, 0.0, 3.0, 1.0]; 
	var P4_2 = [0.0, 1.0, 3.0, 1.0]; 
	var P4_3 = [0.0, 2.0, 3.0, 1.0]; 
	var P4_4 = [0.0, 3.0, 3.0, 1.0]; 


	var Points = [[P1_1, P1_2, P1_3, P1_4],
			[P2_1, P2_2, P2_3, P2_4],
			[P3_1, P3_2, P3_3, P3_4],
			[P4_1, P4_2, P4_3, P4_4]];

	this.TAIL_END_DOWN = new MyPatch(this.scene, 20, 20, 3, 3, Points);

	P1_1 = [0.0, 0.0, 0.0, 1.0]; 
	P1_2 = [0.0, 0.0, 0.0, 1.0]; 
	P1_3 = [0.0, 0.0, 0.0, 1.0]; 
	P1_4 = [0.0, 0.0, 0.0, 1.0]; 

	P2_1 = [0.0, -1.0, 1.0, 1.0];
	P2_2 = [0.0, -0.7, 1.0, 1.0]; 
	P2_3 = [0.0, -0.4, 1.0, 1.0]; 
	P2_4 = [0.0, 0.0, 1.0, 1.0]; 

	P3_1 = [0.0, -1.0, 2.0, 1.0];
	P3_2 = [0.0, -0.7, 2.0, 1.0]; 
	P3_3 = [0.0, -0.4, 2.0, 1.0]; 
	P3_4 = [0.0, 0.0, 2.0, 1.0]; 

	P4_1 = [0.0, 0.0, 3.0, 1.0]; 
    P4_2 = [0.0, 0.0, 3.0, 1.0]; 
	P4_3 = [0.0, 0.0, 3.0, 1.0]; 
	P4_4 = [0.0, 0.0, 3.0, 1.0]; 

	Points = [[P1_1, P1_2, P1_3, P1_4],
			[P2_1, P2_2, P2_3, P2_4],
			[P3_1, P3_2, P3_3, P3_4],
			[P4_1, P4_2, P4_3, P4_4]];

	this.TAIL_END_TOP = new MyPatch(this.scene, 20, 20, 3, 3, Points);

	P1_1 = [0.0, 0.0, 0.0, 1.0]; 
	P1_2 = [0.0, 0.0, 0.0, 1.0]; 
	P1_3 = [0.0, 0.0, 0.0, 1.0]; 
	P1_4 = [0.0, 0.0, 0.0, 1.0]; 

	P2_1 = [0.0, -0.8, 1.0, 1.0];
	P2_2 = [0.0, -0.6, 1.0, 1.0]; 
	P2_3 = [0.0, -0.3, 1.0, 1.0]; 
	P2_4 = [0.0, 0.0, 1.0, 1.0]; 

	P3_1 = [0.0, -0.8, 2.0, 1.0];
	P3_2 = [0.0, -0.6, 2.0, 1.0]; 
	P3_3 = [0.0, -0.3, 2.0, 1.0]; 
	P3_4 = [0.0, 0.0, 2.0, 1.0]; 

	P4_1 = [0.0, 0.0, 3.0, 1.0]; 
    P4_2 = [0.0, 0.0, 3.0, 1.0]; 
	P4_3 = [0.0, 0.0, 3.0, 1.0]; 
	P4_4 = [0.0, 0.0, 3.0, 1.0]; 

	Points = [[P1_1, P1_2, P1_3, P1_4],
			[P2_1, P2_2, P2_3, P2_4],
			[P3_1, P3_2, P3_3, P3_4],
			[P4_1, P4_2, P4_3, P4_4]];

	this.TAIL_END_LEFT = new MyPatch(this.scene, 20, 20, 3, 3, Points);
	
	this.initBuffers();
};

TailEnd.prototype = Object.create(MyPrimitive.prototype);
TailEnd.prototype.constructor = TailEnd;

TailEnd.prototype.display = function() {

    this.scene.pushMatrix(); 
    this.TAIL_END_DOWN.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.0, 3.0, 3.0);   
    this.scene.rotate(Math.PI, 1.0, 0.0, 0.0); 
    this.TAIL_END_TOP.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.0, 3.0, 0.0);   
    this.scene.rotate(Math.PI/2, 1.0, 0.0, 0.0); 
    this.TAIL_END_LEFT.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.0, 3.0);   
    this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0); 
    this.TAIL_END_LEFT.display();
    this.scene.popMatrix();
 }; 