function GameServer(board, address, port) {
	//--------------------------------------------------------
	this.gameBoard = board;
	this.gameRunning = false;
	this.httpAddress = address || 'localhost';
	this.httpPort = port || 8081;
	this.validResponse = false;
	this.serverAddress = 'http://' + this.httpAddress + ':' + this.httpPort + '/';
	//--------------------------------------------------------
	this.boardMatrix = {
		'diagonal': 'diagonalMatrix',
		'default': 'emptyMatrix',
		'small': 'empty6x6Matrix',
	}
	//--------------------------------------------------------
	this.gameSettings = {
		color: 'whitePlayer',
		board: 'default',
		difficulty: 'random',
		mode: 'pvp',
	};
};
//--------------------------------------------------------
GameServer.prototype = Object.create(Object.prototype);
GameServer.prototype.constructor = GameServer;
//--------------------------------------------------------
GameServer.prototype.setBoard = function(boardType) {

	if (this.gameBoard == null || this.gameRunning) {
		return false;
	}

	if (boardType != 'default' && boardType != 'small' && boardType != 'diagonal') {
		return false;
	}

	this.gameSettings["board"] = this.boardMatrix[boardType];
};
//--------------------------------------------------------
GameServer.prototype.setColor = function(playerColor) {

	if (this.gameBoard == null || this.gameRunning) {
		return false;
	}

	if (playerColor != 'blackPlayer' && playerColor != 'whitePlayer')  {
		return false;
	}

	this.gameSettings["color"] = playerColor;
};
//--------------------------------------------------------
GameServer.prototype.setDifficulty = function(difficulty) {

	if (this.gameBoard == null || this.gameRunning) {
		return false;
	}

	if (difficulty != 'smart' && difficulty != 'random') {
		return false;
	}

	this.gameSettings["difficulty"] = boardType;
};
//--------------------------------------------------------
GameServer.prototype.setMode = function(gameMode) {

	if (this.gameBoard == null || this.gameRunning) {
		return false;
	}

	if (gameMode != 'pvp' && gameMode != 'pvb' && gameMode != 'bvb') {
		return false;
	}

	this.gameSettings["mode"] = gameMode;
};
//--------------------------------------------------------
GameServer.prototype.requestGame = function() {

	var requestString = null;

	if (this.gameSettings.mode == 'pvp') {
		requestString = "pvp(" 
			+ this.gameSettings.color + ","
			+ this.gameSettings.board + ")";
	}
	else if (this.gameSettings.mode == 'pvb') {
		requestString = "pvb("
			+ this.gameSettings.color + ","
			+ this.gameSettings.difficulty + ","
			+ this.gameSettings.board + ")";
	}
	else if (this.gameSettings.mode == 'bvb') {
		requestString = "bvb("
			+ this.gameSettings.color + ","
			+ this.gameSettings.difficulty + ","
			+ this.gameSettings.board + ")";
	}
	else {
		return false;
	}

	this.getPrologRequest(requestString, function()
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'ack') {
			console.log("SEND COMMAND COMPLETE");
		}
		else if (serverResponse.status && serverResponse.responseText == 'rej') {
			console.log("MESSAGE REJECTED!");
		}
	});

	return true;
};
//--------------------------------------------------------
GameServer.prototype.checkValid = function(first_argument) {
	return this.validResponse;
};
//--------------------------------------------------------
GameServer.prototype.getPrologRequest = function(requestString, onSuccess, onError) {

	var request = new XMLHttpRequest();

	request.open('GET', this.serverAddress + requestString, true);
	request.onload = onSuccess || function(data) {
		console.log("Request successful. Reply: " + data.target.response);
		this.validResponse = true;
	};

	request.onerror = onError || function() {
		console.log("Error waiting for response");
		this.validResponse = false;
	};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};
