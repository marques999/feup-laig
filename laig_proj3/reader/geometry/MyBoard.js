function MyBoard(scene) {

	MyPrimitive.call(this, scene);

	this.hex = new MyCircle(scene, 6);


	
};

MyBoard.prototype = Object.create(MyPrimitive.prototype);
MyBoard.prototype.constructor = MyBoard;

MyBoard.prototype.display = function() {

    this.scene.pushMatrix();

    this.scene.scale(5.0, 5.0, 1.0);
    for(var y= 0; y < 7; y++) {
        for(var x = 0; x < 7; x ++) {
            this.scene.pushMatrix();
                this.scene.translate(x * Math.cos(30*Math.PI/180), y + 0.5*x*Math.cos(30*Math.PI/180), 0.0);
                this.scene.scale(0.5, 0.5, 0.5);	 
                this.hex.display();	
            this.scene.popMatrix();  
        }        
    }
    
    this.scene.popMatrix();

	
 };