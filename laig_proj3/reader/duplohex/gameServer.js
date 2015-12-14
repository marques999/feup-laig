function GameServer(board, address, port) {
	this.gameBoard = board;
	this.httpAddress = address || 'localhost';
	this.httpPort = port || 8081;
	this.serverAddress = 'http://' + this.httpAddress + ':' + this.httpPort + '/';
};

GameServer.prototype = Object.create(Object.prototype);
GameServer.prototype.constructor = GameServer;

GameServer.prototype.getPrologRequest = function(requestString, onSuccess, onError) {

	var request = new XMLHttpRequest();

	request.open('GET', this.serverAddress + requestString, true);
	request.onload = onSuccess || function(data) {
		console.log("Request successful. Reply: " + data.target.response);
	};

	request.onerror = onError || function() {
		console.log("Error waiting for response");
	};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};

GameServer.prototype.requestReset = function() 
{
	this.getPrologRequest('reset', function()
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'ack') {
			console.log("SEND COMMAND COMPLETE");
		}
		else if (serverResponse.status && serverResponse.responseText == 'rej') {
			console.log("MESsAGE REJECTED!");
		}
	});
};

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

GameServer.prototype.setDifficulty = function(difficulty)
{
	if (difficulty != 'smart' && difficulty != 'random') {
		return false;
	}

	var requestString = 'setDifficulty(' + difficulty + ')';

	this.getPrologRequest(requestString, function(httpResponse) 
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'ack') {
			return true;
		}
	});

	return false;
};

GameServer.prototype.setBoard = function(boardType)
{
	if (boardType != 'default' && boardType != 'small' && boardType != 'diagonal') {
		return false;
	}

	var requestString = 'setBoard(' + boardType + ')';

	this.getPrologRequest(requestString, function(httpResponse) 
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'ack') {
			return true;
		}
	});

	return false;
}

GameServer.prototype.setMode = function(gameMode) {
	
	if (gameMode != 'pvp' && gameMode != 'pvb' && gameMode != 'bvb') {
		return false;
	}

	var requestString = 'setMode(' + gameMode + ')';

	this.getPrologRequest(requestString, function(httpResponse) 
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'ack') {
			return true;
		}
	});

	return false;
}

GameServer.prototype.setColor = function(playerColor)
{
	if (playerColor != 'black' && playerColor != 'white')  {
		return false;
	}

	var requestString = 'setColor(' + playerColor + ')';

	this.getPrologRequest(requestString, function(httpResponse) 
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'ack') {
			return true;
		}
		else {
			alert("RECEIVED MESSAGE NOT VALID...");
		}
	});

	return false;	
}

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
}

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
}

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
			}
		}
	});
};

GameServer.prototype.requestMoveDisc = function(Source, Destination) {
	var sourceString = this.formatMoveCoords('moveDisc', Source, Destination);
	return this.getPrologRequest(requestString, this.handleMove);
};

GameServer.prototype.requestMoveRing = function(Source, Destination) {
	var sourceString = this.formatMoveCoords('moveRing', Source, Destination);
	return this.getPrologRequest(requestString, this.handleMove);
};

GameServer.prototype.requestPlaceDisc = function(Destination) {
	var requestString = this.formatPlaceCoords('placeDisc', Destination);
	return this.getPrologRequest(requestString, this.handlePlace);
};

GameServer.prototype.requestPlaceRing = function(Destination) {
	var requestString = this.formatPlaceCoords('placeRing', Destination);
	return this.getPrologRequest(requestString, this.handlePlace);
};

GameServer.prototype.handleMove = function(httpResponse) {

	var serverResponse = httpResponse.currentTarget;

	if (serverResponse.status == 200) {

		if (serverResponse.responseText == 'ack') {
			return true;
		}

		if (serverResponse.responseText == 'dst') {
			alert("INVALID MOVE! Destination cell invalid");
		}
		else if (serverResponse.responseText == 'src') {
			alert("INVALID MOVE! Source cell invalid.");
		}
		else {
			alert("RECEIVED MESSAGE NOT VALID...");
		}
	}

	return false;
};

GameServer.prototype.handlePlace = function(httpResponse) {

	var serverResponse = httpResponse.currentTarget;

	if (serverResponse.status == 200) { // HTTP OK

		if (serverResponse.responseText == 'ack') {
			return true;
		}
		
		if (serverResponse.responseText == 'err') {
			alert("INVALID MOVE!");
		}
		else {
			alert("RECEIVED MESSAGE NOT VALID...");
		}
	}

	return false;
};

GameServer.prototype.formatPlaceCoords = function(Command, Source) {
	return Command + '(' + (Source % 7) + '-' + (~~(Source / 7)) + ')';
};

GameServer.prototype.formatMoveCoords = function(Command, Source, Destination) {
	return Command + '(' + (Source % 7) + '-' + (~~(Source / 7)) + "," + (Destination % 7) + '-' + (~~(Destination / 7)) + ')';
};