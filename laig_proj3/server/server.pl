%                 ------------- %
% #includes                     %
%                 ------------- %

:- use_module(library(sockets)).
:- use_module(library(lists)).
:- use_module(library(codesio)).

%                 ------------- %
% #server                       %
%                 ------------- %

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,
	socket_server_open(Port, Socket),
	serverHandshake(Socket, Game, Mode),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

readRequest(Socket, Stream, Request):-
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
	catch((
		read_request(Stream, Request),
		read_header(Stream)
	),_Exception,(
		close_stream(Stream),
		fail
	)).

serverReply(Stream, Request, Reply):-
	% Generate Response
	format('Request: ~q~n',[Request]),
	format('Reply: ~q~n', [Reply]),

	% Output Response
	format(Stream, 'HTTP/1.0 ~p~n', 200),
	format(Stream, 'Access-Control-Allow-Origin: *~n', []),
	format(Stream, 'Content-Type: text/plain~n~n', []),
	format(Stream, '~p', [Reply]),
	close_stream(Stream).

serverHandshake(Socket, Game, Mode):-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),

	catch((
		read_request(Stream, Request),
		read_header(Stream)
	),_Exception,(
		close_stream(Stream),
		fail
	)),

	handshake_request(Request, MyReply, Status, Game, Mode),
	format('Request: ~q~n',[Request]),
	format('Reply: ~q~n', [MyReply]),
	format_reply(Stream, Status, MyReply),
	close_stream(Stream),
	(MyReply = ack), !.

format_reject(Stream):-
	format_reply(Stream, '400 Bad Request', rej).

format_reply(Stream, Status, Reply):-
	format(Stream, 'HTTP/1.0 ~p~n', [Status]),
	format(Stream, 'Access-Control-Allow-Origin: *~n', []),
	format(Stream, 'Content-Type: text/plain~n~n', []),
	format(Stream, '~p', [Reply]).

% Server Loop
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),

		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),

		% Output Response
		format_reply(Stream, Status, MyReply),
		close_stream(Stream),
	(Request = quit), !.

close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'no', '400 Bad Request') :- !.
handle_request(_, 'no', '400 Bad Request').

handshake_request(Request, MyReply, '200 OK', Game, Mode):- catch(parse_handshake(Request, MyReply, Game, Mode),error(_,_),fail), !.
handshake_request(syntax_error, 'no', '400 Bad Request', _, _) :- !.
handshake_request(_, 'no', '400 Bad Request', _, _).

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).

read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).

read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

print_header_line(_).

%                 ------------- %
% #commands                     %
%                 ------------- %

:- include('duplohex.pl').

parse_input(handshake, handshake).
parse_input(reset, ack).
parse_input(quit, goodbye).

parse_handshake(pvp(Player,Matrix), ack, Game, pvp):-
	call(Matrix, Board),
	initializePvP(Game,Board,Player).

parse_handshake(pvb(Player,BotMode,Matrix), ack, Game, pvb):-
	call(Matrix, Board),
	initializePvB(Game, Board,Player,BotMode).

parse_handshake(bvb(Player,BotMode,Matrix), ack, Game, bvb):-
	call(Matrix, Board),
	initializeBvB(Game,Board,Player,BotMode).

parse_input(placeDisc(Board, Piece, Player, Position), yes):-
	serverPlaceDisc(Board, Piece, Player, Position).
parse_input(placeRing(Board, Piece, Player, Position), yes):-
	serverPlaceRing(Board, Piece, Player, Position).

parse_input(moveDisc(Board, Piece, Player, From, To), yes):-
	serverMoveDisc(Board, Piece, Player, From, To).
parse_input(moveRing(Board, Piece, Player, From, To), yes):-
	serverMoveRing(Board, Piece, Player, From, To).

parse_input(getRandomMove(Board, Piece, Player), Reply):-
	botRandomMove(Board, Piece, Player, Reply).
parse_input(getSmartMove(Board, Piece, Player), Reply):-
	botSmartMove(Board, Piece, Player, Reply).
parse_input(getInitialMove(Board, Piece, Player), Reply):-
	botInitialMove(Board, Piece, Player, Reply).

parse_input(getStatus(Board, Player1, Player2), Reply):-
	serverCheckGame(Board, Player1, Player2, Reply).