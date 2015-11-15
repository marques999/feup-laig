/**
 * construtor default da classe 'CircularAnimation'
 * @constructor
 * @author Diogo Marques
 * @param {Number} span - duração da animação (em segundos)
 * @param {Number[]} center - centro de rotação
 * @param {Number} radius - raio da rotação em relação ao seu centro
 * @param {Number} start - ângulo inicial da rotação
 * @param {Number} angle - ângulo de rotação
 * @return {null}
 */
function CircularAnimation(span, center, radius, startang, rotang) {

	Animation.call(this, span);

	this.center = center;
	this.radius = radius;
	this.angleStart = startang * Math.PI / 180;
	this.angleDelta = rotang * Math.PI / 180;
	this.velocity = this.angleDelta / this.span;
};

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

/**
 * inicializa a animação com os valores por omissão
 * @return {null}
 */
CircularAnimation.prototype.start = function() {

	this.active = true;
	this.currentAngle = this.angleStart;
	this.currentTime = 0.0;
};

/**
 * calcula uma nova matriz de animação para os parâmetros atuais
 * @return {null}
 */
CircularAnimation.prototype.update = function() {

	mat4.identity(this.matrix);
	mat4.translate(this.matrix, this.matrix, this.center);
	mat4.rotateY(this.matrix, this.matrix, this.currentAngle);
	mat4.translate(this.matrix, this.matrix, [this.radius, 0.0, 0.0]);

	return this.matrix;
};

/**
 * avança a animação em deltaTime unidades de tempo
 * @param {Number} deltaTime - tempo decorrido desde a última verificação
 * @return {null}
 */
CircularAnimation.prototype.step = function(deltaTime) {

	if (this.active) {

		this.currentTime += deltaTime;

		if (this.currentTime < this.span) {
			this.currentAngle += this.velocity * deltaTime;
		}
		else {
			this.stop();
		}
	}
};