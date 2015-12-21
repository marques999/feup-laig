/*
  ____   ____          _____  _____
 |  _ \ / __ \   /\   |  __ \|  __ \
 | |_) | |  | | /  \  | |__) | |  | |
 |  _ <| |  | |/ /\ \ |  _  /| |  | |
 | |_) | |__| / ____ \| | \ \| |__| |
 |____/ \____/_/    \_\_|  \_\_____/

	<BOARD>
		<position x="ff" y="ff" z="ff" />
		<size x="ff" y="ff" b="ff" z="ff" />
		<rotation axis="x" angle="0" />
		<rotation axis="x" angle="0" />
		<rotation axis="x" angle="0" />
		<rotation axis="x" angle="0" />
	</BOARD>
*/

/**
 * construtor por omissão da classe 'BoardParser'
 * @constructor
 * @author Diogo Marques
 * @param {CGFxmlReader} reader
 * @param {CGFscene} scene
 * @return {null}
 */
function BoardParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

BoardParser.prototype = Object.create(BaseParser.prototype);
BoardParser.prototype.constructor = BoardParser;

/**
 * processa todas as entidades presentes no bloco <ILLUMINATION>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <ILLUMINATION>
 * @param {Number} id - identificador do elemento a ser processado
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
BoardParser.prototype.parse = function(root) {

	this.boardMatrix = mat4.create();

	mat4.identity(this.boardMatrix);

	var parseErrors = 0;
	var boardPosition = this.parseCoordinatesXYZ(root, 'position');
	var error = checkValue(boardPosition, 'position', root.nodeName);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var boardSize = this.parseCoordinatesXYZ(root, 'size');
	var error = checkValue(boardSize, 'size', root.nodeName);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(root.nodeName, parseErrors);
	}

	if (this.verbose) {
		printHeader('BOARD');
		printXYZ('position', boardPosition);
		printXYZ('size', boardSize);
	}

	/*for (; xmlIndex < node_sz; xmlIndex++) {

		var child = root.children[xmlIndex];
		var error = null;

		if (child.nodeName == 'ROTATION') {
			error = this.parseRotation(child, node);
		}
	}
*/
	mat4.translate(this.boardMatrix, this.boardMatrix, boardPosition);
	mat4.scale(this.boardMatrix, this.boardMatrix, boardSize);
};

BoardParser.prototype.parseRotation = function(root, node) {

	var parent = root.nodeName;
	var parseErrors = 0;
	var axis = this.reader.getString(root, 'axis', true);
	var error = checkValue(axis, 'axis', parent, node.id);

	if (error != null) {
		return error;
	}

	if (axis != 'x' && axis != 'y' && axis != 'z') {
		onUnknownAxis(axis, root.nodeName, 'NODE');
	}

	var angle = this.reader.getFloat(root, 'angle', true);
	var error = checkValue(angle, 'angle', parent, node.id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, node.id);
	}

	if (axis == 'x') {
		mat4.rotateX(this.boardMatrix, this.boardMatrix, angle);
	}
	else if (axis == 'y') {
		mat4.rotateY(this.boardMatrix, this.boardMatrix, angle);
	}
	else if (axis == 'z') {
		mat4.rotateZ(this.boardMatrix, this.boardMatrix, angle);
	}

	if (this.verbose) {
		printValues('rotation', 'axis', axis, 'angle', angle);
	}
};