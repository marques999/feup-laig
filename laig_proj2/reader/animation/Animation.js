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
	this.active = false;
	this.matrix = mat4.create();
};

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;
Animation.prototype.apply = function() {};
Animation.prototype.step = function() {};

Animation.prototype.start = function() {
	this.active = true;
};

Animation.prototype.stop = function() {
	this.active = false;
};