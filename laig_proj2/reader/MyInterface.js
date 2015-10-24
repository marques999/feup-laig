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
 * @return {Boolean}
 */
MyInterface.prototype.init = function(application) {

	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();
	this.group = this.gui.addFolder("Lights");
	this.group.open();
	this.lights = {};

	return true;
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