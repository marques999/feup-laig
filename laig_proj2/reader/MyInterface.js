/**
 * construtor default da classe 'MyInterface'
 * @constructor
 * @augments CGFinterface
 * @author Diogo Marques
 * @return {null}
 */
function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * inicializa a interface gráfica do utilizador
 * @return {null}
 */
MyInterface.prototype.init = function(application) {

	CGFinterface.prototype.init.call(this, application);

	var self = this;
	this.loopAnimations = true;
	this.updatePeriod = 60;
	this.gui = new dat.GUI();
	this.group = this.gui.addFolder("Animations");
	this.group.open();

	this.group.add(this, "updatePeriod", 1, 60).onChange(function(updatePeriod) {
		self.scene.setUpdatePeriod(1000 / updatePeriod);
	});

	this.group.add(this.scene, "pauseAnimations");
	this.group.add(this, "loopAnimations").onChange(function(loopValue) {
		self.scene.setAnimationLoop(loopValue);
	});

	this.group = this.gui.addFolder("Lights");
	this.group.open();
	this.lights = {};
};

/**
 * adiciona uma nova luz ao menu da interface
 * @param {String} name - identificador da CGFlight
 * @param {Number} id - posição (índice) desta CGFlight no array de luzes da CGFscene
 * @param {Boolean} enabled - estado ON/OFF inicial desta CGFlight
 * @return {null}
 */
MyInterface.prototype.pushLight = function(name, id, enabled) {

	var self = this;
	this.lights[name] = enabled;
	this.group.add(this.lights, name).onChange(function(value) {
		self.scene.toggleLight(id, value);
	});
};