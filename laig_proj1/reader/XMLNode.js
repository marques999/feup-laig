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
 * Adds a new descendant to the node. 
 * @param {Character} child 
 * @return {null} 
 */
XMLNode.prototype.addChild = function(child) {
	this.children.push(child);
};

/**
 * Multiplies the node tranformation matrix by the correspondant rotation matrix. 
 * @param {Character} axis 
 * @param {Number} angle
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
 * Multiplies the node tranformation matrix by the correspondant scale matrix. 
 * @param {Array} coords 
 * @return {null} 
 */
XMLNode.prototype.scale = function(coords) {
	mat4.scale(this.matrix, this.matrix, coords);
};


/**
 * Multiplies the node tranformation matrix by the correspondant translation matrix. 
 * @param {Array} coords 
 * @return {null} 
 */
XMLNode.prototype.translate = function(coords) {
	mat4.translate(this.matrix, this.matrix, coords);	
};