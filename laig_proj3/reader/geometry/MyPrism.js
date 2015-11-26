function MyPrism(scene, width, length, height)
{
	CGFobject.call(this, scene);

	this.width = width;
	this.length = length;
	this.height = height;
	this.rectangleA = new MyRectangle(this.scene, 0, height, width, 0);
	this.rectangleB = new MyRectangle(this.scene, 0, height, length, 0);
	this.rectangleC = new MyRectangle(this.scene, 0, width, length, 0);
};

MyPrism.prototype = Object.create(MyPrimitive.prototype);
MyPrism.prototype.constructor = MyPrism;

MyPrism.prototype.display = function()
{
	// face frontal
	this.scene.pushMatrix();
	this.scene.translate(0.0, 0.0, this.length);
	this.rectangleA.display();
	this.scene.popMatrix();

	// face traseira
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.scene.translate(-this.width, 0.0, 0.0);
	this.rectangleA.display();
	this.scene.popMatrix();

	// face lateral esquerda
	this.scene.pushMatrix();
	this.scene.rotate(-Math.PI / 2, 0, 1, 0);
	this.rectangleB.display();
	this.scene.popMatrix();

	// face lateral direita
	this.scene.pushMatrix();
	this.scene.translate(this.width, 0.0, this.length);	
	this.scene.rotate(Math.PI / 2, 0, 1, 0);
	this.rectangleB.display();
	this.scene.popMatrix();

	// face superior
	this.scene.pushMatrix();
	this.scene.translate(0.0, this.height, 0.0);
	this.rectangleC.display();
	this.scene.popMatrix();

	// face inferior
	this.scene.pushMatrix();
	this.scene.rotate(Math.PI / 2, 1, 0, 0);
	this.rectangleC.display();
	this.scene.popMatrix();
};