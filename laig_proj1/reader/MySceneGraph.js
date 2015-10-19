/**
 * construtor default da classe 'MySceneGraph'
 * @constructor
 * @author Carlos Samouco, Diogo Marques
 * @param {String} filename - caminho relativo do ficheiro LSX
 * @param {XMLscene} scene - apontador para uma XMLscene onde o grafo de cena será desenhado
 * @return {null}
 */
function MySceneGraph(filename, scene) {

	this.loadedOk = null;
	this.scene = scene;
	this.verbose = true;

	scene.graph = this;

	this.leaves = {};
	this.lights = {};
	this.materials = {};
	this.nodes = {};
	this.textures = {};

	this.defaultMaterial = new CGFappearance(this.scene);
	this.defaultMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.defaultMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
	this.defaultMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
	this.defaultMaterial.setShininess(10);

	this.reader = new CGFXMLreader();
	this.sceneFile = 'scenes/' + filename;
	this.scenePath = this.sceneFile.substring(0, this.sceneFile.lastIndexOf('/')) + '/';
	this.reader.open(this.sceneFile, this);
};

/*
  _____ _   _ _____ _______ 
 |_   _| \ | |_   _|__   __|
   | | |  \| | | |    | |   
   | | | . ` | | |    | |   
  _| |_| |\  |_| |_   | |   
 |_____|_| \_|_____|  |_|   

*/

/**
 * chama as funções de parsing uma a uma para processar os diferentes blocos do ficheiro LSX,
 * apresentando uma mensagem de erro na ausência de um bloco ou na existência de blocos repetidos
 * valida todos os nodes carregados do ficheiro LSX, verificando se o root node existe no grafo
 * chama a função onGraphLoaded() da XMLscene associada, preparando a cena com os valores iniciais
 * @return {null} 
 */
MySceneGraph.prototype.onXMLReady = function() {

	var parent = 'SCENE';
	var rootElement = this.reader.xmlDoc.documentElement;

	var rootTags = [
		'INITIALS',
		'ILLUMINATION',
		'LIGHTS',
		'MATERIALS',
		'TEXTURES',
		'LEAVES',
		'NODES',
	];

	var rootParsers = [
		this.parseGlobals,
		this.parseIllumination,
		this.parseLights,
		this.parseMaterials,
		this.parseTextures,
		this.parseLeaves,
		this.parseNodes
	];

	for (var i = 0; i < rootTags.length; i++) {

		var currentElement = rootElement.getElementsByTagName(rootTags[i]);

		if (currentElement == null || currentElement.length == 0) {
			this.onXMLError(onElementMissing(rootTags[i], parent));
			return;
		}

		if (currentElement.length != 1) {
			onMultipleElements(rootTags[i], parent);
		}

		var error = rootParsers[i].call(this, currentElement[0]);

		if (error != null) {
			this.onXMLError(error);
			return;
		}
	}

	this.resetIndegree();
	this.validateNodes();
	
	if (this.nodes[this.graphRoot] != undefined) {
		this.loadedOk = true;
		this.scene.onGraphLoaded();
	}
	else {
		this.onInvalidRoot(this.graphRoot);
	}
};

/*
  _____ _____  _____ _____  _           __     __
 |  __ \_   _|/ ____|  __ \| |        /\\ \   / /
 | |  | || | | (___ | |__) | |       /  \\ \_/ / 
 | |  | || |  \___ \|  ___/| |      / /\ \\   /  
 | |__| || |_ ____) | |    | |____ / ____ \| |   
 |_____/_____|_____/|_|    |______/_/    \_\_|   
												 
/**
 * aplica os materiais e texturas associados ao root node na XMLscene
 * chama a função de processamento e visualização dos restantes nós partindo do root node
 * @return {null} 
 */
MySceneGraph.prototype.display = function() {

	var rootNode = this.nodes[this.graphRoot];
	var rootMaterial = this.defaultMaterial;
	this.scene.pushMatrix();
	
	if (rootNode.materialId != null && rootNode.materialId != 'null') {
		rootMaterial = this.materials[rootNode.materialId];
	}

	if (rootNode.textureId != null && rootNode.textureId != 'null' && rootNode.textureId != 'clear') {
		rootMaterial.setTexture(this.textures[rootNode.textureId].tex);	
	}

	this.scene.applyMaterial(rootMaterial);
	this.processNodes(rootNode, rootNode.materialId, rootNode.textureId);
	this.scene.popMatrix();
};

/**
 * processa recursivamente todos os nós do scene graph (folhas inclusive)
 * processa por herança as transformações, texturas e materiais associadas a cada nó, aplicando-as na XMLscene
 * quando atinge uma folha, desenha na XMLscene a primitiva associada a essa folha e retorna
 * @param {XMLnode} node - estrutura de dados que contém informações sobre o node a ser processado
 * @param {String} materialId - identificador do material do node a ser processado
 * @param {String} textureId - identificador da textura do node a ser processado
 * @return {null}
 */
