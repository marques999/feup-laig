/**
 * construtor default da classe 'objectScore'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectScore(scene) {

	MyPrimitive.call(this, scene);

	this.DIGITS = [];
	this.currentSeconds = 0.0;
	this.LEFT_DIGITS = [10, 1];
	this.RIGHT_DIGITS = [10, 2];
	this.texelLength = 1/16;

	for (var i = 0; i <= 10; i++) {
		this.DIGITS[i] = new ObjectClockDigit(scene, this.texelLength * i, this.texelLength * (i + 1));
	}

	this.DIGITS[11] = new ObjectClockDigit(scene, (11/16) + this.texelLength / 4, (12/16) - this.texelLength / 4);
	this.DIGITS[12] = new ObjectClockDigit(scene, (12/16), (13/16));
	this.defaultMaterial = new CGFappearance(scene);
	this.CLOCK_material = new CGFappearance(scene);
	this.CLOCK_material.loadTexture("scenes/images/clock.png");
};

ObjectScore.prototype = Object.create(MyPrimitive.prototype);
ObjectScore.prototype.constructor = ObjectScore;

/**
 * desenha a primitva 'objectScore' na XMLScene correspondente
 * @return {null}
 */
ObjectScore.prototype.display = function() {
	this.scene.pushMatrix();
	this.CLOCK_material.apply();
	this.DIGITS[this.LEFT_DIGITS[0]].display();
	this.scene.translate(1.0, 0.0, 0.0);
	this.DIGITS[this.LEFT_DIGITS[1]].display();
	this.scene.translate(2.0, 0.0, 0.0);
	this.DIGITS[this.RIGHT_DIGITS[0]].display();
	this.scene.translate(1.0, 0.0, 0.0);
	this.DIGITS[this.RIGHT_DIGITS[1]].display();
	this.defaultMaterial.apply();
	this.scene.popMatrix();
};

ObjectScore.prototype.update = function(player1Score, player2Score) {

	this.LEFT_DIGITS[0] = Math.trunc(player1Score / 10) % 10 - 1;
	if (this.LEFT_DIGITS[0] < 0) {
		this.LEFT_DIGITS[0] = 10;
	}

	this.LEFT_DIGITS[1] = Math.trunc(player1Score % 10) - 1;
	if (this.LEFT_DIGITS[1] < 0) {
		this.LEFT_DIGITS[1] = 9;
	}

	this.RIGHT_DIGITS[0] = Math.trunc(player2Score / 10) % 10 - 1;
	if (this.RIGHT_DIGITS[0] < 0) {
		this.RIGHT_DIGITS[0] = 10;
	}

	this.RIGHT_DIGITS[1] = Math.trunc(player2Score % 10) - 1;
	if (this.RIGHT_DIGITS[1] < 0) {
		this.RIGHT_DIGITS[1] = 9;
	}
};