%=======================================%
%              BOARD CLASS              %
%=======================================%

%                 ------------- %
% #includes                     %
%                 ------------- %

:- include('list.pl').
:- include('disc.pl').
:- include('ring.pl').

:- meta_predicate(scanMatrix(?, ?, ?, 1, ?)).
:- meta_predicate(scanMatrixRow(?, ?, ?, 1, ?)).

%                 ------------- %
% #factos                       %
%                 ------------- %

createSinglePiece(disc, black, 1).
createSinglePiece(disc, white, 2).
createSinglePiece(ring, black, 4).
createSinglePiece(ring, white, 8).

isEmpty(0).

%                 ------------- %
% #predicados                   %
%                 ------------- %

% verifica se determinada célula contém uma peça dupla
isTwopiece(Symbol):-
	isRing(Symbol, _),
	isDisc(Symbol, _).

% verifica se determinada célula contém uma peça simples
isSinglePiece(Symbol):-
	\+isEmpty(Symbol),
	\+isTwopiece(Symbol).

% verifica se determinada célula contém um anel preto
isBlackRing(Symbol):-
	isRing(Symbol, black).

% verifica se determinada célula contém um anel branco
isWhiteRing(Symbol):-
	isRing(Symbol, white).

% verifica se determinada célula contém um disco preto
isBlackDisc(Symbol):-
	isDisc(Symbol, black).

% verifica se determinada célula contém um disco branco
isWhiteDisc(Symbol):-
	isDisc(Symbol, white).

% verifica se determinada célula contém uma peça simples de cor branca
isSingleWhitePiece(Symbol):-
	isSinglePiece(Symbol),
	isWhiteSymbol(Symbol).

% verifica se determinada célula contém uma peça simples de cor preta
isSingleBlackPiece(Symbol):-
	isSinglePiece(Symbol),
	isBlackSymbol(Symbol).

% verifica se duas células contém peças de tipo diferente
isDifferentSymbol(Source, Destination):-
	isDisc(Source, _),
	isRing(Destination, _).
isDifferentSymbol(Source, Destination):-
	isRing(Source, _),
	isDisc(Destination, _).

% verifica se determinada célula contém uma peça (simples || dupla) de cor branca
isWhiteSymbol(Symbol):-
	isDisc(Symbol, white).
isWhiteSymbol(Symbol):-
	isRing(Symbol, white).

% verifica se determinada célula contém uma peça (simples || dupla) de cor preta
isBlackSymbol(Symbol):-
	isDisc(Symbol, black).
isBlackSymbol(Symbol):-
	isRing(Symbol, black).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% conta o número de discos de cor preta existentes no tabuleiro
countBlackDiscs(Board, Number):-
	scanMatrix(Board, 1, 1, isBlackDisc, Lista),
	list_size(Lista, Number), !.

% conta o número de anéis de cor branca existentes no tabuleiro
countBlackRings(Board, Number):-
	scanMatrix(Board, 1, 1, isBlackRing, Lista),
	list_size(Lista, Number), !.

% conta o número de células vazias existentes no tabuleiro
countEmptyCells(Board, Number):-
	scanMatrix(Board, 1, 1, isEmpty, Lista),
	list_size(Lista, Number), !.

% conta o número de discos de cor branca existentes no tabuleiro
countWhiteDiscs(Board, Number):-
	scanMatrix(Board, 1, 1, isWhiteDisc, Lista),
	list_size(Lista, Number), !.

% conta o número de anéis de cor branca existentes no tabuleiro
countWhiteRings(Board, Number):-
	scanMatrix(Board, 1, 1, isWhiteRing, Lista),
	list_size(Lista, Number), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém uma lista com as coordenadas das peças (simples || duplas) de cor branca