MySceneGraph.prototype.processNodes = function(node, materialId, textureId) {

	this.scene.multMatrix(node.matrix);

	for (var i = 0; i < node.children.length; i++) {
		var nextId = node.children[i];
		var mId = materialId;
		var tId = textureId;

		if (this.leaves[nextId] != undefined) {
			var leaf = this.leaves[nextId];	
			var leafMaterial = this.defaultMaterial;
			var leafTexture = null;

			if (mId != null && mId != 'null') {
				leafMaterial = this.materials[mId];
			}

			if (tId == null || tId == 'null') {
				leafMaterial.setTexture(null);
			}
			else {
				leafTexture = this.textures[tId];
				leaf.updateTexCoords(leafTexture.factorS, leafTexture.factorT);
				leafMaterial.setTexture(leafTexture.tex);
			}

			this.scene.applyMaterial(leafMaterial);
			this.scene.drawPrimitive(leaf);
		}
		else if (this.nodes[nextId] != undefined) {
			var nextElement = this.nodes[nextId];
			this.scene.pushMatrix();
			this.processNodes(nextElement, this.getNodeMaterial(mId, nextElement), this.getNodeTexture(tId, nextElement));			
			this.scene.popMatrix();
		}
	}
};

/**
 * determina por herança qual a textura a aplicar sobre o nó atual
 * @param {String} currTextureId - identificador da textura do pai do nó atual
 * @param {XMLnode} nextElement - estrutura de dados representando o nó atual
 * @return {String} - identificador da textura do filho
 */
MySceneGraph.prototype.getNodeTexture = function(currTextureId, nextElement) {

	if (nextElement.textureId == 'null') {
		return currTextureId;
	}

	if (nextElement.textureId == 'clear') {
		return null;
	}

	return nextElement.textureId;
};

/**
 * determina por herança qual o material a aplicar sobre o nó atual
 * @param {String} currTextureId - identificador do material do pai do nó atual
 * @param {XMLnode} nextElement - estrutura de dados representando o nó atual
 * @return {String} - identificador do material do filho
 */
MySceneGraph.prototype.getNodeMaterial = function(currMaterialId, nextElement) {
	return nextElement.materialId == 'null' ? currMaterialId : nextElement.materialId;
};

/*
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
 * processa todas as entidades presentes no bloco <ILLUMINATION> do ficheiro LSX
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <ILLUMINATION>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseIllumination = function(root) {

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

/*
  _______ _____            _   _  _____ ______ ____  _____  __  __ 
 |__   __|  __ \     /\   | \ | |/ ____|  ____/ __ \|  __ \|  \/  |
	| |  | |__) |   /  \  |  \| | (___ | |__ | |  | | |__) | \  / |
	| |  |  _  /   / /\ \ | . ` |\___ \|  __|| |  | |  _  /| |\/| |
	| |  | | \ \  / ____ \| |\  |____) | |   | |__| | | \ \| |  | |
	|_|  |_|  \_\/_/    \_\_| \_|_____/|_|    \____/|_|  \_\_|  |_|

*/

/**
 * processa um escalamento presente num bloco <NODE>
 * @param {XMLElement} root - estrutura que dados XML que contém o atributo <scale>
 * @param {XMLnode} node - estrutura de dados que contém as informações do nó atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseNodeScale = function(root, node) {

	var coords = this.parseNodeCoordinates(root, 'sx', 'sy', 'sz');
	var error = checkValue(coords, 'coordinates', root.nodeName, node.id);
	
	if (error != null) {
		return error;
	}

	node.scale(coords);

	if (this.verbose) {
		printXYZ('SCALE', coords);
	}

	return null;
};

/**
 * processa uma translação presente num bloco <NODE>
 * @param {XMLElement} root - estrutura que dados XML que contém o atributo <translation>
 * @param {XMLnode} node - estrutura de dados que contém as informações do nó atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseNodeTranslation = function(root, node) {

	var coords = this.parseNodeCoordinates(root, 'x', 'y', 'z');
	var error = checkValue(coords, 'coordinates', root.nodeName, node.id);
	
	if (error != null) {
		return error;
	}

	node.translate(coords);

	if (this.verbose) {
		printXYZ('TRANSLATION', coords);
	}

	return null;
};

/**
 * processa uma rotação presente num bloco <NODE>
 * @param {XMLelement} root - estrutura que dados XML que contém o atributo <rotation>
 * @param {XMLnode} node - estrutura de dados que contém as informações do nó atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseNodeRotation = function(root, node) {

	var parent = root.nodeName;
	var parseErrors = 0;
	var axis = this.reader.getString(root, 'axis', true);
	var error = checkValue(axis, 'axis', parent, node.id);
	
	if (error != null) {
		return error;
	}

	if (axis != 'x' && axis != 'y' && axis != 'z') {
		onUnknownAxis(axis, root.nodeName, 'NODE');
	}

	var angle = this.reader.getFloat(root, 'angle', true);
	error = checkValue(angle, 'angle', parent, node.id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, node.id);
	}
	
	node.rotate(axis, angle);

	if (this.verbose) {
		printValues('ROTATION', 'axis', axis, 'angle', angle);
	}

	return null;
};

/*
  _____  _____  _____ __  __ _____ _______ _______      ________  _____ 
 |  __ \|  __ \|_   _|  \/  |_   _|__   __|_   _\ \    / /  ____|/ ____|
 | |__) | |__) | | | | \  / | | |    | |    | |  \ \  / /| |__  | (___  
 |  ___/|  _  /  | | | |\/| | | |    | |    | |   \ \/ / |  __|  \___ \ 
 | |    | | \ \ _| |_| |  | |_| |_   | |   _| |_   \  /  | |____ ____) |
 |_|    |_|  \_\_____|_|  |_|_____|  |_|  |_____|   \/   |______|_____/ 

*/

