function XMLlight(id) {
    this.id = id;
};

XMLlight.prototype = Object.create(Object.prototype);
XMLlight.prototype.constructor = XMLlight;

XMLlight.prototype.getId = function() {
	return this.id;
}

XMLlight.prototype.isEnabled = function() {
	return this.enabled;
}

XMLlight.prototype.setEnabled = function(bool) {
	this.enabled = bool;
}

XMLlight.prototype.getPosition = function() {
	return this.position;
}

XMLlight.prototype.setPosition = function(position) {
	this.position = position;
}

XMLlight.prototype.getAmbient = function() {
	return this.ambient;
}

XMLlight.prototype.setAmbient = function(rgba) {
	this.ambient = rgba;
}

XMLlight.prototype.getDiffuse = function() {
	return this.diffuse;
}

XMLlight.prototype.setDiffuse = function(rgba) {
	this.diffuse = rgba;
}

XMLlight.prototype.getSpecular = function() {
	return this.diffuse;
}

XMLlight.prototype.setSpecular = function(rgba) {
	this.specular = rgba;
}