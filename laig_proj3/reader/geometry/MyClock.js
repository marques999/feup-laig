/**
 * construtor default da classe 'MyTailBooster'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function MyClock(scene) {

	MyPrimitive.call(this, scene);

	this.DIGITS = [];
	this.CLOCK = [10, 10, 11, 10, 10];
	this.texelLength = 1/16;

	for (var i = 0; i <= 10; i++) {
		this.DIGITS[i] = new MyClockDigit(scene, this.texelLength * i, this.texelLength * (i + 1));
	}

	this.DIGITS[11] = new MyClockDigit(scene, (11/16) + this.texelLength / 4, (12/16) - this.texelLength / 4);
	this.CLOCK_material = new CGFappearance(scene);
	this.CLOCK_material.loadTexture("scenes/images/clock.png");
};

MyClock.prototype = Object.create(MyPrimitive.prototype);
MyClock.prototype.constructor = MyClock;

/**
 * desenha a primitv5 'MyTailBooster' na XMLScene correspondente
 * @return {null}
 */
MyClock.prototype.display = function() {
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
};

MyClock.prototype.update = function(currTime) {

	var elapsedMinutes = Math.trunc((currTime / 1000 / 60) % 60);
	var elapsedHours = Math.trunc((currTime / 1000 / 60 / 60) % 12);

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