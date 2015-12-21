/**
 * construtor default da classe 'objectClock'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectClock(scene, player) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.DIGITS = [];
	this.CLOCK = [10, 10, 12, 10, 10];
	this.LEFT = [10, 1];
	this.RIGHT = [10, 2];
	this.materials = [];
	//--------------------------------------------------------
	this.plane = new MyPlane(scene,5);
	this.top = new MyRectangle(scene,-0.5, 0.5, 0.5, -0.5);
	this.ramp = new ObjectRamp(scene);
	this.player = player;
	//--------------------------------------------------------
	this.materials["clock"] = new CGFappearance(scene);
	this.materials["clock"].loadTexture("resources/clock.png");
	this.materials["body"] = new CGFappearance(scene);
	this.materials["body"].loadTexture("resources/clock_black.png");
	this.materials["top"] = new CGFappearance(scene);	
	this.materials["top"].loadTexture("resources/clock_top.png");
	this.materials["default"] = new CGFappearance(scene);
	this.materials["red"] = new CGFappearance(scene);
	this.materials["red"].setDiffuse(0.9, 0.05, 0.05, 0.6);
	this.materials["red"].setAmbient(0.9, 0.05, 0.05, 0.2);
	this.materials["red"].setSpecular(1.0, 1.0, 1.0, 0.5);
	this.materials["red"].setShininess(30);
	//--------------------------------------------------------
	this.currentMillis = 0.0;
	this.elapsedSeconds = 0.0;
	this.texelLength = 1/16;
	//--------------------------------------------------------
	for (var i = 0; i <= 10; i++) {
		this.DIGITS[i] = new ObjectDigit(scene, this.texelLength * i, this.texelLength * (i + 1));
	}
	//--------------------------------------------------------
	this.DIGITS[11] = new ObjectDigit(scene, (11/16) + this.texelLength / 4, (12/16) - this.texelLength / 4);
	this.DIGITS[12] = new ObjectDigit(scene, (12/16), (13/16));
};

ObjectClock.prototype = Object.create(MyPrimitive.prototype);
ObjectClock.prototype.constructor = ObjectClock;

/**
 * desenha a primitva 'objectClock' na XMLScene correspondente
 * @return {null}
 */
