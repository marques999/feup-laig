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

% matriz "vazia" 6x6 (peças distribuídas pelas paredes)
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

% pede ao utilizador para introduzir uma célula de origem válida
askSourceCell(X, Y):-
	nl, write('Please enter the source cell coordinates and press <ENTER>:'), nl,
	getCoordinates(X, Y), validateCoordinates(X, Y), nl, !.

% pede ao utilizador para introduzir uma célula de destino válida
askDestinationCell(X, Y):-
	nl, write('Please enter the destination cell coordinates and press <ENTER>:'), nl,
	getCoordinates(X, Y), validateCoordinates(X, Y), nl, !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se as coordenadas introduzidas pelo utilizador são válidas (célula de origem)
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

% verifica se as coordenadas introduzidas pelo utilizador são válidas (célula de destino)
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

% verifica se as coordenadas introduzidas pelo utilizador se encontram dentro do intervalo
validateCoordinates(X, Y):-
	X > 0, Y > 0,
	X < 8, Y < 8.
validateCoordinates(_X, _Y):-
	messageInvalidCoordinates.

% verifica se ambas as coordenadas introduzidas pelo utilizador são diferentes
% verifica também se as células associadas às coordenadas são vizinhas
validateBothCoordinates(FromX, FromY, FromX, FromY):-
	messageSameCoordinates.
validateBothCoordinates(FromX, FromY, ToX, ToY):-
	isNeighbour(FromX, FromY, ToX, ToY).
validateBothCoordinates(_FromX, _FromY, _ToX, _ToY):-
	messageNotNeighbours.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se determinado disco é da mesma cor que o jogador atual
validateDiscOwnership(Symbol, Player):-
	playerOwnsDisc(Symbol, Player).
validateDiscOwnership(_X, _Y):-
	messageNotOwned.

% verifica se determinado anel é da mesma cor que o jogador atual
validateRingOwnership(Symbol, Player):-
	playerOwnsRing(Symbol, Player).
validateRingOwnership(_X, _Y):-
	messageNotOwned.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% acção do jogador humano: realiza um movimento do tipo "mover disco"
askMoveDisc(Board, Player, NewBoard):-
	askSourceCell(FromX, FromY),
	getSymbol(FromX, FromY, Board, Source),
	validateSource(Source, disc), !,
	validateDiscOwnership(Source, Player), !,
	askDestinationCell(ToX, ToY),
	validateBothCoordinates(FromX, FromY, ToX, ToY),
	getSymbol(ToX, ToY, Board, Destination),
	validateDestination(Destination, ring), !,
	moveDisc(FromX-FromY, ToX-ToY, Board, NewBoard).

% acção do jogador humano: realiza um movimento do tipo "mover anel"
askMoveRing(Board, Player, NewBoard):-
	askSourceCell(FromX, FromY),
	getSymbol(FromX, FromY, Board, Source),
	validateSource(Source, ring), !,
	validateRingOwnership(Source, Player), !,
	askDestinationCell(ToX, ToY),
	validateBothCoordinates(FromX, FromY, ToX, ToY),
	getSymbol(ToX, ToY, Board, Destination),
	validateDestination(Destination, disc), !,
	moveRing(FromX-FromY, ToX-ToY, Board, NewBoard).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se o jogador pode colocar um disco numa determinada posição do tabuleiro
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

% verifica se o jogador pode colocar um anel numa determinada posição do tabuleiro
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

% pede ao jogador humano para realizar um movimento do tipo "colocar disco"
askPlaceDisc(Board, Player, NewBoard, NewPlayer):-
	askDestinationCell(X, Y),
	validatePlaceDisc(X, Y, Board, Player), !,
	getPlayerColor(Player, Color),
	placeDisc(X-Y, Color, Board, NewBoard),
	decrementDiscs(Player, NewPlayer).

