/*
  _      _____ _____ _    _ _______ _____
 | |    |_   _/ ____| |  | |__   __/ ____|
 | |      | || |  __| |__| |  | | | (___
 | |      | || | |_ |  __  |  | |  \___ \
 | |____ _| || |__| | |  | |  | |  ____) |
 |______|_____\_____|_|  |_|  |_| |_____/

	<LIGHT id="ss">
		<enable value ="tt" />
		<position x="ff" y="ff" z="ff" w="ff" />
		<ambient r="ff" g="ff" b="ff" a="ff" />
		<diffuse r="ff" g="ff" b="ff" a="ff" />
		<specular r="ff" g="ff" b="ff" a="ff" />
	</LIGHT>
*/

/**
 * construtor por omissão da classe 'LightParser'
 * @constructor
 * @author Diogo Marques
 * @param {CGFxmlReader} reader
 * @param {CGFscene} scene
 * @return {null}
 */
function LightParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

LightParser.prototype = Object.create(BaseParser.prototype);
LightParser.prototype.constructor = LightParser;

/**
 * processa uma determinada entidade presente no bloco <LIGHTS>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <LIGHTS>
 * @param {Number} id - identificador do elemento a ser processado
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LightParser.prototype.parse = function(root, id) {

	this.result = null;
	var parseErrors = 0;

	if (id == 'null' || id == 'clear') {
		return onReservedId(root.nodeName, id);
	}

	var lightEnabled = this.parseBoolean(root, 'enable');
	var error = checkValue(lightEnabled, 'enable', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightPosition = this.parseCoordinatesXYZW(root, 'position');
	var error = checkValue(lightPosition, 'position', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightAmbient = this.parseCoordinatesRGBA(root, 'ambient');
	var error = checkValue(lightAmbient, 'ambient', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightDiffuse = this.parseCoordinatesRGBA(root, 'diffuse');
	var error = checkValue(lightDiffuse, 'diffuse', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightSpecular = this.parseCoordinatesRGBA(root, 'specular');
	var error = checkValue(lightSpecular, 'specular', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(root.nodeName, parseErrors, id);
	}

	this.result = this.scene.pushLight(id, lightEnabled, lightPosition, lightAmbient, lightDiffuse, lightSpecular);

	if (this.verbose) {
		printHeader('LIGHT', id);
		printValues('enable', 'value', lightEnabled);
		printXYZW('position', lightPosition);
		printRGBA('ambient', lightAmbient);
		printRGBA('diffuse', lightDiffuse);
		printRGBA('specular', lightSpecular);
	}
};