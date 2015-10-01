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