/*
  _____        _____   _____ ______ _____
 |  __ \ /\   |  __ \ / ____|  ____|  __ \
 | |__) /  \  | |__) | (___ | |__  | |__) |
 |  ___/ /\ \ |  _  / \___ \|  __| |  _  /
 | |  / ____ \| | \ \ ____) | |____| | \ \
 |_| /_/    \_\_|  \_\_____/|______|_|  \_\

	<SCENE>
		<INITIALS></INITIALS>
		<ILLUMINATION></ILLUMINATION>
		<MATERIALS></MATERIALS>
		<TEXTURES></TEXTURES>
		<ANIMATIONS></ANIMATIONS>
		<LEAVES></LEAVES>
		<NODES></NODES>
	</SCENE>
*/

/**
 * construtor por omissão da classe 'BaseParser'
 * @constructor
 * @author Diogo Marques
 * @param {CGFxmlReader} reader
 * @param {CGFscene} scene
 * @return {null}
 */
function BaseParser(reader, scene) {
	this.reader = reader;
	this.scene = scene;
	this.verbose = false;
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

	var checkResult = this.reader.getBoolean(node[0], 'value');

	return checkResult == null ? NaN : checkResult;
};

/**
 * processa um n?mero em v?rgula flutuante contido num elemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém o número
 * @return {Number|NaN|null} - número em vírgula flutuante se este for válido, caso contrário NaN ou null
 */
BaseParser.prototype.parseFloat = function(root, name, attribute) {
	return this.parseGeneric(root, name, attribute, this.reader.getFloat);
};

/**
 * processa um número inteiro contido num elemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém o número inteiro
 * @return {Number|NaN|null} - número número inteiro se este for válido, caso contrário NaN ou null
 */
BaseParser.prototype.parseInteger = function(root, name, attribute) {
	return this.parseGeneric(root, name, attribute, this.reader.getInteger);
};

/**
 * processa uma string contida num atributo de um elemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String|null} attribute - identificador do atributo que contém a string
 * @return {String|NaN|null} - string se esta for válida, caso contrário NaN ou null
 */
BaseParser.prototype.parseString = function(root, name, attribute) {
	return this.parseGeneric(root, name, attribute, this.reader.getString);
};

/**
 * processa um valor gen?rico contido num nlemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String|null} attribute - identificador do atributo que contém o valor pedido
 * @param {Object} parser - apontador para uma função de leitura
 * @return {Object|NaN|null} - valor pedido se este for válido, caso contrário NaN ou null
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
 * processa coordenadas genéricas para um array de tamanho variável
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String|null attribute - identificador do atributo que contém as coordenadas
 * @param {Number[]} coords - array que contém o nome das coordenadas a serem processadas
 * @return {Number[]|NaN|null} - array com as coordenadas se estas forem válidas, caso contrário NaN ou null
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
			onCoordinateMissing(coordName, attribute == null ? root.nodeName : attribute);
			return NaN;
		}

		var coordValue = this.reader.getFloat(node, coordName);

		if (coordValue != coordValue) {
			onCoordinateInvalid(coordName, attribute == null ? root.nodeName : attribute);
			return NaN;
		}

		arr.push(coordValue);
	}

	return arr;
};

 /**
 * processa uma sequência de números contida numa string para um array
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém a string
 * @param {Number} length - tamanho do array original
 * @return {Number[]|NaN|null} - array com os números se estes forem válidas, caso contrário NaN ou null
 */
BaseParser.prototype.parseFloatArray = function(root, attribute, length) {

	if (!root.hasAttribute(attribute)) {
		return null;
	}

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
 * processa coordenadas na forma (x, y, z) contidas numa string para um array
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - array com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
BaseParser.prototype.parseVector3 = function(root, name, attribute) {
	return this.parseGeneric(root, name, attribute, this.reader.getVector3)
};

/**
 * processa coordenadas na forma (x, y, z, w) contidas numa string para um array
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @return {Number[]|NaN|null} - array com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
BaseParser.prototype.parseVector4 = function(root) {
	return this.parseFloatArray(root, 'coords', 4);
};

/**
 * processa coordenadas na forma (r, g, b, a) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - array com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
BaseParser.prototype.parseCoordinatesRGBA = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['r', 'g', 'b', 'a']);
};

/**
 * processa coordenadas na forma (x, y, z) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - array com as coordenadas se estas forem v?lidas, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseCoordinatesXYZ = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['x', 'y', 'z']);
};

/**
 * processa coordenadas na forma (x, y, z, w) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - array com as coordenadas se estas forem v?lidas, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseCoordinatesXYZW = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['x', 'y', 'z', 'w']);
};

/**
 * processa coordenadas na forma (sx, sy, sz) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - array com as coordenadas se estas forem v?lidas, caso contr?rio NaN ou null
 */
BaseParser.prototype.parseCoordinatesScale = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['sx', 'sy', 'sz']);
};