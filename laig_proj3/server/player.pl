%                 ------------- %
% #factos                       %
%                 ------------- %

% nomes dos jogadores
player(whitePlayer).
player(blackPlayer).

% cores dos jogadores
playerColor(whitePlayer, white).
playerColor(blackPlayer, black).

% obtém o nome de determinado jogador
getPlayerName(playerState(Name, _, _), Name).

% obtém o número de discos que determinado jogador possui
getNumberDiscs(playerState(_, NumberDiscs, _), NumberDiscs).

% obtém o número de anéis que determinado jogador possui
getNumberRings(playerState(_, _, NumberRings), NumberRings).

% obtém a cor associada ao jogador adversário
getEnemyColor(playerState(whitePlayer, _, _), black).
getEnemyColor(playerState(blackPlayer, _, _), white).

%                 ------------- %
% #predicados                   %
%                 ------------- %

% cria um novo jogador com o número de peças especificado
initializePlayer(Name, NumberDiscs, NumberRings, playerState(Name, NumberDiscs, NumberRings)):-
	player(Name).

% obtém a cor associada a um determinado jogador
getPlayerColor(playerState(Name, _, _), Color):-
	playerColor(Name, Color).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se determinado jogador possui discos
hasDiscs(playerState(_, NumberDiscs, _)):-
	NumberDiscs > 0.

% verifica se determinado jogador possui pelo menos uma das peças
hasPieces(playerState(_, NumberDiscs, _)):-
	NumberDiscs > 0.
hasPieces(playerState(_, _, NumberRings)):-
	NumberRings > 0.

% verifica se determinado jogador possui anéis
hasRings(playerState(_, _, NumberRings)):-
	NumberRings > 0.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% decrementa o número de discos que determinado jogador possui
decrementDiscs(playerState(Name, NumberDiscs, NumberRings), playerState(Name, NewDiscs, NumberRings)):-
	NewDiscs is NumberDiscs - 1.

% decrementa o número de anéis que determinado jogador possui
decrementRings(playerState(Name, NumberDiscs, NumberRings), playerState(Name, NumberDiscs, NewRings)):-
	NewRings is NumberRings - 1.