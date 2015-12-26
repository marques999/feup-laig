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

	if (this.gameSettings == null) {
		return false;
	}

	var requestString = this.gameSettings.toString();
	var self = this;

	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'yes' ) {
			self.xmlScene.onConnect();
		}
		else if (serverResponse.responseText == 'no' || serverResponse.responseText == 'rej') {
			alert("connection error! another game is running on that server...");
			self.xmlScene.onServerError();
		}
		else {
			alert("unknown response! are you sure it's a  valid game server?");
			self.xmlScene.onServerError();
		}
	}, function(httpError)
	{
		alert("connection error!");
		self.xmlScene.onServerError();
	});

	return true;
};
//--------------------------------------------------------
GameServer.prototype.getPrologRequest = function(requestString, onSuccess, onError) {

	var request = new XMLHttpRequest();
	var self = this;

	request.open('GET', this.serverAddress + requestString, true);
	request.onload = onSuccess || function(data) {
		this.validResponse = true;
	};

	request.onerror = onError || function() {
		self.gameBoard.onDisconnect();
	};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};
//--------------------------------------------------------
GameServer.prototype.requestQuit = function()
{
	var self = this;
	//--------------------------------------------------------
	this.getPrologRequest('quit', function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200 && serverResponse.responseText == 'goodbye') {
			self.xmlScene.onDisconnect();
		}
	});
};
//--------------------------------------------------------
GameServer.prototype.requestStatus = function(gameBoard, player1, player2) {
	//--------------------------------------------------------
	var player1State = this.serializePlayer(player1);
	var player2State = this.serializePlayer(player2);
	var requestString = "getStatus(" + gameBoard + "," + player1State + "," + player2State + ")";
	//--------------------------------------------------------
	this.getPrologRequest(requestString, function(httpResponse)
	{
		var serverResponse = httpResponse.currentTarget;

		if (serverResponse.status == 200) { // HTTP OK

			if (serverResponse.responseText = 'continue') {
				console.log("game is still running...");
			}
			else if (serverResponse.responseText == 'p1Wins') {
				alert("PLAYER 1 WON!");
			}
			else if(serverResponse.responseText == 'p1Defeated') {
				alert("PLAYER 1 HAS NO PIECES LEFT AND WAS DEFEATED");
			}
			else if (serverResponse.responseText == 'p2Wins') {
				alert("PLAYER 2 WON!");
			}
			else if (serverResponse.responseText == 'p2Defeated') {
				alert("PLAYER 2 HAS NO PIECES LEFT AND WAS DEFEATED");
			}
			else {
				alert("RECEIVED INVALID MESSAGE");
			}
		}
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

		if (serverResponse.status == 200 && serverResponse.responseText != 'no') {
			self.gameBoard.unserializeAction(serverResponse.responseText);
		}
		else {
			self.gameBoard.onResetPlace();
		}
	}, function(e)
	{
		self.gameBoard.onResetPlace();
		self.gameBoard.onDisconnect();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestMoveDisc = function(Board, SourceX, SourceY, DestinationX, DestinationY) {
	//--------------------------------------------------------
	var serializedPlayer = this.serializePlayer(this.gameBoard.getPlayer());
	var playedPiece = this.gameBoard.getPlayedPiece();
	var requestString = this.serializeMoveDisc(Board, playedPiece, serializedPlayer, SourceX, SourceY, DestinationX, DestinationY);
	var self = this;
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
	}, function(e)
	{
		self.gameBoard.onResetPlace();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestMoveRing = function(Board, SourceX, SourceY, DestinationX, DestinationY) {
	//--------------------------------------------------------
	var serializedPlayer = this.serializePlayer(this.gameBoard.getPlayer());
	var playedPiece = this.gameBoard.getPlayedPiece();
	var requestString = this.serializeMoveRing(Board, playedPiece, serializedPlayer, SourceX, SourceY, DestinationX, DestinationY);
	var self = this;
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
	}, function(e)
	{
		self.gameBoard.onResetPlace();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestPlaceDisc = function(Board, DestinationX, DestinationY) {
	//--------------------------------------------------------
	var serializedPlayer = this.serializePlayer(this.gameBoard.getPlayer());
	var playedPiece = this.gameBoard.getPlayedPiece();
	var requestString = this.serializePlaceDisc(Board, playedPiece, serializedPlayer, DestinationX, DestinationY);
	console.log(requestString);

	var self = this;
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
	}, function(e)
	{
		self.gameBoard.onResetPlace();
	});
};
//--------------------------------------------------------
GameServer.prototype.requestPlaceRing = function(Board, DestinationX, DestinationY) {
	//--------------------------------------------------------
	var serializedPlayer = this.serializePlayer(this.gameBoard.getPlayer());
	var playedPiece = this.gameBoard.getPlayedPiece();
	var requestString = this.serializePlaceRing(Board, playedPiece, serializedPlayer, DestinationX, DestinationY);
	var self = this;
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
	}, function(e)
	{
		self.gameBoard.onResetPlace();
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