%=======================================%
%              PLAYER CLASS             %
%=======================================%

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
getPlayerName(playerState(Name, _NumberDiscs, _NumberRings), Name).

% obtém o número de discos que determinado jogador possui
getNumberDiscs(playerState(_Name, NumberDiscs, _NumberRings), NumberDiscs).

% obtém o número de anéis que determinado jogador possui
getNumberRings(playerState(_Name, _NumberDiscs, NumberRings), NumberRings).

% obtém a cor associada ao jogador adversário
getEnemyColor(playerState(whitePlayer, _NumberDiscs, _NumberRings), black).
getEnemyColor(playerState(blackPlayer, _NumberDiscs, _NumberRings), white).

%                 ------------- %
% #predicados                   %
%                 ------------- %

% cria um novo jogador com o número de peças especificado
initializePlayer(Name, NumberDiscs, NumberRings,
	playerState(Name, NumberDiscs, NumberRings)):-
	player(Name).

% obtém a cor associada a um determinado jogador
getPlayerColor(playerState(Name, _NumberDiscs, _NumberRings), Color):-
	playerColor(Name, Color).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se determinado jogador possui discos
hasDiscs(playerState(_Name, NumberDiscs, _NumberRings)):-
	NumberDiscs > 0.

% verifica se determinado jogador possui pelo menos uma das peças
hasPieces(playerState(_Name, NumberDiscs, _NumberRings)):-
	NumberDiscs > 0.
hasPieces(playerState(_Name, _NumberDiscs, NumberRings)):-
	NumberRings > 0.

% verifica se determinado jogador possui anéis
hasRings(playerState(_Name, _NumberDiscs, NumberRings)):-
	NumberRings > 0.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% decrementa o número de discos que determinado jogador possui
decrementDiscs(playerState(Name, NumberDiscs, NumberRings),
	playerState(Name, NewDiscs, NumberRings)):-
	NewDiscs is NumberDiscs - 1.

% decrementa o número de anéis que determinado jogador possui
decrementRings(playerState(Name, NumberDiscs, NumberRings),
	playerState(Name, NumberDiscs, NewRings)):-
	NewRings is NumberRings - 1.