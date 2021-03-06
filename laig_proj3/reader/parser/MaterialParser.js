/*
  __  __       _______ ______ _____  _____          _       _____
 |  \/  |   /\|__   __|  ____|  __ \|_   _|   /\   | |     / ____|
 | \  / |  /  \  | |  | |__  | |__) | | |    /  \  | |    | (___
 | |\/| | / /\ \ | |  |  __| |  _  /  | |   / /\ \ | |     \___ \
 | |  | |/ ____ \| |  | |____| | \ \ _| |_ / ____ \| |____ ____) |
 |_|  |_/_/    \_\_|  |______|_|  \_\_____/_/    \_\______|_____/

	<MATERIAL id="ss">
		<shininess value="ff" />
		<specular r="ff" g="ff" b="ff" a="ff" />
		<diffuse r="ff" g="ff" b="ff" a="ff" />
		<ambient r="ff" g="ff" b="ff" a="ff" />
		<emission r="ff" g="ff" b="ff" a="ff" />
	</MATERIAL>
*/

/**
 * construtor por omissão da classe 'MaterialParser'
 * @constructor
 * @author Diogo Marques
 * @param {CGFxmlReader} reader
 * @param {CGFscene} scene
 * @return {null}
 */
function MaterialParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

MaterialParser.prototype = Object.create(BaseParser.prototype);
MaterialParser.prototype.constructor = MaterialParser;

/**
 * processa uma determinada entidade presente no bloco <MATERIALS>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <MATERIALS>
 * @param {Number} id - identificador do elemento a ser processado
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MaterialParser.prototype.parse = function(root, id) {

	this.result = null;
	var parseErrors = 0;

	if (id == 'null' || id == 'clear') {
		return onReservedId(id, root.nodeName);
	}

	var materialShininess = this.parseFloat(root, 'shininess', 'value');
	var error = checkValue(materialShininess, 'shininess', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var materialSpecular = this.parseCoordinatesRGBA(root, 'specular');
	var error = checkValue(materialSpecular, 'specular', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var materialDiffuse = this.parseCoordinatesRGBA(root, 'diffuse');
	var error = checkValue(materialDiffuse, 'diffuse', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var materialAmbient = this.parseCoordinatesRGBA(root, 'ambient');
	var error = checkValue(materialAmbient, 'ambient', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var materialEmission = this.parseCoordinatesRGBA(root, 'emission');
	var error = checkValue(materialEmission, 'emission', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(root.nodeName, parseErrors, id);
	}

	this.result = new CGFappearance(this.scene);
	this.result.setAmbient(materialAmbient[0], materialAmbient[1], materialAmbient[2], materialAmbient[3]);
	this.result.setDiffuse(materialDiffuse[0], materialDiffuse[1], materialDiffuse[2], materialDiffuse[3]);
	this.result.setEmission(materialEmission[0], materialEmission[1], materialEmission[2], materialEmission[3]);
	this.result.setSpecular(materialSpecular[0], materialSpecular[1], materialSpecular[2], materialSpecular[3]);
	this.result.setShininess(materialShininess);
	this.result.setTextureWrap("REPEAT", "REPEAT");

	if (this.verbose) {
		printHeader('MATERIAL', id);
		printValues('shininess', 'value', materialShininess);
		printRGBA('specular', materialSpecular);
		printRGBA('diffuse', materialDiffuse);
		printRGBA('ambient', materialAmbient);
		printRGBA('emission', materialEmission);
	}
};