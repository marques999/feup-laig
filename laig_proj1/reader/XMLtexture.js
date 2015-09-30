function XMLtexture(path, factorS, factorT) {
    this.path = path;
    this.factorS = factorS;
    this.factorT = factorT;
};

XMLtexture.prototype = Object.create(Object.prototype);
XMLtexture.prototype.constructor = XMLtexture;

XMLtexture.prototype.setFactor = function(factorS, factorT) {

	if (factorS != null) {
		this.factorS = factorS;
	}
	
	if (factorT == null) {
		this.factorT = factorT;
	}
}

XMLtexture.prototype.apply = function(scene, material) {
	material.loadTexture.call(scene, this.path);
	material.setTextureWrap.call(scene, "REPEAT", "REPEAT");
};