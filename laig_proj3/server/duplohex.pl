%                 ------------- %
% #includes                     %
%                 ------------- %

:- include('globals.pl').
:- include('player.pl').
:- include('board.pl').
:- include('display.pl').
:- include('bot.pl').

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

gameMode(pvp).
gameMode(pvb).
gameMode(bvb).

%                 ------------- %
% #predicados                   %
%                 ------------- %

initializeRandomSeed:-
	now(Usec),
	Seed is Usec mod 30269,
	getrand(random(X, Y, Z, _)),
	setrand(random(Seed, X, Y, Z)), !.

duplohex:- initializeRandomSeed, !, server.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se as coordenadas introduzidas pelo utilizador são válidas (célula de origem)
validateSource(Symbol, _):- isTwopiece(Symbol), !, messageSourceTwopiece.
validateSource(Symbol, disc):- isDisc(Symbol, _).
validateSource(_, disc):- !, messageSourceNotDisc.
validateSource(Symbol, ring):- isRing(Symbol, _).
validateSource(_, ring):- !, messageSourceNotRing.

% verifica se as coordenadas introduzidas pelo utilizador são válidas (célula de destino)
validateDestination(Symbol, _):- isTwopiece(Symbol), !, messageDestinationTwopiece.
validateDestination(Symbol, disc):- isDisc(Symbol, _).
validateDestination(_, disc):- !, messageDestinationNotDisc.
validateDestination(Symbol, ring):- isRing(Symbol, _).
validateDestination(_, ring):- !, messageDestinationNotRing.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se as coordenadas introduzidas pelo utilizador se encontram dentro do intervalo
validateCoordinates(X, Y):- X > 0, Y > 0, X < 8, Y < 8.
validateCoordinates(_, _):- messageInvalidCoordinates.

% verifica se ambas as coordenadas introduzidas pelo utilizador são diferentes
% verifica ainda se as células correspondentes são adjacentes
validateBothCoordinates(FromX, FromY, FromX, FromY):- messageSameCoordinates.
validateBothCoordinates(FromX, FromY, ToX, ToY):- isNeighbour(FromX, FromY, ToX, ToY).
validateBothCoordinates(_, _, _, _):- messageNotNeighbours.

serverPieceAllowed(null, _).
serverPieceAllowed(disc, ring).
serverPieceAllowed(ring, disc).

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

% verifica se o jogador atual tem jogadas regulars disponíveis
serverCheckStuck(Board, Player, yes):- isPlayerStuck(Board, Player).

% verifica se o jogador 1 venceu a partida atual
serverCheckGame(Board, Player1, _, p1Wins):- hasPlayerWon(Board, Player1).

% verifica se o jogador 2 venceu a partida atual
serverCheckGame(Board, _, Player2, p2Wins):- hasPlayerWon(Board, Player2).

% verifica se ainda restam peças ao jogador 1
serverCheckGame(_, Player1, _, p1Defeated):- \+hasPieces(Player1).

% verifica se ainda restam peças ao jogador 2
serverCheckGame(_, _, Player2, p2Defeated):- \+hasPieces(Player2).

% verifica se o jogo ainda não terminou
serverCheckGame(_, _, _, continue).