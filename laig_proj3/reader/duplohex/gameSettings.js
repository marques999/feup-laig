/**
 * construtor default da classe 'GameSettings'
 * @constructor
 * @augments Object
 * @author Diogo Marques
 * @return {null}
 */
function GameSettings() {
	//--------------------------------------------------------
	if (localStorage["gameBoard"] == undefined || localStorage["gameBoard"] == null) {
		this["board"] = 'default';
	}
	else {
		this["board"] = localStorage["gameBoard"];
	}
	//--------------------------------------------------------
	if (localStorage["playerColor"] == undefined || localStorage["playerColor"] == null) {
		this["color"] = 'whitePlayer';
	}
	else {
		this["color"] = localStorage["playerColor"];
	}
	//--------------------------------------------------------
	if (localStorage["fpsCounter"] == undefined || localStorage["fpsCounter"] == null) {
		this["counter"] = true;
	}
	else {
		this["counter"] = parseInt(localStorage["fpsCounter"]) ? true : false;
	}
	//--------------------------------------------------------
	if (localStorage["gameDifficulty"] == undefined || localStorage["gameDifficulty"] == null) {
		this["difficulty"] = 'random';
	}
	else {
		this["difficulty"] = localStorage["gameDifficulty"];
	}
	//--------------------------------------------------------
	if (localStorage["updatePeriod"] == undefined || localStorage["updatePeriod"] == null) {
		this["fps"] = 60;
	}
	else {
		this["fps"] = parseInt(localStorage["updatePeriod"]);
	}
	//--------------------------------------------------------
	if (localStorage["gameMode"] == undefined || localStorage["gameMode"] == null) {
		this["mode"] = 'pvp';
	}
	else {
		this["mode"] = localStorage["gameMode"];
	}
	//--------------------------------------------------------
	if (localStorage["gameScene"] == undefined || localStorage["gameScene"] == null) {
		this["scene"] = 'example.lsx';
	}
	else {
		this["scene"] = localStorage["gameScene"];
	}
	//--------------------------------------------------------
	if (localStorage["playerTimeout"] == undefined || localStorage["playerTimeout"] == null) {
		this["timeout"] = 20;
	}
	else {
		this["timeout"] = parseInt(localStorage["playerTimeout"]);
	}
	//--------------------------------------------------------
	this.boardMatrix = {
		'diagonal': 'diagonalMatrix',
		'default': 'emptyMatrix',
		'small': 'empty6x6Matrix',
	}
};
//--------------------------------------------------------
GameSettings.prototype = Object.create(Object.prototype);
GameSettings.prototype.constructor = GameSettings;
//--------------------------------------------------------
GameSettings.prototype.getBoard = function() {
	return this["board"];
};
//--------------------------------------------------------
GameSettings.prototype.getColor = function() {
	return this["color"];
};
//--------------------------------------------------------
GameSettings.prototype.getCounter = function() {
	return this["counter"];
};
//--------------------------------------------------------
GameSettings.prototype.getDifficulty = function() {
	return this["difficulty"];
};
//--------------------------------------------------------
GameSettings.prototype.getFps = function() {
	return this["fps"];
};
//--------------------------------------------------------
GameSettings.prototype.getMode = function() {
	return this["mode"];
};
//--------------------------------------------------------
GameSettings.prototype.getScene = function() {
	return this["scene"];
};
//--------------------------------------------------------
GameSettings.prototype.getTimeout = function() {
	return this["timeout"];
};
//--------------------------------------------------------
GameSettings.prototype.setBoard = function(boardType) {

	if (boardType == 'default' || boardType == 'small' || boardType == 'diagonal') {
		this["board"] = boardType;
	}
};
//--------------------------------------------------------
GameSettings.prototype.setColor = function(playerColor) {

	if (playerColor == 'blackPlayer' || playerColor == 'whitePlayer')  {
		this["color"] = playerColor;
	}
};
//--------------------------------------------------------
GameSettings.prototype.setCounter = function(counterEnabled) {
	this["counter"] = counterEnabled;
};
//--------------------------------------------------------
GameSettings.prototype.setDifficulty = function(gameDifficulty) {

	if (gameDifficulty == 'smart' || gameDifficulty == 'random') {
		this["difficulty"] = gameDifficulty;
	}
};
//--------------------------------------------------------
GameSettings.prototype.setFps = function(targetFps) {

	if (targetFps > 0 && targetFps <= 60) {
		this["fps"] = targetFps;
	}
};
//--------------------------------------------------------
GameSettings.prototype.setMode = function(gameMode) {

	if (gameMode == 'pvp' || gameMode == 'pvb' || gameMode == 'bvb') {
		this["mode"] = gameMode;
	}
};
//--------------------------------------------------------
GameSettings.prototype.setScene = function(gameScene) {
	this["scene"] = gameScene;
};
//--------------------------------------------------------
GameSettings.prototype.setTimeout = function(playerTimeout) {

	if (playerTimeout >= 10 && playerTimeout <= 60) {
		this["timeout"] = playerTimeout;
	}
};
//--------------------------------------------------------
GameSettings.prototype.save = function() {
	localStorage["fpsCounter"] = this["counter"] ? "1" : "0";
	localStorage["gameBoard"] = this["board"];
	localStorage["gameDifficulty"] = this["difficulty"];
	localStorage["gameMode"] = this["mode"];
	localStorage["gameScene"] = this["scene"];
	localStorage["playerColor"] = this["color"];
	localStorage["playerTimeout"] = this["timeout"].toString();
	localStorage["updatePeriod"] = this["fps"].toString();
};
//--------------------------------------------------------
GameSettings.prototype.toString = function() {

	var requestString = null;

	if (this["mode"] == 'pvp') {
		requestString = "pvp("  + this["color"] + "," + this.boardMatrix[this["board"]] + ")";
	}
	else if (this["mode"] == 'pvb') {
		requestString = "pvb(" + this["color"] + "," + this["difficulty"] + "," + this.boardMatrix[this["board"]] + ")";
	}
	else if (this["mode"]== 'bvb') {
		requestString = "bvb("	+ this["color"] + "," + this["difficulty"] + "," + this.boardMatrix[this["board"]] + ")";
	}

	return requestString;
};