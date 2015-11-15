/**
 * construtor default da classe 'LinearAnimation'
 * @constructor
 * @author Diogo Marques
 * @param {Number} span - duração da animação (em segundos)
 * @param {Number[]} points - pontos de controlo da trajetória
 * @return {null}
 */
function LinearAnimation(span, points) {

	Animation.call(this, span);

	this.points = points;
	this.sections = points.length;
	this.totalDistance = 0.0;
	this.velocity = [];
	this.duration = [];
	this.orientation = [];
	this.duration[0] = 0.0;

	// CALCULA DISTÂNCIAS PARCIAIS E TOTAL ENTRE PONTOS DE CONTROLO
	for (var i = 1; i < this.sections; i++) {
		this.totalDistance += vec3.dist(this.points[i - 1], this.points[i]);
	}

	// CALCULA VELOCIDADE, DURAÇÃO E ORIENTAÇÃO PARA TODOS OS PONTOS DE CONTROLO
	for (var i = 1; i < this.sections; i++) {

		var sectionOrientation = 0.0;
		var sectionDisplacement = vec3.create();
		var sectionDistance = vec3.dist(this.points[i], this.points[i - 1]);
		var sectionDuration = (sectionDistance / this.totalDistance) * this.span;

		this.duration[i] = this.duration[i - 1] + sectionDuration;
		this.velocity[i] = vec3.create();

		if (sectionDistance > 0) {
			vec3.subtract(sectionDisplacement, this.points[i], this.points[i - 1]);
			vec3.scale(this.velocity[i], sectionDisplacement, 1.0 / sectionDuration);
			sectionOrientation = this.orientate(sectionDisplacement);
		}

		this.orientation[i] = sectionOrientation;
	}

	this.orientation[0] = this.orientation[1];
	this.velocity[0] = vec3.create();
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

/**
 * calcula a orientação do objecto com base no seu vetor deslocamento
 * @param {Number[]} vector - vector deslocamento do objeto, não-normalizado
 * @return {Number} - ângulo de rotação do objecto em torno do eixo Y
 */
LinearAnimation.prototype.orientate = function(vector) {

	if (vector[0] == 0 && vector[2] == 0) {
		return 0;
	}

	var N = Math.sqrt(vector[0] * vector[0] + vector[2] * vector[2]);

	vector[0] /= N;
	vector[2] /= N;

	if (vector[0] <= 0) {
		return 3*Math.PI/2 - Math.acos(vector[2]);
	}

	if (vector[2] <= 0) {
		return Math.acos(vector[0]);
	}

	return 3*Math.PI/2 + Math.acos(vector[0] > vector[2] ? vector[0] : vector[2]);
}

/**
 * inicializa a animação com os valores por omissão
 * @return {null}
 */
LinearAnimation.prototype.start = function() {

	this.active = true;
	this.currentTime = 0.0;
	this.currentDelta = vec3.create();
	this.currentPosition = vec3.clone(this.points[0]);
	this.currentSection = 1;
};

/**
 * calcula uma nova matriz de animação para os parâmetros atuais
 * @return {null}
 */
LinearAnimation.prototype.update = function() {

	mat4.identity(this.matrix);
	mat4.translate(this.matrix, this.matrix, this.currentPosition);
	mat4.rotateY(this.matrix, this.matrix, this.orientation[this.currentSection]);

	return this.matrix;
};

/**
 * avança a animação em deltaTime unidades de tempo
 * @param {Number} deltaTime - tempo decorrido desde a última verificação
 * @return {null}
 */
LinearAnimation.prototype.step = function(deltaTime) {

	if (this.active) {

		this.currentTime += deltaTime;

		if (this.currentTime >= this.duration[this.currentSection]) {
			if (++this.currentSection == this.sections) {
				this.currentSection--;
				this.stop();
			}
		}

		vec3.scale(this.currentDelta, this.velocity[this.currentSection], deltaTime);
		vec3.add(this.currentPosition, this.currentPosition, this.currentDelta);
	}
};