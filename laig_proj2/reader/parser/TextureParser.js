/*
  _______ ________   _________ _    _ _____  ______  _____
 |__   __|  ____\ \ / /__   __| |  | |  __ \|  ____|/ ____|
	| |  | |__   \ V /   | |  | |  | | |__) | |__  | (___
	| |  |  __|   > <    | |  | |  | |  _  /|  __|  \___ \
	| |  | |____ / . \   | |  | |__| | | \ \| |____ ____) |
	|_|  |______/_/ \_\  |_|   \____/|_|  \_\______|_____/

	<TEXTURE id="ss">
		<file path="ss" />
		<amplif_factor s="ff" t="ff" />
	</TEXTURE>
*/

/**
 * construtor por omissão da classe 'TextureParser'
 * @constructor
 * @author Diogo Marques
 * @param {CGFxmlReader} reader
 * @param {CGFscene} scene
 * @return {null}
 */
function TextureParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

TextureParser.prototype = Object.create(BaseParser.prototype);
TextureParser.prototype.constructor = TextureParser;

/**
 * processa uma determinada entidade presente no bloco <TEXTURES>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <TEXTURES>
 * @param {Number} id - identificador do elemento a ser processado
 * @param {String} basePath - caminha relativo para a pasta que contém os ficheiros LSX
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
TextureParser.prototype.parse = function(root, id, basePath) {

	this.result = null;
	var parseErrors = 0;

	if (id == 'null' || id == 'clear') {
		return onReservedId(root.nodeName, id);
	}

	var texturePath = this.parseString(root, 'file', 'path');

	if (texturePath == null) {
		return onAttributeMissing('file', id, root.nodeName);
	}

	if (!checkUrl(basePath + texturePath)) {
		onURLInvalid('file', id, root.nodeName);
		parseErrors++;
	}

	var textureS = this.parseFloat(root, 'amplif_factor', 's');
	var error = checkValue(textureS, 'amplification factor S', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var textureT = this.parseFloat(root, 'amplif_factor', 't');
	var error = checkValue(textureT, 'amplification factor T', root.nodeName, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(root.nodeName, parseErrors, id);
	}

	var textureObject = new CGFtexture(this.scene, basePath + texturePath);
	this.result = new XMLtexture(textureObject, textureS, textureT);

	if (this.verbose) {
		printHeader('TEXTURE', id);
		printValues('file', 'path', texturePath);
		printValues('amplif_factor', 's', textureS, 't', textureT);
	}
};