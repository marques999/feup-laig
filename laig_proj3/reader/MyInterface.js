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
//--------------------------------------------------------
MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;
//--------------------------------------------------------
MyInterface.prototype.init = function(application) {
	//--------------------------------------------------------
	CGFinterface.prototype.init.call(this, application);
	//--------------------------------------------------------
	this.gameScenes = {
		'None': 'example.lsx',
		'Apollo': 'MyShuttle.lsx',
		'Billiards': 'MyBilliards.lsx',
		'Park': 'MyExp.lsx'
	};
	//--------------------------------------------------------
	this.playerColors = {
		'Black': 'blackPlayer',
		'White': 'whitePlayer'
	};
	//--------------------------------------------------------
	this.gameBoard = {
		'default': true,
		'diagonal': false,
		'small': false
	};
	//--------------------------------------------------------
	this.gameMode = {
		'pvp': true,
		'pvb': false,
		'bvb': false
	};
	//--------------------------------------------------------
	this.gameDifficulty =  {
		'random': true,
		'smart': false
	}
	//--------------------------------------------------------
	this.lightsState = {};
	this.lightsId = [];
	//--------------------------------------------------------
	this.serverConnected = false;
	this.playerColor = 'blackPlayer';
	this.gui = new dat.GUI();
};
//--------------------------------------------------------
MyInterface.prototype.setScene = function(xmlScene) {
	this.scene = xmlScene;
	this.board = xmlScene.board;
	this.mainMenu();
};
//--------------------------------------------------------
MyInterface.prototype.deleteFolder = function(folderName) {
	this.gui.__folders[folderName].close();
	this.gui.__folders[folderName].domElement.parentNode.parentNode.removeChild(this.gui.__folders[folderName].domElement.parentNode);
	this.gui.__folders[folderName] = undefined;
	this.gui.onResize();
};
//--------------------------------------------------------
MyInterface.prototype.readPreferences = function() {

	if (this.scene == undefined || this.scene == null) {
		return;
	}
	//--------------------------------------------------------
	var preferencesArray = this.scene.getPreferences();
	this.currentScene = preferencesArray.getScene();
	this.playerColor = preferencesArray.color;
	this.updatePeriod = preferencesArray.getFps();
	this.toggleBoolean(this.gameMode, preferencesArray.mode);
	this.toggleBoolean(this.gameBoard, preferencesArray.board);
	this.toggleBoolean(this.gameDifficulty, preferencesArray.difficulty);
};
//--------------------------------------------------------
MyInterface.prototype.savePreferences = function() {

	if (this.scene == undefined || this.scene == null) {
		return;
	}

	var preferencesArray = this.scene.getPreferences();

	preferencesArray.setColor(this.playerColor);
	preferencesArray.setMode(this.getBoolean(this.gameMode));
	preferencesArray.setBoard(this.getBoolean(this.gameBoard));
	preferencesArray.setScene(this.currentScene);
	preferencesArray.setDifficulty(this.getBoolean(this.gameDifficulty));
	preferencesArray.setFps(this.updatePeriod);
	preferencesArray.save();

	this.scene.setUpdatePeriod(1000 / this.updatePeriod);
	this.settingsMenu_close();
	this.mainMenu();
};
//--------------------------------------------------------
MyInterface.prototype.settingsMenu = function() {

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
	this.settingsGroup.add(this, "savePreferences").name("Save Settings");
	this.settingsGroup.add(this, "readPreferences").name("Reset Settings");
	//---------------------------------------------------------
	this.settingsGroup.add(this, "currentScene", this.gameScenes).name("Environment").onChange(function(currentScene) {
		self.scene.loadGraph(currentScene);
	}).listen();
	//---------------------------------------------------------
	this.settingsGroup.add(this, "playerColor", this.playerColors).name("Player Color").onChange(function() {
		self.board.updatePlayer(null, self.playerColor);
	}).listen();
	//---------------------------------------------------------
	this.settingsGroup.add(this, "updatePeriod", 1, 60).name("Target FPS").listen();
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
		self.toggleBoolean(self.gameMode, "pvp");
		self.board.updateMode("pvp");
	});
	//---------------------------------------------------------
	this.modeGroup.add(this.gameMode, "pvb").name("Player VS Bot").listen().onChange(function(value) {
		self.toggleBoolean(self.gameMode, "pvb");
		self.board.updateMode("pvb");
	});
	//---------------------------------------------------------
	this.modeGroup.add(this.gameMode, "bvb").name("Bot VS Bot").listen().onChange(function(value) {
		self.toggleBoolean(self.gameMode, "bvb");
		self.board.updateMode("bvb");
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
//--------------------------------------------------------
MyInterface.prototype.settingsMenu_close = function(self) {

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
};
//--------------------------------------------------------
MyInterface.prototype.onConnect = function() {
	this.serverConnected = true;
	this.connectionMenu_close();
	this.connectionMenu();
}
//--------------------------------------------------------
MyInterface.prototype.onServerError = function() {
	this.serverConnected = false;
	this.gameMenu_close();
	this.board.resetBoard();
	this.scene.resetDisplay();
	this.mainMenu();
}
//--------------------------------------------------------
MyInterface.prototype.onDisconnect = function() {
	this.serverConnected = false;
	this.connectionMenu_close();
	this.connectionMenu();
}
//--------------------------------------------------------
MyInterface.prototype.connectionMenu = function() {

	if (this.scene == undefined || this.scene == null) {
		return;
	}
	//--------------------------------------------------------
	var self = this;
	this.connectionGroup = this.gui.addFolder("Server");
	this.connectionGroup.open();
	this.connectionGroup.add(this.scene, "serverHostname").name("Hostname");
	this.connectionGroup.add(this.scene, "serverPort").name("Port");
	//--------------------------------------------------------
	if (this.serverConnected) {
		this.connectionGroup.add(this.scene, "disconnectServer").name("Disconnect");
	}
	else {
		this.connectionGroup.add(this.scene, "initServer").name("Connect");
	}
};
//--------------------------------------------------------
MyInterface.prototype.connectionMenu_close = function(self) {

	if (this.connectionGroup != undefined && this.connectionGroup != null) {
		this.deleteFolder("Server");
		this.connectionGroup = undefined;
	}
};
//--------------------------------------------------------
MyInterface.prototype.gameMenu = function() {

	if (this.scene == undefined || this.scene == null) {
		return false;
	}
	//---------------------------------------------------------
	if (this.board == undefined || this.board == null) {
		return false;
	}
	//---------------------------------------------------------
	if (!this.serverConnected) {
		alert("ERROR: you are not connected to a server!");
		return false;
	}
	//---------------------------------------------------------
	var self = this;
	this.mainMenu_close();
	this.scene.startGame();
	this.gameGroup = this.gui.addFolder("Game");
	this.gameGroup.open();
	//---------------------------------------------------------
	this.gameGroup.add(this, "mainMenu").name("Quit Game").onChange(function(){
		self.gameMenu_close();
		self.board.resetBoard();
		self.scene.resetDisplay();
	});
	//---------------------------------------------------------
	this.gameGroup.add(this, "movieMenu").name("View Replay");;
	//---------------------------------------------------------
	this.gameGroup.add(this.board, "undoMovement").name("Undo Movement");
	this.camerasMenu();
	this.lightsMenu();
};
//---------------------------------------------------------
MyInterface.prototype.camerasMenu = function() {
	//---------------------------------------------------------
	if (this.scene == undefined || this.scene == null) {
		return false;
	}
	//---------------------------------------------------------
	var self = this;
	this.cameraZoomGroup = this.gui.addFolder("Camera Controls");
	this.cameraViewsGroup = this.gui.addFolder("Camera Views");
	//---------------------------------------------------------
	this.cameraZoomGroup.open();
	this.cameraViewsGroup.open()
	//---------------------------------------------------------
	this.cameraZoomGroup.add(this.scene, "zoomIn").name("Zoom In");
	this.cameraZoomGroup.add(this.scene, "zoomOut").name("Zoom Out");
	//---------------------------------------------------------
	this.cameraZoomGroup.add(this.scene, "cameraTiltAmount", -1.0, 1.0).name("Tilt").listen().onChange(function(){
		self.scene.cameraTilt();
	}).onFinishChange(function() {
		self.scene.resetRotation();
	});
	//---------------------------------------------------------
	this.cameraViewsGroup.add(this.scene, "switchFrontView").name("Front View");
	this.cameraViewsGroup.add(this.scene, "switchSceneView").name("Scene View");
	this.cameraViewsGroup.add(this.scene, "switchTopView").name("Top View");
	this.cameraViewsGroup.add(this.scene, "resetCamera").name("Reset View");
};
//--------------------------------------------------------
MyInterface.prototype.camerasMenu_close = function() {
	//--------------------------------------------------------
	if (this.cameraZoomGroup != undefined && this.cameraZoomGroup != null) {
		this.deleteFolder("Camera Controls");
		this.cameraZoomGroup = undefined;
	}
	//--------------------------------------------------------
	if (this.cameraViewsGroup != undefined && this.cameraViewsGroup != null) {
		this.deleteFolder("Camera Views");
		this.cameraViewsGroup = undefined;
	}
};
//--------------------------------------------------------
MyInterface.prototype.gameMenu_close = function() {

	if (this.gameGroup != undefined && this.gameGroup != null) {
		this.deleteFolder("Game");
		this.gameGroup = undefined;
	}

	//--------------------------------------------------------
	this.camerasMenu_close();
	this.lightsMenu_close();
};
//--------------------------------------------------------
MyInterface.prototype.mainMenu = function() {

	if (this.scene == undefined || this.scene == null) {
		return;
	}
	//--------------------------------------------------------
	var self = this;
	this.mainMenu_close();
	this.mainGroup = this.gui.addFolder("Main Menu");
	this.mainGroup.open();
	//--------------------------------------------------------
	this.mainGroup.add(this, "gameMenu").name("Start Game");
	this.mainGroup.add(this, "settingsMenu").name("Settings");
	this.mainGroup.add(this, "aboutMenu").name("About");
	this.connectionMenu();
};
//--------------------------------------------------------
MyInterface.prototype.mainMenu_close = function() {

	if (this.mainGroup != undefined && this.mainGroup != null) {
		this.deleteFolder("Main Menu");
		this.mainGroup = undefined;
	}

	this.connectionMenu_close();
};
//--------------------------------------------------------
MyInterface.prototype.movieMenu = function() {
	//--------------------------------------------------------
	if (this.board == undefined || this.board == null) {
		return;
	}
	//--------------------------------------------------------
	var self = this;
	this.gameMenu_close();
	this.board.startMovie();
	//--------------------------------------------------------
	this.movieGroup = this.gui.addFolder("Movie Controls");
	this.movieGroup.open();
	this.movieGroup.add(this.board, "pauseMovie").name("Pause Movie");
	this.movieGroup.add(this.board, "resetMovie").name("Reset Movie");
	//--------------------------------------------------------
	this.movieGroup.add(this.board, "exitMovie").name("Stop Movie").onChange(function(value) {
		self.movieMenu_close();
		self.gameMenu();
	});
	//--------------------------------------------------------
	this.camerasMenu();
	this.movieGroup.add(this.board, "rotateMovie").name("Rotate Camera");
	this.movieGroup.add(this.board, "skipMovieFrame").name("Skip Move");
	this.movieGroup.add(this.board, "movieDelay", 100, 5000).step(100).name("Animation Delay");
	this.movieGroup.add(this.board, "movieSpeed", 1, 5).step(0.1).name("Animation Speed");
	this.movieGroup.add(this.board, "movieFrame", 0, 4).step(1).name("Current Move").listen();
};
//--------------------------------------------------------
MyInterface.prototype.movieMenu_close = function() {
	//--------------------------------------------------------
	if (this.movieGroup != undefined && this.movieGroup != null) {
		this.deleteFolder("Movie Controls");
		this.movieGroup = undefined;
	}
	//--------------------------------------------------------
	this.camerasMenu_close();
};
//--------------------------------------------------------
MyInterface.prototype.lightsMenu = function() {

	if (this.scene == undefined || this.scene == null) {
		return;
	}
	//--------------------------------------------------------
	this.lightsGroup = this.gui.addFolder("Lights");
	this.lightsGroup.open();
	//--------------------------------------------------------
	for (var i = 0; i < this.lightsId.length; i++) {
		this.lightsGroup.add(this.lightsState, this.lightsId[i]).onChange(this.lightAction(this, i));
	}
};
//--------------------------------------------------------
MyInterface.prototype.lightsMenu_close = function() {

	if (this.lightsGroup != undefined && this.lightsGroup != null) {
		this.deleteFolder("Lights");
		this.lightsGroup = undefined;
	}
};
//--------------------------------------------------------
MyInterface.prototype.pushLight = function(name, id, enabled) {
	this.lightsState[name] = enabled;
	this.lightsId[id] = name;
};
//--------------------------------------------------------
MyInterface.prototype.resetLights = function() {
	this.lightsId.splice(0, this.lightsId.length);
	for (var lightEntry in this.lightsState) {
		if (this.lightsState.hasOwnProperty(lightEntry)) {
			delete this.lightsState[lightEntry];
		}
	}
};
//--------------------------------------------------------
MyInterface.prototype.lightAction = function(self, id) {
	return function(value) {
		self.scene.toggleLight(id, value);
	};
}
//--------------------------------------------------------
MyInterface.prototype.aboutMenu = function() {
	alert('DuploHex is a connection game related to Hex that includes discs and rings. '
		+ 'In order to play DuploHex you need an 7x7 hex board, 24 black and 24 white rings, and 24 black and 24 white discs.\n\n'
		+ 'Objective: Each player must connect the two opposing sides of the board marked by their colors either with their discs or their rings.'
		+ '\n\nStart: game starts with an empty board. White starts by placing one disc or ring on any cell.'
		);
	alert('Each player in turn must perform two mandatory actions:\n\n'
		+ '(1) add one of her discs to an empty cell or move one of her discs on the board into any ring located in a neighbour cell (must not be already occupied by both).\n\n'
		+ '(2) one of her rings to an empty cell or move one of her rings on the board to a neighbour cell occupied by a disc (must not be already occupied by both).\n\n'
		+ 'The disc-ring pair (a disc inside a ring) cannot be moved for the rest of the game.'
		);
	alert('Players may not pass. Pieces cannot be stacked.\n\n'
		+ 'Finally, if a player cannot perform a legal action, she must in her turn add one of their discs or rings on any cell of the board occupied by a ring or a disc, respectively. '
		+ 'For a shorter game, you can play on a 6x6 board. '
		+ 'To set up such board simply fill two adjacent border rows with rings and discs of the corresponding colour before the game starts.\n\n'
		+ 'DuploHex @ BoardGameGeek\nhttps://boardgamegeek.com/boardgame/174474/duplohex'
		);
};
//--------------------------------------------------------
MyInterface.prototype.getBoolean = function(array) {

	for (var key in array) {
		if (array[key]) {
			return key;
		}
	}
};
//--------------------------------------------------------
MyInterface.prototype.toggleBoolean = function(array, element) {

	for (var key in array) {
		if (key != element) {
			array[key] = false;
		}
	}

	array[element] = true;
};