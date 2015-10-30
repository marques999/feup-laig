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
function CircularAnimation(id, span, center, radius, startang, rotang) {

	Animation.call(this, id, span);

	this.initial = mat4.create();
	this.center = center;
	this.radius = radius;
	this.angleStart = startang * Math.PI / 180;
	this.angleEnd = rotang * Math.PI / 180;
	this.velocity = (this.angleEnd - this.angleStart) / this.span;

	mat4.identity(this.initial);
	mat4.translate(this.initial, this.initial, this.center);
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

/**
 * inicializa a animação com os valores por omissão
 * @return {null}
 */
CircularAnimation.prototype.start = function() {
	this.active = true;
	this.current = this.angleStart;
	this.currentTime = 0.0;
};

/**
 * calcula a matriz da animação para os novos valores
 * @return {null}
 */
CircularAnimation.prototype.update = function() {
	mat4.copy(this.matrix, this.initial);
	mat4.rotateY(this.matrix, this.matrix, this.current);
	mat4.translate(this.matrix, this.matrix, [this.radius, 0.0, 0.0]);
};

/**
 * avança a animação em deltaTime unidades de tempo, caso esta se encontre ativa
 * @param {Number} deltaTime - tempo decorrido desde a última verificação
 * @return {null}
 */
CircularAnimation.prototype.step = function(deltaTime) {

	if (!this.active) {
		return null;
	}

	if (this.currentTime < this.span) {
		this.current += this.velocity * deltaTime;
		this.currentTime += deltaTime;
	}
	else {
		this.stop();
	}
};