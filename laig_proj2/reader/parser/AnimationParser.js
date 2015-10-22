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

	this.animationSpan = 0.0;
	this.animationType = 'unknown';
	this.result = null;

	var parent = root.nodeName;
	var parseErrors = 0;

	if (id == 'null' || id == 'clear') {
		return onReservedId(parent, id);
	}

	this.animationSpan = this.reader.getFloat(root, 'span');
	var error = checkValue(animationSpan, 'span', parent);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	this.animationType = this.reader.getString(root, 'type');
	var error = checkValue(animationType, 'type', parent);

	if (animationType == 'linear') {
		error = this.readLinear(root, id);
	}
	else if (animationType == 'circular') {
		error = this.readCircular(root, id);
	}
	else {
		return onAttributeInvalid('type', id, parent);
	}

	if (error != null) {
		return error;
	}

	printHeader("ANIMATION", id);
	printValues(null, 'span', animationSpan, 'type', animationType);

	return null;
};

AnimationParser.prototype.readLinear = function(root, id) {

	var parent = root.nodeName;
	var parseErrors = 0;
	var animationPoints = [];
	var controlPoints = root.getElementsByTagName('controlpoints');
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
			printXYZ('center', animationCenter);
		}	
	}
	
	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}

	this.result = new LinearAnimation(id, this.animationSpan, animationPoints);
	
	return null;
};

AnimationParser.prototype.readCircular = function(root, id) {

	var parent = 'CIRCULAR ANIMATION';
	var parseErrors = 0;
	var animationCenter = this.reader.getVector3(root, 'center');
	var error = checkValue(animationCenter, 'center', parent);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}
	
	var animationRadius = this.reader.getFloat(root, 'radius');
	error = checkValue(animationRadius, 'radius', parent);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var animationStart = this.reader.getFloat(root, 'startang');
	error = checkValue(animationStart, 'startang', parent);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}
	
	var animationAngle = this.reader.getFloat(root, 'rotang');
	error = checkValue(animationAngle, 'rotang', parent);

	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}
	
	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}
	
	printXYZ('center', animationCenter);
	printValues(null, 'radius', animationRadius,
				'startang', animationStart, 
				'rotang', animationAngle);
	
	this.result = new CircularAnimation(id, this.animationSpan,
		animationCenter, animationRadius, 
		animationStart, animationAngle);
	
	return null;
};