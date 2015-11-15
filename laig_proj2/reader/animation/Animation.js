/**
 * construtor default da classe 'Animation'
 * @constructor
 * @author Diogo Marques
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

/**
 * avança a animação em deltaTime unidades de tempo
 * @param {Number} deltaTime - tempo decorrido desde a última verificação
 * @return {null}
 */
Animation.prototype.step = function(deltaTime) {
	return null;
};

/**
 * calcula uma nova matriz de animação para os parâmetros atuais
 * @return {null}
 */
Animation.prototype.update = function() {
	return null;
};

/**
 * inicializa a animação com os valores por omissão
 * @return {null}
 */
Animation.prototype.start = function() {
	this.active = true;
};

/**
 * interrompe a animação no seu estado atual
 * @return {null}
 */
Animation.prototype.stop = function() {
	this.active = false;
};