%=======================================%
%               MENU CLASS              %
%=======================================%

%                 ------------- %
% #includes                     %
%                 ------------- %


:- meta_predicate(startPvPGame(?, 1)).
:- meta_predicate(startPvBGame(?, ?, 1)).
:- meta_predicate(startBvBGame(?, ?, 1)).

%                 ------------- %
% #predicados                   %
%                 ------------- %

duplohex:-
	initializeRandomSeed, !,
	server.

colorMenu:-
	printColorMenu,
	getInt(Input),
	colorMenuAction(Input), !.

colorMenuAction(1):- gameMenu(blackPlayer), !, colorMenu.
colorMenuAction(2):- gameMenu(whitePlayer), !, colorMenu.
colorMenuAction(3).
colorMenuAction(_):-
	messageInvalidValue, !,
	colorMenu.

gameMenu(Player):-
	printGameMenu,
	getInt(Input),
	gameMenuAction(Input, Player), !.

gameMenuAction(1, Player):- boardMenu(Player, pvp), !, gameMenu(Player).
gameMenuAction(2, Player):- boardMenu(Player, pvb), !, gameMenu(Player).
gameMenuAction(3, Player):- boardMenu(Player, bvb), !, gameMenu(Player).
gameMenuAction(4, _).
gameMenuAction(_, Player):-
	messageInvalidValue, !,
	gameMenu(Player).

boardMenu(Player, Mode):-
	printBoardMenu,
	getInt(Input),
	boardMenuAction(Input, Player, Mode), !.

boardMenuAction(1, Player, pvp):- startPvPGame(Player, empty6x6Matrix), !, boardMenu(Player, pvp).
boardMenuAction(1, Player, Mode):- botMenu(Player, Mode, empty6x6Matrix), !, boardMenu(Player, Mode).
boardMenuAction(2, Player, pvp):- startPvPGame(Player, emptyMatrix), !, boardMenu(Player, pvp).
boardMenuAction(2, Player, Mode):- botMenu(Player, Mode, emptyMatrix), !, boardMenu(Player, Mode).
boardMenuAction(3, Player, pvp):- startPvPGame(Player, diagonalMatrix), !, boardMenu(Player, pvp).
boardMenuAction(3, Player, Mode):- botMenu(Player, Mode, diagonalMatrix), !, boardMenu(Player, Mode).
boardMenuAction(4, _, _).
boardMenuAction(_, Player, Mode):-
	messageInvalidValue, !,
	boardMenu(Player, Mode).

botMenu(Player, Mode, Matrix):-
	printBotMenu,
	getInt(Input),
	botMenuAction(Input, Player, Mode, Matrix), !.

startPvPGame(Player, Matrix):-
	call(Matrix, Board),
	initializePvP(Game, Board, Player), !,
	startGame(Game, pvp).

startPvBGame(Player, BotMode, Matrix):-
	call(Matrix, Board),
	initializePvB(Game, Board, Player, BotMode), !,
	startGame(Game, pvb).

startBvBGame(Player, BotMode, Matrix):-
	call(Matrix, Board),
	initializeBvB(Game, Board, Player, BotMode), !,
	startGame(Game, bvb).