scanPlayerRings(Board, white, Number, Lista):-
	scanMatrix(Board, 1, 1, isWhiteRing, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças (simples || duplas) de cor branca
scanPlayerRings(Board, black, Number, Lista):-
	scanMatrix(Board, 1, 1, isBlackRing, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças (simples || duplas) de cor branca
scanPlayerDiscs(Board, white, Number, Lista):-
	scanMatrix(Board, 1, 1, isWhiteDisc, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças (simples || duplas) de cor branca
scanPlayerDiscs(Board, black, Number, Lista):-
	scanMatrix(Board, 1, 1, isBlackDisc, Lista),
	list_size(Lista, Number), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém uma lista com as coordenadas das peças simples de cor preta
listBlackPieces(Board, Lista):-
	scanMatrix(Board, 1, 1, isSingleBlackPiece, Lista), !.

% obtém uma lista com as coordenadas de todas as peças simples existentes no tabuleiro
listSinglePieces(Board, Lista):-
	scanMatrix(Board, 1, 1, isSinglePiece, Lista), !.

% obtém uma lista com as coordenadas das peças simples de cor branca
listWhitePieces(Board, Lista):-
	scanMatrix(Board, 1, 1, isSingleWhitePiece, Lista), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém uma lista com as coordenadas dos discos simples (CHECK)
scanSingleDiscs(Board, Lista, Number):-
	scanMatrix(Board, 1, 1, isSingleDisc, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas dos anéis simples (CHECK)
scanSingleRings(Board, Lista, Number):-
	scanMatrix(Board, 1, 1, isSingleRing, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças simples de cor branca
scanPlayerSingleDiscs(Board, black, Lista, Number):-
	scanMatrix(Board, 1, 1, isSingleBlackDisc, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças simples de cor branca
scanPlayerSingleDiscs(Board, white, Lista, Number):-
	scanMatrix(Board, 1, 1, isSingleWhiteDisc, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças simples de cor branca
scanPlayerSingleRings(Board, black, Lista, Number):-
	scanMatrix(Board, 1, 1, isSingleBlackRing, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças simples de cor branca
scanPlayerSingleRings(Board, white, Lista, Number):-
	scanMatrix(Board, 1, 1, isSingleWhiteRing, Lista),
	list_size(Lista, Number), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém uma lista com as coordenadas das peças simples de cor preta
scanPlayerSinglePieces(Board, black, Lista, Number):-
	scanMatrix(Board, 1, 1, isSingleBlackPiece, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças simples de cor branca
scanPlayerSinglePieces(Board, white, Lista, Number):-
	scanMatrix(Board, 1, 1, isSingleWhitePiece, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças (simples || duplas) de cor branca
scanPlayerPieces(Board, white, Number, Lista):-
	scanMatrix(Board, 1, 1, isWhiteSymbol, Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas das peças (simples || duplas) de cor preta
scanPlayerPieces(Board, black, Number, Lista):-
	scanMatrix(Board, 1, 1, isBlackSymbol, Lista),
	list_size(Lista, Number), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém uma lista com as coordenadas vizinhas de uma célual do tabuleiro
scanNeighbors(FromX-FromY, Lista):-
	findall(ToX-ToY, isNeighbour(FromX, FromY, ToX, ToY), Lista), !.

% obtém uma lista com as coordenadas de todas as c?las vazias vizinhas de uma célual do tabuleiro
scanEmptyNeighbours(FromX-FromY, Board, Number, Lista):-
	findall(ToX-ToY, isEmptyNeighbour(Board, FromX-FromY, ToX-ToY), Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas de todas as peças simples existentes na vizinhança
scanSingleNeighbours(FromX-FromY, Board, Number, Lista):-
	findall(ToX-ToY, isSingleNeighbour(Board, FromX-FromY, ToX-ToY), Lista),
	list_size(Lista, Number), !.

% obtém uma lista com as coordenadas e número de celulas vazias no tabuleiro
scanEmptyCells(Board, Lista, Number):-
	scanMatrix(Board, 1, 1, isEmpty, Lista),
	list_size(Lista, Number), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se ainda existem células vazias para realizar jogadas regulares
isPlayerStuck(Board, _):-
	countEmptyCells(Board, NumberEmpty),
	NumberEmpty > 0, !, fail.

% verifica se ainda existem peças simples para realizar jogadas regulares
isPlayerStuck(Board, _):-
	listSinglePieces(Board, ListSingle),
	ListSingle == [].

% verifica se o jogador de cor branca ainda pode fazer jogadas regulares
isPlayerStuck(Board, Player):-
	getPlayerColor(Player, white),
	listSinglePieces(Board, ListSingle),
	listWhitePieces(Board, ListWhite),
	\+hasMovesLeft(Board, ListWhite, ListSingle).

% verifica se o jogador de cor preta ainda pode fazer jogadas regulares
isPlayerStuck(Board, Player):-
	getPlayerColor(Player, black),
	listSinglePieces(Board, ListSingle),
	listBlackPieces(Board, ListBlack),
	\+hasMovesLeft(Board, ListBlack, ListSingle).

% verifica se determinado jogador pode mover alguma peça
hasMovesLeft(Board, ListColored, ListSingle):-
	member(X, ListSingle),
	member(Y, ListColored),
	isNeighbour(X, Y),
	getSymbol(X, Board, Source),
	getSymbol(Y, Board, Destination),
	isDifferentSymbol(Source, Destination).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se duas coordenadas são adjacentes em conetividade 4
sameRow(From, To):-
	To is From + 1.
sameRow(From, To):-
	To is From - 1.

% verifica se duas células do tabuleiro são adjacentes em conetividade 6
isNeighbour(FromX, FromY, ToX, ToY):-
	ToX is FromX - 1,
	ToX > 0, ToX < 8,
	ToY is FromY + 1,
	ToY > 0, ToY < 8.
isNeighbour(FromX, FromY, ToX, ToY):-
	ToX is FromX + 1,
	ToX > 0, ToX < 8,
	ToY is FromY - 1,
	ToY > 0, ToY < 8.
isNeighbour(FromX, FromY, FromX, ToY):-
	sameRow(FromY, ToY),
	ToY > 0, ToY < 8.
isNeighbour(FromX, FromY, ToX, FromY):-
	sameRow(FromX, ToX),
	ToX > 0, ToX < 8.

% verifica se duas células do tabuleiro são vizinhas (versão com pares de coordenadas)
isNeighbour(FromX-FromY, ToX-ToY):-
	isNeighbour(FromX, FromY, ToX, ToY).

% verifica se determinada célula To vizinha de From se encontravazia
isEmptyNeighbour(Board, FromX-FromY, ToX-ToY):-
	isNeighbour(FromX, FromY, ToX, ToY),
	getSymbol(ToX, ToY, Board, Symbol),
	isEmpty(Symbol).

% verifica se determinada célula To vizinha de From contém uma peça simples
isSingleNeighbour(Board, FromX-FromY, ToX-ToY):-
	isNeighbour(FromX, FromY, ToX, ToY),
	getSymbol(ToX, ToY, Board, Symbol),
	isSinglePiece(Symbol).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se um disco existente numa célula do tabuleiro pertence a determinado jogador
playerOwnsDisc(Symbol, Player):-
	getPlayerColor(Player, Color),
	isDisc(Symbol, Color).

% verifica se um anel existente numa célula do tabuleiro pertence a determinado jogador
playerOwnsRing(Symbol, Player):-
	getPlayerColor(Player, Color),
	isRing(Symbol, Color).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se o jogador de cor preta venceu a partida
hasPlayerWon(Board, Player):-
	getPlayerColor(Player, black),
	scanBlackWall(Board, List), !,
	checkMultiplePaths(List, black, Board).

% verifica se o jogador de cor branca venceu a partida
hasPlayerWon(Board, Player):-
	getPlayerColor(Player, white),
	scanWhiteWall(Board, List), !,
	checkMultiplePaths(List, white, Board).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% dadas múltiplas posições de arranque, verifica se é possível encontrar pelo menos um caminho
checkMultiplePaths([H|_], Color, Board):-
	checkPath(H, Color, Board).
checkMultiplePaths([_|T], Color, Board):-
	checkMultiplePaths(T, Color, Board).

% dada uma posição de arranque, verifica se é possível encontrar um caminho partindo dessa posição
% (situação em que a posição de arranque contém um disco da cor do jogador)
checkPath(X-Y, Color, Board):-
	getSymbol(X, Y, Board, Symbol),
	isDisc(Symbol, Color),
	checkPathDisc(X-Y, 7-7, Board, Color, Lista), !,
	Lista \== [].

% dada uma posição de arranque, verifica se é possível encontrar um caminho partindo dessa posição
% (situação em que a posição de arranque contém um anel da cor do jogador)
checkPath(X-Y, Color, Board):-
	getSymbol(X, Y, Board, Symbol),
	isRing(Symbol, Color),
	checkPathRing(X-Y, 7-7, Board, Color, Lista), !,
	Lista \== [].

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém uma lista com as coordenadas das células que verificam determinado objetivo
scanMatrix([], _X, _Y, _Predicate, []).
scanMatrix([H|T], X, Y, Predicate, Lista):-
	scanMatrixRow(H, X, Y, Predicate, Row),
	X1 is X + 1,
	scanMatrix(T, X1, Y, Predicate, Resultado),
	append(Row, Resultado, Lista).

% percorre uma linha do tabuleiro
% obtém uma lista com as células dessa linha que verificam determinado objetivo
scanMatrixRow([], _X, _Y, _Predicate, []).
scanMatrixRow([H|T], X, Y, Predicate, Lista):-
	call(Predicate, H),
	Y1 is Y + 1,
	scanMatrixRow(T, X, Y1, Predicate, Resultado),
	append([X-Y], Resultado, Lista).
scanMatrixRow([_H|T], X, Y, Predicate, Lista):-
	Y1 is Y + 1,
	scanMatrixRow(T, X, Y1, Predicate, Lista).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém uma lista com as coordenadas das peças pretas que se encontram na parede respetiva
scanBlackWall(Board, List):-
	list_at(1, Board, Row),
	scanMatrixRow(Row, 1, 1, isBlackSymbol, List), !.

% obtém uma lista com as coordenadas das peças brancas que se encontram na parede respetiva
scanWhiteWall(Board, List):-
	scanWhite(1, 1, Board, List), !.

% percorre o tabuleiro na vertical, obtendo uma lista com as coordenadas das peças brancas
scanWhite(8, _Y, _Board, []).
scanWhite(X, Y, Board, Lista):-
	getSymbol(X, Y, Board, Symbol),
	isWhiteSymbol(Symbol),
	X1 is X + 1,
	scanWhite(X1, Y, Board, NovaLista),
	append([X-Y], NovaLista, Lista).
scanWhite(X, Y, Board, Lista):-
	X1 is X + 1,
	scanWhite(X1, Y, Board, Lista).