%=======================================%
%               DISC CLASS              %
%=======================================%

%                 ------------- %
% #predicados                   %
%                 ------------- %

% verifica se uma determinada célula se encontra ocupada por um disco preto
isDisc(Symbol, black):-
	1 is Symbol /\ 3.

% verifica se uma determinada célula se encontra ocupada por um disco branco
isDisc(Symbol, white):-
	2 is Symbol /\ 3.

% verifica se uma determinada célula se encontra ocupada por por uma peça simples (disco preto)
isSingleBlackDisc(Symbol):-
	1 is Symbol /\ 15.

% verifica se uma determinada célula se encontra ocupada por por uma peça simples (disco branco)
isSingleWhiteDisc(Symbol):-
	2 is Symbol /\ 15.

% verifica se uma determinada célula se encontra ocupada por por uma peça simples (disco qualquer)
isSingleDisc(Symbol):-
	isSingleBlackDisc(Symbol).
isSingleDisc(Symbol):-
	isSingleWhiteDisc(Symbol).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% calcula a nova peça do tabuleiro após adição de um disco
insertDisc(Destination, Source, NewSymbol):-
	\+isTwopiece(Destination),
	NewSymbol is Destination \/ Source.

% move um disco para uma célula ocupada por um anel
moveDisc(FromX-FromY, ToX-ToY, Board, NewBoard):-
	getSymbol(ToX, ToY, Board, Destination),
	getSymbol(FromX, FromY, Board, Source),
	insertDisc(Destination, Source, NewDestination),
	moveSymbol(FromX, FromY, ToX, ToY, NewDestination, Board, NewBoard).

% verifica se é possível colocar um disco numa célula (situação normal de jogo)
canPlaceDisc(Board, X, Y):-
	getSymbol(X, Y, Board, Destination),
	isEmpty(Destination).

% verifica se é possível colocar um disco numa célula (situação excepcional de jogo)
canSpecialDisc(Board, X, Y):-
	getSymbol(X, Y, Board, Symbol),
	\+isTwopiece(Symbol),
	isRing(Symbol, _).

% coloca um disco numa determinada célula do tabuleiro
placeDisc(X-Y, Color, Board, NewBoard):-
	getSymbol(X, Y, Board, Destination),
	createSinglePiece(disc, Color, Source),
	insertDisc(Destination, Source, Symbol),
	setSymbol(X, Y, Symbol, Board, NewBoard).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se duas células se encontram ligadas por um disco da mesma cor
connectedDisc(StartX-StartY, EndX-EndY, Board):-
	isNeighbour(StartX, StartY, EndX, EndY),
	getSymbol(StartX, StartY, Board, Source),
	getSymbol(EndX, EndY, Board, Destination),
	isDisc(Source, Color),
	isDisc(Destination, Color).

% encontra um caminho ligado por discos entre duas células do tabuleiro
checkPathDisc(Start, End, Board, Color, Lista):-
	checkPathDisc(Start, End, Board, Color, [Start], Lista).
checkPathDisc(7-StartY, _End, _Board, black, Lista, Lista):-
	StartY > 1, !.
checkPathDisc(StartX-7, _End, _Board, white, Lista, Lista):-
	StartX > 1, !.
checkPathDisc(Start, End, Board, Color, Lista, ListaFim):-
	connectedDisc(Start, Middle, Board),
	Middle \= End,
	\+member(Middle, Lista),
	append(Lista, [Middle], Lista2),
	checkPathDisc(Middle, End, Board, Color, Lista2, ListaFim).