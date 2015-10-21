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
 * @param {String} attribute - identificador do atributo que contém o valor booleano
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
 * processa um número em vírgula flutuante contido num atributo de um elemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number|NaN|null} - número em vírgula flutuante se este for válido, caso contrário NaN ou null
 */
BaseParser.prototype.parseFloat = function(root, name, attribute) {

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
		return this.reader.getFloat(node, attribute);
	}
	
	return null;
};

/**
 * processa uma string contida num atributo de um elemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém a string
 * @return {String|NaN|null} - string se esta for válida, caso contrário NaN ou null
 */
BaseParser.prototype.parseString = function(root, name, attribute) {

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
		return this.reader.getString(node, attribute);
	}

	return null;
};

/**
 * processa coordenadas genéricas para um vetor de tamanho variável
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @param {Number[]} coords - vetor que contém o nome das coordenadas a serem processadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
BaseParser.prototype.parseCoordinates = function(root, attribute, coords) {

	var arr = [];
	var node = root;
	
	if (attribute != null) {
		
		var tempNode = root.getElementsByTagName(attribute);
		
		if (tempNode == null || tempNode.length == 0) {
			return null;
		}

		if (tempNode.length != 1) {
			onMultipleDefinitions(attribute, root.nodeName);
		}
		
		node = tempNode[0];
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

/**
 * processa coordenadas na forma (r, g, b, a) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
BaseParser.prototype.parseCoordinatesRGBA = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['r', 'g', 'b', 'a']);
};

/**
 * processa coordenadas na forma (x, y, z) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
BaseParser.prototype.parseCoordinatesXYZ = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['x', 'y', 'z']);
};

/**
 * processa coordenadas na forma (x, y, z, w) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
BaseParser.prototype.parseCoordinatesXYZW = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['x', 'y', 'z', 'w']);
};

/**
 * processa coordenadas na forma (sx, sy, sz) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
BaseParser.prototype.parseCoordinatesScale = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['sx', 'sy', 'sz']);
};