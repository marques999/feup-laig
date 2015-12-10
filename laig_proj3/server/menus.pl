%=======================================%
%               MENU CLASS              %
%=======================================%

%                 ------------- %
% #includes                     %
%                 ------------- %

:- include('duplohex.pl').

:- meta_predicate(startPvPGame(?, 1)).
:- meta_predicate(startPvBGame(?, ?, 1)).
:- meta_predicate(startBvBGame(?, ?, 1)).

%                 ------------- %
% #predicados                   %
%                 ------------- %

printMainMenu:- nl,
	write('+================================+'), nl,
	write('+       ..:: DUPLOHEX ::..       +'), nl,
	write('+================================+'), nl,
	write('|                                |'), nl,
	write('|   1. Start                     |'), nl,
	write('|   2. Instructions              |'), nl,
	write('|   3. About                     |'), nl,
	write('|                                |'), nl,
	write('|   4. <- Exit                   |'), nl,
	write('|                                |'), nl,
	write('+================================+'), nl, nl,
	write('Please choose an option:'), nl, !.

printColorMenu:- nl,
	write('+===============================+'), nl,
	write('+    ..:: SELECT COLOR ::..     +'), nl,
	write('+===============================+'), nl,
	write('|                               |'), nl,
	write('|   1. Black                    |'), nl,
	write('|   2. White                    |'), nl,
	write('|                               |'), nl,
	write('|   3. <- Back                  |'), nl,
	write('|                               |'), nl,
	write('+===============================+'), nl, nl,
	write('Please choose an option:'), nl, !.

printBotMenu:- nl,
	write('+===============================+'), nl,
	write('+  ..:: SELECT DIFFICULTY ::..  +'), nl,
	write('+===============================+'), nl,
	write('|                               |'), nl,
	write('|   1. Random Bots              |'), nl,
	write('|   2. Smart Bots               |'), nl,
	write('|                               |'), nl,
	write('|   3. <- Back                  |'), nl,
	write('|                               |'), nl,
	write('+===============================+'), nl, nl,
	write('Please choose an option:'), nl, !.

printBoardMenu:- nl,
	write('+===============================+'), nl,
	write('+     ..:: SELECT BOARD ::..    +'), nl,
	write('+===============================+'), nl,
	write('|                               |'), nl,
	write('|   1. 6 x 6                    |'), nl,
	write('|   2. 7 x 7                    |'), nl,
	write('|   3. Diagonal                 |'), nl,
	write('|                               |'), nl,
	write('|   4. <- Back                  |'), nl,
	write('|                               |'), nl,
	write('+===============================+'), nl, nl,
	write('Please choose an option:'), nl, !.

printGameMenu:- nl,
	write('+===============================+'), nl,
	write('+     ..:: SELECT MODE ::..     +'), nl,
	write('+===============================+'), nl,
	write('|                               |'), nl,
	write('|   1. Player vs. Player        |'), nl,
	write('|   2. Player vs. Computer      |'), nl,
	write('|   3. Computer vs. Computer    |'), nl,
	write('|                               |'), nl,
	write('|   4. <- Back                  |'), nl,
	write('|                               |'), nl,
	write('+===============================+'), nl, nl,
	write('Please choose an option:'), nl, !.

duplohex:-
	initializeRandomSeed, !,
	mainMenu.

mainMenu:-
	printMainMenu,
	getInt(Input),
	mainMenuAction(Input), !.

mainMenuAction(1):- colorMenu, !, mainMenu.
mainMenuAction(2):- helpMenu, !, mainMenu.
mainMenuAction(3):- aboutMenu, !, mainMenu.
mainMenuAction(4).
mainMenuAction(_):-
	messageInvalidValue, !,
	mainMenu.

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

botMenuAction(1, Player, pvb, Matrix):- startPvBGame(Player, random, Matrix), !, botMenu(Player, pvb, Matrix).
botMenuAction(1, Player, bvb, Matrix):- startBvBGame(Player, random, Matrix), !, botMenu(Player, bvb, Matrix).
botMenuAction(2, Player, pvb, Matrix):- startPvBGame(Player, smart, Matrix), !, botMenu(Player, pvb, Matrix).
botMenuAction(2, Player, bvb, Matrix):- startBvBGame(Player, smart, Matrix), !, botMenu(Player, bvb, Matrix).
botMenuAction(3, _, _, _).
botMenuAction(_, Player, Mode, Matrix):-
	messageInvalidValue, !,
	botMenu(Player, Mode, Matrix).

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

