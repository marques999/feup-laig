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

	this.currentScene = 'Moon';
	this.loopAnimations = true;
	this.updatePeriod = 60;

	this.gameScenes = {
		'Apollo PT': 'MyShuttle.lsx',
		'Billiards': 'MyBilliards.lsx',
		'Solar System': 'MyPlanets.lsx'
	};

	this.gui = new dat.GUI();
	this.reset();
};

MyInterface.prototype.deleteFolder = function(folderName) {
    this.gui.__folders[folderName].close();
    this.gui.__folders[folderName].domElement.parentNode.parentNode.removeChild(this.gui.__folders[folderName].domElement.parentNode);
    this.gui.__folders[folderName] = undefined;
    this.gui.onResize();
};

MyInterface.prototype.initGame = function(gameBoard) {
	this.gameBoard = gameBoard;
	this.gui.add(this, "movieMenu");
}

MyInterface.prototype.movieMenu = function() {

	if (this.movieGroup != undefined && this.movieGroup != null) {
		this.deleteFolder("Movie");
		this.movieGroup = undefined;
	}

	var self = this;
	this.gameBoard.startMovie();
	this.movieGroup = this.gui.addFolder("Movie");
	this.movieGroup.open();
	this.movieGroup.add(this.gameBoard, "pauseMovie");
	
	this.movieGroup.add(this.gameBoard, "stopMovie").onChange(function(value) {
		self.deleteFolder("Movie");
		self.movieGroup = undefined;
	});

	this.movieGroup.add(this.gameBoard, "skipFrame");
	
	this.movieGroup.add(this.gameBoard, "movieDelay", 100, 5000);
	this.movieGroup.add(this.gameBoard, "movieSpeed", 1, 5);
	this.movieGroup.add(this.gameBoard, "movieFrame", 0, 4).listen();
};

MyInterface.prototype.sceneMenu = function() {
	
	if (this.sceneGroup != undefined && this.sceneGroup != null) {
		this.deleteFolder("Scene");
		this.sceneGroup = undefined;
	}

	var self = this;
	this.sceneGroup = this.gui.addFolder("Scene");
	this.sceneGroup.open();

	this.sceneGroup.add(this, "currentScene", this.gameScenes).onChange(function(currentScene) {
		self.scene.loadGraph(currentScene);
	});

	this.sceneGroup.add(this.scene, "cameraPosition", 0, 60.0).onChange(function(value) {
		self.scene.setCameraPosition(value);
	});

	this.sceneGroup.add(this.scene, "cameraTarget", 0, 360.0).onChange(function(value) {
		self.scene.setCameraTarget(value);
	});
};

MyInterface.prototype.cameraMenu = function() {

	if (this.camerasGroup != undefined && this.camerasGroup != null) {
		this.deleteFolder("Cameras");
		this.camerasGroup = null;
	}

	this.camerasGroup = this.gui.addFolder("Cameras");
	this.camerasGroup.open();
	this.camerasGroup.add(this.scene, "zoomIn");
	this.camerasGroup.add(this.scene, "zoomOut");
};

MyInterface.prototype.animationMenu = function() {

	if (this.animationsGroup != undefined && this.animationsGroup != null) {
		this.deleteFolder("Animations");
		this.animationsGroup = undefined;
	}

	this.animationsGroup = this.gui.addFolder("Animations");
	this.animationsGroup.open();
	this.animationsGroup.add(this, "updatePeriod", 1, 60).onChange(function(updatePeriod) {
		self.scene.setUpdatePeriod(1000 / updatePeriod);
	});
}

MyInterface.prototype.lightsMenu = function() {
	
	if (this.lightsGroup != undefined && this.lightsGroup != null) {
		this.deleteFolder("Lights");
		this.lightsGroup = undefined;
	}

	this.lightsGroup = this.gui.addFolder("Lights");
	this.lightsGroup.open();
	this.lights = {};
}

MyInterface.prototype.reset = function() {
	//--------------------------------------------------------		
	this.sceneMenu();
	//--------------------------------------------------------		
	this.cameraMenu();
	//--------------------------------------------------------		
	this.animationMenu();
	//--------------------------------------------------------		
	this.lightsMenu();
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
	this.lightsGroup.add(this.lights, name).onChange(function(value) {
		self.scene.toggleLight(id, value);
	});
};