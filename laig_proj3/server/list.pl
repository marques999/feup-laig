%=======================================%
%           MATRIX OPERATIONS           %
%=======================================%

% altera o elemento presente na posição de coordenadas (X,Y) de uma matriz
setSymbol(1, Y, NewElem, [OldRow|Tail], [NewRow|Tail]):-
	list_set(Y, NewElem, OldRow, NewRow).
setSymbol(X, Y, NewElem, [OldRow|Tail], [OldRow|NewTail]):-
	X > 1,
	X1 is X-1,
	setSymbol(X1, Y, NewElem, Tail, NewTail).

% substitui o elemento presente em (ToX, ToY), apagando o elemento em (FromX, FromY)
moveSymbol(FromX, FromY, ToX, ToY, Symbol, Board, NewBoard):-
	setSymbol(ToX, ToY, Symbol, Board, TempBoard),
	setSymbol(FromX, FromY, 0, TempBoard, NewBoard).

% obtém o elemento presente na posição de coordenadas (X,Y) de uma matriz
getSymbol(X, Y, List, Symbol):-
	X > 0,
	list_at(X, List, Row), !,
	list_at(Y, Row, Symbol).
getSymbol(X-Y, List, Symbol):-
	getSymbol(X, Y, List, Symbol).

%=======================================%
%            LIST OPERATIONS            %
%=======================================%

% determina o comprimento de uma lista
list_size([], 0).
list_size([_|T], Size):-
	list_size(T, TailSize),
	Size is TailSize + 1.

% altera o elemento presente na posição I de uma lista
list_set(1, Symbol, [_|L], [Symbol|L]).
list_set(I, Symbol, [H|L], [H|Result]):-
	I > 1,
	I1 is I-1,
	list_set(I1, Symbol, L, Result).

% obtém o elemento presente na posição I de uma lista
list_at(1, [H|_], H).
list_at(X, [_|T], Symbol):-
	X > 1,
	X1 is X - 1, !,
	list_at(X1, T, Symbol).