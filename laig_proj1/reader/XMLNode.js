/**
 * construtor default da classe 'XMLnode'
 * @param {String} id - identificador do node
 * @param {String} textureId -  identificador da textura associada a este node
 * @param {String} materialId - identificador do material associado a este node
 * @constructor
 */
function XMLnode(id, textureId, materialId) {

	this.id = id;
	this.indegree = 0;
	this.textureId = textureId;
	this.materialId = materialId;
	this.matrix = mat4.create();
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
 * @param {Array} coords - vetor de coordenadas (x, y, z) do escalamento 
 * @return {null} 
 */
XMLnode.prototype.scale = function(coords) {
	mat4.scale(this.matrix, this.matrix, coords);
};

/**
 * multiplica a matriz de transformação deste node por uma matriz de translação
 * @param {Array} coords - vetor de coordenadas (x, y, z) da translação
 * @return {null} 
 */
XMLnode.prototype.translate = function(coords) {
	mat4.translate(this.matrix, this.matrix, coords);
};