/**
 * construtor default da classe 'BaseParser'
 * @constructor
 * @author Diogo Marques
 * @param {String} id - identificador do node
 * @param {String} textureId -  identificador da textura associada a este node
 * @param {String} materialId - identificador do material associado a este node
 * @return {null}
 */
function BaseParser(reader, scene) {
	this.reader = reader;
	this.scene = scene;
	this.verbose = true;
};

BaseParser.prototype = Object.create(Object.prototype);
BaseParser.prototype.constructor = BaseParser;

/**
 * processa um valor booleano contido num atributo de um elemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que cont?m o valor booleano
 * @return {Boolean|NaN|null} - valor booleano se este for válido, caso contrário NaN ou null
 */
BaseParser.prototype.parseBoolean = function(root, attribute) {

	var node = root.getElementsByTagName(attribute);

	if (node == null || node.length == 0) {
		return null;
	}

	if (node.length != 1) {
		onMultipleDefinitions(attribute, root.nodeName);
	}

	if (!node[0].hasAttribute('value')) {
		return null;
	}

	var checkResult = this.reader.getBoolean(node[0], 'value', true);

	return checkResult == null ? NaN : checkResult;
};

/**
 * processa um n?mero em v?rgula flutuante contido num elemento XML
 * @param {XMLElement} root - estrutura de dados XML que cont?m o elemento
 * @param {String} attribute - identificador do atributo que cont?m as coordenadas
 * @return {Number|NaN|null} - n?mero em v?rgula flutuante se este for v?lido, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseFloat = function(root, name, attribute) {
	return this.parseGeneric(root, name, attribute, this.reader.getFloat);
};

/**
 * processa um vetor de tr?s dimens?es contido num elemento XML
 * @param {XMLElement} root - estrutura de dados XML que cont?m o elemento
 * @param {String|null} attribute - identificador do atributo que cont?m as coordenadas
 * @return {Number|NaN|null} - vetor de tr?s dimens?es se este for v?lido, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseVector3 = function(root, name, attribute) {
	return this.parseGeneric(root, name, attribute, this.reader.getVector3)
};

/**
 * processa uma string contida num atributo de um elemento XML
 * @param {XMLElement} root - estrutura de dados XML que cont?m o elemento
 * @param {String|null} attribute - identificador do atributo que cont?m a string
 * @return {String|NaN|null} - string se esta for v?lida, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseString = function(root, name, attribute) {
	return this.parseGeneric(root, name, attribute, this.reader.getString);
};

/**
 * processa um valor gen?rico contido num nlemento XML
 * @param {XMLElement} root - estrutura de dados XML que cont?m o elemento
 * @param {String|null} attribute - identificador do atributo que cont?m o valor
 * @param {Object} parser - apontador para uma fun??o de leitura
 * @return {String|NaN|null} - string se esta for v?lida, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseGeneric = function(root, name, attribute, parser) {

	var node = root;

	if (name != null) {

		node = root.getElementsByTagName(name);

		if (node == null || node.length == 0) {
			return null;
		}

		if (node.length != 1) {
			onMultipleDefinitions(name, root.nodeName);
		}

		node = node[0];
	}

	if (node.hasAttribute(attribute)) {
		return parser.call(this.reader, node, attribute);
	}

	return null;
};

/**
 * processa coordenadas gen?ricas para um vetor de tamanho vari?vel
 * @param {XMLElement} root - estrutura de dados XML que cont?m o elemento
 * @param {String|null attribute - identificador do atributo que cont?m as coordenadas
 * @param {Number[]} coords - vetor que cont?m o nome das coordenadas a serem processadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem v?lidas, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseCoordinates = function(root, attribute, coords) {

	var arr = [];
	var node = root;

	if (attribute != null) {

		node = root.getElementsByTagName(attribute);

		if (node == null || node.length == 0) {
			return null;
		}

		if (node.length != 1) {
			onMultipleDefinitions(attribute, root.nodeName);
		}

		node = node[0];
	}

	for (var i = 0; i < coords.length; i++) {

		var coordName = coords[i];

		if (!node.hasAttribute(coordName)) {
			onCoordinateMissing(coordName, attribute);
			return NaN;
		}

		var coordValue = this.reader.getFloat(node, coordName);

		if (coordValue != coordValue) {
			onCoordinateInvalid(coordName, attribute);
			return NaN;
		}

		arr.push(coordValue);
	}

	return arr;
};

BaseParser.prototype.parseVector4 = function(root, length) {

	var unprocessedArgs = this.reader.getString(root, 'coords');
	var vectorArgs = unprocessedArgs.replace(/\s+/g, ' ').split(' ');
	var arr = vectorArgs.map(parseFloat);

	if (arr[0] != arr[0] || arr[1] != arr[1] || arr[2] != arr[2] || arr[3] != arr[3]) {
		return NaN;
	}

	return arr;
};

BaseParser.prototype.parseFloatArray = function(root, attribute, length) {

	var unprocessedArgs = this.reader.getString(root, attribute);
	var vectorArgs = unprocessedArgs.replace(/\s+/g, ' ').split(' ');
	var arr = vectorArgs.map(parseFloat);

	for (var i = 0; i < arr.length; i++) {
		if (arr[i] != arr[i]) {
			return NaN;
		}
	}

	return arr;
}


/**
 * processa coordenadas na forma (r, g, b, a) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que cont?m o elemento
 * @param {String} attribute - identificador do atributo que cont?m as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem v?lidas, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseCoordinatesRGBA = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['r', 'g', 'b', 'a']);
};

/**
 * processa coordenadas na forma (x, y, z) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que cont?m o elemento
 * @param {String} attribute - identificador do atributo que cont?m as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem v?lidas, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseCoordinatesXYZ = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['x', 'y', 'z']);
};

/**
 * processa coordenadas na forma (x, y, z, w) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que cont?m o elemento
 * @param {String} attribute - identificador do atributo que cont?m as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem v?lidas, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseCoordinatesXYZW = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['x', 'y', 'z', 'w']);
};

/**
 * processa coordenadas na forma (sx, sy, sz) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que cont?m o elemento
 * @param {String} attribute - identificador do atributo que cont?m as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem v?lidas, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseCoordinatesScale = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['sx', 'sy', 'sz']);
};