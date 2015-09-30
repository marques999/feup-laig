function XMLNode(id, textureId, materialId) {
    this.id = id;
    this.indegree = 0;
    this.textureId = textureId;
    this.materialId = materialId;
    this.geomTransf = [];   
    this.children = [];
};

XMLNode.prototype = Object.create(Object.prototype);
XMLNode.prototype.constructor = XMLNode;

XMLNode.prototype.addTransformation = function(transf) {
    this.geomTransf.push(transf);
}

XMLNode.prototype.addChild = function(child) {
     this.children.push(child);
}

XMLNode.prototype.applyTransform = function(scene) {
   // for (var i = this.geomTransf.length - 1; i >= 0; i--) {
//
    //    this.geomTransf[i].apply(scene);
   // }
}

//mandatory military service