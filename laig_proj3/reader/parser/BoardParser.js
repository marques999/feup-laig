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
		<frontview x="ff" y="ff" z="ff" />
		<sceneview x="ff" y="ff" z="ff" />
		<topview x="ff" y="ff" z="ff" />
		<rotation axis="x" angle="ii" />
		<rotation axis="y" angle="ii" />
		<rotation axis="z" angle="ii" />
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
 * processa todas as entidades presentes no bloco <BOARD>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <BOARD>
 * @param {Number} id - identificador do elemento a ser processado
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
BoardParser.prototype.parse = function(root) {

	this.boardMatrix = mat4.create();

	mat4.identity(this.boardMatrix);

	var parseErrors = 0;
	var nodeSize = root.children.length;
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

	var cameraFront = this.parseCoordinatesXYZ(root, 'frontview');
	var error = checkValue(cameraFront, 'frontview', root.nodeName);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var cameraScene = this.parseCoordinatesXYZ(root, 'sceneview');
	var error = checkValue(cameraScene, 'sceneview', root.nodeName);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var cameraTop = this.parseCoordinatesXYZ(root, 'topview');
	var error = checkValue(cameraTop, 'topview', root.nodeName);

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
		printXYZ('frontview', cameraFront);
		printXYZ('sceneview', cameraScene);
		printXYZ('topview', cameraTop);
	}

	mat4.translate(this.boardMatrix, this.boardMatrix, boardPosition);

	for (var xmlIndex = 5; xmlIndex < nodeSize; xmlIndex++) {

		var child = root.children[xmlIndex];

		if (child.nodeName == 'rotation') {
			 this.parseRotation(child);
		}
	}

	mat4.scale(this.boardMatrix, this.boardMatrix, boardSize);

	this.scene.setBoardPosition(boardPosition);
	this.scene.setBoardSize(boardSize);
	this.scene.setBoardMatrix(this.boardMatrix);
	this.scene.setFrontView(vec3.clone(cameraFront));
	this.scene.setSceneView(vec3.clone(cameraScene));
	this.scene.setTopView(vec3.clone(cameraTop));
};

/**
 * processa uma rotação presente num bloco <BOARD>
 * @param {XMLelement} root - estrutura que dados XML que contém o atributo <rotation>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
BoardParser.prototype.parseRotation = function(root) {

	var parent = root.nodeName;
	var parseErrors = 0;
	var axis = this.reader.getString(root, 'axis', true);
	var error = checkValue(axis, 'axis', parent);

	if (error != null) {
		return error;
	}

	if (axis != 'x' && axis != 'y' && axis != 'z') {
		onUnknownAxis(axis, root.nodeName, 'NODE');
	}

	var angle = this.reader.getFloat(root, 'angle', true);
	var error = checkValue(angle, 'angle', parent);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors);
	}

	if (axis == 'x') {
		mat4.rotateX(this.boardMatrix, this.boardMatrix, angle * Math.PI / 180);
	}
	else if (axis == 'y') {
		mat4.rotateY(this.boardMatrix, this.boardMatrix, angle * Math.PI / 180);
	}
	else if (axis == 'z') {
		mat4.rotateZ(this.boardMatrix, this.boardMatrix, angle * Math.PI / 180);
	}

	if (this.verbose) {
		printValues('rotation', 'axis', axis, 'angle', angle);
	}
};