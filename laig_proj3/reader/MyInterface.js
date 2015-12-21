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

	this.currentScene = 'None';
	this.updatePeriod = 60.0;

	this.gameScenes = {
		'None': 'example.lsx',
		'Apollo PT': 'MyShuttle.lsx',
		'Billiards': 'MyBilliards.lsx',
		'Solar System': 'MyPlanets.lsx'
	};

	this.playerColors = {
		'Black': 'blackPlayer',
		'White': 'whitePlayer'
	};

	this.gameBoard = {
		'default': true,
		'diagonal': false,
		'small': false
	};

	this.gameMode = {
		'pvp': true,
		'pvb': false,
		'bvb': false
	};

	this.gameDifficulty =  {
		'random': true,
		'smart': false
	}

	this.playerColor = 'blackPlayer';
	this.gui = new dat.GUI();
	this.reset();
};

MyInterface.prototype.setScene = function(xmlScene) {
	this.scene = xmlScene;
	this.mainMenu();
}

MyInterface.prototype.deleteFolder = function(folderName) {
	this.gui.__folders[folderName].close();
	this.gui.__folders[folderName].domElement.parentNode.parentNode.removeChild(this.gui.__folders[folderName].domElement.parentNode);
	this.gui.__folders[folderName] = undefined;
	this.gui.onResize();
};

MyInterface.prototype.initGame = function(gameBoard) {
	this.board = gameBoard;
	//this.gui.add(this, "movieMenu").name("View Replay");
}

MyInterface.prototype.readPreferences = function() {

	if (this.scene == undefined || this.scene == null) {
		return;
	}

	var preferencesArray = this.scene.getPreferences();
	this.playerColor = preferencesArray.color;
	this.updatePeriod = preferencesArray.getFps();
	this.toggleBoolean(this.gameMode, preferencesArray.mode);
	this.toggleBoolean(this.gameBoard, preferencesArray.board);
	this.toggleBoolean(this.gameDifficulty, preferencesArray.difficulty);
};

MyInterface.prototype.savePreferences = function() {

	if (this.scene == undefined || this.scene == null) {
		return;
	}

	var preferencesArray = this.scene.getPreferences();

	preferencesArray.setColor(this.playerColor);
	preferencesArray.setMode(this.getBoolean(this.gameMode));
	preferencesArray.setBoard(this.getBoolean(this.gameBoard));
	preferencesArray.setDifficulty(this.getBoolean(this.gameDifficulty));
	preferencesArray.setFps(this.updatePeriod);
	preferencesArray.save();

	this.scene.setUpdatePeriod(1000 / this.updatePeriod);
	this.settingsMenu_close();
	this.mainMenu();
};

MyInterface.prototype.mainMenu_close = function() {

	if (this.mainGroup != undefined && this.mainGroup != null) {
		this.deleteFolder("Main Menu");
		this.mainGroup = undefined;
	}
};

MyInterface.prototype.settingsMenu = function() {
	//---------------------------------------------------------
	if (this.scene == undefined || this.scene == null) {
		return;
	}
	//---------------------------------------------------------
	this.mainMenu_close();
	this.readPreferences();
	//---------------------------------------------------------
	var self = this;
	this.settingsGroup = this.gui.addFolder("Settings");
	this.settingsGroup.open();
	//---------------------------------------------------------
	this.settingsGroup.add(this, "savePreferences").name("Save Settings");
	this.settingsGroup.add(this, "readPreferences").name("Reset Settings");
	this.settingsGroup.add(this, "updatePeriod", 1, 60).name("Target FPS").listen();
	this.settingsGroup.add(this, "playerColor", this.playerColors).name("Player Color").listen().onChange(function() {
		self.board.updatePlayer(self.playerColor);
	});
	//---------------------------------------------------------
	this.boardGroup = this.gui.addFolder("Board");
	this.modeGroup = this.gui.addFolder("Mode");
	this.difficultyGroup = this.gui.addFolder("Difficulty");
	//---------------------------------------------------------
	this.boardGroup.open();
	this.modeGroup.open();
	this.difficultyGroup.open();
	//---------------------------------------------------------
	this.boardGroup.add(this.gameBoard, "default").name("Default (7 x 7)").listen().onChange(function(value) {
		self.toggleBoolean(self.gameBoard, "default");
		self.board.updateMatrix('default');
	});
	//---------------------------------------------------------
	this.boardGroup.add(this.gameBoard, "diagonal").name("Diagonal (7 x 7)").listen().onChange(function(value) {
		self.toggleBoolean(self.gameBoard, "diagonal");
		self.board.updateMatrix('diagonal');
	});
	//---------------------------------------------------------
	this.boardGroup.add(this.gameBoard, "small").name("Small (6 x 6)").listen().onChange(function(value) {
		self.toggleBoolean(self.gameBoard, "small");
		self.board.updateMatrix('small');
	});
	//---------------------------------------------------------
	this.modeGroup.add(this.gameMode, "pvp").name("Player VS Player").listen().onChange(function(value) {
		self.toggleBoolean(self.gameMode, "pvo");
	});
	//---------------------------------------------------------
	this.modeGroup.add(this.gameMode, "pvb").name("Player VS Bot").listen().onChange(function(value) {
		self.toggleBoolean(self.gameMode, "pvb");
	});
	//---------------------------------------------------------
	this.modeGroup.add(this.gameMode, "bvb").name("Bot VS Bot").listen().onChange(function(value) {
		self.toggleBoolean(self.gameMode, "bvb");
	});
	//---------------------------------------------------------
	this.difficultyGroup.add(this.gameDifficulty, "random").name("Random Bots").listen().onChange(function(value) {
		self.gameDifficulty["random"] = true;
		self.gameDifficulty["smart"] = false;
	});
	//---------------------------------------------------------
	this.difficultyGroup.add(this.gameDifficulty, "smart").name("Smart Bots").listen().onChange(function(value) {
		self.gameDifficulty["random"] = false;
		self.gameDifficulty["smart"] = true;
	});
};