helpMenu:-
	write('+=================================================================+'), nl,
	write('+                ..:: GAME INSTRUCTIONS ::..                      +'), nl,
	write('+=================================================================+'), nl,
	write('|                                                                 |'), nl,
	write('|   DuploHex is a connection game related to Hex that includes    |'), nl,
	write('|   discs and rings. In order to play DuploHex you need an 7x7    |'), nl,
	write('|   Hex board, 25 black and 25 white rings, and 25 black and 25   |'), nl,
	write('|   white discs.                                                  |'), nl,
	write('|                                                                 |'), nl,
	write('|   Objective:                                                    |'), nl,
	write('|     Each player must connect the two opposing sides of the      |'), nl,
	write('|     board marked by their colors either with their discs or     |'), nl,
	write('|     their rings.                                                |'), nl,
	write('|                                                                 |'), nl,
	write('|   Start:                                                        |'), nl,
	write('|     Game starts with an empty board.                            |'), nl,
	write('|     White starts by placing one disc or ring on any cell.       |'), nl,
	write('|                                                                 |'), nl,
	write('|                                                                 |'), nl,
	write('|                                                   Page 1 of 3   |'), nl,
	write('|                                                                 |'), nl,
	write('+=================================================================+'), nl,
	nl, pressEnterToContinue, nl,

	write('+=================================================================+'), nl,
	write('+                ..:: GAME INSTRUCTIONS ::..                      +'), nl,
	write('+=================================================================+'), nl,
	write('|                                                                 |'), nl,
	write('|   Each player in turn must perform two mandatory actions:       |'), nl,
	write('|                                                                 |'), nl,
	write('|   1 : add one of her discs to an empty cell or move one of her  |'), nl,
	write('|       discs on the board into any ring located in a neighbour   |'), nl,
	write('|       cell (must not be already occupied by both)               |'), nl,
	write('|                                                                 |'), nl,
	write('|   2 : one of her rings to an empty cell or move one of her      |'), nl,
	write('|       rings on the board to a neighbour cell occupied by a      |'), nl,
	write('|       disc (must not be already occupied by both)               |'), nl,
	write('|                                                                 |'), nl,
	write('|    The disc-ring pair (a disc inside a ring) cannot be moved    |'), nl,
	write('|    for the rest of the game.                                    |'), nl,
	write('|                                                                 |'), nl,
	write('|                                                                 |'), nl,
	write('|                                                   Page 2 of 3   |'), nl,
	write('|                                                                 |'), nl,
	write('+=================================================================+'), nl,
	nl, pressEnterToContinue, nl,

	write('+=================================================================+'), nl,
	write('+                ..:: GAME INSTRUCTIONS ::..                      +'), nl,
	write('+=================================================================+'), nl,
	write('|                                                                 |'), nl,
	write('|   Players may not pass. Pieces cannot be stacked.               |'), nl,
	write('|                                                                 |'), nl,
	write('|   Finally, if a player cannot perform a legal action, she must  |'), nl,
	write('|   in her turn add one of their discs or rings on any cell of    |'), nl,
	write('|   the board occupied by a ring or a disc, respectively.         |'), nl,
	write('|                                                                 |'), nl,
	write('|   For a shorter game, you can play on a 6x6 board.              |'), nl,
	write('|   To set up such board simply fill two adjacent border rows     |'), nl,
	write('|   with rings and discs of the corresponding colour before the   |'), nl,
	write('|   game starts.                                                  |'), nl,
	write('|                                                                 |'), nl,
	write('|   DuploHex @ BoardGameGeek                                      |'), nl,
	write('|     https://boardgamegeek.com/boardgame/174474/duplohex         |'), nl,
	write('|                                                                 |'), nl,
	write('|                                                                 |'), nl,
	write('|                                                   Page 3 of 3   |'), nl,
	write('|                                                                 |'), nl,
	write('+=================================================================+'), nl,
	nl, pressEnterToContinue, !.

aboutMenu:- nl,
	write('+===============================+'), nl,
	write('+        ..:: ABOUT ::..        +'), nl,
	write('+===============================+'), nl,
	write('|                               |'), nl,
	write('|   FEUP / MIEIC                |'), nl,
	write('|   Ano Letivo 2015-2016        |'), nl,
	write('|                               |'), nl,
	write('|   Authors:                    |'), nl,
	write('|                               |'), nl,
	write('|    > Carlos Samouco           |'), nl,
	write('|      up201305187@fe.up.pt     |'), nl,
	write('|                               |'), nl,
	write('|    > Diogo Marques            |'), nl,
	write('|      up201305642@fe.up.pt     |'), nl,
	write('|                               |'), nl,
	write('+===============================+'), nl,
	nl, pressEnterToContinue, !.