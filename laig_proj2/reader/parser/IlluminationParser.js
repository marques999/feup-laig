/**
  _____ _      _     _    _ __  __ _____ _   _       _______ _____ ____  _   _
 |_   _| |    | |   | |  | |  \/  |_   _| \ | |   /\|__   __|_   _/ __ \| \ | |
   | | | |    | |   | |  | | \  / | | | |  \| |  /  \  | |    | || |  | |  \| |
   | | | |    | |   | |  | | |\/| | | | | . ` | / /\ \ | |    | || |  | | . ` |
  _| |_| |____| |___| |__| | |  | |_| |_| |\  |/ ____ \| |   _| || |__| | |\  |
 |_____|______|______\____/|_|  |_|_____|_| \_/_/    \_\_|  |_____\____/|_| \_|

	<ILLUMINATION>
		<ambient r="ff" g="ff" b="ff" a="ff" />
		<background r="ff" g="ff" b="ff" a="ff" />
	</ILLUMINATION>
*/

/**
 * construtor default da classe 'IlluminationParser'
 * @constructor
 * @author Diogo Marques
 * @return {null}
 */
function IlluminationParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

IlluminationParser.prototype = Object.create(BaseParser.prototype);
IlluminationParser.prototype.constructor = IlluminationParser;

IlluminationParser.prototype.parse = function(root, id) {

	var globalAmbient = this.parseCoordinatesRGBA(root, 'ambient');
	var error = checkValue(globalAmbient, 'ambient', root.nodeName);

	if (error != null) {
		return error;
	}

	var globalBackground = this.parseCoordinatesRGBA(root, 'background');
	error = checkValue(globalBackground, 'background', root.nodeName);

	if (error != null) {
		return error;
	}

	this.scene.setAmbient(globalAmbient);
	this.scene.setBackground(globalBackground);

	if (this.verbose) {
		printHeader('ILLUMINATION');
		printRGBA('ambient', globalAmbient);
		printRGBA('background', globalBackground);
	}

	return null;
};