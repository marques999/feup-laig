%=======================================%
%                GLOBALS                %
%=======================================%

%                 ------------- %
% #includes                     %
%                 ------------- %

:- use_module(library(random)).
:- use_module(library(system)).

%                 ------------- %
% #predicados                   %
%                 ------------- %

messageInvalidValue:-
	nl, write('ERROR: you have entered an invalid value...'), nl,
	pressEnterToContinue, !.

messageInvalidChoice:-
	write('INVALID INPUT!'), nl,
	write('Please enter a valid number...'), nl, nl.

messageSameCoordinates:-
	write('INVALID INPUT!'), nl,
	write('Source and destination cell coordinates must be different'), nl,
	pressEnterToContinue, nl, fail.

messageInvalidCoordinates:-
	write('INVALID INPUT!'), nl,
	write('Cell coordinates must be an integer between 1 and 7'), nl,
	pressEnterToContinue, nl, fail.

messageNoRings:-
	write('INVALID MOVE!'), nl,
	write('Player has no rings left that can be played'), nl,
	pressEnterToContinue, nl, fail.

messageNoDiscs:-
	write('INVALID MOVE!'), nl,
	write('Player has no discs left that can be played'), nl,
	pressEnterToContinue, nl, fail.

messagePieceExists:-
	write('INVALID MOVE!'), nl,
	write('Destination cell should not be already occupied by a piece'), nl,
	pressEnterToContinue, nl, fail.

messageRingExists:-
	write('INVALID MOVE!'), nl,
	write('Destination cell should not be already occupied by a ring'), nl,
	pressEnterToContinue, nl, fail.

messageDiscExists:-
	write('INVALID MOVE!'), nl,
	write('Destination cell should not be already occupied by a disc'), nl,
	pressEnterToContinue, nl, fail.

messageSourceTwopiece:-
	write('INVALID MOVE!'), nl,
	write('Source cell is already occupied by two pieces and can\'t be moved'), nl,
	pressEnterToContinue, nl, fail.

messageSourceNotDisc:-
	write('INVALID MOVE!'), nl,
	write('Source cell is not occupied by a disc'), nl,
	pressEnterToContinue, nl, fail.

messageSourceNotRing:-
	write('INVALID MOVE!'), nl,
	write('Source cell is not occupied by a ring'), nl,
	pressEnterToContinue, nl, fail.

messageDestinationNotDisc:-
	write('INVALID MOVE!'), nl,
	write('Destination cell is not occupied by a disc'), nl,
	pressEnterToContinue, nl, fail.

messageDestinationNotRing:-
	write('INVALID MOVE!'), nl,
	write('Destination cell is not occupied by a ring'), nl,
	pressEnterToContinue, nl, fail.

messageDestinationTwopiece:-
	write('INVALID MOVE!'), nl,
	write('Destination cell is already occupied by two pieces and can\'t be moved'), nl,
	pressEnterToContinue, nl, fail.

messageNotNeighbours:-
	write('INVALID MOVE!'), nl,
	write('Source cell and destination cell aren\'t neighbors!'), nl,
	pressEnterToContinue, nl, fail.

messageNotOwned:-
	write('INVALID MOVE!'), nl,
	write('A player can only move his/her own pieces!'), nl,
	pressEnterToContinue, nl, fail.

messagePlayerWins(Player):-
	getPlayerName(Player, PlayerName),
	format('CONGRATULATIONS!\n~w has won the match!\n', PlayerName),
	pressEnterToContinue, nl.

messagePlayerLost(Player):-
	getPlayerName(Player, PlayerName),
	format('GAME OVER!\n~w has no pieces left and was defeated!\n', PlayerName),
	pressEnterToContinue, nl.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

initializeRandomSeed:-
	now(Usec),
	Seed is Usec mod 30269,
	getrand(random(X, Y, Z, _)),
	setrand(random(Seed, X, Y, Z)), !.

pressEnterToContinue:-
	write('Press <Enter> to continue...'), nl,
	get_code(_), !.

getInt(Input):-
	get_code(TempInput),
	get_code(_),
	Input is TempInput - 48.

getCoordinates(X, Y):-
	getInt(X),
	getInt(Y).