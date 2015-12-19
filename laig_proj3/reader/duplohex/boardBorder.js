/**
 * construtor default da classe 'MyBoardBorder'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} slices - número de divisões do círculo em torno do raio
 * @return {null}
 */
function MyBoardBorder(scene, size, type) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.size = size-1;
	this.type = type;
	this.defaultAngle = Math.sin(Math.PI/3);
	this.invertedAngle = Math.sin(Math.PI / 6);
	this.defaultScale = 0.5 / this.defaultAngle + 7 * 2 * this.defaultAngle;
	this.material= new CGFappearance(scene);
	//--------------------------------------------------------
	this.plane = new ObjectPlane(scene, 15);
	this.triangle = new MyTriangle(scene, [0.0, 0.0, 0.0], [2 * this.defaultAngle, 0.0, 0.0], [this.defaultAngle, 0.5, 0.0]);
	this.halftriangle = new MyTriangle(scene, [0.0, 0.0, 0.0], [0.5 / this.defaultAngle, 0,0], [0.5 * this.defaultAngle, 0.5 * this.invertedAngle, 0.0]);
	this.halftriangle2 = new MyTriangle(scene, [0.0, 0.0, 0.0], [0.5 / this.defaultAngle, 0,0], [0.5 * Math.tan(Math.PI/6) * this.invertedAngle, 0.5 * Math.tan(Math.PI/6)*this.defaultAngle,0]);
	this.rectangle = new MyRectangle(scene, 0.0, 0.5, this.defaultScale, 0.0);
	this.moddedCircle = new CustomCircle(scene, 20, 0.5, Math.PI / 6);
	this.moddedCircle2 = new CustomCircle(scene, 20, 0.5, Math.PI / 3);
	this.moddedCylinder = new CustomCylinder(scene, 0.5, 0.5, 0.5, 20, 20, Math.PI / 6);
	this.moddedCylinder2 = new CustomCylinder(scene, 0.5, 0.5, 0.5, 20, 20, Math.PI / 3);
	//--------------------------------------------------------
	if (type == 1) {
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
	//--------------------------------------------------------
};

MyBoardBorder.prototype = Object.create(MyPrimitive.prototype);
MyBoardBorder.prototype.constructor = MyBoardBorder;

/**
 * inicializa os buffers WebGL da primitiva 'MyBoardBorder'
 * @return {null}
 */
MyBoardBorder.prototype.display = function() {

	this.material.apply();
	this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2,1,0,0);
		this.scene.translate(0.0, -0.5, 0.5);
		this.rectangle.display();
		this.scene.rotate(-Math.PI/2,1,0,0);
		this.scene.scale(this.defaultScale,0.5,1.0);
		this.scene.translate(0.5, 0.0, -0.5);
		this.plane.display();
	this.scene.popMatrix();

	if (this.type == 1) {

		this.scene.pushMatrix();
			 this.scene.translate(this.defaultScale,0.0,0.0);
			 this.scene.rotate(-Math.PI/2,0.0,0.0,1.0);
			 this.moddedCircle.display();
			 this.scene.translate(0.0,0.0,-0.5);
			 this.moddedCylinder.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.triangle.display();
			for(var i = 0; i < this.size; i++) {
				this.scene.translate(2.0*this.defaultAngle,0.0,0.0);
				this.triangle.display();
			}
			this.scene.translate(2.0*this.defaultAngle,0.0,0.0);
			this.halftriangle.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			 this.scene.rotate(-5*Math.PI/6,0.0,0.0,1.0);
			 this.moddedCircle2.display();
			 this.scene.translate(0.0,0.0,-0.5);
			 this.moddedCylinder2.display();
		this.scene.popMatrix();
	}
	else {

		this.scene.pushMatrix();
			 this.scene.rotate(4*Math.PI/3,0.0,0.0,1.0);
			 this.moddedCircle.display();
			 this.scene.translate(0.0,0.0,-0.5);
			 this.moddedCylinder.display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
			this.halftriangle2.display();
			for(var i = 0; i < this.size; i++) {
			if(i == 0){
				this.scene.translate(0.5/this.defaultAngle,0.0,0.0);
			}
			else {
				this.scene.translate(2*this.defaultAngle,0.0,0.0);
			}

				this.triangle.display();
			}
			this.scene.translate(2*this.defaultAngle,0.0,0.0);
			this.triangle.display();

		this.scene.popMatrix();

		 this.scene.pushMatrix();
			 this.scene.translate(this.defaultScale,0.0,0.0);
			 this.scene.rotate(-Math.PI/2,0.0,0.0,1.0);
			 this.moddedCircle2.display();
			 this.scene.translate(0.0,0.0,-0.5);
			 this.moddedCylinder2.display();
		this.scene.popMatrix();
	}
};