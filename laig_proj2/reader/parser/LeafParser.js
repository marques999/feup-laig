/*
  _      ______     __      ________  _____ 
 | |    |  ____|   /\ \    / /  ____|/ ____|
 | |    | |__     /  \ \  / /| |__  | (___  
 | |    |  __|   / /\ \ \/ / |  __|  \___ \ 
 | |____| |____ / ____ \  /  | |____ ____) |
 |______|______/_/    \_\/   |______|_____/ 
 
	<LEAF id="ss" type="rectangle" args="ff ff ff ff" />
	<LEAF id="ss" type="cylinder" args="ff ff ff ii ii" /> 
	<LEAF id="ss" type="sphere" args="ff ii ii" />
	<LEAF id="ss" type="triangle" args="ff ff ff  ff ff ff  ff ff ff" />

*/

/**
 * construtor default da classe 'LeafParser'
 * @constructor
 * @author Diogo Marques
 * @param {String} id - identificador do node
 * @param {String} textureId -  identificador da textura associada a este node
 * @param {String} materialId - identificador do material associado a este node
 * @return {null}
 */
function LeafParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

LeafParser.prototype = Object.create(BaseParser.prototype);
LeafParser.prototype.constructor = LeafParser;

LeafParser.prototype.parse = function(root, id) {

	var parent = root.nodeName;
	this.result = null;

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

	if (leafType == 'rectangle') {
		error = this.readRectangle(id, leafArgs);
	}
	else if (leafType == 'triangle') {
		error = this.readTriangle(id, leafArgs);
	}
	else if (leafType == 'plane') {
		error = this.readPlane(id, leafArgs);
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
	
	if (this.verbose) {
		printHeader("LEAF", id);
		printValues(null, 'type', leafType, 'args', leafArgs);
	}
	
	return null;
};

/**
 * processa uma primitiva do tipo "rectangle" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da LeafParser/primitiva atual
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
 * @param {Number} id - identificador da LeafParser/primitiva atual
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
 * @param {Number} id - identificador da LeafParser/primitiva atual
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
		onAttributeInvalid('number of divisions', id, 'CYLINDER');
		parseErrors++;
	}
	
	if (parseErrors != 0) {
		return onParseError('PLANE', parseErrors, id);
	}

	this.result = new MyPlane(this.scene, myDivisions);
	return null;
};

/**
 * processa uma primitiva do tipo "cylinder" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da LeafParser/primitiva atual
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
 * @param {Number} id - identificador da LeafParser/primitiva atual
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