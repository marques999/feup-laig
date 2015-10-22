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
 * construtor default da classe 'TextureParser'
 * @constructor
 * @author Diogo Marques
 * @return {null}
 */
function TextureParser(reader, scene, path) {
	BaseParser.call(this, reader, scene);
	this.path = path;
};

TextureParser.prototype = Object.create(BaseParser.prototype);
TextureParser.prototype.constructor = TextureParser;

TextureParser.prototype.parse = function(root, id) {

	this.result = null;
	var parent = root.nodeName;
	var parseErrors = 0;

	if (id == 'null' || id == 'clear') {
		return onReservedId(parent, id);
	}

	var texturePath = this.parseString(root, 'file', 'path');

	if (texturePath == null) {
		return onAttributeMissing('file', id, parent);
	}

	if (!checkUrl(this.path + texturePath)) {
		return onURLInvalid('file', id, parent);
	}

	var textureS = this.parseFloat(root, 'amplif_factor', 's');
	var error = checkValue(textureS, 'amplification factor S', parent, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var textureT = this.parseFloat(root, 'amplif_factor', 't');
	var error = checkValue(textureT, 'amplification factor T', parent, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}

	var textureObject = new CGFtexture(this.scene, this.path + texturePath);
	this.result = new XMLtexture(textureObject, textureS, textureT);

	if (this.verbose) {
		printHeader('TEXTURE', id);
		printValues('file', 'path', texturePath);
		printValues('amplif_factor', 's', textureS, 't', textureT);
	}

	return null;
};