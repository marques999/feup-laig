/**
 * construtor default da classe 'Animation'
 * @constructor
 * @author Diogo Marques
 * @param {String} id - identificador da animação
 * @param {Number} span - duração da animação (em segundos)
 * @return {null}
 */
function Animation(id, span) {
	this.id = id;
	this.span = span;
};

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;
Animation.prototype.apply = function() {};
Animation.prototype.step = function() {};