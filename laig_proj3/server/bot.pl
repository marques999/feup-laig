%=======================================%
%               BOT CLASS               %
%=======================================%

%                 ------------- %
% #factos                       %
%                 ------------- %

botMode(random).
botMode(smart).

%                 ------------- %
% #predicados                   %
%                 ------------- %

% escolhe aleatoriamente um elemento de uma lista com várias coordenadas
generatePosition(Lista, Tamanho, Position):-
	TamanhoExtra is Tamanho + 1,
	random(1, TamanhoExtra, Number),
	list_at(Number, Lista, Position), !.

% obtém as coordenadas de uma célula vazia vizinha da célula From
generateEmptyNeighbour(Board, From, Position):-
	scanEmptyNeighbours(From, Board, Tamanho, Lista),
	Tamanho > 0,
	generatePosition(Lista, Tamanho, Position), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% realiza uma jogada inteligente do tipo "mover disco"
botSmartMoveDisc(Board, Player, OwnPosition, EnemyPosition):-
	findOwnSingleDisc(Board, Player, OwnPosition),
	scanSingleNeighbours(OwnPosition, Board, Tamanho, Lista),
	Tamanho > 0,
	calculateMoveDisc(Board, OwnPosition, Lista, 0, 0-0, EnemyPosition),
	EnemyPosition \= 0-0.

% em caso de insucesso, realiza uma jogada aleatória do tipo "mover disco"
botSmartMoveDisc(Board, Player, OwnPosition, EnemyPosition):-
	botRandomSource(Board, disc, Player, OwnPosition),
	botRandomDestination(OwnPosition, EnemyPosition).

% realiza uma jogada inteligente do tipo "mover anel"
botSmartMoveRing(Board, Player, OwnPosition, EnemyPosition):-
	findOwnSingleRing(Board, Player, OwnPosition),
	scanSingleNeighbours(OwnPosition, Board, Tamanho, Lista),
	Tamanho > 0,
	calculateMoveRing(Board, OwnPosition, Lista, 0, 0-0, EnemyPosition),
	EnemyPosition \= 0-0.

% em caso de insucesso, realiza uma jogada aleatória do tipo "mover anel"
botSmartMoveRing(Board, Player, OwnPosition, EnemyPosition):-
	botRandomSource(Board, ring, Player, OwnPosition),
	botRandomDestination(OwnPosition, EnemyPosition).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% pontua uma jogada do tipo "mover disco" para cada célula vizinha
calculateMoveDisc(_Board, _From, [],  _Score, Position, Position):- !.
calculateMoveDisc(Board, From, [To|T], Score, _Position, TargetPosition):-
	scoreMoveDisc(Board, From, To, NewScore),
	NewScore > Score,
	calculateMoveDisc(Board, From, T, NewScore, To, TargetPosition).
calculateMoveDisc(Board, From, [_|T], Score, Position, TargetPosition):-
	calculateMoveDisc(Board, From, T, Score, Position, TargetPosition).

% pontua uma jogada do tipo "mover anel" para cada célula vizinha
calculateMoveRing(_Board, _From, [],  _Score, Position, Position):- !.
calculateMoveRing(Board, From, [To|T], Score, _Position, TargetPosition):-
	scoreMoveRing(Board, From, To, NewScore),
	NewScore > Score,
	calculateMoveRing(Board, From, T, NewScore, To, TargetPosition).
calculateMoveRing(Board, From, [_|T], Score, Position, TargetPosition):-
	calculateMoveRing(Board, From, T, Score, Position, TargetPosition).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% pontua a jogada com "2" se as peças adjacentes são diferentes mas pertencem a jogadores diferentes
scoreMoveDisc(Board, From, To, 2):-
	getSymbol(From, Board, Source),
	getSymbol(To, Board, Destination),
	isDisc(Source, Color),
	isRing(Destination, _),
	\+isRing(Destination, Color).

% pontua a jogada com "1" se as peças adjacentes são diferentes mas pertencem ao mesmo jogador
scoreMoveDisc(Board, From, To, 1):-
	getSymbol(From, Board, Source),
	getSymbol(To, Board, Destination),
	isDisc(Source, Color),
	isRing(Destination, Color).

