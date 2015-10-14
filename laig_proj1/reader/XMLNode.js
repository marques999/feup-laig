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

XMLNode.prototype.addChild = function(child) {
	this.children.push(child);
};

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

XMLNode.prototype.scale = function(coords) {
	mat4.scale(this.matrix, this.matrix, coords);
};

XMLNode.prototype.translate = function(coords) {
	mat4.translate(this.matrix, this.matrix, coords);	
};