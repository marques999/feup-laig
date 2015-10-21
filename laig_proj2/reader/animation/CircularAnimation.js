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
	
	this.center = center;
	this.radius = radius;
	this.start = start * Math.PI / 180;
	this.angle = angle * Math.PI / 180;
	this.angleIncrement = this.angle / (this.span * 60);
	this.currentAngle = this.start;
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.calculateTrajectory = function() {
};

CircularAnimation.prototype.step = function() {
	
	this.currentAngle += this.angleIncrement;
};