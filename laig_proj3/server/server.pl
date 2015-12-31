%                 ------------- %
% #includes                     %
%                 ------------- %

:- use_module(library(sockets)).
:- use_module(library(lists)).
:- use_module(library(codesio)).

%                 ------------- %
% #server                       %
%                 ------------- %

port(8081).

% Server Entry Point
server:-
	port(Port),
	write('Opened Server'),nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop
% Uncomment writes for more information on incomming connections
server_loop(Socket):-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
	catch((
		read_request(Stream, Request),
		read_header(Stream)
	),_Exception,(
		close_stream(Stream),
		fail
	)),
	handle_request(Request, MyReply, Status),
	format('Request: ~q~n',[Request]),
	format('Reply: ~q~n', [MyReply]),
	format(Stream, 'HTTP/1.0 ~p~n', [Status]),
	format(Stream, 'Access-Control-Allow-Origin: *~n', []),
	format(Stream, 'Content-Type: text/plain~n~n', []),
	format(Stream, '~p', [MyReply]),
	close_stream(Stream),
	(Request = quit), !.

close_stream(Stream):-
	flush_output(Stream),
	close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK'):- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'no', '400 Bad Request'):- !.
handle_request(_, 'no', '200 OK').

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

parse_input(pvp(_,_), yes).
parse_input(pvb(_,_,_), yes).
parse_input(bvb(_,_,_), yes).
parse_input(quit, goodbye).

parse_input(placeDisc(Board, Piece, Player, Position), yes):-
	serverPlaceDisc(Board, Piece, Player, Position).
parse_input(placeRing(Board, Piece, Player, Position), yes):-
	serverPlaceRing(Board, Piece, Player, Position).
parse_input(moveDisc(Board, Piece, Player, From, To), yes):-
	serverMoveDisc(Board, Piece, Player, From, To).
parse_input(moveRing(Board, Piece, Player, From, To), yes):-
	serverMoveRing(Board, Piece, Player, From, To).
parse_input(initialMove(Board, Function, Player, Position), yes):-
	serverInitialMove(Board, Function, Player, Position).
parse_input(getRandomMove(Board, Piece, Player), Reply):-
	botRandomMove(Board, Piece, Player, Reply).
parse_input(getSmartMove(Board, Piece, Player), Reply):-
	botSmartMove(Board, Piece, Player, Reply).
parse_input(getInitialMove(Board, Piece, Player), Reply):-
	botInitialMove(Board, Piece, Player, Reply).
parse_input(getStatus(Board, Player1, Player2), Reply):-
	serverCheckGame(Board, Player1, Player2, Reply).
parse_input(getStuck(Board, CurrentPlayer), Reply):-
	serverCheckStuck(Board, CurrentPlayer, Reply).