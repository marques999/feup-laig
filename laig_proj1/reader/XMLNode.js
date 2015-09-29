function XMLNode(id, textureId, materialId) {
    this.id = id;
    this.textureId = textureId;
    this.materialId = materialId;
    this.geomTransf = [];   
    this.children = [];
};

XMLNode.prototype = Object.create(Object.prototype);
XMLNode.prototype.constructor = XMLNode;

XMLNode.prototype.addTransf = function(transf){
    this.geomTransf.push(transf);
}


XMLNode.prototype.addTChild = function(child){
     this.children.push(child);
}

//mandatory military service