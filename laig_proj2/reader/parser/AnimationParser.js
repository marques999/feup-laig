/**
 * construtor default da classe 'AnimationParser'
 * @constructor
 * @author Diogo Marques
 * @return {null}
 */
function AnimationParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

AnimationParser.prototype = Object.create(BaseParser.prototype);
AnimationParser.prototype.constructor = AnimationParser;

AnimationParser.prototype.parse = function(root, id) {

	this.result = null;
	var parent = root.nodeName;
	var parseErrors = 0;

	if (id == 'null' || id == 'clear') {
		return onReservedId(parent, id);
	}

	var parseAttributes = {
		'span' : this.parseFloat,
		'type' : this.parseString
	};

	for (var attribute in parseAttributes) {

		this[attribute] = parseAttributes[attribute].call(this, root, null, attribute);
		var error = checkValue(this[attribute], attribute, parent);

		if (error != null) {
			parseErrors++;
			onXMLWarning(error);
		}
	}

	if (this.type == 'linear') {
		error = this.readLinear(root, id);
	}
	else if (this.type == 'circular') {
		error = this.readCircular(root, id);
	}
	else {
		return onAttributeInvalid('type', id, parent);
	}

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}

	return null;
};

AnimationParser.prototype.readLinear = function(root, id) {

	var parent = 'LINEAR ANIMATION';
	var parseErrors = 0;
	var animationPoints = [];
	var controlPoints = root.getElementsByTagName('controlpoint');
	var controlPointsSize = controlPoints.length;

	if (controlPointsSize == null || controlPointsSize == 0) {
		return onAttributeMissing('controlpoint', id, parent);
	}

	for (var i = 0; i < controlPointsSize; i++) {

		var newCoordinates = this.parseCoordinatesXYZ(controlPoints[i], null);
		var error = checkValue(newCoordinates, 'controlpoint', parent);

		if (error != null) {
			onXMLWarning(error);
			parseErrors++;
		}
		else {
			animationPoints.push(newCoordinates);
		}
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}

	printHeader("ANIMATION", id);
	printSingle('span', this.span);
	printSingle('type', this.type);

	for (var i = 0; i < animationPoints.length; i++) {
		printXYZ('control point ' + i, animationPoints[i]);
	}

	this.result = new LinearAnimation(id, this.span, animationPoints);

	return null;
};

AnimationParser.prototype.readCircular = function(root, id) {

	var parent = 'CIRCULAR ANIMATION';
	var parseErrors = 0;

	var parseAttributes = {
		'center': this.parseVector3,
		'radius': this.parseFloat,
		'startang': this.parseFloat,
		'rotang' : this.parseFloat
	};

	for (var attribute in parseAttributes) {

		this[attribute] = parseAttributes[attribute].call(this, root, null, attribute);
		var error = checkValue(this[attribute], attribute, parent);

		if (error != null) {
			parseErrors++;
			onXMLWarning(error);
		}
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}

	printHeader("ANIMATION", id);
	printSingle('span', this.span);
	printSingle('type', this.type);
	printXYZ('center', this.center);
	printSingle('radius', this.radius);
	printSingle('startang', this.startang);
	printSingle('rotang', this.rotang);

	this.result = new CircularAnimation(id, this.span,
		this.center, this.radius, this.startang, this.rotang);

	return null;
};