/**
 * processa uma primitiva do tipo "rectangle" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.readRectangle = function(id, leafArgs) {

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

	this.leaves[id] = new MyRectangle(this.scene, x1, y1, x2, y2);

	return null;
};

/**
 * processa uma primitiva do tipo "triangle" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.readTriangle = function(id, leafArgs) {

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

	this.leaves[id] = new MyTriangle(this.scene, vec1, vec2, vec3);

	return null;
};

/**
 * processa uma primitiva do tipo "cylinder" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.readCylinder = function(id, leafArgs) {

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

	this.leaves[id] = new MyCylinder(this.scene, myHeight, myRadiusBottom, myRadiusTop, myStacks, mySlices);

	return null;
};

/**
 * processa uma primitiva do tipo "sphere" e acrescenta ao array de leaves do grafo
 * @param {Number} id - identificador da leaf/primitiva atual
 * @param {String[]} leafArgs - array contendo os argumentos não processados desta primitiva
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.readSphere = function(id, leafArgs) {

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

	this.leaves[id] = new MySphere(this.scene, myRadius, myStacks, mySlices);

	return null;
};

/*
  _____        _____   _____ ______ _____   _____ 
 |  __ \ /\   |  __ \ / ____|  ____|  __ \ / ____|
 | |__) /  \  | |__) | (___ | |__  | |__) | (___  
 |  ___/ /\ \ |  _  / \___ \|  __| |  _  / \___ \ 
 | |  / ____ \| | \ \ ____) | |____| | \ \ ____) |
 |_| /_/    \_\_|  \_\_____/|______|_|  \_\_____/ 
												  
*/

/**
 * processa um valor booleano contido num atributo de um elemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém o valor booleano
 * @return {Boolean|NaN|null} - valor booleano se este for válido, caso contrário NaN ou null
 */
