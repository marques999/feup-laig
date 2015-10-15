/**
 * construtor default da classe 'XMLNode'
 * @param id {String} - identificador do nó
 * @param textureId {String} -  identificador da textura associada a este nó
 * @param materialId {String} - identificador do material associado a este nó
 * @class
 */
function XMLNode(id, textureId, materialId) {

    this.id = id;
    this.indegree = 0;
    this.textureId = textureId;
    this.materialId = materialId;
    this.matrix = mat4.create();
    this.children = [];

    mat4.identity(this.matrix);
};

XMLNode.prototype = Object.create(Object.prototype);
XMLNode.prototype.constructor = XMLNode;


/**
 * acrescenta um descendente no final da lista de descendentes deste nó
 * @param {String} child - id do nó descendente
 * @return {null} 
 */
XMLNode.prototype.addChild = function(child) {
	this.children.push(child);
};

/**
 * multiplica a matriz de transformação do nó por uma matriz de rotação
 * @param {String} axis - eixo da rotação (x, y, z)
 * @param {Float} angle - ângulo da rotação (em graus)
 * @return {null} 
 */
XMLNode.prototype.rotate = function(axis, angle) {
	
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
 * multiplica a matriz de transformação do nó por uma matriz de escalamento
 * @param {Array} coords - vetor de coordenadas (x, y, z) do escalamento 
 * @return {null} 
 */
XMLNode.prototype.scale = function(coords) {
	mat4.scale(this.matrix, this.matrix, coords);
};


/**
 * multiplica a matriz de transformação do nó por uma matriz de translação
 * @param {Array} coords - vetor de coordenadas (x, y, z) da translação
 * @return {null} 
 */
XMLNode.prototype.translate = function(coords) {
	mat4.translate(this.matrix, this.matrix, coords);	
};