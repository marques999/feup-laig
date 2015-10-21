/**
 * construtor default da classe 'LinearAnimation'
 * @constructor
 * @author Diogo Marques
 * @param {String} id - identificador da anima��o
 * @param {Number} span - dura��o da anima��o (em segundos)
 * @param {Number[]} points - pontos de controlo da trajet�ria
 * @return {null}
 */
function LinearAnimation(id, span, points) {
	
	Animation.call(this, id, span);
	
	this.points = points;
};

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;