ObjectClock.prototype.display = function() {

	this.materials["body"].apply();

	this.scene.pushMatrix();					
		this.ramp.display();
		this.scene.translate(2.5, 0.0, 0.0);
		this.ramp.display();
		this.scene.translate(5,0.0, 0.0);
		this.ramp.display();
		this.scene.translate(2.5, 0.0, 0.0);
		this.ramp.display();			
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(5.25, -0.5, 0);
		this.scene.scale(10.5, -1.0, 5*Math.cos(Math.PI/4));
		this.plane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(5.25, 0.0, 1.25*Math.cos(Math.PI/4));
		this.scene.scale(10.5, 1.0, 2.5*Math.cos(Math.PI/4));
		this.plane.display();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(10.5, -0.25, 0.0);
		this.scene.scale(1.0, 0.5, 5*Math.cos(Math.PI/4));
		this.scene.rotate(Math.PI, 1, 1, 0);
		this.plane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();	
		this.scene.translate(0.0, -0.25, 0.0);	
		this.scene.scale(-1.0, -0.5, 5*Math.cos(Math.PI/4));
		this.scene.rotate(Math.PI, 1, 1, 0);
		this.plane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(10.5, 1.25*Math.cos(Math.PI/4), -1.25*Math.cos(Math.PI/4));
		this.scene.scale(1.0, 2.5*Math.cos(Math.PI/4), 2.5*Math.cos(Math.PI/4));
		this.scene.rotate(Math.PI, 1, 1, 0);
		this.plane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.0, 1.25*Math.cos(Math.PI/4), -1.25*Math.cos(Math.PI/4));
		this.scene.scale(-1.0, -2.5*Math.cos(Math.PI/4), 2.5*Math.cos(Math.PI/4));
		this.scene.rotate(Math.PI, 1, 1, 0);
		this.plane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();	
		this.scene.translate(5.25, -0.25, 2.5*Math.cos(Math.PI/4));	
		this.scene.scale(10.5, 0.5, 1.0);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();	
		this.scene.translate(5.25, 2.5*Math.cos(Math.PI/4) -0.25, 0.0);	
		this.scene.scale(10.5, 0.5, 1.0);
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();	
		this.scene.translate(5.25, 1.25*Math.cos(Math.PI/4) - 0.25, -2.5*Math.cos(Math.PI/4));	
		this.scene.scale(10.5, 2.5*Math.cos(Math.PI/4) + 0.5, 1.0);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	this.materials["top"].apply();
	this.scene.pushMatrix();
		this.scene.translate(5.25, 2.5*Math.cos(Math.PI/4), -1.25*Math.cos(Math.PI/4));
		this.scene.scale(10.5, 1.0, 2.5*Math.cos(Math.PI/4));
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.top.display();
	this.scene.popMatrix();


	this.scene.pushMatrix();
		this.materials["clock"].apply();	
		this.scene.translate(0.5, 0.0, 2*Math.sqrt(Math.cos(Math.PI/4)*Math.cos(Math.PI/4)));
		this.scene.rotate(-Math.PI/4, 1, 0, 0);
		//--------------------------------------------------------
		this.DIGITS[this.LEFT[0]].display();
		this.scene.translate(1.0, 0.0, 0.0);
		this.DIGITS[this.LEFT[1]].display();
		this.scene.translate(1.5, 0.0, 0.0);
		//--------------------------------------------------------
		this.DIGITS[this.CLOCK[0]].display();
		this.scene.translate(1.0, 0.0, 0.0);
		this.DIGITS[this.CLOCK[1]].display();
		this.scene.translate(1.5, 0.0, 0.0);
		this.DIGITS[this.CLOCK[3]].display();
		this.scene.translate(1.0, 0.0, 0.0);
		this.DIGITS[this.CLOCK[4]].display();
		this.scene.translate(-1.5, 0.0, 0.0);
		this.scene.scale(0.5, 1.0, 1.0);
		this.DIGITS[this.CLOCK[2]].display();
		this.scene.scale(2.0, 1.0, 1.0);
		this.scene.translate(3.0, 0.0, 0.0);
		//--------------------------------------------------------
		this.DIGITS[this.RIGHT[0]].display();
		this.scene.translate(1.0, 0.0, 0.0);
		this.DIGITS[this.RIGHT[1]].display();		
	this.scene.popMatrix();
	this.materials["default"].apply();
};

ObjectClock.prototype.update = function(currTime, lastUpdate, gameRunning) {

	this.LEFT[0] = ~~(this.player.discs / 10) % 10 - 1;
	if (this.LEFT[0] < 0) {
		this.LEFT[0] = 10;
	}

	this.LEFT[1] = ~~(this.player.discs % 10) - 1;
	if (this.LEFT[1] < 0) {
		this.LEFT[1] = 9;
	}

	this.RIGHT[0] = ~~(this.player.rings / 10) % 10 - 1;
	if (this.RIGHT[0] < 0) {
		this.RIGHT[0] = 10;
	}

	this.RIGHT[1] = ~~(this.player.rings % 10) - 1;
	if (this.RIGHT[1] < 0) {
		this.RIGHT[1] = 9;
	}

	if (!gameRunning) {
		return false;
	}

	this.currentMillis += currTime - lastUpdate;

	if (lastUpdate <= 0) {
		lastUpdate = currTime;
	}

	this.elapsedSeconds += ((currTime - lastUpdate) / 1000);
	var elapsedMinutes = ~~(this.elapsedSeconds % 60);
	var elapsedHours = ~~((this.elapsedSeconds / 60) % 60);

	if (this.currentMillis >= 500) {
		this.currentMillis = 0;
		this.CLOCK[2] ^= 7;
	}

	this.CLOCK[0] = ~~(elapsedHours / 10) - 1;
	if (this.CLOCK[0] < 0) {
		this.CLOCK[0] = 10;
	}

	this.CLOCK[1] = ~~(elapsedHours % 10) - 1;
	if (this.CLOCK[1] < 0) {
		this.CLOCK[1] = 9;
	}

	this.CLOCK[3] = ~~(elapsedMinutes / 10) - 1;
	if (this.CLOCK[3] < 0) {
		this.CLOCK[3] = 9;
	}

	this.CLOCK[4] = ~~(elapsedMinutes % 10) - 1;
	if (this.CLOCK[4] < 0) {
		this.CLOCK[4] = 9;
	}
};