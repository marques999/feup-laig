/**
 * construtor default da classe 'GameServer'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {GameBoard} board - apontador para uma primitiva "tabuleiro"
 * @param {GameSettings} settings - estrutura de dados contendo as configurações do jogo
 * @param {String} address - endereço IP ou hostname do servidor HTTP
 * @param {String} port - porta de rede onde o servidor HTTP se encontra a correr
 * @return {null}
 */
function GameServer(scene, address, port) {
	//--------------------------------------------------------
	this.xmlScene = scene;
	this.gameBoard = scene.board;
	this.gameSettings = scene.gameSettings;
	//--------------------------------------------------------
	this.httpAddress = address || 'localhost';
	this.httpPort = port || 8081;
	this.gameRunning = false;
	this.validResponse = false;
	this.serverAddress = 'http://' + this.httpAddress + ':' + this.httpPort + '/';
	//--------------------------------------------------------
	this.playerName = {
		'black': 'blackPlayer',
		'white': 'whitePlayer'
	}
};
//--------------------------------------------------------
GameServer.prototype = Object.create(Object.prototype);
GameServer.prototype.constructor = GameServer;
//--------------------------------------------------------
GameServer.prototype.requestGame = function() {
	//--------------------------------------------------------
	var requestString = this.gameSettings.toString();
	var self = this;
	//--------------------------------------------------------
	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;
		//--------------------------------------------------------
		if (serverResponse.status == 200 && serverResponse.responseText == 'yes' ) {
			self.xmlScene.onConnect();
		}
		else {
			self.onServerUnknown();
			self.xmlScene.onServerError();
		}
	}, function(httpError)
	{
		self.onServerOffline();
		self.xmlScene.onServerError();
	});
};
//--------------------------------------------------------
GameServer.prototype.getPrologRequest = function(requestString, onSuccess, onError) {
	//--------------------------------------------------------
	var request = new XMLHttpRequest();
	var self = this;
	//--------------------------------------------------------
	request.open('GET', this.serverAddress + requestString, true);
	request.onload = onSuccess || function(data) {
		this.validResponse = true;
	};
	//--------------------------------------------------------
	request.onerror = onError || function() {
		self.xmlScene.onServerError();
	};
	//--------------------------------------------------------
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};
//--------------------------------------------------------
GameServer.prototype.requestQuit = function() {
	//--------------------------------------------------------
	var self = this;
	//--------------------------------------------------------
	this.getPrologRequest('quit', function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;
		if (serverResponse.status == 200 && serverResponse.responseText == 'goodbye') {
			self.xmlScene.onDisconnect();
		}
	}, function(httpError)
	{
		self.xmlScene.onDisconnect();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestStatus = function(gameBoard, player1, player2) {
	//--------------------------------------------------------
	var player1State = this.serializePlayer(player1);
	var player2State = this.serializePlayer(player2);
	var requestString = "getStatus(" + gameBoard + "," + player1State + "," + player2State + ")";
	var self = this;
	//--------------------------------------------------------
	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;
		if (serverResponse.status == 200 && serverResponse.responseText != 'continue') {
			self.gameBoard.handleStatus(serverResponse.responseText);
		}
	}, function(httpError)
	{
		self.onConnectionLost();
		self.xmlScene.onServerError();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestStuck = function(gameBoard, currentPlayer) {
	//--------------------------------------------------------
	var playerState = this.serializePlayer(currentPlayer);
	var requestString = "getStuck(" + gameBoard + "," + playerState + ")";
	var self = this;
	//--------------------------------------------------------
	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;
		if (serverResponse.status == 200) {
			self.gameBoard.handleStuck(serverResponse.responseText == 'yes');
		}
	}, function(httpError)
	{
		self.onConnectionLost();
		self.xmlScene.onServerError();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestBotAction = function(Board, currentPiece, initialMove) {
	//--------------------------------------------------------
	var serializedPlayer = this.serializePlayer(this.gameBoard.getPlayer());
	var botMode = this.gameSettings.getDifficulty();
	var requestString = null;
	var self = this;
	//--------------------------------------------------------
	if (initialMove) {
		requestString = 'getInitialMove(';
	}
	else {
		if (botMode == 'smart') {
			requestString = 'getSmartMove(';
		}
		else {
			requestString = 'getRandomMove(';
		}
	}
	//--------------------------------------------------------
	requestString += Board + "," + currentPiece + "," + serializedPlayer + ")";
	//--------------------------------------------------------
	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;
		//--------------------------------------------------------
		if (serverResponse.status == 200 && serverResponse.responseText != 'no') {
			if (!self.gameBoard.unserializeAction(serverResponse.responseText)) {
				self.gameBoard.onResetPlace();
			}
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(httpError)
	{
		self.onConnectionTimeout();
		self.gameBoard.onResetPlace();
		self.xmlScene.onServerError();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestMoveDisc = function(Board, SourceX, SourceY, DestinationX, DestinationY, initialMove) {
	//--------------------------------------------------------
	var serializedPlayer = this.serializePlayer(this.gameBoard.getPlayer());
	var playedPiece = this.gameBoard.getPlayedPiece();
	var requestString = null;
	var self = this;
	//--------------------------------------------------------
	if (initialMove) {
		requestString = this.serializeInitialMoveDisc(Board, serializedPlayer, SourceX, SourceY);
	}
	else {
		requestString = this.serializeMoveDisc(Board, playedPiece, serializedPlayer, SourceX, SourceY, DestinationX, DestinationY);
	}
	//--------------------------------------------------------
	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;
		//--------------------------------------------------------
		if (serverResponse.status == 200 && serverResponse.responseText == 'yes') {
			self.gameBoard.onPlacePiece();
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(httpError)
	{
		self.onConnectionTimeout();
		self.gameBoard.onResetPlace();
		self.xmlScene.onServerError();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestMoveRing = function(Board, SourceX, SourceY, DestinationX, DestinationY, initialMove) {
	//--------------------------------------------------------
	var serializedPlayer = this.serializePlayer(this.gameBoard.getPlayer());
	var playedPiece = this.gameBoard.getPlayedPiece();
	var requestString = null;
	var self = this;
	//--------------------------------------------------------
	if (initialMove) {
		requestString = this.serializeInitialMoveRing(Board, serializedPlayer, SourceX, SourceY);
	}
	else {
		requestString = this.serializeMoveRing(Board, playedPiece, serializedPlayer, SourceX, SourceY, DestinationX, DestinationY);
	}
	//--------------------------------------------------------
	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'yes') {
			self.gameBoard.onPlacePiece();
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(httpError)
	{
		self.onConnectionTimeout();
		self.gameBoard.onResetPlace();
		self.xmlScene.onServerError();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestPlaceDisc = function(Board, DestinationX, DestinationY, initialMove) {
	//--------------------------------------------------------
	var serializedPlayer = this.serializePlayer(this.gameBoard.getPlayer());
	var playedPiece = this.gameBoard.getPlayedPiece();
	var requestString = null;
	var self = this;
	//--------------------------------------------------------
	if (initialMove) {
		requestString = this.serializeInitialPlaceDisc(Board, serializedPlayer, DestinationX, DestinationY);
	}
	else {
		requestString = this.serializePlaceDisc(Board, playedPiece, serializedPlayer, DestinationX, DestinationY);
	}
	//--------------------------------------------------------
	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;
		//--------------------------------------------------------
		if (serverResponse.status == 200 && serverResponse.responseText == 'yes') {
			self.gameBoard.onPlacePiece();
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(httpError)
	{
		self.onConnectionTimeout();
		self.gameBoard.onResetPlace();
		self.xmlScene.onServerError();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestPlaceRing = function(Board, DestinationX, DestinationY, initialMove) {
	//--------------------------------------------------------
	var serializedPlayer = this.serializePlayer(this.gameBoard.getPlayer());
	var playedPiece = this.gameBoard.getPlayedPiece();
	var requestString = null;
	var self = this;
	//--------------------------------------------------------
	if (initialMove) {
		requestString = this.serializeInitialPlaceRing(Board, serializedPlayer, DestinationX, DestinationY);
	}
	else {
		requestString = this.serializePlaceRing(Board, playedPiece, serializedPlayer, DestinationX, DestinationY);
	}
	//--------------------------------------------------------
	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;
		//--------------------------------------------------------
		if (serverResponse.status == 200 && serverResponse.responseText == 'yes') {
			self.gameBoard.onPlacePiece();
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(httpError)
	{
		self.onConnectionTimeout();
		self.gameBoard.onResetPlace();
		self.xmlScene.onServerError();
	});
};
//--------------------------------------------------------
GameServer.prototype.serializePlayer = function(playerState) {
	return "playerState(" + this.playerName[playerState.color] + "," + playerState.discs + "," + playerState.rings + ")";
};
//--------------------------------------------------------
GameServer.prototype.serializePlaceDisc = function(Board, Piece, Player, SourceX, SourceY) {
	return 'placeDisc(' + Board + "," + Piece + "," + Player + "," + SourceX + '-' + SourceY + ')';
};
//--------------------------------------------------------
GameServer.prototype.serializePlaceRing = function(Board, Piece, Player, SourceX, SourceY) {
	return 'placeRing(' + Board + "," + Piece + "," + Player + "," +  SourceX + '-' + SourceY + ')';
};
//--------------------------------------------------------
GameServer.prototype.serializeMoveDisc = function(Board, Piece, Player, SourceX, SourceY, DestinationX, DestinationY) {
	return 'moveDisc(' + Board + "," + Piece + "," + Player + "," + SourceX + '-' + SourceY + "," + DestinationX + '-' + DestinationY + ')';
};
//--------------------------------------------------------
GameServer.prototype.serializeMoveRing = function(Board, Piece, Player, SourceX, SourceY, DestinationX, DestinationY) {
	return 'moveRing(' + Board + "," + Piece + "," + Player + "," +  SourceX + '-' + SourceY + "," + DestinationX + '-' + DestinationY + ')';
};
//--------------------------------------------------------
GameServer.prototype.serializeInitialPlaceDisc = function(Board, Player, SourceX, SourceY) {
	return 'initialMove(' + Board + ",placeDisc," + Player + "," + SourceX + '-' + SourceY + ')';
};
//--------------------------------------------------------
GameServer.prototype.serializeInitialPlaceRing = function(Board, Player, SourceX, SourceY) {
	return 'initialMove(' + Board + ",placeRing," + Player + "," +  SourceX + '-' + SourceY + ')';
};
//--------------------------------------------------------
GameServer.prototype.serializeInitialMoveDisc = function(Board, Player, SourceX, SourceY) {
	return 'initialMove(' + Board + ",moveDisc," + Player + "," +  SourceX + '-' + SourceY + ')';
};
//--------------------------------------------------------
GameServer.prototype.serializeInitialMoveRing = function(Board, Player, SourceX, SourceY) {
	return 'initialMove(' + Board + ",moveRing," + Player + "," +  SourceX + '-' + SourceY + ')';
};
//--------------------------------------------------------
GameServer.prototype.onConnectionTimeout = function() {
	alert("> DISCONNECTED <\nError sending request, server did not respond!");
};
//--------------------------------------------------------
GameServer.prototype.onConnectionLost = function() {
	alert("> DISCONNECTED <\nError checking current game state, lost connection to server!");
};
//--------------------------------------------------------
GameServer.prototype.onServerUnknown = function() {
	alert("> DISCONNECTED <\nReceived unknown response, are you connected to a valid game server?");
};
//--------------------------------------------------------
GameServer.prototype.onServerOffline = function() {
	alert("> DISCONNECTED <\nConnection error: server not running on target machine!");
};