% pontua a jogada com "0" se a célula adjacente encontra-se vazia
scoreMoveDisc(_Board, _From, _To, 0).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% pontua a jogada com "2" se as peças adjacentes são diferentes mas pertencem a jogadores diferentes
scoreMoveRing(Board, From, To, 2):-
	getSymbol(From, Board, Source),
	getSymbol(To, Board, Destination),
	isRing(Source, Color),
	isDisc(Destination, _),
	\+isDisc(Destination, Color).

% pontua a jogada com "1" se as peças adjacentes são diferentes mas pertencem ao mesmo jogador
scoreMoveRing(Board, From, To, 1):-
	getSymbol(From, Board, Source),
	getSymbol(To, Board, Destination),
	isRing(Source, Color),
	isDisc(Destination, Color).

% pontua a jogada com "0" se a célula adjacente encontra-se vazia
scoreMoveRing(_Board, _From, _To, 0).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém as coordenadas de uma célula (simples || dupla) com uma peça do jogador
findOwnPiece(Board, Player, Position):-
	getPlayerColor(Player, Color),
	scanPlayerPieces(Board, Color, Tamanho, Lista),
	Tamanho > 0, !,
	generatePosition(Lista, Tamanho, Position).

% obtém as coordenadas de uma célula (simples || dupla) com um disco do jogador
findOwnDisc(Board, Player, Position):-
	getPlayerColor(Player, Color),
	scanPlayerDiscs(Board, Color, Tamanho, Lista),
	Tamanho > 0, !,
	generatePosition(Lista, Tamanho, Position).

% obtém as coordenadas de uma célula (simples || dupla) com um disco do jogador
findOwnSingleDisc(Board, Player, Position):-
	getPlayerColor(Player, Color),
	scanPlayerSingleDiscs(Board, Color, Lista, Tamanho),
	Tamanho > 0,
	generatePosition(Lista, Tamanho, Position).

% obtém as coordenadas de uma célula (simples || dupla) com um anel do jogador
findOwnRing(Board, Player, Position):-
	getPlayerColor(Player, Color),
	scanPlayerRings(Board, Color, Tamanho, Lista),
	Tamanho > 0, !,
	generatePosition(Lista, Tamanho, Position).

% obtém as coordenadas de uma célula (simples || dupla) com um disco do jogador
findOwnSingleRing(Board, Player, Position):-
	getPlayerColor(Player, Color),
	scanPlayerSingleRings(Board, Color, Lista, Tamanho),
	Tamanho > 0,
	generatePosition(Lista, Tamanho, Position).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém as coordenadas de uma célula (simples || dupla) com uma peça do adversário
findOpponentPiece(Board, Player, Position):-
	getEnemyColor(Player, Color),
	scanPlayerPieces(Board, Color, Tamanho, Lista),
	Tamanho > 0, !,
	generatePosition(Lista, Tamanho, Position).

% obtém as coordenadas de uma célula (simples || dupla) com um disco do adversário
findOpponentDisc(Board, Player, Position):-
	getEnemyColor(Player, Color),
	scanPlayerDiscs(Board, Color, Tamanho, Lista),
	Tamanho > 0, !,
	generatePosition(Lista, Tamanho, Position).

% obtém as coordenadas de uma célula (simples || dupla) com um anel do adversário
findOpponentRing(Board, Player, Position):-
	getEnemyColor(Player, Color),
	scanPlayerRings(Board, Color, Tamanho, Lista),
	Tamanho > 0, !,
	generatePosition(Lista, Tamanho, Position).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% obtém as coordenadas de uma célula adjacente à célula que contém um disco do jogador
botAttackPlaceDisc(Board, Player, Position):-
	findOwnDisc(Board, Player, OwnPosition), !,
	generateEmptyNeighbour(Board, OwnPosition, Position).

% obtém as coordenadas de uma célula adjacente à célula que contém um anel do jogador
botAttackPlaceRing(Board, Player, Position):-
	findOwnRing(Board, Player, OwnPosition), !,
	generateEmptyNeighbour(Board, OwnPosition, Position).

% obtém as coordenadas de uma célula adjacente à célula que contém um disco do adversário
botDefendPlaceDisc(Board, Player, Position):-
	findOpponentDisc(Board, Player, EnemyPosition), !,
	generateEmptyNeighbour(Board, EnemyPosition, Position).

% obtém as coordenadas de uma célula adjacente à célula que contém um anel do adversário
botDefendPlaceRing(Board, Player, Position):-
	findOpponentRing(Board, Player, EnemyPosition), !,
	generateEmptyNeighbour(Board, EnemyPosition, Position).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% jogada ofensiva (colocar um anel na vizinhança de uma peça do próprio jogador)
