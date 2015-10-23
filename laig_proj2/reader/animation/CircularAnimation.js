/**
 * construtor default da classe 'CircularAnimation'
 * @constructor
 * @author Diogo Marques
 * @param {String} id - identificador da animação
 * @param {Number} span - duração da animação (em segundos)
 * @param {Number[]} center - centro de rotação
 * @param {Number} radius - raio da rotação em relação ao seu centro
 * @param {Number} start - ângulo inicial da rotação
 * @param {Number} angle - ângulo final da rotação
 * @return {null}
 */
function CircularAnimation(id, span, center, radius, start, angle) {

	Animation.call(this, id, span);

	this.initial = mat4.create();
	this.center = center;
	this.radius = radius;
	this.angleStart = start * Math.PI / 180;
	this.angleEnd = angle * Math.PI / 180;
	this.velocity = (this.angleEnd - this.angleStart) / this.span;

	mat4.identity(this.initial);
	mat4.translate(this.initial, this.initial, this.center);
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function() {
	
	mat4.copy(this.matrix, this.initial);
	mat4.rotateY(this.matrix, this.matrix, this.current);
	mat4.translate(this.matrix, this.matrix, [this.radius, 0.0, 0.0]);
	
	return this.matrix;
};

CircularAnimation.prototype.step = function(updateInterval) {
	
	if (!this.active) {
		return null;
	}
	
	if (this.current < this.angleEnd) {
		this.current += this.velocity * updateInterval;
	}
	else {
		this.stop();
	}
};

CircularAnimation.prototype.start = function() {
	this.active = true;
	this.current = this.angleStart;
};