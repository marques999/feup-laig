%=======================================%
%             DISPLAY CLASS             %
%=======================================%

%                 ------------- %
% #factos                       %
%                 ------------- %

firstLine(8, ' --- ').
firstLine(9, ' --- ').
firstLine(10, ' --- ').
firstLine(4, ' xxx ').
firstLine(5, ' xxx ').
firstLine(6, ' xxx ').
firstLine(_, '     ').

secondLine(1, '  B  ').
secondLine(2, '  W  ').
secondLine(4, 'x   x').
secondLine(5, 'x B x').
secondLine(6, 'x W x').
secondLine(8, '|   |').
secondLine(9, '| B |').
secondLine(10, '| W |').
secondLine(_, '     ').

%                 ------------- %
% #predicados                   %
%                 ------------- %

% imprime no ecrã os delimitadores das células do tabuleiro
createSeparator(0, _).
createSeparator(N, SS):-
	N1 is N-1,
	write(SS),
	createSeparator(N1, SS), !.

% imprime no ecrã uma sequência de 4 * Y espaços
printTab(Y):-
	Y1 is Y * 4,
	format('~*c', [Y1, 0' ]), !.

% imprime no ecrã uma representação do tabuleiro de jogo
printBoard(Board):-
	nl, printFirstRow(7),
	printRows(Board, 7), nl, nl, !.

% imprime no ecrã os números das colunas do tabuleiro
printColumnIdentifiers(Length):-
	printColumnIdentifiers(Length, 0), !.

% função auxiliar para imprimir no ecrã os Length números das colunas do tabuleiro
printColumnIdentifiers(Length, Length).
printColumnIdentifiers(Length, Current):-
	Next is Current + 1,
	write('   '),
	write(Next),
	write('    '),
	printColumnIdentifiers(Length, Next), !.

% imprime no ecrã as linhas do tabuleiro
printRows(Board, Length) :-
	printRows(Board, Length, 0), !.

% função auxiliar para imprimir no ecrã as Length linhas do tabuleiro
printRows([], Length, Length).
printRows([H|T], Length, Current):-
	printRow(H, Length, Current),
	Next is Current + 1,
	printRows(T, Length, Next), !.

% imprime no ecrã a primeira linha da representação do tabuleiro
printFirstRow(Length):-
	write('     '),
	printColumnIdentifiers(Length), nl,
	write('    +'),
	createSeparator(Length, '-------+'), nl, !.

% imprime no ecrã a última linha do tabuleiro
printRow(Items, Length, Current):-
	Current is Length - 1,
	printRowItems(Items, Current), nl,
	printTab(Current),
	write('    +'),
	createSeparator(Length, '-------+'), !.

% imprime no ecrã uma linha do tabuleiro
printRow(Items, Length, Current):-
	printRowItems(Items, Current), nl,
	printTab(Current),
	write('    +'),
	createSeparator(Length, '-------+'),
	write('---+'), nl, !.

% imprime no ecrã as células e peças de determinada linha do tabuleiro
printRowItems(Items, Current):-
	printTab(Current),
	write('    | '),
	printFirstLine(Items), nl,
	Next is Current + 1,
	write(Next),
	printTab(Current),
	write('   | '),
	printSecondLine(Items), nl,
	printTab(Current),
	write('    | '),
	printFirstLine(Items), !.

% imprime no ecrã a primeira e terceira secções de uma linha do tabuleiro
printFirstLine([]).
printFirstLine([H|T]):-
	firstLine(H, Char),
	write(Char),
	write(' | '),
	printFirstLine(T), !.

% imprime no ecrã a segunda secção de uma linha do tabuleiro
printSecondLine([]).
printSecondLine([H|T]):-
	secondLine(H, Char),
	write(Char),
	write(' | '),
	printSecondLine(T), !.

% imprime no ecrã informações sobre o estado de determinado jogador (nome e número de peças)
printPlayerInfo(Player):-
	getPlayerName(Player, PlayerName),
	getNumberRings(Player, NumberRings),
	getNumberDiscs(Player, NumberDiscs),
	format('| ~w | rings : ~w | discs : ~w |', [PlayerName, NumberRings, NumberDiscs]), nl, !.

% imprime no ecrã o nome do próximo jogador a jogar
printTurn(Player):-
	format("> IT'S ~w'S TURN!", Player), nl, !.

% imprime no ecrã todos os elementos do estado do jogo
printState(Game):-
	getGameBoard(Game, Board),
	getPlayer1(Game, Player1),
	getPlayer2(Game, Player2),
	getPlayerTurn(Game, PlayerTurn),
	printBoard(Board),
	write('+---------------------------------------+'), nl,
	printPlayerInfo(Player1),
	printPlayerInfo(Player2),
	write('+---------------------------------------+'), nl, nl,
	printTurn(PlayerTurn), nl,
	pressEnterToContinue, nl, !.