botSmartPlaceRing(Board, Player, Position):-
	random(0, 11, Number),
	Number > 5,
	botAttackPlaceRing(Board, Player, Position).

% jogada defensiva (colocar um anel na vizinhança de uma peça do adversário)
botSmartPlaceRing(Board, Player, Position):-
	botDefendPlaceRing(Board, Player, Position).

% jogada defensiva aleatória, caso as tentativas anteriores não tenham sucesso
botSmartPlaceRing(Board, Player, Position):-
	botRandomPlace(Board, Player, Position, ring).

% jogada ofensiva (colocar um disco na vizinhança de uma peça do próprio jogador)
botSmartPlaceDisc(Board, Player, Position):-
	random(0, 11, Number),
	Number > 5,
	botAttackPlaceDisc(Board, Player, Position).

% jogada defensiva (colocar um disco na vizinhança de uma peça do adversário)
botSmartPlaceDisc(Board, Player, Position):-
	botDefendPlaceDisc(Board, Player, Position).

% jogada defensiva aleatória, caso as tentativas anteriores não tenham sucesso
botSmartPlaceDisc(Board, Player, Position):-
	botRandomPlace(Board, Player, Position, disc).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% acção inicial do computador: colocar um disco
botInitialMove(Board, Player, NewBoard, NewPlayer):-
	random(0, 2, Action),
	Action > 0, !,
	botRandomPlace(Board, Player, Position, disc),
	botAction(1, Position, Board, Player, NewBoard, NewPlayer).

% acção inicial do computador: colocar um anel
botInitialMove(Board, Player, NewBoard, NewPlayer):-
	botRandomPlace(Board, Player, Position, ring),
	botAction(3, Position, Board, Player, NewBoard, NewPlayer).

% predicado gerador de movimentos aleatórios do computador
botRandomMove(Board, Player, NewBoard, NewPlayer):-
	random(1, 5, Number),
	hasDiscs(Player),
	hasRings(Player), !,
	botRandomAction(Number, Board, Player, NewBoard, NewPlayer).

