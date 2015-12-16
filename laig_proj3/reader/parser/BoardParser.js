/*
  ____   ____          _____  _____  
 |  _ \ / __ \   /\   |  __ \|  __ \ 
 | |_) | |  | | /  \  | |__) | |  | |
 |  _ <| |  | |/ /\ \ |  _  /| |  | |
 | |_) | |__| / ____ \| | \ \| |__| |
 |____/ \____/_/    \_\_|  \_\_____/ 

	<ILLUMINATION>
		<ambient r="ff" g="ff" b="ff" a="ff" />
		<background r="ff" g="ff" b="ff" a="ff" />
	</ILLUMINATION>
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
BoardParser.prototype.parse = function(root, id) {

	var boardPosition = this.parseCoordinatesXYZ(root, 'position');
	var error = checkValue(boardPosition, 'position', root.nodeName);

	if (error != null) {
		return error;
	}

	var boardWidth = this.parseFloat(root, 'dimensions', 'width');
	var error = checkValue(boardWidth, 'board width', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var boardHeight = this.parseFloat(root, 'dimensions', 'height');
	var error = checkValue(boardHeight, 'board height', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	this.scene.setBoardPosition(boardPosition);
	this.scene.setBoardDimensions(boardWidth, boardHeight);

	if (this.verbose) {
		printHeader('BOARD');
		printXYZ('position', boardPosition);
		printValues('dimensions', 'width', boardWidth, 'height', boardHeight);
	}
};