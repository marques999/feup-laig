%                 ------------- %
% #includes                     %
%                 ------------- %

:- use_module(library(random)).
:- use_module(library(system)).

%                 ------------- %
% #predicados                   %
%                 ------------- %

messageInvalidValue:-
	write('WARNING: you have entered an invalid value...\n'), !.

messageInvalidChoice:-
	write('WARNING: invalid input given, please enter a valid number!\n'), fail.

messageSameCoordinates:-
	write('WARNING: source and destination cell coordinates must be different\n'), fail.

messageInvalidCoordinates:-
	write('WARNING: cell coordinates must be an integer between 1 and 7\n'), fail.

messageNoRings:-
	write('WARNING: current player has no rings left that can be played\n'), fail.

messageNoDiscs:-
	write('WARNING: current player has no discs left that can be played\n'), fail.

messagePieceExists:-
	write('WARNING: destination cell should not be already occupied by a piece!\n'), fail.

messageRingExists:-
	write('WARNING: destination cell should not be already occupied by a ring!\n'), fail.

messageDiscExists:-
	write('WARNING: destination cell should not be already occupied by a disc!\n'), fail.

messageSourceTwopiece:-
	write('WARNING: source cell is already occupied by two pieces and thus cannot be moved...\n'), fail.

messageSourceNotDisc:-
	write('WARNING: source cell is not occupied by a disc!\n'), fail.

messageSourceNotRing:-
	write('WARNING: source cell is not occupied by a ring!\n'), fail.

messageDestinationNotDisc:-
	write('WARNING: destination cell is not occupied by a disc!\n'), fail.

messageDestinationNotRing:-
	write('WARNING: destination cell is not occupied by a ring!\n'), fail.

messageDestinationTwopiece:-
	write('WARNING: destination cell is already occupied by two pieces and thus cannot be moved...\n'), fail.

messageNotNeighbours:-
	write('WARNING: source cell and destination cell are not adjacent to each other!\n'), fail.

messageNotOwned:-
	write('WARNING: a player can only move his/her own pieces!\n'), fail.

messagePlayerWins(Player):-
	getPlayerName(Player, PlayerName),
	format('CONGRATULATIONS!\n~w has won the match!\n', PlayerName).

messagePlayerLost(Player):-
	getPlayerName(Player, PlayerName),
	format('GAME OVER!\n~w has no pieces left and was defeated!\n', PlayerName).