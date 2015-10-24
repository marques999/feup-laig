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
 * construtor default da classe 'LightParser'
 * @constructor
 * @author Diogo Marques
 * @return {null}
 */
function LightParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

LightParser.prototype = Object.create(BaseParser.prototype);
LightParser.prototype.constructor = LightParser;

LightParser.prototype.parse = function(root, id) {

	this.result = null;
	var parent = root.nodeName;
	var parseErrors = 0;

	if (id == 'null' || id == 'clear') {
		return onReservedId(parent, id);
	}

	var lightEnabled = this.parseBoolean(root, 'enable');
	var error = checkValue(lightEnabled, 'enable', parent, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightPosition = this.parseCoordinatesXYZW(root, 'position');
	error = checkValue(lightPosition, 'position', parent, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightAmbient = this.parseCoordinatesRGBA(root, 'ambient');
	error = checkValue(lightAmbient, 'ambient', parent, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightDiffuse = this.parseCoordinatesRGBA(root, 'diffuse');
	error = checkValue(lightDiffuse, 'diffuse', parent, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightSpecular = this.parseCoordinatesRGBA(root, 'specular');
	error = checkValue(lightSpecular, 'specular', parent, id);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
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

	return null;
};