% pede ao jogador humano para realizar um movimento do tipo "colocar anel"
askPlaceRing(Board, Player, NewBoard, NewPlayer):-
	askDestinationCell(X, Y),
	validatePlaceRing(X, Y, Board, Player), !,
	getPlayerColor(Player, Color),
	placeRing(X-Y, Color, Board, NewBoard),
	decrementRings(Player, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% inicia uma nova partida no modo Player vs Player
startGame(Game, pvp):-
	startHuman(Game, NewGame),
	playGame(NewGame, pvp).

% inicia uma nova partida no modo Player vs Bot (situação 1: jogador humano começa primeiro)
startGame(Game, pvb):-
	isPlayerTurn(Game), !,
	startHuman(Game, NewGame),
	playGame(NewGame, pvb).

% inicia uma nova partida no modo Player vs Bot (situação 2: computador começa primeiro)
startGame(Game, pvb):-
	startBot(Game, NewGame),
	playGame(NewGame, pvb).

% inicia uma nova partida no modo Bot vs Bot
startGame(Game, bvb):-
	startBot(Game, NewGame),
	playGame(NewGame, bvb).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se ainda restam peças ao jogador atual
playGame(Game, _Mode):-
	getCurrentPlayer(Game, Player),
	\+hasPieces(Player), !,
	getGameBoard(Game, Board),
	printBoard(Board),
	messagePlayerLost(Player).

% verifica se o jogador 1 venceu a partida atual
playGame(Game, _Mode):-
	getGameBoard(Game, Board),
	getPlayer1(Game, Player1),
	hasPlayerWon(Board, Player1), !,
	printBoard(Board),
	messagePlayerWins(Player1).

% verifica se o jogador 2 venceu a partida atual
playGame(Game, _Mode):-
	getGameBoard(Game, Board),
	getPlayer2(Game, Player2),
	hasPlayerWon(Board, Player2), !,
	printBoard(Board),
	messagePlayerWins(Player2).

% ciclo de jogo para uma partida Player vs Player
playGame(Game, pvp):-
	playHuman(Game, NewGame),
	playGame(NewGame, pvp).

% ciclo de jogo para uma partida Player vs Bot (situação 1: vez do jogador humano)
playGame(Game, pvb):-
	isPlayerTurn(Game), !,
	playHuman(Game, NewGame),
	playGame(NewGame, pvb).

% ciclo de jogo para uma partida Player vs Bot (situação 2: vez do computador)
playGame(Game, pvb):-
	playBot(Game, NewGame),
	playGame(NewGame, pvb).

% ciclo de jogo para uma partida Bot vs Bot
playGame(Game, bvb):-
	playBot(Game, NewGame),
	playGame(NewGame, bvb).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% atualiza estado do jogo com movimento realizado pelo jogador atual
move(Game, Board, Player, NewGame):-
	setGameBoard(Game, Board, TempGame),
	setCurrentPlayer(TempGame, Player, TempGame2),
	changePlayerTurn(TempGame2, NewGame), !.

% acção do computador: realizar uma jogada (constitúida por dois movimentos)
playBot(Game, NewGame):-
	getBotMode(Game, BotMode),
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	letBotPlay(Board, Player, BotMode, NewBoard, NewPlayer),
	move(Game, NewBoard, NewPlayer, NewGame).

% acção do jogador humano: realizar uma jogada (constituída por dois movimentos)
playHuman(Game, NewGame):-
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	letHumanPlay(Board, Player, NewBoard, NewPlayer),
	move(Game, NewBoard, NewPlayer, NewGame).

% acção do computador: realizar a jogada inicial (apenas um movimento "colocar peça")
startBot(Game, NewGame):-
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	botInitialMove(Board, Player, NewBoard, NewPlayer), !,
	move(Game, NewBoard, NewPlayer, NewGame).

% acção do jogador humano: realizar a jogada inicial (apenas um movimento "colocar peça")
startHuman(Game, NewGame):-
	getGameBoard(Game, Board),
	getCurrentPlayer(Game, Player),
	printState(Game),
	askInitialMove(Board, Player, NewBoard, NewPlayer), !,
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

% pede ao jogador humano para realizar uma jogada (constituída por dois movimentos)
letHumanPlay(Board, Player, NewBoard, NewPlayer):-
	write('> SELECT FIRST MOVE:\t1. Place Disc'), nl,
	write('\t\t\t2. Place Ring'), nl,
	write('\t\t\t3. Move Disc'), nl,
	write('\t\t\t4. Move Ring'), nl,
	getInt(Choice),
	askMoveAction(Board, Player, Choice, NewBoard, NewPlayer), !.

% pede ao computador aleatório para realizar uma jogada (constituída por dois movimentos)
letBotPlay(Board, Player, random, NewBoard, NewPlayer):-
	botRandomMove(Board, Player, NewBoard, NewPlayer), !.

% pede ao computador ganancioso para realizar uma jogada (constituída por dois movimentos)
letBotPlay(Board, Player, smart, NewBoard, NewPlayer):-
	botSmartMove(Board, Player, NewBoard, NewPlayer), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% pede ao jogador humano para realizar a jogada inicial
askInitialMove(Board, Player, NewBoard, NewPlayer):-
	write('> SELECT INITIAL MOVE:\t1. Place Disc'), nl,
	write('\t\t\t2. Place Ring'), nl,
	getInt(Choice),
	askInitialAction(Board, Player, Choice, NewBoard, NewPlayer).

% pede ao jogador humano um movimento inicial ("colocar disco" || "colocar peça")
askInitialAction(Board, Player, 1, NewBoard, NewPlayer):-
	askPlaceDisc(Board, Player, NewBoard, NewPlayer).
askInitialAction(Board, Player, 2, NewBoard, NewPlayer):-
	askPlaceRing(Board, Player, NewBoard, NewPlayer).
askInitialAction(Board, Player, Choice, NewBoard, NewPlayer):-
	Choice > 0, Choice =< 2, !,
	askInitialMove(Board, Player, NewBoard, NewPlayer).
askInitialAction(Board, Player, _Choice, NewBoard, NewPlayer):-
	messageInvalidChoice, !,
	askInitialMove(Board, Player, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% pede um segundo movimento ao jogador humano (após ter jogado anéis no primeiro)
askSecondMove(Board, Player, disc, NewBoard, NewPlayer):-
	printBoard(Board),
	write('> SELECT SECOND MOVE:\t1. Place Disc'), nl,
	write('\t\t\t2. Move Disc'), nl,
	getInt(Choice),
	askDiscAction(Board, Player, Choice, NewBoard, NewPlayer).

% pede um segundo movimento ao jogador humano (após ter jogado discos no primeiro)
askSecondMove(Board, Player, ring, NewBoard, NewPlayer):-
	printBoard(Board),
	write('> SELECT SECOND MOVE:\t1. Place Ring'), nl,
	write('\t\t\t2. Move Ring'), nl,
	getInt(Choice),
	askRingAction(Board, Player, Choice, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% pede um primeiro movimento ao jogador humano, dos quatro possíveis
askMoveAction(Board, Player, 1, NewBoard, NewPlayer):-
	askPlaceDisc(Board, Player, TempBoard, TempPlayer), !,
	askSecondMove(TempBoard, TempPlayer, ring, NewBoard, NewPlayer).
askMoveAction(Board, Player, 2, NewBoard, NewPlayer):-
	askPlaceRing(Board, Player, TempBoard, TempPlayer), !,
	askSecondMove(TempBoard, TempPlayer, disc, NewBoard, NewPlayer).
askMoveAction(Board, Player, 3, NewBoard, NewPlayer):-
	askMoveDisc(Board, Player, TempBoard), !,
	askSecondMove(TempBoard, Player, ring, NewBoard,  NewPlayer).
askMoveAction(Board, Player, 4, NewBoard, NewPlayer):-
	askMoveRing(Board, Player, TempBoard), !,
	askSecondMove(TempBoard, Player, disc, NewBoard, NewPlayer).
askMoveAction(Board, Player, Choice, NewBoard, NewPlayer):-
	Choice > 0, Choice =< 4, !,
	letHumanPlay(Board, Player, NewBoard, NewPlayer).
askMoveAction(Board, Player, _Choice, NewBoard, NewPlayer):-
	messageInvalidChoice, !,
	letHumanPlay(Board, Player, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% pede um segundo movimento com discos ao jogador humano
askDiscAction(Board, Player, 1, NewBoard, NewPlayer):-
	askPlaceDisc(Board, Player, NewBoard, NewPlayer).
askDiscAction(Board, Player, 2, NewBoard, _NewPlayer):-
	askMoveDisc(Board, Player, NewBoard).
askDiscAction(Board, Player, Choice, NewBoard, NewPlayer):-
	Choice > 0, Choice =< 2, !,
	askSecondMove(Board, Player, disc, NewBoard, NewPlayer).
askDiscAction(Board, Player, _Choice, NewBoard, NewPlayer):-
	messageInvalidChoice, !,
	askSecondMove(Board, Player, disc, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% pede um segundo movimento com anéis ao jogador humano
askRingAction(Board, Player, 1, NewBoard, NewPlayer):-
	askPlaceRing(Board, Player, NewBoard, NewPlayer).
askRingAction(Board, Player, 2, NewBoard, _NewPlayer):-
	askMoveRing(Board, Player, NewBoard).
askRingAction(Board, Player, Choice, NewBoard, NewPlayer):-
	Choice > 0, Choice =< 2, !,
	askSecondMove(Board, Player, ring, NewBoard, NewPlayer).
askRingAction(Board, Player, _Choice, NewBoard, NewPlayer):-
	messageInvalidChoice, !,
	askSecondMove(Board, Player, disc, NewBoard, NewPlayer).