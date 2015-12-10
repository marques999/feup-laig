function MyDisc(scene, height, radius, stacks, slices) {

	MyPiece.call(this, scene);
	
	this.cyl = new MyCylinder(scene, height, radius, radius, stacks, slices);
	this.circle = new MyCircle(scene, slices);	

	this.matUnselected;
	this.matSelected;

	this.height = height;
	this.radius = radius;
};

MyDisc.prototype = Object.create(MyPiece.prototype);
MyDisc.prototype.constructor = MyDisc;

MyDisc.prototype.display = function() {

	this.scene.pushMatrix();	
	   this.cyl.display();	
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(this.radius, this.radius, 1.0);	   
		this.scene.translate(0.0, 0.0, this.height);	 
		this.circle.display();	
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(this.radius, this.radius, 1.0);	 
	    this.scene.scale(1.0, -1.0, -1.0);
	    this.circle.display();	
	this.scene.popMatrix();
 };