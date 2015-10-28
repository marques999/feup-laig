/**
 * construtor default da classe 'XMLnode'
 * @constructor
 * @author Carlos Samouco
 * @param {String} id - identificador do node
 * @param {String} textureId -  identificador da textura associada a este node
 * @param {String} materialId - identificador do material associado a este node
 * @return {null}
 */
function XMLnode(id, textureId, materialId) {

	this.id = id;
	this.indegree = 0;
	this.textureId = textureId;
	this.materialId = materialId;
	this.matrix = mat4.create();
	this.animations = [];
	this.animationNumber = 0;
	this.children = [];

	mat4.identity(this.matrix);
};

XMLnode.prototype = Object.create(Object.prototype);
XMLnode.prototype.constructor = XMLnode;

/**
 * acrescenta um descendente ao final da lista de descendentes deste node
 * @param {String} child - id do node descendente
 * @return {null}
 */
XMLnode.prototype.addChild = function(child) {
	this.children.push(child);
};

/**
 * acrescenta uma animação no final da lista de animações deste node
 * @param {Animation} animation - estrutura de dados contendo uma animação
 * @return {null}
 */
XMLnode.prototype.addAnimation = function(animation) {
	this.animations.push(animation);
};

/**
 * multiplica a matriz de transformação deste node por uma matriz de rotação
 * @param {String} axis - vetor de coordenadas do eixo de rotação (x, y, z)
 * @param {Number} angle - ângulo da rotação (em graus)
 * @return {null}
 */
XMLnode.prototype.rotate = function(axis, angle) {

	if (axis == 'x') {
		mat4.rotateX(this.matrix, this.matrix, angle * Math.PI / 180);
	}
	else if (axis == 'y') {
		mat4.rotateY(this.matrix, this.matrix, angle * Math.PI / 180);
	}
	else if (axis == 'z') {
		mat4.rotateZ(this.matrix, this.matrix, angle * Math.PI / 180);
	}
};

/**
 * multiplica a matriz de transformação deste node por uma matriz de escalamento
 * @param {Number[]} coords - vetor de coordenadas (x, y, z) do escalamento
 * @return {null}
 */
XMLnode.prototype.scale = function(coords) {
	mat4.scale(this.matrix, this.matrix, coords);
};

/**
 * multiplica a matriz de transformação deste node por uma matriz de translação
 * @param {Number[]} coords - vetor de coordenadas (x, y, z) da translação
 * @return {null}
 */
XMLnode.prototype.translate = function(coords) {
	mat4.translate(this.matrix, this.matrix, coords);
};

/**
 * multiplica a matriz de transformação deste node por uma matriz de translação
 * @param {Number} deltaTime - intervalo de tempo decorrido desde o último update
 * @return {null}
 */
XMLnode.prototype.updateAnimation = function(deltaTime) {

	var currentAnimation = this.animations[this.animationNumber];

	if (currentAnimation == null) {
		return;
	}

	if (currentAnimation.active) {
		this.animations[this.animationNumber].step(deltaTime);
	}
	else {
		this.animationNumber = (this.animationNumber + 1) % this.animations.length;
		this.animations[this.animationNumber].start();
	}
};

/**
 * aplica a matriz de transformação da animação corrente
 * @return {Mat4|null} - null se o node não tiver animações ou estas tiverem já terminado
 */
XMLnode.prototype.applyAnimation = function() {

	var currentAnimation = this.animations[this.animationNumber];

	if (currentAnimation != null && currentAnimation != undefined) {
		return currentAnimation.update();
	}
};