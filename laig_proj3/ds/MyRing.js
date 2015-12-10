function MyRing(scene, width, height, radius, stacks, slices) {

	MyPiece.call(this, scene);

	this.invCyl = new MyInvCylinder(scene, height, radius, radius, stacks, slices);
	this.cyl = new MyCylinder(scene, height, radius, radius, stacks, slices);
	this.hole = new MyHoleCircle(scene, slices, width);	

	this.matUnselected;
	this.matSelected;

	this.width = 1 - width;
	this.height = height;
	this.radius = radius;
};

MyRing.prototype = Object.create(MyPiece.prototype);
MyRing.prototype.constructor = MyRing;

MyRing.prototype.display = function() {

	this.scene.pushMatrix();
	   this.scene.scale(this.width, this.width, 1.0);
	   this.invCyl.display();	
	this.scene.popMatrix();

	this.scene.pushMatrix();	
	   this.cyl.display();	
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(this.radius, this.radius, 1.0);	   
	   this.scene.translate(0.0, 0.0, this.height);	  
	   this.hole.display();	
	this.scene.popMatrix();

	this.scene.pushMatrix();
	   this.scene.scale(1.0, -1.0, -1.0);
	   this.hole.display();	
	this.scene.popMatrix();
 };