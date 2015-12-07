/*
  _      ______     __      ________  _____
 | |    |  ____|   /\ \    / /  ____|/ ____|
 | |    | |__     /  \ \  / /| |__  | (___
 | |    |  __|   / /\ \ \/ / |  __|  \___ \
 | |____| |____ / ____ \  /  | |____ ____) |
 |______|______/_/    \_\/   |______|_____/

	<LEAVES>
		<LEAF id="ss" type="rectangle" args="ff ff ff ff"/>
		<LEAF id="ss" type="cylinder" args="ff ff ff ii ii"/>
		<LEAF id="ss" type="sphere" args="ff ii ii"/>
		<LEAF id="ss" type="triangle" args="ff ff ff ff ff ff ff ff ff"/>
		<LEAF id="ss" type="plane" parts="ii"/>
		<LEAF id="ss" type="terrain" texture="ss" heightmap="ss"/>
		<LEAF id="ss" type="vehicle"/>
		<LEAF id="ss" type="patch" orderU="ii" orderV="ii" partsU="ii" partsV="ii">
			<controlpoint coords="ff ff ff ff" />
			<controlpoint coords="ff ff ff ff" />
			<controlpoint coords="ff ff ff ff" />
			<controlpoint coords="ff ff ff ff" />
		</LEAF>
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

	if (!root.hasAttribute('type')) {
		return onAttributeMissing('type', id, root.nodeName);
	}

	if (id == 'null' || id == 'clear') {
		return onReservedId(id, root.nodeName);
	}

	this.result = null;
	var leafType = this.reader.getString(root, 'type');
	var error = this.readType(id, root, leafType);

	if (error != null) {
		return error;
	}
};

/**
 * process uma primitiva e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {XMLElement} root - estutura de dados XML que contém os argumentos não processados
 * @param {String} leafType - tipo da primitiva atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readType = function(id, root, leafType) {

	var error = null;

	if (leafType == 'rectangle') {
		error = this.readRectangle(id, root);
	}
	else if (leafType == 'triangle') {
		error = this.readTriangle(id, root);
	}
	else if (leafType == 'patch') {
		error = this.readPatch(id, root);
	}
	else if (leafType == 'cylinder') {
		error = this.readCylinder(id, root);
	}
	else if (leafType == 'sphere') {
		error = this.readSphere(id, root);
	}
	else if (leafType == 'terrain') {
		error = this.readTerrain(id, root);
	}
	else if (leafType == 'vehicle') {
		this.result = new MyVehicle(this.scene);
	}
	else if (leafType == 'plane') {
		error = this.readPlane(id, root);
	}
	else if (leafType == 'test') {
		error = this.readTest();
	}
	else {
		error = onAttributeInvalid('type', id, root.nodeName);
	}

	return error;
}
/**
 * processa uma primitiva do tipo "rectangle" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {XMLElement} root - estutura de dados XML que contém os argumentos não processados
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readRectangle = function(id, root) {

	if (!root.hasAttribute('args')) {
		return onAttributeMissing('args', id, 'RECTANGLE');
	}

	var unprocessedArgs = this.reader.getString(root, 'args');
	var leafArgs = unprocessedArgs.replace(/\s+/g, ' ').split(' ');

	if (leafArgs.length != 4) {
		return onInvalidArguments(id, leafArgs.length, 4);
	}

	var parseErrors = 0;
	var x1 = parseFloat(leafArgs[0]);
	var y1 = parseFloat(leafArgs[1]);

	if (x1 != x1 || y1 != y1) {
		onAttributeInvalidWarn('top left vertex', id, 'RECTANGLE');
		parseErrors++;
	}

	var x2 = parseFloat(leafArgs[2]);
	var y2 = parseFloat(leafArgs[3]);

	if (x2 != x2 || y2 != y2) {
		onAttributeInvalidWarn('bottom right vertex', id, 'RECTANGLE');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('RECTANGLE', parseErrors, id);
	}

	this.result = new MyRectangle(this.scene, x1, y1, x2, y2);

	if (this.verbose) {
		printHeader("LEAF", id);
		printSingle('type', 'rectangle');
		printValues('vertex 1', 'x', x1, 'y', y1);
		printValues('vertex 2', 'x', x2, 'y', y2);
	}
};

/**
 * processa uma primitiva do tipo "triangle" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {XMLElement} root - estutura de dados XML que contém os argumentos não processados
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readTriangle = function(id, root) {

	if (!root.hasAttribute('args')) {
		return onAttributeMissing('args', id, 'TRIANGLE');
	}

	var unprocessedArgs = this.reader.getString(root, 'args');
	var leafArgs = unprocessedArgs.replace(/\s+/g, ' ').split(' ');

	if (leafArgs.length != 9) {
		return onInvalidArguments(id, leafArgs.length, 9);
	}

	var parseErrors = 0;
	var vec1 = [leafArgs[0], leafArgs[1], leafArgs[2]].map(parseFloat);

	if (vec1[0] != vec1[0] || vec1[1] != vec1[1] || vec1[2] != vec1[2]) {
		onAttributeInvalidWarn('first triangle vertex', id, 'TRIANGLE');
		parseErrors++;
	}

	var vec2 = [leafArgs[3], leafArgs[4], leafArgs[5]].map(parseFloat);

	if (vec2[0] != vec2[0] || vec2[1] != vec2[1] || vec2[2] != vec2[2]) {
		onAttributeInvalidWarn('second triangle vertex', id, 'TRIANGLE');
		parseErrors++;
	}

	var vec3 = [leafArgs[6], leafArgs[7], leafArgs[8]].map(parseFloat);

	if (vec3[0] != vec3[0] || vec3[1] != vec3[1] || vec3[2] != vec3[2]) {
		onAttributeInvalidWarn('third triangle vertex', id, 'TRIANGLE');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('TRIANGLE', parseErrors, id);
	}

	this.result = new MyTriangle(this.scene, vec1, vec2, vec3);

	if (this.verbose) {
		printHeader("LEAF", id);
		printSingle('type', 'triangle');
		printXYZ('vertex 1', vec1);
		printXYZ('vertex 2', vec2);
		printXYZ('vertex 2', vec3);
	}
};

/**
 * processa uma primitiva do tipo "plane" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {XMLElement} root - estutura de dados XML que contém os argumentos não processados
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readPlane = function(id, root) {

	var parseErrors = 0;
	var myDivisions = this.parseInteger(root, null, 'parts')
	var error = checkValue(myDivisions, 'parts', 'PLANE', id);

	if (error != null) {
		onXMLWarning(error);
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('PLANE', parseErrors, id);
	}

	this.result = new MyPlane(this.scene, myDivisions);

	if (this.verbose) {
		printHeader("LEAF", id);
		printSingle('type', 'plane');
		printSingle('parts', myDivisions);
	}
};

LeafParser.prototype.readTest = function(id, root) {
	
	this.result = new GameBoard(this.scene);	
};

/**
 * processa uma primitiva do tipo "terrain" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {XMLElement} root - estutura de dados XML que contém os argumentos não processados
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readTerrain = function(id, root) {

	var parseErrors = 0;
	var myTexture = this.parseString(root, null, 'texture');
	var error = checkValue(myTexture, 'textureh', 'TERRAIN', id);

	if (error != null) {
		onXMLWarning(error);
		parseErrors++;
	}

	if (!checkUrl(myTexture)) {
		onURLInvalid('texture', id, 'TERRAIN');
		parseErrors++;
	}

	var myHeightmap = this.parseString(root, null, 'heightmap');
	var error = checkValue(myHeightmap, 'heightmap', 'TERRAIN', id);

	if (error != null) {
		onXMLWarning(error);
		parseErrors++;
	}

	if (!checkUrl(myHeightmap)) {
		onURLInvalid('heightmap', id, 'TERRAIN');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('TERRAIN', parseErrors, id);
	}

	this.result = new MyTerrain(this.scene, myTexture, myHeightmap);

	if (this.verbose) {
		printHeader("LEAF", id);
		printSingle('type', 'terrain');
		printSingle('texture', myTexture);
		printSingle('heightmap', myHeightmap);
	}
};

/**
 * processa uma primitiva do tipo "patch" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {XMLElement} root - estutura de dados XML que contém os argumentos não processados
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readPatch = function(id, root) {

	var parseErrors = 0;
	var myDivsU = this.parseInteger(root, null, 'partsU');
	var error = checkValue(myDivsU, 'surface U divisions', 'PATCH', id);

	if (error != null) {
		onXMLWarning(error);
		parseErrors++;
	}

	var myDivsV = this.parseInteger(root, null, 'partsV');
	var error = checkValue(myDivsV, 'surface V divisions', 'PATCH', id);

	if (error != null) {
		onXMLWarning(error);
		parseErrors++;
	}

	var myDegreeU = this.parseInteger(root, null, 'orderU');
	var error = checkValue(myDegreeU, 'surface U degree', 'PATCH', id);

	if (error != null) {
		onXMLWarning(error);
		parseErrors++;
	}

	var myDegreeV = this.parseInteger(root, null, 'orderV');
	var error = checkValue(myDegreeV, 'surface V degree', 'PATCH', id);

	if (error != null) {
		onXMLWarning(error);
		parseErrors++;
	}

	if (myDegreeU < 0 || myDegreeU > 3) {
		onDegreeOutOfRange(id, 'degreeU');
		parseErrors++;
	}

	if (myDegreeV < 0 || myDegreeV > 3) {
		onDegreeOutOfRange(id, 'degreeV');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('PATCH', parseErrors, id);
	}

	root = root.children;

	var uLength = myDegreeU + 1;
	var vLength = myDegreeV + 1;
	var totalLength = uLength * vLength;
	var controlPoints = [];
	var myArray = [];

	if (root.length != totalLength) {
		return onInvalidPoints(id, totalLength);
	}

	if (this.verbose) {
		printHeader("LEAF", id);
		printSingle('type', 'patch');
		printValues('u', 'divisions', myDivsU, 'degree', myDegreeU);
		printValues('v', 'divisions', myDivsV, 'degree', myDegreeV);
	}

	for (var currentPoint = 0; currentPoint < totalLength; currentPoint+=1) {

		var nodePoint = root[currentPoint];

		if (nodePoint.nodeName != 'controlpoint') {
			onXMLWarning(onUnexpectedTag(nodePoint.nodeName, 'controlpoint', 'PATCH', id));
			parseErrors++;
			continue;
		}

		var myVertex = this.parseVector4(nodePoint);
		var error = checkValue(myVertex, 'control vertex', 'PATCH', id);

		if (error != null) {
			onXMLWarning(warning);
			parseErrors++;
		}
		else {
			myArray.push(myVertex);
		}

		if (this.verbose) {
			printXYZW('controlpoint', myVertex);
		}

		if (currentPoint % vLength == myDegreeV) {
			controlPoints.push(myArray);
			myArray = [];
		}
	}

	if (parseErrors != 0) {
		return onParseError('PATCH', parseErrors, id);
	}

	this.result = new MyPatch(this.scene, myDivsU, myDivsV, myDegreeU, myDegreeV, controlPoints);
};

/**
 * processa uma primitiva do tipo "cylinder" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {XMLElement} root - estutura de dados XML que contém os argumentos não processados
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readCylinder = function(id, root) {

	if (!root.hasAttribute('args')) {
		return onAttributeMissing('args', id, 'CYLINDER');
	}

	var unprocessedArgs = this.reader.getString(root, 'args');
	var leafArgs = unprocessedArgs.replace(/\s+/g, ' ').split(' ');

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
		onAttributeInvalidWarn('bottom radius', id, 'CYLINDER');
		parseErrors++;
	}

	var myRadiusTop = parseFloat(leafArgs[2]);

	if (myRadiusTop != myRadiusTop) {
		onAttributeInvalidWarn('top radius', id, 'CYLINDER');
		parseErrors++;
	}

	var myStacks = parseInt(leafArgs[3]);

	if (myStacks != myStacks) {
		onAttributeInvalidWarn('number of stacks', id, 'CYLINDER');
		parseErrors++;
	}

	var mySlices = parseInt(leafArgs[4]);

	if (mySlices != mySlices) {
		onAttributeInvalidWarn('number of slices', id, 'CYLINDER');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('CYLINDER', parseErrors, id);
	}

	this.result = new MyCylinder(this.scene, myHeight, myRadiusBottom, myRadiusTop, myStacks, mySlices);

	if (this.verbose) {
		printHeader("LEAF", id);
		printSingle('type', 'cylinder');
		printSingle('height', myHeight);
		printSingle('bottom radius', myRadiusBottom);
		printSingle('top radius', myRadiusTop);
		printSingle('stacks', myStacks);
		printSingle('slices', mySlices);
	}
};

/**
 * processa uma primitiva do tipo "sphere" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {XMLElement} root - estutura de dados XML que contém os argumentos não processados
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
LeafParser.prototype.readSphere = function(id, root) {

	if (!root.hasAttribute('args')) {
		return onAttributeMissing('args', id, 'SPHERE');
	}

	var unprocessedArgs = this.reader.getString(root, 'args');
	var leafArgs = unprocessedArgs.replace(/\s+/g, ' ').split(' ');

	if (leafArgs.length != 3) {
		return onInvalidArguments(id, leafArgs.length, 3);
	}

	var parseErrors = 0;
	var myRadius = parseFloat(leafArgs[0]);

	if (myRadius != myRadius) {
		onAttributeInvalidWarn('sphere radius', id, 'SPHERE');
		parseErrors++;
	}

	var myStacks = parseInt(leafArgs[1]);

	if (myStacks != myStacks) {
		onAttributeInvalidWarn('number of stacks', id, 'SPHERE');
		parseErrors++;
	}

	var mySlices = parseInt(leafArgs[2]);

	if (mySlices != mySlices) {
		onAttributeInvalidWarn('number of slices', id, 'SPHERE');
		parseErrors++;
	}

	if (parseErrors != 0) {
		return onParseError('SPHERE', parseErrors, id);
	}

	this.result = new MySphere(this.scene, myRadius, myStacks, mySlices);

	if (this.verbose) {
		printHeader("LEAF", id);
		printSingle('type', 'sphere');
		printSingle('radius', myRadius);
		printSingle('stacks', myStacks);
		printSingle('slices', mySlices);
	}
};