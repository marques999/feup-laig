function MyPieceHolder(scene) {

	MyPrimitive.call(this, scene);
	
	this.cube = new MyCube(scene);
};

MyPieceHolder.prototype = Object.create(MyPrimitive.prototype);
MyPieceHolder.prototype.constructor = MyPieceHolder;


MyPieceHolder.prototype.display = function() {

	this.scene.pushMatrix();		
		this.scene.translate(0.0, 0.0, 11.0);
		this.scene.scale(18.0, 2.0, 1.0);
		this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();		
		this.scene.scale(18.0, 2.0, 1.0);
		this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(8.9, 0.0, 1.0);
		this.scene.scale(0.8, 1.75, 10.0);
		this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, 1.0);
		this.scene.scale(1.0, 2.0, 10.0);
		this.cube.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(17.0, 0.0, 1.0);
		this.scene.scale(1.0, 2.0, 10.0);
		this.cube.display();
	this.scene.popMatrix();	
 };