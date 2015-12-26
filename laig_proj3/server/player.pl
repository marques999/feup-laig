%                 ------------- %
% #factos                       %
%                 ------------- %

% nomes dos jogadores
player(whitePlayer).
player(blackPlayer).

% cores dos jogadores
playerColor(whitePlayer, white).
playerColor(blackPlayer, black).

% obt�m o nome de determinado jogador
getPlayerName(playerState(Name, _, _), Name).

% obt�m o n�mero de discos que determinado jogador possui
getNumberDiscs(playerState(_, NumberDiscs, _), NumberDiscs).

% obt�m o n�mero de an�is que determinado jogador possui
getNumberRings(playerState(_, _, NumberRings), NumberRings).

% obt�m a cor associada ao jogador advers�rio
getEnemyColor(playerState(whitePlayer, _, _), black).
getEnemyColor(playerState(blackPlayer, _, _), white).

%                 ------------- %
% #predicados                   %
%                 ------------- %

% cria um novo jogador com o n�mero de pe�as especificado
initializePlayer(Name, NumberDiscs, NumberRings, playerState(Name, NumberDiscs, NumberRings)):-
	player(Name).

% obt�m a cor associada a um determinado jogador
getPlayerColor(playerState(Name, _, _), Color):-
	playerColor(Name, Color).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se determinado jogador possui discos
hasDiscs(playerState(_, NumberDiscs, _)):-
	NumberDiscs > 0.

% verifica se determinado jogador possui pelo menos uma das pe�as
hasPieces(playerState(_, NumberDiscs, _)):-
	NumberDiscs > 0.
hasPieces(playerState(_, _, NumberRings)):-
	NumberRings > 0.

% verifica se determinado jogador possui an�is
hasRings(playerState(_, _, NumberRings)):-
	NumberRings > 0.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% decrementa o n�mero de discos que determinado jogador possui
decrementDiscs(playerState(Name, NumberDiscs, NumberRings), playerState(Name, NewDiscs, NumberRings)):-
	NewDiscs is NumberDiscs - 1.

% decrementa o n�mero de an�is que determinado jogador possui
decrementRings(playerState(Name, NumberDiscs, NumberRings), playerState(Name, NumberDiscs, NewRings)):-
	NewRings is NumberRings - 1.