//--------------------------------------------------------
GameServer.prototype.requestReset = function()
{
	this.getPrologRequest('reset', function()
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'ack') {
			console.log("SEND COMMAND COMPLETE");
		}
		else if (serverResponse.status && serverResponse.responseText == 'rej') {
			console.log("MESSAGE REJECTED!");
		}
	});
};
//--------------------------------------------------------
GameServer.prototype.requestQuit = function()
{
	this.getPrologRequest('quit', function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'goodbye') {
			return true;
		}
	});

	return false;
};
//--------------------------------------------------------
GameServer.prototype.requestPlayerInfo = function(playerColor, boardType)
{
	var self = this;
	var requestString = 'playerPieces(' + playerColor + ',' + boardType + ')';

	this.getPrologRequest(requestString, function(httpResponse)
	{
		var playerStruct = null;
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200)
		{
			try
			{
				playerStruct = JSON.parse(serverResponse.responseText);
				self.gameBoard.setPlayer1(playerStruct);
			}
			catch (e)
			{
			    alert(e);
			}
		}
	});
};
//--------------------------------------------------------
GameServer.prototype.requestBot = function()
{
	var self = this;
	var requestString = 'botMove';

	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;
		var botStruct = null;

		if (serverResponse.status == 200)
		{
			try
			{
				botStruct = JSON.parse(serverResponse.responseText);
				self.gameMode.processMove(botStruct);
			}
			catch (e)
			{
			    alert(e);
			}
		}
	});
};
//--------------------------------------------------------
GameServer.prototype.requestStatus = function()
{
	this.getPrologRequest('status', function()
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200) { // HTTP OK

			if (serverResponse.responseText = 'NOP') {
				console.log("GAME IS STILL RUNNING");
			}
			else if (serverResponse.responseText == 'P1W') {
				console.log("PLAYER 1 WON!");
			}
			else if(serverResponse.responseText == 'P1D') {
				console.log("PLAYER 1 HAS NO PIECES LEFT AND WAS DEFEATED");
			}
			else if (serverResponse.responseText == 'P2W') {
				console.log("PLAYER 2 WON!");
			}
			else if (serverResponse.responseText == 'P2D') {
				console.log("PLAYER 2 HAS NO PIECES LEFT AND WAS DEFEATED");
			}
			else {
				console.log("RECEIVED INVALID MESSAGE");
				validResponse = false;
			}
		}
	});
};
//--------------------------------------------------------
GameServer.prototype.requestMoveDisc = function(SourceX, SourceY, DestinationX, DestinationY) {
	var requestString = this.formatMoveCoords('moveDisc', SourceX, SourceY, DestinationX, DestinationY);
	var self = this;
	this.getPrologRequest(requestString, function(httpResponse) 
	{	
		if (httpResponse.currentTarget.status == 200) {
			self.gameBoard.onPlacePiece();
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(e)
	{
		self.gameBoard.onResetPlace();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestMoveRing = function(SourceX, SourceY, DestinationX, DestinationY) {
	var requestString = this.formatMoveCoords('moveRing', SourceX, SourceY, DestinationX, DestinationY);
	var self = this;
	this.getPrologRequest(requestString, function(httpResponse) 
	{	
		if (httpResponse.currentTarget.status == 200) {
			self.gameBoard.onPlacePiece();
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(e)
	{
		self.gameBoard.onResetPlace();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestPlaceDisc = function(DestinationX, DestinationY) {
	var requestString = this.formatPlaceCoords('placeDisc', DestinationX, DestinationY);
	var self = this;
	this.getPrologRequest(requestString, function(httpResponse) 
	{	
		if (httpResponse.currentTarget.status == 200) {
			self.gameBoard.onPlacePiece();
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(e)
	{
		self.gameBoard.onResetPlace();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestPlaceRing = function(DestinationX, DestinationY) {
	var requestString = this.formatPlaceCoords('placeRing', DestinationX, DestinationY);
	var self = this;
	this.getPrologRequest(requestString, function(httpResponse) 
	{	
		if (httpResponse.currentTarget.status == 200) {
			self.gameBoard.onPlacePiece();
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(e)
	{
		self.gameBoard.onResetPlace();
	});
};
//--------------------------------------------------------
GameServer.prototype.formatPlaceCoords = function(Command, SourceX, SourceY) {
	return Command + '(' + SourceX + '-' + SourceY + ')';
};
//--------------------------------------------------------
GameServer.prototype.formatMoveCoords = function(Command, SourceX, SourceY, DestinationX, DestinationY) {
	return Command + '(' + SourceX + '-' + SourceY + "," + DestinationX + '-' + DestinationY + ')';
};