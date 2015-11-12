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
	this.front = new Front(scene);
	this.boddy = new Boddy(scene);
	this.tail = new Tail(scene);
	this.tailBooster = new TailBooster(scene); 
	this.tailEnd = new TailEnd(scene); 
    	
	this.initBuffers();
};

MyVehicle.prototype = Object.create(MyPrimitive.prototype);
MyVehicle.prototype.constructor = MyVehicle;


MyVehicle.prototype.display = function() {

	this.scene.pushMatrix();
		
		this.scene.rotate(Math.PI/2, 1, 0, 0);			
		this.scene.translate(3.6, -0.65, 0.0);		
		
	
		this.scene.pushMatrix();	

			this.scene.scale(1.4, 0.8, 0.5);
			this.scene.translate(-1.4, 0.2, 0.0);
			this.scene.rotate(Math.PI/15, 0.0, 0.0, 1.0);

			this.scene.pushMatrix();
				this.scene.translate(0.0, 0.0, 1.0);
				this.asa.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(0.0, 0.0, -1.0);
				this.scene.scale(1.0, -1.0, -1.0);
				this.asa.display();
			this.scene.popMatrix();

		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.scale(0.5, 0.5, 0.5);

			this.scene.pushMatrix();   
				this.scene.translate(5.0, -0.3, -1.5);
				this.front.display();
			this.scene.popMatrix();

			this.scene.pushMatrix(); 
				this.scene.scale(3.0, 1.0, 1.0);   
				this.scene.translate(1.0, -0.3, -1.5);
				this.boddy.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
				this.scene.translate(-6.0, -0.3, -1.5);		
				this.tailEnd.display();
			this.scene.popMatrix();
			
				this.scene.pushMatrix();
				this.scene.translate(-6.0, 0.0, 0.0);	
				this.scene.scale(1.2, 1.2, 1.2);
						
				this.scene.pushMatrix();
					this.scene.translate(0.0, 0.7, -0.7);
					this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
					this.tailBooster.display();
				this.scene.popMatrix();

				this.scene.pushMatrix();
					this.scene.translate(0.0, 0.7, 0.7);
					this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
					this.tailBooster.display();
				this.scene.popMatrix();

				this.scene.pushMatrix();
					this.scene.translate(0.0, 1.9, 0.0);
					this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
					this.tailBooster.display();
				this.scene.popMatrix();

		this.scene.popMatrix();

		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.scene.translate(-2.85, 1.4, 0.0);
			this.scene.scale(0.6, 0.5, 0.9); 
			this.scene.rotate(Math.PI/15, 0, 0, 1); 	
			this.tail.display();
		this.scene.popMatrix();

    this.scene.popMatrix();
 };


//PLAIN PAPER

 /*
    var P1_1 = [0.0, 3.0, 0.0, 1.0];
	var P1_2 = [1.0, 3.0, 0.0, 1.0];
	var P1_3 = [2.0, 3.0, 0.0, 1.0];
	var P1_4 = [3.0, 3.0, 0.0, 1.0];

	var P2_1 = [0.0, 2.0, 0.0, 1.0];
	var P2_2 = [1.0, 2.0, 0.0, 1.0];
	var P2_3 = [2.0, 2.0, 0.0, 1.0];
	var P2_4 = [3.0, 2.0, 0.0, 1.0];

	var P3_1 = [0.0, 1.0, 0.0, 1.0];
	var P3_2 = [1.0, 1.0, 0.0, 1.0];
	var P3_3 = [2.0, 1.0, 0.0, 1.0];
	var P3_4 = [3.0, 1.0, 0.0, 1.0];

	var P4_1 = [0.0, 0.0, 0.0, 1.0];
	var P4_2 = [1.0, 0.0, 0.0, 1.0];
	var P4_3 = [2.0, 0.0, 0.0, 1.0];
	var P4_4 = [3.0, 0.0, 0.0, 1.0];*/