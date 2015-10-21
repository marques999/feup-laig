/**
 * construtor default da classe 'CircularAnimation'
 * @constructor
 * @author Diogo Marques
 * @param {String} id - identificador da anima��o
 * @param {Number} span - dura��o da anima��o (em segundos)
 * @param {Number[]} center - centro de rota��o
 * @param {Number} radius - raio da rota��o em rela��o ao seu centro
 * @param {Number} start - �ngulo inicial da rota��o
 * @param {Number} angle - �ngulo final da rota��o
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