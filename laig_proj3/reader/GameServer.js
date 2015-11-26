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

GameServer.prototype.requestReset = function() {
	this.getPrologRequest('reset', this.handleGenericCommand);
}

GameServer.prototype.requestQuit = function() {
	this.getPrologRequest('quit', this.handleQuitCommand);
}

GameServer.prototype.requestStatus = function() {
	this.getPrologRequest('status', handleStatus);
}

GameServer.prototype.requestMove = function(Piece, FromX, FromY, ToX, ToY) {
	var src = this.formatCoords(srcX, srcY);
	var dst = this.formatCoords(dstX, dstY);
	var method = 'none';

	if (piece == 'disc') {
		method = 'moveDisc';
	}
	else if (piece == 'ring') {
		method = 'moveRing';
	}

	var requestString = method + "(" + src + "," + dst + ")";
	this.getPrologRequest(requestString, this.handleMove);
};

GameServer.prototype.requestPlace = function(piece, dstX, dstY) {
	var src = this.formatCoords(dstX, dstY);
	var method = 'none';

	if (piece == 'disc') {
		method = 'placeDisc';
	}
	else if (piece == 'ring') {
		method = 'placeRing';
	}

	var requestString = method + "(" + src + ")";
	this.getPrologRequest(requestString, this.handlePlace);
};

GameServer.prototype.handleQuitCommand = function(httpResponse) {
	var serverResponse = httpResponse.currentTarget;
	if (serverResponse.status == 200 && serverResponse.responseText == 'goodbye') {
		console.log("SERVER CONNECTION TERMINATED");
	}
}

GameServer.prototype.handleGenericCommand = function(httpResponse) {
	var response = httpResponse.currentTarget;
	var responseValid = response.status == 200;
	if (responseValid && response.responseText == 'ack') {
		console.log("SEND COMMAND COMPLETE");
	}
	else if (responseValidm && response.responseText == 'rej') {
		console.log("MESsAGE REJECTED!");
	}
}

GameServer.prototype.handleMove = function(httpResponse) {
	var serverResponse = httpResponse.currentTarget;

	if (serverResponse.status == 200) {
		if (serverResponse.responseText == 'ack') {
			console.log("MOVE COMPLETE");
		}
		else if (serverResponse.responseText == 'rej') {
			console.log("INVALID MOVE!");
		}
		else {
			console.log("RECEIVED MESSAGE NOT VALID...");
		}
	}
};

GameServer.prototype.handlePlace = function(httpResponse) {
	
	var serverResponse = httpResponse.currentTarget;

	if (serverResponse.status == 200) {
		if (serverResponse.responseText == 'ack') {
			console.log("MOVE COMPLETE");
		}
		else if (serverResponse.responseText == 'rej') {
			console.log("INVALID MOVE!");
		}
		else {
			console.log("RECEIVED MESSAGE NOT VALID...");
		}
	}
};



GameServer.prototype.handleStatus = function(httpResponse) {

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
};

GameServer.prototype.formatCoords = function(x, y) {
	return x + "-" + y;
};