% predicado gerador de movimentos inteligentes do computador
botSmartMove(Board, Player, NewBoard, NewPlayer):-
	random(1, 5, Number),
	hasDiscs(Player),
	hasRings(Player), !,
	botSmartAction(Number, Board, Player, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% acção do computador: colocar um disco no tabuleiro
botAction(1, Position, Board, Player, NewBoard, NewPlayer):-
	hasDiscs(Player), !,
	getPlayerColor(Player, Color),
	printPlaceAction(Player, disc, Position),
	placeDisc(Position, Color, Board, NewBoard),
	decrementDiscs(Player, NewPlayer).

% acção do computador: colocar um anel no tabuleiro
botAction(3, Position, Board, Player, NewBoard, NewPlayer):-
	hasRings(Player), !,
	getPlayerColor(Player, Color),
	printPlaceAction(Player, ring, Position),
	placeRing(Position, Color, Board, NewBoard),
	decrementRings(Player, NewPlayer).

% acção do computador: mover um disco para uma célula ocupada por um anel
botAction(2, From, To, Board, Player, NewBoard, Player):-
	botCanMoveDisc(From, To, Board, Player), !,
	printMoveAction(Player, disc, From, To),
	moveDisc(From, To, Board, NewBoard).

% acção do computador: mover um anel para uma célula ocupada por um disco
botAction(4, From, To, Board, Player, NewBoard, Player):-
	botCanMoveRing(From, To, Board, Player),
	printMoveAction(Player, ring, From, To),
	moveRing(From, To, Board, NewBoard).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% imprime no ecrã informações relativas ao movimento "colocar peça" do computador
printPlaceAction(Player, Piece, Position):-
	getPlayerName(Player, PlayerName),
	format('~w placed ~w at position ~w\n', [PlayerName, Piece, Position]), nl.

% imprime no ecrã informações relativas ao movimento "mover peça" do computador
printMoveAction(Player, Piece, From, To):-
	getPlayerName(Player, PlayerName),
	format('~w moving ~w from position ~w to position ~w\n', [PlayerName, Piece, From, To]), nl.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% acção do computador: realiza um movimento aleatório do tipo "colocar disco"
botRandomAction(1, Board, Player, NewBoard, NewPlayer):-
	botRandomPlace(Board, Player, Position, disc),
	botAction(1, Position, Board, Player, TempBoard, TempPlayer), !,
	botSecondRandom(ring, TempBoard, TempPlayer, NewBoard, NewPlayer).

% acção do computador: realiza um movimento aleatório do tipo "mover disco"
botRandomAction(2, Board, Player, NewBoard, NewPlayer):-
	botRandomSource(Board, disc, Player, From),
	botRandomDestination(From, To),
	botAction(2, From, To, Board, Player, TempBoard, TempPlayer), !,
	botSecondRandom(ring, TempBoard, TempPlayer, NewBoard, NewPlayer).

% acção do computador: realiza um movimento aleatório do tipo "colocar anel"
botRandomAction(3, Board, Player, NewBoard, NewPlayer):-
	botRandomPlace(Board, Player, Position, ring),
	botAction(3, Position, Board, Player,TempBoard,TempPlayer), !,
	botSecondRandom(disc, TempBoard, TempPlayer, NewBoard, NewPlayer).

% acção do computador: realiza um movimento aleatório do tipo "mover anel"
botRandomAction(4, Board, Player, NewBoard, NewPlayer):-
	botRandomSource(Board, ring, Player, From),
	botRandomDestination(From, To),
	botAction(4, From, To, Board, Player, TempBoard,TempPlayer), !,
	botSecondRandom(disc, TempBoard, TempPlayer, NewBoard, NewPlayer).

% acção do computador: fallback
botRandomAction(_, Board, Player, NewBoard, NewPlayer):-
	botRandomMove(Board, Player, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% acção do computador: realiza um segundo movimento aleatório com um disco
botSecondRandom(disc, Board, Player, NewBoard, NewPlayer):-
	random(1, 11, Action),
	Action > 5, !,
	botRandomPlace(Board, Player, Position, disc),
	botAction(1, Position, Board, Player, NewBoard, NewPlayer).
botSecondRandom(disc, Board, Player, NewBoard, NewPlayer):-
	botRandomSource(Board, disc, Player, From),
	botRandomDestination(From, To),
	botAction(2, From, To, Board, Player, NewBoard, NewPlayer).

% acção do computador: realiza um segundo movimento aleatório com um anel
botSecondRandom(ring, Board, Player, NewBoard, NewPlayer):-
	random(1, 11, Action),
	Action > 5, !,
	botRandomPlace(Board, Player, Position, ring),
	botAction(3, Position, Board, Player, NewBoard, NewPlayer).
botSecondRandom(ring, Board, Player, NewBoard, NewPlayer):-
	botRandomSource(Board, ring, Player, From),
	botRandomDestination(From, To),
	botAction(4, From, To, Board, Player, NewBoard, NewPlayer).

% acção do computador: fallback
botSecondRandom(Piece, Board, Player, NewBoard, NewPlayer):-
	botSecondRandom(Piece, Board, Player, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% acção do computador: realiza um segundo movimento inteligente com um disco
botSecondSmart(disc, Board, Player, NewBoard, NewPlayer):-
	random(1, 11, Action),
	Action > 5,
	botSmartPlaceDisc(Board, Player, Position),
	botAction(1, Position, Board, Player, NewBoard, NewPlayer).
botSecondSmart(disc, Board, Player, NewBoard, NewPlayer):-
	botSmartMoveDisc(Board, Player, From, To),
	botAction(2, From, To, Board, Player, NewBoard, NewPlayer).

% acção do computador: realiza um segundo movimento inteligente com um anel
botSecondSmart(ring, Board, Player, NewBoard, NewPlayer):-
	random(1, 11, Action),
	Action > 5,
	botSmartPlaceRing(Board, Player, Position),
	botAction(3, Position, Board, Player, NewBoard, NewPlayer).
botSecondSmart(ring, Board, Player, NewBoard, NewPlayer):-
	botSmartMoveRing(Board, Player, From, To),
	botAction(4, From, To, Board, Player, NewBoard, NewPlayer).

% acção do computador: fallback
botSecondSmart(Piece, Board, Player, NewBoard, NewPlayer):-
	botSecondSmart(Piece, Board, Player, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% acção do computador: realiza um movimento ganancioso do tipo "colocar disco"
botSmartAction(1, Board, Player, NewBoard, NewPlayer):-
	botSmartPlaceDisc(Board, Player, Position),
	botAction(1, Position, Board, Player, TempBoard, TempPlayer), !,
	botSecondSmart(ring, TempBoard, TempPlayer, NewBoard, NewPlayer).

% acção do computador: realiza um movimento ganancioso do tipo "mover disco"
botSmartAction(2, Board, Player, NewBoard, NewPlayer):-
	botSmartMoveDisc(Board, Player, From, To),
	botAction(2, From, To, Board, Player, TempBoard, TempPlayer), !,
	botSecondSmart(ring, TempBoard, TempPlayer, NewBoard, NewPlayer).

% acção do computador: realiza um movimento ganancioso do tipo "colocar anel"
botSmartAction(3, Board, Player, NewBoard, NewPlayer):-
	botSmartPlaceRing(Board, Player, Position),
	botAction(3, Position, Board, Player,TempBoard,TempPlayer), !,
	botSecondSmart(disc, TempBoard, TempPlayer, NewBoard, NewPlayer).

% acção do computador: realiza um movimento ganancioso do tipo "mover anel"
botSmartAction(4, Board, Player, NewBoard, NewPlayer):-
	botSmartMoveRing(Board, Player, From, To),
	botAction(4, From, To, Board, Player, TempBoard, TempPlayer), !,
	botSecondSmart(disc, TempBoard, TempPlayer, NewBoard, NewPlayer).

% acção do computador: fallback
botSmartAction(_, Board, Player, NewBoard, NewPlayer):-
	botSmartMove(Board, Player, NewBoard, NewPlayer).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% verifica se o computador pode mover um anel da posição (FromX,FromY) para (ToX,ToY)
botCanMoveRing(FromX-FromY, ToX-ToY, Board, Player):-
	getSymbol(FromX, FromY, Board, Source),
	getSymbol(ToX, ToY, Board, Destination),
	getPlayerColor(Player, Color),
	isRing(Source, Color), !,
	isSingleDisc(Destination).

% verifica se o computador pode mover um disco da posição (FromX,FromY) para (ToX,ToY)
botCanMoveDisc(FromX-FromY, ToX-ToY, Board, Player):-
	getSymbol(FromX, FromY, Board, Source),
	getSymbol(ToX, ToY, Board, Destination),
	getPlayerColor(Player, Color),
	isDisc(Source, Color), !,
	isSingleRing(Destination).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% gera aleatoriamente uma célula de origem válida
botRandomSource(Board, Piece, Player, Position):-
	getPlayerColor(Player, Color),
	botScanMatrix(Board, Piece, Color, Lista), !,
	list_size(Lista, Tamanho), !,
	generatePosition(Lista, Tamanho, Position), !.

% gera aleatoriamente uma célula de destino válida
botRandomDestination(X-Y, Position):-
	scanNeighbors(X-Y, Lista), !,
	list_size(Lista, Tamanho),
	generatePosition(Lista, Tamanho, Position), !.

% verifica se existem jogadas restantes, procurando células vazias no tabuleiro
botRandomPlace(Board, Player, Position, _Piece):-
	\+isPlayerStuck(Board, Player), !,
	scanEmptyCells(Board, Lista, Tamanho),
	generatePosition(Lista, Tamanho, Position), !.

% caso contrário, procura anéis no tabuleiro onde colocar um disco
botRandomPlace(Board, _Player, Position, disc):-
	scanSingleRings(Board, Lista, Tamanho),
	Tamanho > 0, !,
	generatePosition(Lista, Tamanho, Position), !.

% caso contrário, procura discos no tabuleiro onde colocar um anel
botRandomPlace(Board, _Player, Position, ring):-
	scanSingleDiscs(Board, Lista, Tamanho),
	Tamanho > 0, !,
	generatePosition(Lista, Tamanho, Position), !.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% encontra todas as peças do tabuleiro que sejam discos pretos
botScanMatrix(Board, disc, black, Lista):-
	scanMatrix(Board, 1, 1, isSingleBlackDisc, Lista).

% encontra todas as peças do tabuleiro que sejam discos brancos
botScanMatrix(Board, disc, white, Lista):-
	scanMatrix(Board, 1, 1, isSingleWhiteDisc, Lista).

% encontra todas as peças do tabuleiro que sejam anéis pretos
botScanMatrix(Board, ring, black, Lista):-
	scanMatrix(Board, 1, 1, isSingleBlackRing, Lista).

% encontra todas as peças do tabuleiro que sejam anéis brancos
botScanMatrix(Board, ring, white, Lista):-
	scanMatrix(Board, 1, 1, isSingleWhiteRing, Lista).