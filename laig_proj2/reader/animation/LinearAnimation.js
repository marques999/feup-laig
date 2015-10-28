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
	this.sections = points.length;
	this.delta = [];
	this.duration = [];
	this.orientation = [];

	// CALCULA ORIENTAÇÃO INICIAL
	this.delta[0] = vec3.create();
	this.duration[0] = 0.0;
	this.orientation[0] = vec3.fromValues(1.0, 0.0, 0.0);

	// CALCULA DISTÂNCIAS PARCIAIS ENTRE PONTOS DE CONTROLO
	var totalDistance = 0.0;
	for (var i = 1; i < this.sections; i++) {
		totalDistance += vec3.dist(this.points[i], this.points[i - 1]);
	}

	// CALCULA DELTAS E ORIENTAÇÕES PARA RESTANTES PONTOS
	for (var i = 1; i < this.sections; i++) {

		var orientation = 0;
		var direction = vec3.create();
		var distance = vec3.dist(this.points[i], this.points[i - 1]);
		var relative = (distance / totalDistance) * this.span;

		this.duration[i] = this.duration[i - 1] + relative;
		this.delta[i] = vec3.create();

		if (relative > 0) {
			vec3.subtract(direction, this.points[i], this.points[i - 1]);
			vec3.scale(this.delta[i], direction, 1.0 / relative);
			orientation = this.orientate(direction);
		}

		this.orientation[i] = orientation;
	}
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.orientate = function(vector) {

	if (vector[0] == 0 && vector[2] == 0) {
		return 0;
	}

	var N =  Math.sqrt(vector[0] * vector[0] + vector[2] * vector[2]);

	if (N > 0.0) {
		vector[0] /= N;
		vector[2] /= N;
	}

	if (vector[2] > 0 && vector[0] > 0) {
		 return Math.acos(vector[0]) - Math.PI / 2;
	}

	if (vector[2] > 0 && vector[0] < 0) {
		return Math.acos(vector[0]) + Math.PI / 2;
	}

	return Math.acos(vector[0]);
}

LinearAnimation.prototype.start = function() {

	this.active = true;
	this.currentTime = 0;
	this.currentDelta = vec3.create();
	this.currentPosition = vec3.create();
	this.currentSection = 0;

	vec3.copy(this.currentPosition, this.points[0]);
};

LinearAnimation.prototype.update = function() {

	mat4.identity(this.matrix);
	mat4.translate(this.matrix, this.matrix, this.currentPosition);
	mat4.rotateY(this.matrix, this.matrix, this.orientation[this.currentSection]);

	return this.matrix;
};

LinearAnimation.prototype.step = function(deltaTime) {

	if (!this.active) {
		return;
	}

	this.currentTime += deltaTime;

	if (this.currentTime > this.duration[this.currentSection]) {
		if (++this.currentSection == this.sections) {
			this.currentSection--;
			this.stop();
		}
	}

	vec3.scale(this.currentDelta, this.delta[this.currentSection], deltaTime);
	vec3.add(this.currentPosition, this.currentPosition, this.currentDelta);
};