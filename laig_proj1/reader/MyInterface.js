function MyInterface()
{
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application)
{
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();
	var groupLights = this.gui.addFolder("Lights");

	return true;
};

MyInterface.prototype.refreshLights = function(lArray, lNames) {

	groupLights.open();
	groupLights.add(this.scene, 'lights[0]', lNames[0]);
	groupLights.add(this.scene, 'lights[1]', lNanes[1]);

}