MySceneGraph.prototype.parseBoolean = function(root, attribute) {

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
 * processa coordenadas na forma (coordA, coordB, coordC) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @return {Number[]|NaN} - vetor com as coordenadas se estas forem válidas, caso contrário NaN
 */
MySceneGraph.prototype.parseNodeCoordinates = function(node, coordA, coordB, coordC) {

	if (!node.hasAttribute(coordA)) {
		onCoordinateMissing(coordA, node.nodeName);
		return NaN;
	}

	var x = this.reader.getFloat(node, coordA);

	if (!node.hasAttribute(coordB)) {
		onCoordinateMissing(coordB, node.nodeName);
		return NaN;
	}

	var y = this.reader.getFloat(node, coordB);

	if (!node.hasAttribute(coordC)) {
		onCoordinateMissing(coordC, node.nodeName);
		return NaN;
	}

	var z = this.reader.getFloat(node, coordC);

	if (x != x || y != y || z != z) {
		return NaN;
	}

	return [ x, y, z ];
};

/**
 * processa coordenadas genéricas para um vetor de tamanho variável
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @param {Number[]} coords - vetor que contém o nome das coordenadas a serem processadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
MySceneGraph.prototype.parseCoordinates = function(root, attribute, coords) {

	var error = false;
	var arr = [];
	var node = root.getElementsByTagName(attribute);

	if (node == null || node.length == 0) {
		return null;
	}

	if (node.length != 1) {
		onMultipleDefinitions(attribute, root.nodeName);
	}

	for (var i = 0; i < coords.length; i++) {

		var coordName = coords[i];

		if (!node[0].hasAttribute(coordName)) {
			onCoordinateMissing(coordName, attribute);
			return NaN;
		}

		var coordValue = this.reader.getFloat(node[0], coordName);

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
MySceneGraph.prototype.parseCoordinatesRGBA = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['r', 'g', 'b', 'a']);
};

/**
 * processa coordenadas na forma (x, y, z) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
MySceneGraph.prototype.parseCoordinatesXYZ = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['x', 'y', 'z']);
};

/**
 * processa coordenadas na forma (x, y, z, w) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
MySceneGraph.prototype.parseCoordinatesXYZW = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['x', 'y', 'z', 'w']);
};

/**
 * processa coordenadas na forma (sx, sy, sz) para um vetor
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number[]|NaN|null} - vetor com as coordenadas se estas forem válidas, caso contrário NaN ou null
 */
MySceneGraph.prototype.parseCoordinatesScale = function(root, attribute) {
	return this.parseCoordinates(root, attribute, ['sx', 'sy', 'sz']);
};

/**
 * processa um número em vírgula flutuante contido num atributo de um elemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém as coordenadas
 * @return {Number|NaN|null} - número em vírgula flutuante se este for válido, caso contrário NaN ou null
 */
MySceneGraph.prototype.parseFloat = function(root, name, attribute) {

	var node = root.getElementsByTagName(name);
	
	if (node == null || node.length == 0) {
		return null;
	}

	if (node.length != 1) {
		onMultipleDefinitions(name, root.nodeName);
	}

	if (node[0].hasAttribute(attribute)) {
		return this.reader.getFloat(node[0], attribute);
	}
	
	return null;
};

/**
 * processa uma string contida num atributo de um elemento XML
 * @param {XMLElement} root - estrutura de dados XML que contém o elemento
 * @param {String} attribute - identificador do atributo que contém a string
 * @return {String|NaN|null} - string se esta for válida, caso contrário NaN ou null
 */
MySceneGraph.prototype.parseString = function(root, name, attribute) {

	var node = root.getElementsByTagName(name);
	
	if (node == null || node.length == 0) {
		return null;
	}

	if (node.length != 1) {
		onMultipleDefinitions(name, root.nodeName);
	}

	if (node[0].hasAttribute(attribute)) {
		return this.reader.getString(node[0], attribute);
	}

	return null;
};

/*
		   _____  _____        __     _______ 
	 /\   |  __ \|  __ \     /\\ \   / / ____|
	/  \  | |__) | |__) |   /  \\ \_/ / (___  
   / /\ \ |  _  /|  _  /   / /\ \\   / \___ \ 
  / ____ \| | \ \| | \ \  / ____ \| |  ____) |
 /_/    \_\_|  \_\_|  \_\/_/    \_\_| |_____/ 
											  
*/

MySceneGraph.prototype.parseArray = function(rootElement, nodeName, parseFunc) {

	var childrenSize = rootElement.children.length;
	var parent = rootElement.nodeName;

	if (childrenSize == 0) {
		return "<" + parent + "> is empty.";
	}

	for (var i = 0; i < childrenSize; i++) {
		
		var currentElement = rootElement.children[i];
		var currentElementName = currentElement.nodeName;

		if (currentElementName == 'ROOT') {
			continue;
		}

		if (currentElementName != nodeName) {
			console.warn("WARNING: invalid tag found <" + currentElementName + "> found in <" + parent + ">, expected <" + nodeName + ">!");
			continue;
		}

		if (!currentElement.hasAttribute('id')) {
			console.warn("WARNING: <" + currentElementName + "> with index=" + i + " is missing ID!");
			continue;
		}

		var id = this.reader.getString(currentElement, 'id');
		var error = parseFunc.call(this, id, currentElement);

		if (error != null) {
			this.onXMLError(error);
		}
	}

	return null;
};

/*
  _   _  ____  _____  ______  _____ 
 | \ | |/ __ \|  __ \|  ____|/ ____|
 |  \| | |  | | |  | | |__  | (___  
 | . ` | |  | | |  | |  __|  \___ \ 
 | |\  | |__| | |__| | |____ ____) |
 |_| \_|\____/|_____/|______|_____/ 
	  
	<NODE id="ss">

		<MATERIAL id="ss" />
		<TEXTURE id="ss" />
		<TRANSLATION x="ff" y="ff" z="ff" />
		<ROTATION axis="cc" angle="ff" />
		<SCALE sx="ff" sy="ff" sz="ff" />
		<DESCENDANTS>
			<DESCENDANT id="ss" />
		</DESCENDANTS>

	</NODE>	  
*/

/** 
 * processa todas as entidades presentes no bloco <NODES> do ficheiro LSX
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <NODES>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseNodes = function (root) {

	var globalRoot = this.parseString(root, 'ROOT', 'id');
	var error = checkValue(globalRoot, 'root', root.nodeName);
	
	if (error != null) {
		return error;
	}

	this.graphRoot = globalRoot;

	if (this.verbose) {
		printHeader("NODES");
		printValues('root', 'id', globalRoot);
	}

	return this.parseArray(root, 'NODE', this.parseNode);
};

/**
 * processa uma entidade do tipo <NODE>, adicionando ao array de nodes do grafo
 * verifica se existe um node com o mesmo identificador no array de nodes
 * verifica ainda se os materiais e texturas referenciados pelo node são válidos (existem na cena)
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <NODE>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseNode = function(id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;
	var nodeMaterial = null;
	var nodeTexture = null;

	if (this.nodes[id] != undefined) {
		return onElementDuplicate(parent, id);
	}

	if (id == 'null' || id == 'clear') {
		return onReservedId(parent, id);
	}

	if (root.children[0].nodeName != 'MATERIAL') {
		return onUnexpectedTag(root.children[0].nodeName, 'MATERIAL', parent, id);
	}

	nodeMaterial = this.reader.getString(root.children[0], 'id');
	
	if (nodeMaterial == null) {
		return onAttributeMissing('MATERIAL', id, parent);
	}

	var error = checkReference(this.materials, 'MATERIAL', id, nodeMaterial);	
	
	if (error != null) {
		nodeMaterial = null;
		onXMLWarning(error);
	}

	if (root.children[1].nodeName != 'TEXTURE') {
		return onUnexpectedTag(root.children[0].nodeName, 'TEXTURE', parent, id);
	}

	nodeTexture = this.reader.getString(root.children[1], 'id');
	
	if (nodeTexture == null) {
		return onAttributeMissing('TEXTURE', id, parent);
	}

	error = checkReference(this.textures, 'TEXTURE', id, nodeTexture);	
	
	if (error != null) {
		nodeTexture = null;
		onXMLWarning(error);
	}

	if (this.verbose) {
		printHeader(parent, id);
		printValues('MATERIAL', 'id', nodeMaterial);
		printValues('TEXTURE', 'id', nodeTexture);
	}

	var node = new XMLnode(id, nodeTexture, nodeMaterial);
	var node_sz = root.children.length;

	for (var i = 2; i < node_sz; i++) {
	
		var child = root.children[i];
		var error = null;

		if (child.nodeName == 'TRANSLATION') {
			error = this.parseNodeTranslation(child, node);
		}
		else if (child.nodeName == 'ROTATION') {
			error = this.parseNodeRotation(child, node);
		}
		else if (child.nodeName == 'SCALE') {
			error = this.parseNodeScale(child, node);
		}
		else if (child.nodeName == 'DESCENDANTS') {
			break;
		}
		else {
			error = onUnexpectedTag(child.nodeName, 'TRANSLATION/ROTATION/SCALE/DESCENDANTS', parent, id);
		}

		if (error != null) {
			onXMLWarning(error);
		}
	}

	var nodeDescendants = root.getElementsByTagName('DESCENDANTS');

	if (nodeDescendants == null || nodeDescendants.length == 0) {
		return onAttributeMissing('DESCENDANTS', id, parent);
	}

	if (nodeDescendants.length != 1) {
		onMultipleElements('DESCENDANTS', parent);
	}

	nodeDescendants = nodeDescendants[0].children;
	
	if (nodeDescendants.length == 0) {
		return "<NODE> with id=" + id + " has zero descendants, skipping...";
	}

	if (this.verbose) {
		console.log("\t\tDESCENDANTS:");
	}

	for (var i = 0; i < nodeDescendants.length; i++) {
		
		var childId = this.reader.getString(nodeDescendants[i], 'id', true);
		
		if (childId == null) {
			onXMLWarning(onAttributeMissing('id', id, parent));
			continue;
		}

		node.addChild(childId);
		
		if (this.verbose) {
			console.log("\t\t\t id=" + childId);
		}
	}

	this.nodes[id] = node;

	return null;
};

/*
  _      _____ _____ _    _ _______ _____ 
 | |    |_   _/ ____| |  | |__   __/ ____|
 | |      | || |  __| |__| |  | | | (___  
 | |      | || | |_ |  __  |  | |  \___ \ 
 | |____ _| || |__| | |  | |  | |  ____) |
 |______|_____\_____|_|  |_|  |_| |_____/ 

	<LIGHT id="ss">
		<enable value ="tt" />
		<position x="ff" y="ff" z="ff" w="ff" />
		<ambient r="ff" g="ff" b="ff" a="ff" />
		<diffuse r="ff" g="ff" b="ff" a="ff" />
		<specular r="ff" g="ff" b="ff" a="ff" />
	</LIGHT>

*/

/**
 * processa todas as entidades presentes no bloco <LIGHTS> do ficheiro LSX
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <LIGHTS>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseLights = function(root) {
	return this.parseArray(root, 'LIGHT', this.parseLight);
};

/**
 * processa uma entidade do tipo <LIGHT>, adicionando ao array de luzes do grafo
 * verifica ainda se existe uma luz com o mesmo identificador no array de luzes
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <LIGHT>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseLight = function(id, root) {

	var parseErrors = 0;
	var parent = root.nodeName;

	if (this.lights[id] != undefined) {
		return onElementDuplicate(parent, id);
	}

	if (this.scene.getActiveLights() == this.scene.getNumberLights()) {
		return onMaximumLights(this.scene.getNumberLights());
	}

	if (id == 'null' || id == 'clear') {
		return onReservedId(parent, id);
	}

	var lightEnabled = this.parseBoolean(root, 'enable');
	var error = checkValue(lightEnabled, 'enable', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightPosition = this.parseCoordinatesXYZW(root, 'position');
	error = checkValue(lightPosition, 'position', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightAmbient = this.parseCoordinatesRGBA(root, 'ambient');
	error = checkValue(lightAmbient, 'ambient', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightDiffuse = this.parseCoordinatesRGBA(root, 'diffuse');
	error = checkValue(lightDiffuse, 'diffuse', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var lightSpecular = this.parseCoordinatesRGBA(root, 'specular');
	error = checkValue(lightSpecular, 'specular', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}

	this.lights[id] = this.scene.pushLight(id, lightEnabled, lightPosition, lightAmbient, lightDiffuse, lightSpecular);

	if (this.verbose) {
		printHeader('LIGHT', id);
		printValues('enable', 'value', lightEnabled);
		printXYZW('position', lightPosition);
		printRGBA('ambient', lightAmbient);
		printRGBA('diffuse', lightDiffuse);
		printRGBA('specular', lightSpecular);
	}

	return null;
};

/*
  __  __       _______ ______ _____  _____          _       _____ 
 |  \/  |   /\|__   __|  ____|  __ \|_   _|   /\   | |     / ____|
 | \  / |  /  \  | |  | |__  | |__) | | |    /  \  | |    | (___  
 | |\/| | / /\ \ | |  |  __| |  _  /  | |   / /\ \ | |     \___ \ 
 | |  | |/ ____ \| |  | |____| | \ \ _| |_ / ____ \| |____ ____) |
 |_|  |_/_/    \_\_|  |______|_|  \_\_____/_/    \_\______|_____/ 

	<MATERIAL id="ss">
		<shininess value="ff" />
		<specular r="ff" g="ff" b="ff" a="ff" />
		<diffuse r="ff" g="ff" b="ff" a="ff" />
		<ambient r="ff" g="ff" b="ff" a="ff" />
		<emission r="ff" g="ff" b="ff" a="ff" />
	</MATERIAL>

*/

/**
 * processa todas as entidades presentes no bloco <MATERIALS>
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <MATERIALS>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseMaterials = function(root) {
	return this.parseArray(root, 'MATERIAL', this.parseMaterial);
};

/**
 * processa uma entidade do tipo <MATERIAL>, adicionando ao array de materiais do grafo
 * verifica ainda se existe um material com o mesmo identificador no array de materiais
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <MATERAIL>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseMaterial = function(id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	if (this.materials[id] != undefined) {
		return onElementDuplicate(parent, id);
	}

	if (id == 'null' || id == 'clear') {
		return onReservedId(parent, id);
	}

	var materialShininess = this.parseFloat(root, 'shininess', 'value');
	var error = checkValue(materialShininess, 'shininess', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var materialSpecular = this.parseCoordinatesRGBA(root, 'specular');
	error = checkValue(materialSpecular, 'specular', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var materialDiffuse = this.parseCoordinatesRGBA(root, 'diffuse');
	error = checkValue(materialDiffuse, 'diffuse', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var materialAmbient = this.parseCoordinatesRGBA(root, 'ambient');
	error = checkValue(materialAmbient, 'ambient', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var materialEmission = this.parseCoordinatesRGBA(root, 'emission');
	error = checkValue(materialEmission, 'emission', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}

	var myMaterial = new CGFappearance(this.scene);

	myMaterial.setAmbient(materialAmbient[0], materialAmbient[1], materialAmbient[2], materialAmbient[3]);
	myMaterial.setDiffuse(materialDiffuse[0], materialDiffuse[1], materialDiffuse[2], materialDiffuse[3]);
	myMaterial.setEmission(materialEmission[0], materialEmission[1], materialEmission[2], materialEmission[3]);
	myMaterial.setSpecular(materialSpecular[0], materialSpecular[1], materialSpecular[2], materialSpecular[3]);
	myMaterial.setShininess(materialShininess);
	myMaterial.setTextureWrap("REPEAT", "REPEAT");

	this.materials[id] = myMaterial;

	if (this.verbose) {
		printHeader('MATERIAL', id);
		printValues('shininess', 'value', materialShininess);
		printRGBA('specular', materialSpecular);
		printRGBA('diffuse', materialDiffuse);
		printRGBA('ambient', materialAmbient);
		printRGBA('emission', materialEmission);
	}

	return null;
};

/*
  _______ ________   _________ _    _ _____  ______  _____ 
 |__   __|  ____\ \ / /__   __| |  | |  __ \|  ____|/ ____|
	| |  | |__   \ V /   | |  | |  | | |__) | |__  | (___  
	| |  |  __|   > <    | |  | |  | |  _  /|  __|  \___ \ 
	| |  | |____ / . \   | |  | |__| | | \ \| |____ ____) |
	|_|  |______/_/ \_\  |_|   \____/|_|  \_\______|_____/ 

	<TEXTURE id="ss">
		<file path="ss" />
		<amplif_factor s="ff" t="ff" />
	</TEXTURE>

*/

/**
 * processa todas as entidades presentes no bloco <TEXTURES>
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <TEXTURES>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseTextures = function(rootElement) {
	return this.parseArray(rootElement, 'TEXTURE', this.parseTexture);
};

/**
 * processa uma entidade do tipo <TEXTURE>, adicionando ao array de texturas do grafo
 * verifica ainda se existe uma textura com o mesmo identificador no array de texturas
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <TEXTURE>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseTexture = function(id, root)
{
	var parent = root.nodeName;
	var parseErrors = 0;

	if (this.textures[id] != undefined) {
		return onElementDuplicate(parent, id);
	}

	if (id == 'null' || id == 'clear') {
		return onReservedId(parent, id);;
	}

	var texturePath = this.parseString(root, 'file', 'path');
	
	if (texturePath == null) {
		return onAttributeMissing('file', id, parent);
	}

	if (!checkUrl(this.scenePath + texturePath)) {
		return onURLInvalid('file', id, parent);
	}

	var textureS = this.parseFloat(root, 'amplif_factor', 's');
	var error = checkValue(textureS, 'amplification factor S', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	var textureT = this.parseFloat(root, 'amplif_factor', 't');
	var error = checkValue(textureT, 'amplification factor T', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}

	var textureObject = new CGFtexture(this.scene, this.scenePath + texturePath);
	this.textures[id] = new XMLtexture(textureObject, textureS, textureT);

	if (this.verbose) {
		printHeader('TEXTURE', id);
		printValues('file', 'path', texturePath);
		printValues('amplif_factor', 's', textureS, 't', textureT);
	}

	return null;
};

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
 * processa todas as entidades presentes no bloco <LEAVES>
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <LEAVES>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseLeaves = function(root) {
	return this.parseArray(root, 'LEAF', this.parseLeaf);
};

/**
 * processa uma entidade do tipo <LEAF>, adicionando ao array de leaves do grafo
 * verifica ainda se existe uma leaf com o mesmo identificador no array
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <LEAF>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseLeaf = function(id, root) {

	var parent = root.nodeName;

	if (this.leaves[id] != undefined) {
		return onElementDuplicate(parent, id);
	}

	if (!root.hasAttribute('type')) {
		return onAttributeMissing('type', id, parent);
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
	else if (leafType == 'cylinder') {
		error = this.readCylinder(id, leafArgs);
	}
	else if (leafType == 'sphere') {
		error = this.readSphere(id, leafArgs);
	}
	else {
		onAttributeInvalid('type', id, parent);
		return;
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

/*
   _____ _      ____  ____          _       _____ 
  / ____| |    / __ \|  _ \   /\   | |     / ____|
 | |  __| |   | |  | | |_) | /  \  | |    | (___  
 | | |_ | |   | |  | |  _ < / /\ \ | |     \___ \ 
 | |__| | |___| |__| | |_) / ____ \| |____ ____) |
  \_____|______\____/|____/_/    \_\______|_____/ 

	<GLOBALS>
		<frustum near="ff" far="ff" />	
		<translation x="ff" y="ff" z="ff"/>
		<rotation axis="x" angle="ff" />
		<rotation axis="y" angle="ff" />
		<rotation axis="z" angle="ff" />
		<scale sx="ff" sy="ff" sz="ff" />
		<reference length="ff" />
	</GLOBALS>

*/

/**
 * processa todas as entidades presentes no bloco <INITIALS>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <INITIALS>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseGlobals = function(root) {

	var parent = root.nodeName;
	var parseErrors = 0;
	
	var globalFrustumNear = this.parseFloat(root, 'frustum', 'near');
	var error = checkValue(globalFrustumNear, 'near', 'frustum');
	if (error != null) {
		return error;
	}

	var globalFrustumFar = this.parseFloat(root, 'frustum', 'far');
	error = checkValue(globalFrustumFar, 'far', 'frustum');
	if (error != null) {
		return error;
	}

	var globalReference = this.parseFloat(root, 'reference', 'length');
	error = checkValue(globalReference, 'length', 'reference');
	if (error != null) {
		return error;
	}

	var globalScale = this.parseCoordinatesScale(root, 'scale');
	error = checkValue(globalScale, 'scale', parent);
	if (error != null) {
		return error;
	}

	var globalTranslate = this.parseCoordinatesXYZ(root, 'translation');
	error = checkValue(globalTranslate, 'translation', parent);
	if (error != null) {
		return error;
	}
	
	var node = root.getElementsByTagName('rotation');
	var node_sz = node.length;

	if (node == null || node_sz == 0) {
		return this.onElementMissing('rotation', parent);
	}

	if (node_sz > 3) {
		console.warn("WARNING: more than three rotations found in <INITIALS>.");
	}
	
	var axisFound = {
		'x': false, 
		'y': false,
		'z': false
	};

	var j = 0;

	for (var i = 0; i < node_sz; i++) {

		var axis = this.reader.getString(node[i], 'axis');
		error = checkValue(axis, 'rotation axis', parent);
		
		if (error != null) {
			return error;
		}

		if (axis != 'x' && axis != 'y' && axis != 'z') {
			onUnknownAxis(axis, node[i].nodeName, parent);
			continue;
		}

		if (axisFound[axis]) {
			onMultipleAxis(axis);
			continue;
		}

		var angle = this.reader.getFloat(node[i], 'angle');
		error = checkValue(angle, 'rotation angle', parent);

		if (error != null) {
			return error;
		}

		axisFound[axis] = true;

		this.scene.setRotation(j++, axis, angle);
	}

	if (!axisFound['x']) {
		return "X axis rotation is missing from <INITIALS>";
	}

	if (!axisFound['y']) {
		return "Y axis rotation is missing from <INITIALS>";
	}

	if (!axisFound['z']) {
		return "Z axis rotation is missing from <INITIALS>";
	}

	this.scene.initAxis(globalReference);
	this.scene.initFrustum(globalFrustumNear, globalFrustumFar);
	this.scene.initScale(globalScale);
	this.scene.initTranslate(globalTranslate);

	if (this.verbose) {
		printHeader('INITIALS');
		printValues('frustum', 'near', globalFrustumNear, 'far', globalFrustumFar);
		printXYZ('translate', globalTranslate);
		printValues('rotation', 'axis', this.scene.defaultRotationAxis[0], 'angle', this.scene.defaultRotationAngle[0]);
		printValues('rotation', 'axis', this.scene.defaultRotationAxis[1], 'angle', this.scene.defaultRotationAngle[1]);
		printValues('rotation', 'axis', this.scene.defaultRotationAxis[2], 'angle', this.scene.defaultRotationAngle[2]);
		printXYZ('scale', globalScale);
		printValues('reference', 'length', globalReference);
	}
	
	return null;
};

/**
 * determina o número de arestas incidentes em cada nó do grafo de cena
 * visita todos os nós existentes no grafo, incrementando em uma unidade o indegree dos seus descendentes
 * @return {null} 
 */
MySceneGraph.prototype.resetIndegree = function() {
	for (var node in this.nodes) {
		var children = this.nodes[node].children;
		for (var i = 0; i < children.length; i++) {
			if (children[i] in this.nodes) {
				this.nodes[children[i]].indegree++;
			}
		}
	}
};

/**
 * remove todos os nós isolados e sem descendentes do grafo de cena
 * 1. procura por nós órfãos (com indegree = 0) e remove-os do grafo
 * 2. procura todos os nós por descendentes com referências a nós inválidos e remove-os do grafo
 * 3. procura por nós sem um único descendente (com children.length == 0) e remove-os do grafo
 * (repete enquanto houver nós isolados ou nós com referências inválidas causadas por apagar nós anteriormente)
 * @return {null} 
 */
MySceneGraph.prototype.validateNodes = function() {

	var ready = false;

	while (!ready) {

		ready = true;

		for (var node in this.nodes) {

			var children = this.nodes[node].children;
			var nodeIndegree = this.nodes[node].indegree;
			this.onVisitNode(node, this.nodes[node].indegree);

			if (nodeIndegree == 0 && node != this.graphRoot) {
				ready = false;	
				this.onProcessNode("Deleting", node);	
				delete this.nodes[node];
				continue;		
			}

			for (var n = 0; n < children.length; n++) {
				if (!(children[n] in this.leaves) && !(children[n] in this.nodes) && children[n] != node) {	
					this.onEraseChildren(children[n], node);
					children.splice(n, 1);
					n--;
				}
			}

			if (children.length == 0) {
				ready = false;
				this.onProcessNode("Erasing", node);
				delete this.nodes[node];
			}
		}
	}
};

MySceneGraph.prototype.onEraseChildren = function(node, parent)	{
	this.verbose &&	console.log("[VALIDATE NODES] Erasing reference with id=" + node + " from node id=" + parent);
};

MySceneGraph.prototype.onProcessNode = function(message, id) {
	this.verbose &&	console.log("[VALIDATE NODES] " + message + ": " + id);
};

MySceneGraph.prototype.onVisitNode = function(node, indegree) {
	this.verbose && console.log("[VALIDATE NODES] Processing: " + node + ", indegree=" + indegree);
};

MySceneGraph.prototype.onInvalidRoot = function(root) {
	this.onXMLError("invalid graph root '" + root + "'' not found in <NODES>!");
};

MySceneGraph.prototype.onXMLError = function(message) {
	console.error("XML Loading ERROR: " + message);	
	this.loadedOk = false;
};