%=======================================%
%            DUPLOHEX CLASS             %
%=======================================%

%                 ------------- %
% #includes                     %
%                 ------------- %

:- include('player.pl').
:- include('board.pl').
:- include('bot.pl').
:- include('globals.pl').
:- include('display.pl').

%                 ------------- %
% #factos                       %
%                 ------------- %

% matriz vazia 7 x 7
emptyMatrix([
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0]
]).

% matriz "vazia" 6x6 (pe�as distribu�das pelas paredes)
empty6x6Matrix([
	[1, 4, 1, 4, 1, 4, 1],
	[8, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 2],
	[2, 1, 4, 1, 4, 1, 8]
]).

% matriz diagonal
diagonalMatrix([
	[1, 0, 0, 0, 0, 0, 2],
	[0, 8, 0, 0, 0, 4, 0],
	[0, 0, 1, 0, 2, 0, 0],
	[0, 0, 0, 4, 0, 0, 0],
	[0, 0, 2, 0, 1, 0, 0],
	[0, 4, 0, 0, 0, 8, 0],
	[8, 0, 0, 0, 0, 0, 4]
]).

% modo de jogo Player vs Player (jogador humano vs jogador humano)
gameMode(pvp).

% modo de jogo Player vs Bot (jogador humano vs computador)
gameMode(pvb).

% modo de jogo Bot vs Bot (computador vs computador)
gameMode(bvb).

%                 ------------- %
% #predicados                   %
%                 ------------- %

% inicializa uma nova partida no modo Player vs Player (situa��o 1: jogador 1 escolheu cor preta)
initializePvP(Game, Board, blackPlayer):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player1),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player2),
	Game = Board-pvp-random-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Player vs Player (situa��o 1: jogador 1 escolheu cor branca)
initializePvP(Game, Board, whitePlayer):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player1),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player2),
	Game = Board-pvp-random-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Player vs Bot (situa��o 1: jogador 1 escolheu cor preta)
initializePvB(Game, Board, blackPlayer, BotMode):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player1),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player2),
	Game = Board-pvb-BotMode-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Player vs Bot (situa��o 1: jogador 1 escolheu cor branca)
initializePvB(Game, Board, whitePlayer, BotMode):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player1),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player2),
	Game = Board-pvb-BotMode-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Bot vs Bot (situa��o 1: jogador 1 escolheu cor preta)
initializeBvB(Game, Board, blackPlayer, BotMode):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player1),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player2),
	Game = Board-bvb-BotMode-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Bot vs Bot (situa��o 2: jogador 1 escolheu cor branca)
initializeBvB(Game, Board, whitePlayer, BotMode):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player1),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player2),
	Game = Board-bvb-BotMode-whitePlayer-Player1-Player2, !.

% conta o n�mero de pe�as existentes num tabuleiro pr�-definido
countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings):-
	countBlackDiscs(Board, TempBlackDiscs),
	countBlackRings(Board, TempBlackRings),
	countWhiteDiscs(Board, TempWhiteDiscs),
	countWhiteRings(Board, TempWhiteRings),
	BlackDiscs is 24 - TempBlackDiscs,
	BlackRings is 24 - TempBlackRings,
	WhiteDiscs is 24 - TempWhiteDiscs,
	WhiteRings is 24 - TempWhiteRings.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obt�m o estado do tabuleiro do jogo atual
getGameBoard(Board-_Mode-_BotMode-_PlayerTurn-_Player1-_Player2, Board).

% altera o estado do tabuleiro do jogo atual
setGameBoard(_Board-Mode-BotMode-PlayerTurn-Player1-Player2,
	NewBoard, NewBoard-Mode-BotMode-PlayerTurn-Player1-Player2).

% obt�m o modo de jogo atual (pvp || pvb || bvb)
getGameMode(_Board-Mode-_BotMode-_PlayerTurn-_Player1-_Player2, Mode).

% altera o modo de jogo atual (pvp || pvb || bvb)
setGameMode(Board-_Mode-BotMode-PlayerTurn-Player1-Player2,
	NewMode, Board-NewMode-BotMode-PlayerTurn-Player1-Player2):-
	gameMode(NewMode).

% obt�m o comportamento do computador no jogo atual (random || smart)
getBotMode(_Board-_Mode-BotMode-_PlayerTurn-_Player1-_Player2, BotMode).

% atualiza o comportamento do computador no jogo atual (random || smart)
setBotMode(Board-Mode-_BotMode-PlayerTurn-Player1-Player2,
	NewMode, Board-Mode-NewMode-PlayerTurn-Player1-Player2):-
	botMode(NewMode).

