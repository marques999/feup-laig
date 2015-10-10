function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) {
	
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();
	this.lights = {};

	return true;
};

MyInterface.prototype.pushLight = function(name, id, enabled) {
	
	var self = this;

	this.lights[name] = enabled;
	this.gui.add(this.lights, name).onChange(function(value) {
		self.scene.toggleLight(id, value);
	});
};