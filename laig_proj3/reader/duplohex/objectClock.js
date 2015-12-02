/**
 * construtor default da classe 'ObjectClock'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectClock(scene) {

	MyPrimitive.call(this, scene);

	this.DIGITS = [];
	this.currentSeconds = 0.0;
	this.CLOCK = [10, 10, 11, 10, 10];
	this.texelLength = 1/16;

	for (var i = 0; i <= 10; i++) {
		this.DIGITS[i] = new ObjectClockDigit(scene, this.texelLength * i, this.texelLength * (i + 1));
	}

	this.DIGITS[11] = new ObjectClockDigit(scene, (11/16) + this.texelLength / 4, (12/16) - this.texelLength / 4);
	this.DIGITS[12] = new ObjectClockDigit(scene, (12/16), (13/16));
	this.CLOCK_material = new CGFappearance(scene);
	this.CLOCK_material.loadTexture("scenes/images/clock.png");
};

ObjectClock.prototype = Object.create(MyPrimitive.prototype);
ObjectClock.prototype.constructor = ObjectClock;

/**
 * desenha a primitv5 'ObjectClock' na XMLScene correspondente
 * @return {null}
 */
ObjectClock.prototype.display = function() {
	this.scene.pushMatrix();
	this.CLOCK_material.apply();
	this.DIGITS[this.CLOCK[0]].display();
	this.scene.translate(1.0, 0.0, 0.0);
	this.DIGITS[this.CLOCK[1]].display();
	this.scene.translate(1.5, 0.0, 0.0);
	this.DIGITS[this.CLOCK[3]].display();
	this.scene.translate(1.0, 0.0, 0.0);
	this.DIGITS[this.CLOCK[4]].display();
	this.scene.translate(-1.75, 0.0, 0.0);
	this.scene.scale(0.5, 1.0, 1.0);
	this.DIGITS[this.CLOCK[2]].display();
	this.scene.popMatrix();
};

ObjectClock.prototype.update = function(currTime, lastUpdate) {

	var currentSeconds = currTime / 1000;
	var elapsedMinutes = Math.trunc((currentSeconds / 60) % 60);
	var elapsedHours = Math.trunc((currentSeconds / 60 / 60) % 24);
	this.currentSeconds += currTime - lastUpdate;

	if (this.currentSeconds > 500) {
		this.currentSeconds = 0;
		this.CLOCK[2] ^= 7;
	}

	this.CLOCK[0] = Math.trunc(elapsedHours / 10) - 1;
	if (this.CLOCK[0] < 0) {
		this.CLOCK[0] = 10;
	}

	this.CLOCK[1] = Math.trunc(elapsedHours % 10) - 1;
	if (this.CLOCK[1] < 0) {
		this.CLOCK[1] = 9;
	}

	this.CLOCK[3] = Math.trunc(elapsedMinutes / 10) - 1;
	if (this.CLOCK[3] < 0) {
		this.CLOCK[3] = 9;
	}

	this.CLOCK[4] = Math.trunc(elapsedMinutes % 10) - 1;
	if (this.CLOCK[4] < 0) {
		this.CLOCK[4] = 9;
	}
};