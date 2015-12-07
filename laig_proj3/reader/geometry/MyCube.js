function MyCube(scene) {
	MyPrimitive.call(this, scene);
	this.rectangle = new MyRectangle(scene, 0.0, 1.0, 1.0, 0.0);
};

MyCube.prototype = Object.create(MyPrimitive.prototype);
MyCube.prototype.constructor = MyCube;

MyCube.prototype.display = function() {

    this.scene.pushMatrix();
        this.scene.translate(1.0, 0.0, 0.0);
        this.scene.scale(-1.0, 1.0, 1.0);       
        this.rectangle.display(); 
	this.scene.popMatrix();

	this.scene.pushMatrix();
	    this.scene.translate(0.0, 0.0, 1.0);
        this.rectangle.display(); 
	this.scene.popMatrix();

	this.scene.pushMatrix();
	   this.scene.translate(1.0, 0.0, 1.0);
	   this.scene.rotate(Math.PI/2, 0.0, 1.0, 0.0);
       this.rectangle.display(); 
	this.scene.popMatrix();

	this.scene.pushMatrix();
	   this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
       this.rectangle.display(); 
	this.scene.popMatrix();

	this.scene.pushMatrix();
	   this.scene.rotate(Math.PI/2, 1.0, 0.0, 0.0);
       this.rectangle.display(); 
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.0, 1.0, 1.0);
		this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);
		this.rectangle.display(); 
	this.scene.popMatrix();
 };