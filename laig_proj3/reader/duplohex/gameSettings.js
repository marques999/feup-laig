/**
 * construtor default da classe 'GameSettings'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @return {null}
 */
function GameSettings() {
	//--------------------------------------------------------
	if (localStorage["playerColor"] == undefined) {
		this["color"] = 'whitePlayer';
	}
	else {
		this["color"] = localStorage["playerColor"];
	}
	//--------------------------------------------------------
	if (localStorage["gameBoard"] == undefined) {
		this["board"] = 'default';
	}
	else {
		this["board"] = localStorage["gameBoard"];
	}
	//--------------------------------------------------------
	if (localStorage["gameDifficulty"] == undefined) {
		this["difficulty"] = 'random';
	}
	else {
		this["difficulty"] = localStorage["gameDifficulty"];
	}
	//--------------------------------------------------------
	if (localStorage["gameMode"] == undefined) {
		this["mode"] = 'pvp';
	}
	else {
		this["mode"] = localStorage["gameMode"];
	}
	//--------------------------------------------------------
	if (localStorage["gameScene"] == undefined) {
		this["scene"] = 'example.lsx';
	}
	else {
		this["scene"] = localStorage["gameScene"];
	}
	//--------------------------------------------------------
	if (localStorage["updatePeriod"] == undefined) {
		this["fps"] = 60;
	}
	else {
		this["fps"] = parseInt(localStorage["updatePeriod"]);
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
GameSettings.prototype.save = function() {
	localStorage["playerColor"] = this["color"];
	localStorage["updatePeriod"] = this["fps"].toString();
	localStorage["gameBoard"] = this["board"];
	localStorage["gameDifficulty"] = this["difficulty"];
	localStorage["gameMode"] = this["mode"];
	localStorage["gameScene"] = this["scene"];
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
GameSettings.prototype.setDifficulty = function(gameDifficulty) {

	if (gameDifficulty == 'smart' || gameDifficulty == 'random') {
		this["difficulty"] = gameDifficulty;
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
GameSettings.prototype.setFps = function(targetFps) {

	if (targetFps > 0 && targetFps <= 60) {
		this["fps"] = targetFps;
	}
};
//--------------------------------------------------------
GameSettings.prototype.getBoard = function() {
	return this["board"];
};
//--------------------------------------------------------
GameSettings.prototype.getColor = function() {
	return this["color"];
};
//--------------------------------------------------------
GameSettings.prototype.getDifficulty = function() {
	return this["difficulty"];
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
GameSettings.prototype.getFps = function() {
	return this["fps"];
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