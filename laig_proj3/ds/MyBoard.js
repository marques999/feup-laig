function MyBoard(scene) {

	MyPrimitive.call(this, scene);

	//--------------------------------------------------------	
	this.baseXsize = 5.0;
	this.baseYsize = 5.0;

	this.baseXpos = -2.25;
	this.baseYpos = 0.0;
	this.baseZpos = -4.5*Math.cos(30*Math.PI/180);
	//--------------------------------------------------------

	this.hex = new MyCircle(scene, 6);
	this.cyl = new MyCylinder(scene, 1.0, 1.0, 1.0, 20, 6);
	this.base = new MyRectangle(scene, 0.0, 1.0, 1.0, 0.0);		
	this.pieceHolder = new MyPieceHolder(scene, this.baseXsize, this.baseYsize);
	
	
	this.hexTexture = new CGFtexture(this.scene, "scenes/images/hexagon.png");
	this.baseTexture = new CGFtexture(this.scene, "scenes/images/hex_board.png");
	//---------------------------------------------------------

	this.pieces = [];
	this.pieces[0] = new MyDisc(scene, 1.0, 0.65, 20, 20);
	this.pieces[1] = new MyDisc(scene, 1.0, 0.65, 20, 20);
	this.pieces[2] = new MyRing(scene, 0.35, 0.85, 1.0, 20, 20);
	this.pieces[3] = new MyRing(scene, 0.35, 0.85, 1.0, 20, 20);
	this.pieces[4] = new MyRing(scene, 0.35, 0.85, 1.0, 20, 20);

	this.pieces[0].setCoords(3, 0, 15);
	this.pieces[1].setCoords(4, 0, 17);	
	this.pieces[2].setCoords(8, 0, 15);	
	this.pieces[3].setCoords(8.5, 1.0, 15);	
	this.pieces[4].setCoords(10.0, 0.0, 17);
	//---------------------------------------------------------
	this.seq = [];
	this.seq[0] = [0,1,2];
	this.seq[1] = [3,3,4];
	this.seq[2] = [0,2,2];
	this.seq[3] = [2,5,4];
	this.seq[4] = [1,4,0];
	this.seq[5] = [3,3,3];
	this.seq[6] = [0,3,2];
	this.seq[7] = [3,3,2];
	this.seq[8] = [4,1,2];
	
	this.seqR = -1;
};

MyBoard.prototype = Object.create(MyPrimitive.prototype);
MyBoard.prototype.constructor = MyBoard;

MyBoard.prototype.placePiece = function(pieceId, x, y)  {

	var piece = this.pieces[pieceId];
		
	var x2 = (this.baseXsize/2 + this.baseXsize/4)*2/3*x +  this.baseXsize*(this.baseXpos/1.5);
	var y2 = this.baseYpos;
	var z2 = -(this.baseYsize/2)*2/3*x*Math.cos(30*Math.PI/180) - this.baseYsize*y*2/3*Math.cos(30*Math.PI/180) - this.baseYsize*(this.baseZpos/1.5);

	var dist = vec3.dist([x2, y2 + 6, z2], piece.coords);
					
	this.animation = new LinearAnimation(dist*0.20, [[piece.coords[0], piece.coords[1], piece.coords[2]],[piece.coords[0], 3.0, piece.coords[2]], [x2, y2 + 3, z2], [x2, y2, z2]])
	
	this.animationId = pieceId;
	this.animation.start();	
	
	this.pieces[pieceId].setCoords(x2, y2, z2);
}

MyBoard.prototype.update = function(delta) {
	if(this.animationId != null) {		
		this.animation.step(delta);
		if (!this.animation.active) {			
			this.animationId = null;			
		}
	}		
	if(this.animationId == null){
		this.seqR++;

		if(this.seqR < this.seq.length)
			this.placePiece(this.seq[this.seqR][0], this.seq[this.seqR][1], this.seq[this.seqR][2]);
	}
}

MyBoard.prototype.display = function() {


	this.scene.pushMatrix();

		this.scene.scale(1.0, 1.0, 1.0);
		this.scene.translate(0.0, 0.0, 0.0);

		this.scene.pushMatrix();	
			this.scene.scale(this.baseXsize, 1.0, this.baseYsize); 
			this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);
			this.scene.translate(this.baseXpos, this.baseZpos, this.baseYpos);

			for(var y= 0; y < 7; y++) {
				for(var x = 0; x < 7; x ++) {
					this.scene.pushMatrix();
						this.hexTexture.bind();
						this.scene.translate(x*0.75, y*Math.cos(30*Math.PI/180) + 0.5*x*Math.cos(30*Math.PI/180), 0.0);
						this.scene.scale(0.5, 0.5, 0.5);	 
						this.hex.display();
						this.scene.translate(0.0, 0.0, -1.0);
						this.hexTexture.unbind();
						if(y == 0 || x == 0 || y == 6 || x == 6) {	
							this.cyl.display();
						}
					this.scene.popMatrix();  
				}        
			}
		this.scene.popMatrix();

		this.scene.pushMatrix();						
			this.scene.scale(this.baseXsize*7.0, 1.0, this.baseYsize*12.0);	
			this.scene.translate(-0.5, -0.5, 0.5);					
			this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);					
			this.base.display();
		this.scene.popMatrix();


		this.scene.pushMatrix();
			this.scene.translate(-0.5, -0.25, 17.0);
			this.pieceHolder.display();
		this.scene.popMatrix();	

		this.scene.pushMatrix();
			this.scene.translate(-17.5, -0.25, -29.0);		
			this.pieceHolder.display();
		this.scene.popMatrix();	


		this.scene.pushMatrix();
			this.scene.scale(this.baseXsize*1.5/5.0, this.baseYsize*1.3/5.0, this.baseXsize*1.5/5.0);			
			for(var i = 0; i < this.pieces.length; i++) {
				this.scene.pushMatrix();
					
					if(this.animation != null && this.animationId == i) {
						this.scene.multMatrix(this.animation.update());
					}
					else {
						this.scene.translate(this.pieces[i].coords[0], this.pieces[i].coords[1], this.pieces[i].coords[2]);
					}
					this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);

					
					this.pieces[i].display();
				this.scene.popMatrix();
			}
		this.scene.popMatrix();
		
	
		
 };

