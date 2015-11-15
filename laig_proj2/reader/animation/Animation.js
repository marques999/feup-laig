/**
 * construtor default da classe 'Animation'
 * @constructor
 * @author Diogo Marques
 * @param {String} id - identificador da animação
 * @param {Number} span - duração da animação (em segundos)
 * @return {null}
 */
function Animation(span) {
	this.span = span;
	this.active = false;
	this.matrix = mat4.create();
};

Animation.prototype = Object.create(Object.prototype);
Animation.prototype.constructor = Animation;

Animation.prototype.step = function(deltaTime) {
	return null;
};

Animation.prototype.update = function() {
	return null;
};

Animation.prototype.start = function() {
	this.active = true;
};

Animation.prototype.stop = function() {
	this.active = false;
};