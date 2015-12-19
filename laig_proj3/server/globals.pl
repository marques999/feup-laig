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
	nl, write('ERROR: you have entered an invalid value...'), nl, !.

messageInvalidChoice:-
	write('INVALID INPUT!'), nl,
	write('Please enter a valid number...'), nl, nl.

messageSameCoordinates:-
	write('Source and destination cell coordinates must be different'), nl, nl, fail.

messageInvalidCoordinates:-
	write('Cell coordinates must be an integer between 1 and 7'), nl, nl, fail.

messageNoRings:-
	write('Player has no rings left that can be played'), nl, nl, fail.

messageNoDiscs:-
	write('Player has no discs left that can be played'), nl, nl, fail.

messagePieceExists:-
	write('Destination cell should not be already occupied by a piece'), nl, nl, fail.

messageRingExists:-
	write('Destination cell should not be already occupied by a ring'), nl, nl, fail.

messageDiscExists:-
	write('Destination cell should not be already occupied by a disc'), nl, nl, fail.

messageSourceTwopiece:-
	write('Source cell is already occupied by two pieces and can\'t be moved'), nl, nl, fail.

messageSourceNotDisc:-
	write('Source cell is not occupied by a disc'), nl, nl, fail.

messageSourceNotRing:-
	write('Source cell is not occupied by a ring'), nl, nl, fail.

messageDestinationNotDisc:-
	write('Destination cell is not occupied by a disc'), nl, nl, fail.

messageDestinationNotRing:-
	write('Destination cell is not occupied by a ring'), nl, nl, fail.

messageDestinationTwopiece:-
	write('Destination cell is already occupied by two pieces and can\'t be moved'), nl, nl, fail.

messageNotNeighbours:-
	write('Source cell and destination cell aren\'t neighbors!'), nl, nl, fail.

messageNotOwned:-
	write('A player can only move his/her own pieces!'), nl, nl, fail.

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