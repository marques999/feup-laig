/**
 * construtor default da classe 'LinearAnimation'
 * @constructor
 * @author Diogo Marques
 * @param {String} id - identificador da animação
 * @param {Number} span - duração da animação (em segundos)
 * @param {Number[]} points - pontos de controlo da trajetória
 * @return {null}
 */
function LinearAnimation(id, span, points) {
	
	Animation.call(this, id, span);
	
	this.points = points;
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;