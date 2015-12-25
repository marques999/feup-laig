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

emptyMatrix([
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0]
]).

empty6x6Matrix([
	[1, 4, 1, 4, 1, 4, 1],
	[8, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 2],
	[2, 1, 4, 1, 4, 1, 8]
]).

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

duplohex:-
	initializeRandomSeed, !,
	server.

% inicializa uma nova partida no modo Player vs Player (situação 1: jogador 1 escolheu cor preta)
initializePvP(Game, Board, blackPlayer):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player1),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player2),
	Game = Board-pvp-random-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Player vs Player (situação 1: jogador 1 escolheu cor branca)
initializePvP(Game, Board, whitePlayer):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player1),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player2),
	Game = Board-pvp-random-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Player vs Bot (situação 1: jogador 1 escolheu cor preta)
initializePvB(Game, Board, blackPlayer, BotMode):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player1),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player2),
	Game = Board-pvb-BotMode-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Player vs Bot (situação 1: jogador 1 escolheu cor branca)
initializePvB(Game, Board, whitePlayer, BotMode):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player1),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player2),
	Game = Board-pvb-BotMode-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Bot vs Bot (situação 1: jogador 1 escolheu cor preta)
initializeBvB(Game, Board, blackPlayer, BotMode):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player1),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player2),
	Game = Board-bvb-BotMode-whitePlayer-Player1-Player2, !.

% inicializa uma nova partida no modo Bot vs Bot (situação 2: jogador 1 escolheu cor branca)
initializeBvB(Game, Board, whitePlayer, BotMode):-
	countPieces(Board, BlackDiscs, BlackRings, WhiteDiscs, WhiteRings),
	initializePlayer(whitePlayer, WhiteDiscs, WhiteRings, Player1),
	initializePlayer(blackPlayer, BlackDiscs, BlackRings, Player2),
	Game = Board-bvb-BotMode-whitePlayer-Player1-Player2, !.

% conta o número de peças existentes num tabuleiro pré-definido
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

% obtém o estado do tabuleiro do jogo atual
getGameBoard(Board-_Mode-_BotMode-_PlayerTurn-_Player1-_Player2, Board).

% altera o estado do tabuleiro do jogo atual
setGameBoard(_Board-Mode-BotMode-PlayerTurn-Player1-Player2,
	NewBoard, NewBoard-Mode-BotMode-PlayerTurn-Player1-Player2).

% obtém o modo de jogo atual (pvp || pvb || bvb)
getGameMode(_Board-Mode-_BotMode-_PlayerTurn-_Player1-_Player2, Mode).

% altera o modo de jogo atual (pvp || pvb || bvb)
setGameMode(Board-_Mode-BotMode-PlayerTurn-Player1-Player2,
	NewMode, Board-NewMode-BotMode-PlayerTurn-Player1-Player2):-
	gameMode(NewMode).

% obtém o comportamento do computador no jogo atual (random || smart)
getBotMode(_Board-_Mode-BotMode-_PlayerTurn-_Player1-_Player2, BotMode).

% atualiza o comportamento do computador no jogo atual (random || smart)
setBotMode(Board-Mode-_BotMode-PlayerTurn-Player1-Player2,
	NewMode, Board-Mode-NewMode-PlayerTurn-Player1-Player2):-
	botMode(NewMode).

% obtém o nome do próximo jogador a jogar
getPlayerTurn(_Board-_Mode-_BotMode-PlayerTurn-_Player1-_Player2, PlayerTurn).

% atualiza o nome do próximo jogador a jogar
setPlayerTurn(Board-Mode-BotMode-_PlayerTurn-Player1-Player2,
	NewTurn, Board-Mode-BotMode-NewTurn-Player1-Player2):-
	player(NewTurn).

% obtém o estado do jogador 1 do jogo atual
getPlayer1(_Board-_Mode-_BotMode-_PlayerTurn-Player1-_Player2, Player1).

% atualiza o estado do jogador 1 do jogo atual
setPlayer1(Board-Mode-BotMode-PlayerTurn-_Player1-Player2,
	NewPlayer, Board-Mode-BotMode-PlayerTurn-NewPlayer-Player2).

% obtém o estado do jogador 2 do jogo atual
getPlayer2(_Board-_Mode-_BotMode-_PlayerTurn-_Player1-Player2, Player2).