MyInterface.prototype.settingsMenu_close = function(self) {
	//---------------------------------------------------------
	if (this.settingsGroup != undefined && this.settingsGroup != null) {
		this.deleteFolder("Settings");
		this.settingsGroup = undefined;
	}
	//---------------------------------------------------------
	if (this.boardGroup != undefined && this.boardGroup != null) {
		this.deleteFolder("Board");
		this.boardGroup = undefined;
	}
	//---------------------------------------------------------
	if (this.modeGroup != undefined && this.modeGroup != null) {
		this.deleteFolder("Mode");
		this.modeGroup = undefined;
	}
	//---------------------------------------------------------
	if (this.difficultyGroup != undefined && this.difficultyGroup != null) {
		this.deleteFolder("Difficulty");
		this.difficultyGroup = undefined;
	}
	//---------------------------------------------------------
};

MyInterface.prototype.aboutMenu = function() {
	alert("HELLO");
};

MyInterface.prototype.getBoolean = function(array) {

	for (var key in array) {
		if (array[key]) {
			return key;
		}
	}
}

MyInterface.prototype.toggleBoolean = function(array, element) {

	for (var key in array) {
		if (key != element) {
			array[key] = false;
		}
	}

	array[element] = true;
};

MyInterface.prototype.gameMenu = function() {

	if (this.scene == undefined || this.scene == null) {
		return;
	}

	var self = this;
	this.mainMenu_close();
	this.scene.initServer();
	//---------------------------------------------------------
	this.gameGroup = this.gui.addFolder("Game");
	this.camerasGroup = this.gui.addFolder("Cameras");
	//---------------------------------------------------------
	this.gameGroup.open();
	this.camerasGroup.open();
	//---------------------------------------------------------
	this.gameGroup.add(this, "mainMenu").name("Quit Game").onChange(function(){
		self.gameMenu_close();
	});
	//---------------------------------------------------------
	this.gameGroup.add(this, "currentScene", this.gameScenes).onChange(function(currentScene) {
		self.scene.loadGraph(currentScene);
	});
	//---------------------------------------------------------
	this.camerasGroup.add(this.scene, "zoomIn").name("Zoom In");
	this.camerasGroup.add(this.scene, "zoomOut").name("Zoom Out");
	//---------------------------------------------------------
	this.camerasGroup.add(this.scene, "cameraPosition", 0, 60.0).name("Position").onChange(function(value) {
		self.scene.setCameraPosition(value);
	});
	//---------------------------------------------------------
	this.camerasGroup.add(this.scene, "cameraTarget", 0, 360.0).name("Target").onChange(function(value) {
		self.scene.setCameraTarget(value);
	});
};

MyInterface.prototype.gameMenu_close = function() {

	if (this.gameGroup != undefined && this.gameGroup != null) {
		this.deleteFolder("Game");
		this.gameGroup = undefined;
	}

	if (this.camerasGroup != undefined && this.camerasGroup != null) {
		this.deleteFolder("Cameras");
		this.camerasGroup = undefined;
	}
};

MyInterface.prototype.mainMenu = function() {

	if (this.scene == undefined || this.scene == null) {
		return;
	}

	var self = this;
	this.mainGroup = this.gui.addFolder("Main Menu");
	this.mainGroup.open();
	this.mainGroup.add(this, "gameMenu").name("Start Game");
	this.mainGroup.add(this, "settingsMenu").name("Settings");
	this.mainGroup.add(this, "aboutMenu").name("About").onChange(function() {
		self.deleteFolder("Main Menu");
		self.movieGroup = undefined;
	});
};

MyInterface.prototype.movieMenu = function() {

	if (this.board == undefined || this.board == null) {
		return;
	}

	var self = this;
	this.board.startMovie();
	this.movieGroup = this.gui.addFolder("Movie");
	this.movieGroup.open();
	this.movieGroup.add(this.board, "pauseMovie").name("Pause Movie");
	this.movieGroup.add(this.board, "stopMovie").name("Stop Movie").onChange(function(value) {
		self.deleteFolder("Movie");
		self.movieGroup = undefined;
	});

	this.movieGroup.add(this.board, "skipFrame").name("Skip Move");
	this.movieGroup.add(this.board, "movieDelay", 100, 5000).step(100).name("Animation Delay");
	this.movieGroup.add(this.board, "movieSpeed", 1, 5).step(0.1).name("Animation Speed");
	this.movieGroup.add(this.board, "movieFrame", 0, 4).step(1).name("Current Move").listen();
};

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
//	this.sceneMenu();
	//--------------------------------------------------------
//	this.lightsMenu();
};

/**
 * adiciona uma nova luz ao menu da interface
 * @param {String} name - identificador da CGFlight
 * @param {Number} id - posição (índice) desta CGFlight no array de luzes da CGFscene
 * @param {Boolean} enabled - estado ON/OFF inicial desta CGFlight
 * @return {null}
 */
MyInterface.prototype.pushLight = function(name, id, enabled) {

	if (this.lightsGroup == undefined || this.lightsGroup == null) {
		return;
	}

	var self = this;
	this.lights[name] = enabled;
	this.lightsGroup.add(this.lights, name).onChange(function(value) {
		self.scene.toggleLight(id, value);
	});
};