% obt�m o nome do pr�ximo jogador a jogar
getPlayerTurn(_Board-_Mode-_BotMode-PlayerTurn-_Player1-_Player2, PlayerTurn).

% atualiza o nome do pr�ximo jogador a jogar
setPlayerTurn(Board-Mode-BotMode-_PlayerTurn-Player1-Player2,
	NewTurn, Board-Mode-BotMode-NewTurn-Player1-Player2):-
	player(NewTurn).

% obt�m o estado do jogador 1 do jogo atual
getPlayer1(_Board-_Mode-_BotMode-_PlayerTurn-Player1-_Player2, Player1).

% atualiza o estado do jogador 1 do jogo atual
setPlayer1(Board-Mode-BotMode-PlayerTurn-_Player1-Player2,
	NewPlayer, Board-Mode-BotMode-PlayerTurn-NewPlayer-Player2).

% obt�m o estado do jogador 2 do jogo atual
getPlayer2(_Board-_Mode-_BotMode-_PlayerTurn-_Player1-Player2, Player2).

% atualiza o estado do jogador 2 do jogo atual
setPlayer2(Board-Mode-BotMode-PlayerTurn-Player1-_Player2,
	NewPlayer, Board-Mode-BotMode-PlayerTurn-Player1-NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% determina o nome do pr�ximo jogador a jogar (situa��o 1: whitePlayer acabou de jogar)
changePlayerTurn(Game, NewGame):-
	getPlayerTurn(Game, whitePlayer),
	setPlayerTurn(Game, blackPlayer, NewGame).

% determina o nome do pr�ximo jogador a jogar (situa��o 2: blackPlayer acabou de jogar)
changePlayerTurn(Game, NewGame):-
	getPlayerTurn(Game, blackPlayer),
	setPlayerTurn(Game, whitePlayer, NewGame).

% obt�m o estado do jogador atual (situa��o 1: jogador 1 est� a jogar)
getCurrentPlayer(_Board-_Mode-_BotMode-PlayerTurn-Player1-_Player2, Player1):-
	getPlayerName(Player1, PlayerTurn).

% obt�m o estado do jogador atual (situa��o 2: jogador 2 est� a jogar)
getCurrentPlayer(_Board-_Mode-_BotMode-PlayerTurn-_Player1-Player2, Player2):-
	getPlayerName(Player2, PlayerTurn).

% atualiza o estado do jogador atual (situa��o 1: jogador 1 est� a jogar)
setCurrentPlayer(Board-Mode-BotMode-PlayerTurn-Player1-Player2, NewPlayer,
	Board-Mode-BotMode-PlayerTurn-NewPlayer-Player2):-
	getPlayerName(Player1, PlayerTurn).

% atualiza o estado do jogador atual (situa��o 2: jogador 2 est� a jogar)
setCurrentPlayer(Board-Mode-BotMode-PlayerTurn-Player1-Player2, NewPlayer,
	Board-Mode-BotMode-PlayerTurn-Player1-NewPlayer):-
	getPlayerName(Player2, PlayerTurn).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se as coordenadas introduzidas pelo utilizador s�o v�lidas (c�lula de origem)
validateSource(Symbol, _Piece):-
	isTwopiece(Symbol), !,
	messageSourceTwopiece.
validateSource(Symbol, disc):-
	isDisc(Symbol, _).
validateSource(_Symbol, disc):- !,
	messageSourceNotDisc.
validateSource(Symbol, ring):-
	isRing(Symbol, _).
validateSource(_Symbol, ring):- !,
	messageSourceNotRing.

% verifica se as coordenadas introduzidas pelo utilizador s�o v�lidas (c�lula de destino)
validateDestination(Symbol, _Piece):-
	isTwopiece(Symbol), !,
	messageDestinationTwopiece.
validateDestination(Symbol, disc):-
	isDisc(Symbol, _).
validateDestination(_Symbol, disc):- !,
	messageDestinationNotDisc.
validateDestination(Symbol, ring):-
	isRing(Symbol, _).
validateDestination(_Symbol, ring):- !,
	messageDestinationNotRing.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se as coordenadas introduzidas pelo utilizador se encontram dentro do intervalo
validateCoordinates(X, Y):-
	X > 0, Y > 0,
	X < 8, Y < 8.
validateCoordinates(_X, _Y):-
	messageInvalidCoordinates.

% verifica se ambas as coordenadas introduzidas pelo utilizador s�o diferentes
% verifica tamb�m se as c�lulas associadas �s coordenadas s�o vizinhas
validateBothCoordinates(FromX, FromY, FromX, FromY):-
	messageSameCoordinates.
validateBothCoordinates(FromX, FromY, ToX, ToY):-
	isNeighbour(FromX, FromY, ToX, ToY).
validateBothCoordinates(_FromX, _FromY, _ToX, _ToY):-
	messageNotNeighbours.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se determinado disco � da mesma cor que o jogador atual
validateDiscOwnership(Symbol, Player):-
	playerOwnsDisc(Symbol, Player).
validateDiscOwnership(_X, _Y):-
	messageNotOwned.

% verifica se determinado anel � da mesma cor que o jogador atual
validateRingOwnership(Symbol, Player):-
	playerOwnsRing(Symbol, Player).
validateRingOwnership(_X, _Y):-
	messageNotOwned.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

serverPlaceDisc(Board, Player, X-Y, NewBoard, NewPlayer):-
	validateCoordinates(X, Y), !,
	validatePlaceDisc(X, Y, Board, Player), !,
	getPlayerColor(Player, Color),
	placeDisc(X-Y, Color, Board, NewBoard),
	decrementDiscs(Player, NewPlayer).

serverPlaceRing(Board, Player, X-Y, NewBoard, NewPlayer):-
	validateCoordinates(X, Y), !,
	validatePlaceRing(X, Y, Board, Player), !,
	getPlayerColor(Player, Color),
	placeRing(X-Y, Color, Board, NewBoard),
	decrementRings(Player, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

serverMoveDisc(Board, Player, FromX-FromY, ToX-ToY, NewBoard):-
	validateCoordinates(FromX, FromY),
	getSymbol(FromX, FromY, Board, Source),
	validateSource(Source, disc), !,
	validateDiscOwnership(Source, Player), !,
	validateCoordinates(ToX, ToY),
	validateBothCoordinates(FromX, FromY, ToX, ToY),
	getSymbol(ToX, ToY, Board, Destination),
	validateDestination(Destination, ring), !,
	moveDisc(FromX-FromY, ToX-ToY, Board, NewBoard).

serverMoveRing(Board, Player, FromX-FromY, ToX-ToY, NewBoard):-
	validateCoordinates(FromX, FromY),
	getSymbol(FromX, FromY, Board, Source),
	validateSource(Source, ring), !,
	validateRingOwnership(Source, Player), !,
	validateCoordinates(ToX, ToY),
	validateBothCoordinates(FromX, FromY, ToX, ToY),
	getSymbol(ToX, ToY, Board, Destination),
	validateDestination(Destination, disc), !,
	moveRing(FromX-FromY, ToX-ToY, Board, NewBoard).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se o jogador pode colocar um disco numa determinada posi��o do tabuleiro
validatePlaceDisc(X, Y, Board, _Player):-
	getSymbol(X, Y, Board, Symbol),
	isTwopiece(Symbol), !,
	messageDestinationTwopiece.
validatePlaceDisc(_X, _Y, _Board, Player):-
	\+hasDiscs(Player), !,
	messageNoDiscs.
validatePlaceDisc(X, Y, Board, _Player):-
	canPlaceDisc(Board, X, Y).
validatePlaceDisc(_X, _Y, Board, Player):-
	\+isPlayerStuck(Board, Player), !,
	messagePieceExists.
validatePlaceDisc(X, Y, Board, _Player):-
	\+canSpecialDisc(Board, X, Y), !,
	messageDestinationNotRing.
validatePlaceDisc(_X, _Y, _Board, _Player).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se o jogador pode colocar um anel numa determinada posi��o do tabuleiro
validatePlaceRing(X, Y, Board, _Player):-
	getSymbol(X, Y, Board, Symbol),
	isTwopiece(Symbol), !,
	messageDestinationTwopiece.
validatePlaceRing(_X, _Y, _Board, Player):-
	\+hasRings(Player), !,
	messageNoRings.
validatePlaceRing(X, Y, Board, _Player):-
	canPlaceRing(Board, X, Y).
validatePlaceRing(_X, _Y, Board, Player):-
	\+isPlayerStuck(Board, Player), !,
	messagePieceExists.
validatePlaceRing(X, Y, Board, _Player):-
	\+canSpecialRing(Board, X, Y), !,
	messageDestinationNotDisc.
validatePlaceRing(_X, _Y, _Board, _Player).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% inicia uma nova partida no modo Player vs Player
startGame(Socket, Game, pvp):-
	startHuman(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvp).

% inicia uma nova partida no modo Player vs Bot (situa��o 1: jogador humano come�a primeiro)
startGame(Socket, Game, pvb):-
	isPlayerTurn(Game), !,
	startHuman(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvb).

% inicia uma nova partida no modo Player vs Bot (situa��o 2: computador come�a primeiro)
startGame(Socket, Game, pvb):-
	startBot(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvb).

% inicia uma nova partida no modo Bot vs Bot
startGame(Socket, Game, bvb):-
	startBot(Socket, Game, NewGame),
	playGame(Socket, NewGame, bvb).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se ainda restam pe�as ao jogador atual
playGame(_, Game, _Mode):-
	getCurrentPlayer(Game, Player),
	\+hasPieces(Player), !,
	getGameBoard(Game, Board),
	printBoard(Board),
	messagePlayerLost(Player).

% verifica se o jogador 1 venceu a partida atual
playGame(_, Game, _Mode):-
	getGameBoard(Game, Board),
	getPlayer1(Game, Player1),
	hasPlayerWon(Board, Player1), !,
	printBoard(Board),
	messagePlayerWins(Player1).

% verifica se o jogador 2 venceu a partida atual
playGame(_, Game, _Mode):-
	getGameBoard(Game, Board),
	getPlayer2(Game, Player2),
	hasPlayerWon(Board, Player2), !,
	printBoard(Board),
	messagePlayerWins(Player2).

% ciclo de jogo para uma partida Player vs Player
playGame(Socket, Game, pvp):-
	playHuman(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvp).

% ciclo de jogo para uma partida Player vs Bot (situa��o 1: vez do jogador humano)
playGame(Socket, Game, pvb):-
	isPlayerTurn(Game), !,
	playHuman(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvb).

% ciclo de jogo para uma partida Player vs Bot (situa��o 2: vez do computador)
playGame(Socket, Game, pvb):-
	playBot(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvb).

% ciclo de jogo para uma partida Bot vs Bot
playGame(Socket, Game, bvb):-
	playBot(Socket, Game, NewGame),
	playGame(Socket, NewGame, bvb).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% atualiza estado do jogo com movimento realizado pelo jogador atual
move(Game, Board, Player, NewGame):-
	setGameBoard(Game, Board, TempGame),
	setCurrentPlayer(TempGame, Player, TempGame2),
	changePlayerTurn(TempGame2, NewGame), !.

% ac��o do computador: realizar uma jogada (constit�ida por dois movimentos)
playBot(Socket, Game, NewGame):-
	getBotMode(Game, BotMode),
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	letBotPlay(Board, Player, BotMode, NewBoard, NewPlayer),
	move(Game, NewBoard, NewPlayer, NewGame).

% ac��o do jogador humano: realizar uma jogada (constitu�da por dois movimentos)
playHuman(Socket, Game, NewGame):-
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	letHumanPlay(Socket, Board, Player, Reply, TempBoard, TempPlayer),
	letHumanPlaySecond(Socket, TempBoard, TempPlayer, Reply, NewBoard, NewPlayer),
	move(Game, NewBoard, NewPlayer, NewGame).

% ac��o do computador: realizar a jogada inicial (apenas um movimento "colocar pe�a")
startBot(Socket, Game, NewGame):-
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	botInitialMove(Board, Player, NewBoard, NewPlayer), !,
	move(Game, NewBoard, NewPlayer, NewGame).

% ac��o do jogador humano: realizar a jogada inicial (apenas um movimento "colocar pe�a")
startHuman(Socket, Game, NewGame):-
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	letHumanPlayInitial(Socket, Board, Player, NewBoard, NewPlayer), !,
	move(Game, NewBoard, NewPlayer, NewGame).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% determina se o jogador humano � o pr�ximo a jogar no modo Player vs Bot
isPlayerTurn(Game):-
	getCurrentPlayer(Game, Player),
	getPlayer1(Game, Player), !.

% determina se o computador � o pr�ximo a jogar no modo Player vs Bot
isBotTurn(Game):-
	getCurrentPlayer(Game, Player),
	getPlayer2(Game, Player), !.

% pede ao computador aleat�rio para realizar uma jogada (constitu�da por dois movimentos)
letBotPlay(Board, Player, random, NewBoard, NewPlayer):-
	botRandomMove(Board, Player, NewBoard, NewPlayer), !.

% pede ao computador ganancioso para realizar uma jogada (constitu�da por dois movimentos)
letBotPlay(Board, Player, smart, NewBoard, NewPlayer):-
	botSmartMove(Board, Player, NewBoard, NewPlayer), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

letHumanPlayInitial(Socket, Board, Player, NewBoard, NewPlayer):-
	write('> SELECT INITIAL MOVE:'), nl,
	repeat,
	readRequest(Socket, Stream, Request),
	format('> Request: ~q~n', [Request]),
	initialRequest(Request, MyReply, Status, Board, Player, NewBoard, NewPlayer),
	format_reply(Stream, Status, MyReply),
	close_stream(Stream),
	(MyReply = ack), !.

initialRequest(Request, MyReply, '200 OK', Board, Player, NewBoard, NewPlayer):-  
	catch(initialAction(Request, MyReply, Board, Player, NewBoard, NewPlayer), error(_,_), fail), !.
initialRequest(_, 'rej', '400 Bad Request', _, _, _, _).

initialAction(placeDisc(Position), ack, Board, Player, NewBoard, NewPlayer):-
	serverPlaceDisc(Board, Player, Position, NewBoard, NewPlayer).
initialAction(placeRing(Position), ack, Board, Player, NewBoard, NewPlayer):-
	serverPlaceRing(Board, Player, Position, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

letHumanPlay(Socket, Board, Player, MyReply, NewBoard, NewPlayer):-
	write('SELECT FIRST MOVE :'), nl, nl,
	repeat,
	readRequest(Socket, Stream, Request),
	format('> Request: ~q~n',[Request]),
	firstActionRequest(Request, MyReply, Status, Board, Player, NewBoard, NewPlayer),
	format_reply(Stream, Status, MyReply),
	close_stream(Stream),
	(MyReply \= rej), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

firstActionRequest(Request, MyReply, '200 OK', Board, Player, NewBoard, NewPlayer):-  
	catch(firstAction(Request, MyReply, Board, Player, NewBoard, NewPlayer), error(_,_), fail), !.
firstActionRequest(_, 'rej', '400 Bad Request', _, _, _, _).

firstAction(placeDisc(Position), ring, Board, Player, NewBoard, NewPlayer):-
	serverPlaceDisc(Board, Player, Position, NewBoard, NewPlayer), !.
firstAction(placeRing(Position), disc, Board, Player, NewBoard, NewPlayer):-
	serverPlaceRing(Board, Player, Position, NewBoard, NewPlayer), !.
firstAction(moveDisc(From, To), ring, Board, Player, NewBoard, _):-
	serverMoveDisc(Board, Player, From, To, NewBoard), !.
firstAction(moveRing(From, To), disc, Board, Player, NewBoard, _):-
	serverMoveRing(Board, Player, From, To, NewBoard), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

letHumanPlaySecond(Socket, Board, Player, disc, NewBoard, NewPlayer):-
	printBoard(Board),
	write('SELECT SECOND MOVE! (DISC)'), nl, nl,
	repeat,
	readRequest(Socket, Stream, Request),
	format('> Request: ~q~n',[Request]),
	secondDiscRequest(Request, MyReply, Status, Board, Player, NewBoard, NewPlayer),
	format_reply(Stream, Status, MyReply),
	close_stream(Stream),
	(MyReply = ack), !.

letHumanPlaySecond(Socket, Board, Player, ring, NewBoard, NewPlayer):-
	printBoard(Board),
	write('SELECT SECOND MOVE! (RING)'), nl, nl,
	repeat,
	readRequest(Socket, Stream, Request),
	format('> Request: ~q~n',[Request]),
	secondRingRequest(Request, MyReply, Status, Board, Player, NewBoard, NewPlayer),
	format_reply(Stream, Status, MyReply),
	close_stream(Stream),
	(MyReply = ack), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

secondDiscRequest(Request, MyReply, '200 OK', Board, Player, NewBoard, NewPlayer):-  
	catch(secondDiscAction(Request, MyReply, Board, Player, NewBoard, NewPlayer), error(_,_), fail), !.
secondDiscRequest(_, 'rej', '400 Bad Request', _, _, _, _).

secondDiscAction(placeDisc(Position), ack, Board, Player, NewBoard, NewPlayer):-
	serverPlaceDisc(Board, Player, Position, NewBoard, NewPlayer).
secondDiscAction(moveDisc(From,To), ack, Board, Player, NewBoard, _):-
	serverMoveDisc(Board, Player, From, To, NewBoard).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

secondRingRequest(Request, MyReply, '200 OK', Board, Player, NewBoard, NewPlayer):-  
	catch(secondRingAction(Request, MyReply, Board, Player, NewBoard, NewPlayer), error(_,_), fail), !.
secondRingRequest(_, 'rej', '400 Bad Request', _, _, _, _).

secondRingAction(placeRing(Position), ack, Board, Player, NewBoard, NewPlayer):-
	serverPlaceRing(Board, Player, Position, NewBoard, NewPlayer).
secondRingAction(moveRing(From,To), ack, Board, Player, NewBoard, _):-
	serverMoveRing(Board, Player, From, To, NewBoard).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%