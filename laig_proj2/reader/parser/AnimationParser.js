/*
		   _   _ _____ __  __       _______ _____ ____  _   _  _____
	 /\   | \ | |_   _|  \/  |   /\|__   __|_   _/ __ \| \ | |/ ____|
	/  \  |  \| | | | | \  / |  /  \  | |    | || |  | |  \| | (___
   / /\ \ | . ` | | | | |\/| | / /\ \ | |    | || |  | | . ` |\___ \
  / ____ \| |\  |_| |_| |  | |/ ____ \| |   _| || |__| | |\  |____) |
 /_/    \_\_| \_|_____|_|  |_/_/    \_\_|  |_____\____/|_| \_|_____/

	<ANIMATIONS>
		<ANIMATION id="ss" span="ff" type="linear">
			<controlpoint x="ff" y="ff" z="ff" />
			<controlpoint x="ff" y="ff" z="ff" />
			<controlpoint x="ff" y="ff" z="ff" />
		</ANIMATION>
		<ANIMATION id="ss" span="ff" type="circular" center="ff ff ff" radius="ff" startang="ff" rotang="ff">
		</ANIMATION>
	</ANIMATIONS>
*/

/**
 * construtor por omissão da classe 'AnimationParser'
 * @constructor
 * @author Diogo Marques
 * @param {CGFxmlReader} reader
 * @param {CGFscene} scene
 * @return {null}
 */
function AnimationParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

AnimationParser.prototype = Object.create(BaseParser.prototype);
AnimationParser.prototype.constructor = AnimationParser;

/**
 * processa uma determinada entidade presente no bloco <ANIMATIONS>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <ANIMATIONS>
 * @param {Number} id - identificador do elemento a ser processado
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
AnimationParser.prototype.parse = function(root, id) {

	this.result = null;
	var parseErrors = 0;

	if (id == 'null' || id == 'clear') {
		return onReservedId(root.nodeName, id);
	}

	var parseAttributes = {
		'span': this.parseFloat,
		'type': this.parseString
	};

	for (var attribute in parseAttributes) {

		this[attribute] = parseAttributes[attribute].call(this, root, null, attribute);
		var error = checkValue(this[attribute], attribute, root.nodeName);

		if (error != null) {
			parseErrors++;
			onXMLWarning(error);
		}
	}

	if (parseErrors != 0) {
		return onParseError('ANIMATION', parseErrors, id);
	}

	if (this.type == 'linear') {
		error = this.readLinear(root, id);
	}
	else if (this.type == 'circular') {
		error = this.readCircular(root, id);
	}
	else {
		return onAttributeInvalid('type', id, root.nodeName);
	}

	if (error != null) {
		return error;
	}
};

/**
 * processa uma animação do tipo "linear" e acrescenta ao array de animações do grafo
 * @param {XMLElement} root - estrutura de dados XML que contém os atributos desta animação
 * @param {Number} id - identificador da animação atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
AnimationParser.prototype.readLinear = function(root, id) {

	var parseErrors = 0;
	var animationPoints = [];
	var controlPoints = root.getElementsByTagName('controlpoint');

	if (controlPoints.length == null || controlPoints.length == 0) {
		return onAttributeMissing('controlpoint', id, 'ANIMATION');
	}

	for (var i = 0; i < controlPoints.length; i++) {

		var newCoordinates = this.parseCoordinatesXYZ(controlPoints[i], null);
		var error = checkValue(newCoordinates, 'controlpoint', 'ANIMATION');

		if (error != null) {
			onXMLWarning(error);
			parseErrors++;
		}
		else {
			animationPoints.push(newCoordinates);
		}
	}

	if (parseErrors != 0) {
		return onParseError('ANIMATION', parseErrors, id);
	}

	if (this.verbose) {
		printHeader("ANIMATION", id);
		printSingle('span', this.span);
		printSingle('type', this.type);
	}

	for (var i = 0; i < animationPoints.length; i++) {
		printXYZ('control point ' + i, animationPoints[i]);
	}

	this.result = new LinearAnimation(id, this.span, animationPoints);
};

/**
 * processa uma animação do tipo "circular" e acrescenta ao array de animações do grafo
 * @param {XMLElement} root - estrutura de dados XML que contém os atributos desta animação
 * @param {Number} id - identificador da animação atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
AnimationParser.prototype.readCircular = function(root, id) {

	var parseErrors = 0;
	var parseAttributes = {
		'center': this.parseVector3,
		'radius': this.parseFloat,
		'startang': this.parseFloat,
		'rotang': this.parseFloat
	};

	for (var attribute in parseAttributes) {

		this[attribute] = parseAttributes[attribute].call(this, root, null, attribute);
		var error = checkValue(this[attribute], attribute, 'ANIMATION');

		if (error != null) {
			parseErrors++;
			onXMLWarning(error);
		}
	}

	if (parseErrors != 0) {
		return onParseError('ANIMATION', parseErrors, id);
	}

	if (this.verbose) {
		printHeader("ANIMATION", id);
		printSingle('span', this.span);
		printSingle('type', this.type);
		printXYZ('center', this.center);
		printSingle('radius', this.radius);
		printSingle('startang', this.startang);
		printSingle('rotang', this.rotang);
	}

	this.result = new CircularAnimation(id, this.span, this.center, this.radius, this.startang, this.rotang);
};