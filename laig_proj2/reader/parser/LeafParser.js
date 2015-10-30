/*
  _      ______     __      ________  _____
 | |    |  ____|   /\ \    / /  ____|/ ____|
 | |    | |__     /  \ \  / /| |__  | (___
 | |    |  __|   / /\ \ \/ / |  __|  \___ \
 | |____| |____ / ____ \  /  | |____ ____) |
 |______|______/_/    \_\/   |______|_____/

	<LEAVES>
		<LEAF id="ss" type="rectangle" args="ff ff ff ff" />
		<LEAF id="ss" type="cylinder" args="ff ff ff ii ii" />
		<LEAF id="ss" type="sphere" args="ff ii ii" />
		<LEAF id="ss" type="triangle" args="ff ff ff ff ff ff ff ff ff" />
		<LEAF id="ss" type="plane" args="ii" />
		<LEAF id="ss" type="patch" args="ii ii" />
	</LEAVES>
*/

/**
 * construtor por omissão da classe 'LeafParser'
 * @constructor
 * @author Diogo Marques
 * @param {CGFxmlReader} reader
 * @param {CGFscene} scene
 * @return {null}
 */
function LeafParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

LeafParser.prototype = Object.create(BaseParser.prototype);
LeafParser.prototype.constructor = LeafParser;