% atualiza o estado do jogador 2 do jogo atual
setPlayer2(Board-Mode-BotMode-PlayerTurn-Player1-_Player2,
	NewPlayer, Board-Mode-BotMode-PlayerTurn-Player1-NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% determina o nome do próximo jogador a jogar (situação 1: whitePlayer acabou de jogar)
changePlayerTurn(Game, NewGame):-
	getPlayerTurn(Game, whitePlayer),
	setPlayerTurn(Game, blackPlayer, NewGame).

% determina o nome do próximo jogador a jogar (situação 2: blackPlayer acabou de jogar)
changePlayerTurn(Game, NewGame):-
	getPlayerTurn(Game, blackPlayer),
	setPlayerTurn(Game, whitePlayer, NewGame).

% obtém o estado do jogador atual (situação 1: jogador 1 está a jogar)
getCurrentPlayer(_Board-_Mode-_BotMode-PlayerTurn-Player1-_Player2, Player1):-
	getPlayerName(Player1, PlayerTurn).

% obtém o estado do jogador atual (situação 2: jogador 2 está a jogar)
getCurrentPlayer(_Board-_Mode-_BotMode-PlayerTurn-_Player1-Player2, Player2):-
	getPlayerName(Player2, PlayerTurn).

% atualiza o estado do jogador atual (situação 1: jogador 1 está a jogar)
setCurrentPlayer(Board-Mode-BotMode-PlayerTurn-Player1-Player2, NewPlayer,
	Board-Mode-BotMode-PlayerTurn-NewPlayer-Player2):-
	getPlayerName(Player1, PlayerTurn).

% atualiza o estado do jogador atual (situação 2: jogador 2 está a jogar)
setCurrentPlayer(Board-Mode-BotMode-PlayerTurn-Player1-Player2, NewPlayer,
	Board-Mode-BotMode-PlayerTurn-Player1-NewPlayer):-
	getPlayerName(Player2, PlayerTurn).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se as coordenadas introduzidas pelo utilizador são válidas (célula de origem)
validateSource(Symbol, _):-
	isTwopiece(Symbol), !,
	messageSourceTwopiece.
validateSource(Symbol, disc):-
	isDisc(Symbol, _).
validateSource(_, disc):- !,
	messageSourceNotDisc.
validateSource(Symbol, ring):-
	isRing(Symbol, _).
validateSource(_, ring):- !,
	messageSourceNotRing.

% verifica se as coordenadas introduzidas pelo utilizador são válidas (célula de destino)
validateDestination(Symbol, _):-
	isTwopiece(Symbol), !,
	messageDestinationTwopiece.
validateDestination(Symbol, disc):-
	isDisc(Symbol, _).
validateDestination(_, disc):- !,
	messageDestinationNotDisc.
validateDestination(Symbol, ring):-
	isRing(Symbol, _).
validateDestination(_, ring):- !,
	messageDestinationNotRing.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se as coordenadas introduzidas pelo utilizador se encontram dentro do intervalo
validateCoordinates(X, Y):-
	X > 0, Y > 0,
	X < 8, Y < 8.
validateCoordinates(_, _):-
	messageInvalidCoordinates.

% verifica se ambas as coordenadas introduzidas pelo utilizador são diferentes
% verifica também se as células associadas às coordenadas são vizinhas
validateBothCoordinates(FromX, FromY, FromX, FromY):-
	messageSameCoordinates.
validateBothCoordinates(FromX, FromY, ToX, ToY):-
	isNeighbour(FromX, FromY, ToX, ToY).
validateBothCoordinates(_, _, _, _):-
	messageNotNeighbours.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se determinado disco é da mesma cor que o jogador atual
validateDiscOwnership(Symbol, Player):- playerOwnsDisc(Symbol, Player).
validateDiscOwnership(_, _):- messageNotOwned.

% verifica se determinado anel é da mesma cor que o jogador atual
validateRingOwnership(Symbol, Player):- playerOwnsRing(Symbol, Player).
validateRingOwnership(_, _):- messageNotOwned.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

serverPlaceDisc(Board, Piece, Player, X-Y):-
	serverPieceAllowed(Piece, disc),
	validateCoordinates(X, Y), !,
	validatePlaceDisc(X, Y, Board, Player).

serverPlaceRing(Board, Piece, Player, X-Y):-
	serverPieceAllowed(Piece, ring),
	validateCoordinates(X, Y), !,
	validatePlaceRing(X, Y, Board, Player).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

serverPieceAllowed(null, _).
serverPieceAllowed(disc, ring).
serverPieceAllowed(ring, disc).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

serverMoveDisc(Board, Piece, Player, FromX-FromY, ToX-ToY):-
	serverPieceAllowed(Piece, disc),
	validateCoordinates(FromX, FromY),
	getSymbol(FromX, FromY, Board, Source),
	validateSource(Source, disc), !,
	validateDiscOwnership(Source, Player), !,
	validateCoordinates(ToX, ToY), !,
	validateBothCoordinates(FromX, FromY, ToX, ToY),
	getSymbol(ToX, ToY, Board, Destination),
	validateDestination(Destination, ring).

serverMoveRing(Board, Piece, Player, FromX-FromY, ToX-ToY):-
	serverPieceAllowed(Piece, ring),
	validateCoordinates(FromX, FromY),
	getSymbol(FromX, FromY, Board, Source),
	validateSource(Source, ring), !,
	validateRingOwnership(Source, Player), !,
	validateCoordinates(ToX, ToY), !,
	validateBothCoordinates(FromX, FromY, ToX, ToY),
	getSymbol(ToX, ToY, Board, Destination),
	validateDestination(Destination, disc).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se o jogador pode colocar um disco numa determinada posição do tabuleiro
validatePlaceDisc(X, Y, Board, _):-
	getSymbol(X, Y, Board, Symbol),
	isTwopiece(Symbol), !,
	messageDestinationTwopiece.
validatePlaceDisc(_, _, _, Player):-
	\+hasDiscs(Player), !,
	messageNoDiscs.
validatePlaceDisc(X, Y, Board, _):-
	canPlaceDisc(Board, X, Y).
validatePlaceDisc(_, _, Board, Player):-
	\+isPlayerStuck(Board, Player), !,
	messagePieceExists.
validatePlaceDisc(X, Y, Board, _):-
	\+canSpecialDisc(Board, X, Y), !,
	messageDestinationNotRing.
validatePlaceDisc(_, _, _, _).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se o jogador pode colocar um anel numa determinada posição do tabuleiro
validatePlaceRing(X, Y, Board, _):-
	getSymbol(X, Y, Board, Symbol),
	isTwopiece(Symbol), !,
	messageDestinationTwopiece.
validatePlaceRing(_, _, _, Player):-
	\+hasRings(Player), !,
	messageNoRings.
validatePlaceRing(X, Y, Board, _):-
	canPlaceRing(Board, X, Y).
validatePlaceRing(_, _, Board, Player):-
	\+isPlayerStuck(Board, Player), !,
	messagePieceExists.
validatePlaceRing(X, Y, Board, _):-
	\+canSpecialRing(Board, X, Y), !,
	messageDestinationNotDisc.
validatePlaceRing(_, _, _, _).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% inicia uma nova partida no modo Player vs Player
startGame(Socket, Game, pvp):-
	startHuman(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvp).

% inicia uma nova partida no modo Player vs Bot (situação 1: jogador humano começa primeiro)
startGame(Socket, Game, pvb):-
	isPlayerTurn(Game), !,
	startHuman(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvb).

% inicia uma nova partida no modo Player vs Bot (situação 2: computador começa primeiro)
startGame(Socket, Game, pvb):-
	startBot(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvb).

% inicia uma nova partida no modo Bot vs Bot
startGame(Socket, Game, bvb):-
	startBot(Socket, Game, NewGame),
	playGame(Socket, NewGame, bvb).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se ainda restam peças ao jogador 1
serverCheckGame(_, Player1, _, p1Defeated):-
	\+hasPieces(Player1).

% verifica se ainda restam peças ao jogador 2
serverCheckGame(_, _, Player2, p2Defeated):-
	\+hasPieces(Player2).

% verifica se o jogador 1 venceu a partida atual
serverCheckGame(Board, Player1, _, p1Wins):-
	hasPlayerWon(Board, Player1).

% verifica se o jogador 2 venceu a partida atual
serverCheckGame(Board, _, Player2, p2Wins):-
	hasPlayerWon(Board, Player2).

% verifica se o jogo ainda não terminou
serverCheckGame(_, _, _, continue).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% ciclo de jogo para uma partida Player vs Player
playGame(Socket, Game, pvp):-
	playHuman(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvp).

% ciclo de jogo para uma partida Player vs Bot (situação 1: vez do jogador humano)
playGame(Socket, Game, pvb):-
	isPlayerTurn(Game), !,
	playHuman(Socket, Game, NewGame),
	playGame(Socket, NewGame, pvb).

% ciclo de jogo para uma partida Player vs Bot (situação 2: vez do computador)
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

% acção do computador: realizar a jogada inicial (apenas um movimento "colocar peça")
startBot(_, Game, NewGame):-
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	botInitialMove(Board, Player, NewBoard, NewPlayer), !,
	move(Game, NewBoard, NewPlayer, NewGame).

% acção do jogador humano: realizar a jogada inicial (apenas um movimento "colocar peça")
startHuman(Socket, Game, NewGame):-
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	letHumanPlayInitial(Socket, Board, Player, NewBoard, NewPlayer), !,
	move(Game, NewBoard, NewPlayer, NewGame).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% determina se o jogador humano é o próximo a jogar no modo Player vs Bot
isPlayerTurn(Game):-
	getCurrentPlayer(Game, Player),
	getPlayer1(Game, Player), !.

% determina se o computador é o próximo a jogar no modo Player vs Bot
isBotTurn(Game):-
	getCurrentPlayer(Game, Player),
	getPlayer2(Game, Player), !.

% pede ao computador aleatório para realizar uma jogada (constituída por dois movimentos)
letBotPlay(Board, Player, random, NewBoard, NewPlayer):-
	botRandomMove(Board, Player, NewBoard, NewPlayer), !.

% pede ao computador ganancioso para realizar uma jogada (constituída por dois movimentos)
letBotPlay(Board, Player, smart, NewBoard, NewPlayer):-
	botSmartMove(Board, Player, NewBoard, NewPlayer), !.