/**
 * processa uma determinada entidade presente no bloco <LEAVES>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <LEAVES>
 * @param {Number} id - identificador do elemento a ser processado
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.parse = function(root, id) {

	this.result = null;
	var parent = root.nodeName;

	if (!root.hasAttribute('type')) {
		return onAttributeMissing('type', this.id, parent);
	}

	var leafType = this.reader.getString(root, 'type');

	if (!root.hasAttribute('args')) {
		return onAttributeMissing('args', id, parent);
	}

	var unprocessedArgs = this.reader.getString(root, 'args');
	var leafArgs = unprocessedArgs.replace(/\s+/g, ' ').split(' ');
	var error = null;

	if (this.verbose) {
		printHeader("LEAF", id);
		printSingle('type', leafType);
		printSingle('args', leafArgs);
	}

	if (leafType == 'rectangle') {
		error = this.readRectangle(id, leafArgs);
	}
	else if (leafType == 'triangle') {
		error = this.readTriangle(id, leafArgs);
	}
	else if (leafType == 'plane') {
		error = this.readPlane(id, leafArgs);
	}
	else if (leafType == 'patch') {
		error = this.readPatch(id, leafArgs, root.children);
	}
	else if (leafType == 'cylinder') {
		error = this.readCylinder(id, leafArgs);
	}
	else if (leafType == 'sphere') {
		error = this.readSphere(id, leafArgs);
	}
	else {
		return onAttributeInvalid('type', id, parent);
	}

	if (error != null) {
		return error;
	}

	return null;
};

/**
 * processa uma primitiva do tipo "rectangle" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readRectangle = function(id, leafArgs) {

	if (leafArgs.length != 4) {
		return onInvalidArguments(id, leafArgs.length, 4);
	}

	var parseErrors = 0;
	var x1 = parseFloat(leafArgs[0]);
	var y1 = parseFloat(leafArgs[1]);

	if (x1 != x1 || y1 != y1) {
		onAttributeInvalid('top left vertex', id, 'RECTANGLE');
		parseErrors++;
	}

	var x2 = parseFloat(leafArgs[2]);
	var y2 = parseFloat(leafArgs[3]);

	if (x2 != x2 || y2 != y2) {
		onAttributeInvalid('bottom right vertex', id, 'RECTANGLE');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('RECTANGLE', parseErrors, id);
	}

	this.result = new MyRectangle(this.scene, x1, y1, x2, y2);

	return null;
};

/**
 * processa uma primitiva do tipo "triangle" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readTriangle = function(id, leafArgs) {

	if (leafArgs.length != 9) {
		return onInvalidArguments(id, leafArgs.length, 9);
	}

	var parseErrors = 0;
	var vec1 = [leafArgs[0], leafArgs[1], leafArgs[2]].map(parseFloat);

	if (vec1[0] != vec1[0] || vec1[1] != vec1[1] || vec1[2] != vec1[2]) {
		onAttributeInvalid('first triangle vertex', id, 'TRIANGLE');
		parseErrors++;
	}

	var vec2 = [leafArgs[3], leafArgs[4], leafArgs[5]].map(parseFloat);

	if (vec2[0] != vec2[0] || vec2[1] != vec2[1] || vec2[2] != vec2[2]) {
		onAttributeInvalid('second triangle vertex', id, 'TRIANGLE');
		parseErrors++;
	}

	var vec3 = [leafArgs[6], leafArgs[7], leafArgs[8]].map(parseFloat);

	if (vec3[0] != vec3[0] || vec3[1] != vec3[1] || vec3[2] != vec3[2]) {
		onAttributeInvalid('third triangle vertex', id, 'TRIANGLE');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('TRIANGLE', parseErrors, id);
	}

	this.result = new MyTriangle(this.scene, vec1, vec2, vec3);

	return null;
};

/**
 * processa uma primitiva do tipo "plane" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readPlane = function(id, leafArgs) {

	if (leafArgs.length != 1) {
		return onInvalidArguments(id, leafArgs.length, 1);
	}

	var parseErrors = 0;
	var myDivisions = parseInt(leafArgs[0]);

	if (myDivisions != myDivisions) {
		onAttributeInvalid('number of divisions', id, 'PLANE');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('PLANE', parseErrors, id);
	}

	this.result = new MyPlane(this.scene, myDivisions);

	return null;
};

/**
 * processa uma primitiva do tipo "patch" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readPatch = function(id, leafArgs, root) {

	var error = null;
	var parseErrors = 0;

	if (leafArgs.length != 2) {
		return onInvalidArguments(id, leafArgs.length, 2);
	}

	var myDivsU = parseInt(leafArgs[0]);
	var myDivsV = parseInt(leafArgs[1]);

	if (myDivsU != myDivsU) {
		onAttributeInvalid('surface divisions U', id, 'PATCH');
		parseErrors++;
	}

	if (myDivsV != myDivsV) {
		onAttributeInvalid('surface divisions V', id, 'PATCH');
		parseErrors++;
	}

	if (root[0].nodeName != 'UPATCH') {
		return onUnexpectedTag(root[0].nodeName, 'UPATCH', 'PATCH', id);
	}

	if (root[1].nodeName != 'VPATCH') {
		return onUnexpectedTag(root[1].nodeName, 'VPATCH', 'PATCH', id);
	}

	var myDegreeU = this.parseFloat(root[0], null, 'degree');
	var myDegreeV = this.parseFloat(root[1], null, 'degree');

	error = checkValue(myDegreeU, 'surface U degree', 'PATCH', id);
	if (error != null) {
		return error;
	}

	error = checkValue(myDegreeV, 'surface V degree', 'PATCH', id);
	if (error != null) {
		return error;
	}

	var uLength = myDegreeU + 1;
	var vLength = myDegreeV + 1;
	var myPoints = [];
	var myKnotsU = this.parseFloatArray(root[0], 'knots');
	var myKnotsV = this.parseFloatArray(root[1], 'knots');

	error = checkValue(myKnotsU, 'U knots', 'PATCH', id);
	if (error != null) {
		return error;
	}

	error = checkValue(myKnotsV, 'V knots', 'PATCH', id);
	if (error != null) {
		return error;
	}

	if (myKnotsU.length != uLength * 2) {
		return onInvalidKnots(id, 'U knots', uLength * 2);
	}

	if (myKnotsV.length != vLength * 2) {
		return onInvalidKnots(id, 'V knots', vLength * 2);
	}

	if (root.length != uLength + 2) {
		return onInvalidPoints(id, uLength);
	}

	for (var currentU = 0; currentU < root.length - 2; currentU++) {

		var uTagName = 'U' + currentU;
		var uCoordinates = root[currentU + 2];
		var child_sz = uCoordinates.children.length;

		myPoints[currentU] = [];

		if (uCoordinates.nodeName != uTagName) {
			onXMLWarning(onUnexpectedTag(uCoordinates.nodeName, uTagName, 'PATCH', id));
			parseErrors++;
			continue;
		}

		if (child_sz != vLength) {
			onXMLWarning(onInvalidPoints(id, vLength));
			parseErrors++;
			continue;
		}

		for (var currentV = 0; currentV < child_sz; currentV++) {

			var vTagName = 'V' + currentV;
			var vCoordinates = uCoordinates.children[currentV];

			if (vCoordinates.nodeName != vTagName) {
				onXMLWarning(onUnexpectedTag(vCoordinates.nodeName, vTagName, 'PATCH', id));
				parseErrors++;
				continue;
			}

			var myVertex = this.parseVector4(vCoordinates);
			var error = checkValue(myVertex, 'control vertex', 'PATCH', id);

			if (error != null) {
				onXMLWarning(warning);
				parseErrors++;
				continue;
			}

			myPoints[currentU][currentV] = myVertex;
		}
	}

	if (parseErrors != 0) {
		return onParseError('PATCH', parseErrors, id);
	}

	if (this.verbose) {
		printValues('upatch', 'degree', myDegreeU, 'knots', myKnotsU);
		printValues('vpatch', 'degree', myDegreeV, 'knots', myKnotsV);
	}

	this.result = new MyPatch(this.scene, myDivsU, myDivsV, myDegreeU, myDegreeV, myKnotsU, myKnotsV, myPoints);

	return null;
};

/**
 * processa uma primitiva do tipo "cylinder" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readCylinder = function(id, leafArgs) {

	if (leafArgs.length != 5) {
		return onInvalidArguments(id, leafArgs.length, 5);
	}

	var parseErrors = 0;
	var myHeight = parseFloat(leafArgs[0]);

	if (myHeight != myHeight) {
		onAttributeInvalid('height', id, 'CYLINDER');
		parseErrors++;
	}

	var myRadiusBottom = parseFloat(leafArgs[1]);

	if (myRadiusBottom != myRadiusBottom) {
		onAttributeInvalid('bottom radius', id, 'CYLINDER');
		parseErrors++;
	}

	var myRadiusTop = parseFloat(leafArgs[2]);

	if (myRadiusTop != myRadiusTop) {
		onAttributeInvalid('top radius', id, 'CYLINDER');
		parseErrors++;
	}

	var myStacks = parseInt(leafArgs[3]);

	if (myStacks != myStacks) {
		onAttributeInvalid('number of stacks', id, 'CYLINDER');
		parseErrors++;
	}

	var mySlices = parseInt(leafArgs[4]);

	if (mySlices != mySlices) {
		onAttributeInvalid('number of slices', id, 'CYLINDER');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('CYLINDER', parseErrors, id);
	}

	this.result = new MyCylinder(this.scene, myHeight, myRadiusBottom, myRadiusTop, myStacks, mySlices);

	return null;
};

/**
 * processa uma primitiva do tipo "sphere" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readSphere = function(id, leafArgs) {

	if (leafArgs.length != 3) {
		return onInvalidArguments(id, leafArgs.length, 3);
	}

	var parseErrors = 0;
	var myRadius = parseFloat(leafArgs[0]);

	if (myRadius != myRadius) {
		onAttributeInvalid('sphere radius', id, 'SPHERE');
		parseErrors++;
	}

	var myStacks = parseInt(leafArgs[1]);

	if (myStacks != myStacks) {
		onAttributeInvalid('number of stacks', id, 'SPHERE');
		parseErrors++;
	}

	var mySlices = parseInt(leafArgs[2]);

	if (mySlices != mySlices) {
		onAttributeInvalid('number of slices', id, 'SPHERE');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('SPHERE', parseErrors, id);
	}

	this.result = new MySphere(this.scene, myRadius, myStacks, mySlices);

	return null;
};