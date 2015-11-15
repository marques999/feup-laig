/**
 * construtor default da classe 'MySceneGraph'
 * @constructor
 * @author Carlos Samouco, Diogo Marques
 * @param {String} filename - caminho relativo do ficheiro LSX
 * @param {XMLscene} scene - apontador para uma XMLscene onde o grafo será apresentado
 * @return {null}
 */
function MySceneGraph(filename, scene) {

	this.loadedOk = null;
	this.scene = scene;
	this.verbose = true;

	scene.graph = this;

	this.animations = {};
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

	var rootElement = this.reader.xmlDoc.documentElement;
	this.animationParser = new AnimationParser(this.reader, this.scene);
	this.globalsParser = new GlobalsParser(this.reader, this.scene);
	this.illuminationParser = new IlluminationParser(this.reader, this.scene);
	this.leafParser = new LeafParser(this.reader, this.scene);
	this.lightParser = new LightParser(this.reader, this.scene);
	this.materialParser = new MaterialParser(this.reader, this.scene);
	this.nodeParser = new NodeParser(this.reader, this);
	this.textureParser = new TextureParser(this.reader, this.scene);

	var rootParsers = {
		'INITIALS': this.parseGlobals,
		'ILLUMINATION': this.parseIllumination,
		'LIGHTS': this.parseLights,
		'MATERIALS': this.parseMaterials,
		'TEXTURES': this.parseTextures,
		'ANIMATIONS': this.parseAnimations,
		'LEAVES': this.parseLeaves,
		'NODES': this.parseNodes,
	};

	var requiredElements = {
		'INITIALS': true,
		'ILLUMINATION': true,
		'LIGHTS': true,
		'MATERIALS': false,
		'TEXUTRES': false,
		'ANIMATIONS': false,
		'LEAVES': true,
		'NODES': true,
	};

	for (var current in rootParsers) {

		var currentElement = rootElement.getElementsByTagName(current);

		if (currentElement == null || currentElement.length == 0) {

			if (!requiredElements[current]) {
				continue;
			}

			this.onXMLError(onElementMissing(current, 'SCENE'));

			return false;
		}

		if (currentElement.length != 1) {
			onMultipleElements(current, 'SCENE');
		}

		var error = rootParsers[current].call(this, currentElement[0]);

		if (error != null) {
			this.onXMLError(error);
			return false;
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

	var animationMatrix = node.applyAnimation();

	if (animationMatrix != null) {
		mat4.multiply(animationMatrix,animationMatrix, node.matrix);
	}
	else {
		animationMatrix = node.matrix
	}

	this.scene.multMatrix(animationMatrix);

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

/**
 * atualiza o estado das animações associadas aos nodes do grafo
 * @param {Number} deltaTime - intervalo de tempo decorrido desde o último update
 * @return {null}
 */
MySceneGraph.prototype.processAnimations = function(deltaTime) {

	for (var node in this.nodes) {
		this.nodes[node].updateAnimation(deltaTime);
	}
};

/**
 * altera o modo de reprodução em todas as animações dos nodes do grafo
 * @param {Boolean} loopValue - "true" repete as animações, "false" para não repetir
 * @return {null}
 */
MySceneGraph.prototype.setAnimationLoop = function(loopValue) {

	for (var node in this.nodes) {
		this.nodes[node].setLoop(loopValue);
	}
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

	for (var i = 0; i < childrenSize; i++) {

		var currentElement = rootElement.children[i];
		var currentElementName = currentElement.nodeName;

		if (currentElementName == 'ROOT') {
			continue;
		}

		if (currentElementName != nodeName) {
			console.warn("WARNING: invalid tag found <" + currentElementName + "> found in <" + rootElement.nodeName + ">, expected <" + nodeName + ">!");
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
};

/**
 * processa todas as entidades presentes no bloco <NODES> do ficheiro LSX
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <NODES>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseNodes = function(root) {

	var globalRoot = this.parseString(root, 'ROOT', 'id');
	var error = checkValue(globalRoot, 'root', root.nodeName);

	if (error != null) {
		return error;
	}

	this.graphRoot = globalRoot;
	return this.parseArray(root, 'NODE', this.parseNode);
};

/**
 * verifica se um determinado elemento existe num array associativo
 * @param {Number} nodeId - identificador do node que referencia esse elemento
 * @param {Number} objectId - identificador do elemento
 * @param {Number} parent - tipo de dados do elemento
 * @param {Object[]} myArray - array associativo a ser pesquisado
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.checkReference = function(nodeId, objectId, parent, myArray) {

	if (objectId != 'null' && objectId != 'clear' && myArray[objectId] == undefined) {
		return "<NODE> with id=" + nodeId + " references <" + parent + "> id=" + objectId + " which doesn't exist, reverting to defaults...";
	}
}
/**
 * verifica se uma determinada animação existe no array de animações
 * @param {Number} nodeId - identificador do node que referencia a animação
 * @param {Number} objectId - identificador da animação
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.checkAnimationReference = function(nodeId, objectId) {
	return this.checkReference(nodeId, objectId, 'ANIMATION', this.animations);
}

/**
 * verifica se um determinado material existe no array de materiais
 * @param {Number} nodeId - identificador do node que referencia o material
 * @param {Number} objectId - identificador do material
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.checkMaterialReference = function(nodeId, objectId) {
	return this.checkReference(nodeId, objectId, 'MATERIAL', this.materials);
};

/**
 * verifica se uma determinada textura existe no array de texturas
 * @param {Number} nodeId - identificador do node que referencia a textura
 * @param {Number} objectId - identificador da textura
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.checkTextureReference = function(nodeId, objectId) {
	return this.checkReference(nodeId, objectId, 'TEXUTRE', this.textures);
};

/**
 * processa todas as entidades presentes no bloco <ANIMATIONS> do ficheiro LSX
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <ANIMATIONS>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseAnimations = function(root) {
	return this.parseArray(root, 'ANIMATION', this.parseAnimation);
};

/**
 * processa todas as entidades presentes no bloco <INITIALS>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <INITIALS>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseGlobals = function(root) {
	return this.globalsParser.parse(root, 0);
};

/**
 * processa todas as entidades presentes no bloco <ILLUMINATION> do ficheiro LSX
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <ILLUMINATION>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseIllumination = function(root) {
	return this.illuminationParser.parse(root, 0);
};

/**
 * processa todas as entidades presentes no bloco <LEAVES>
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <LEAVES>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseLeaves = function(root) {
	return this.parseArray(root, 'LEAF', this.parseLeaf);
};

/**
 * processa todas as entidades presentes no bloco <LIGHTS> do ficheiro LSX
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <LIGHTS>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseLights = function(root) {
	return this.parseArray(root, 'LIGHT', this.parseLight);
};

/**
 * processa todas as entidades presentes no bloco <MATERIALS>
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <MATERIALS>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseMaterials = function(root) {
	return this.parseArray(root, 'MATERIAL', this.parseMaterial);
};

/**
 * processa todas as entidades presentes no bloco <TEXTURES>
 * @param {XMLelement} root - estrutura de dados XML que contém as entidades descendentes de <TEXTURES>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseTextures = function(rootElement) {
	return this.parseArray(rootElement, 'TEXTURE', this.parseTexture);
};

/**
 * processa uma entidade do tipo <NODE>, adicionando ao array de nodes do grafo
 * verifica se existe um node com o mesmo identificador no array de nodes
 * verifica ainda se os materiais e texturas referenciados pelo node são válidos (existem na cena)
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <NODE>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseNode = function(id, root) {

	if (this.nodes[id] != undefined) {
		return onElementDuplicate(root.nodeName, id);
	}

	var error = this.nodeParser.parse(root, id);
	if (error != null) {
		return error;
	}

	var newNode = this.nodeParser.result;
	var error = this.checkMaterialReference(id, newNode.materialId);

	if (error != null) {
		newNode.materialId = null;
		onXMLWarning(error);
	}

	error = this.checkTextureReference(id, newNode.textureId);

	if (error != null) {
		newNode.textureId = null;
		onXMLWarning(error);
	}

	this.nodes[id] = newNode;
};

/**
 * processa uma entidade do tipo <LIGHT>, adicionando ao array de luzes do grafo
 * verifica ainda se existe uma luz com o mesmo identificador no array de luzes
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <LIGHT>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseLight = function(id, root) {

	if (this.lights[id] != undefined) {
		return onElementDuplicate(root.nodeName, id);
	}

	if (this.scene.getActiveLights() == this.scene.getNumberLights()) {
		return onMaximumLights(this.scene.getNumberLights());
	}

	var error = this.lightParser.parse(root, id);
	if (error != null) {
		return error;
	}

	this.lights[id] = this.lightParser.result;
};

/**
 * processa uma entidade do tipo <ANIMATION>, adicionando ao array de animações do grafo
 * verifica ainda se existe uma animação com o mesmo identificador no array de animações
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <ANIMATION>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseAnimation = function(id, root) {

	if (this.animations[id] != undefined) {
		return onElementDuplicate(root.nodeName, id);
	}

	var error = this.animationParser.parse(root, id);
	if (error != null) {
		return error;
	}

	this.animations[id] = this.animationParser.result;
};

/**
 * processa uma entidade do tipo <MATERIAL>, adicionando ao array de materiais do grafo
 * verifica ainda se existe um material com o mesmo identificador no array de materiais
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <MATERAIL>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseMaterial = function(id, root) {

	if (this.materials[id] != undefined) {
		return onElementDuplicate(root.nodeName, id);
	}

	var error = this.materialParser.parse(root, id);
	if (error != null) {
		return error;
	}

	this.materials[id] = this.materialParser.result;
};

/**
 * processa uma entidade do tipo <TEXTURE>, adicionando ao array de texturas do grafo
 * verifica ainda se existe uma textura com o mesmo identificador no array de texturas
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <TEXTURE>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseTexture = function(id, root) {

	if (this.leaves[id] != undefined) {
		return onElementDuplicate(root.nodeName, id);
	}

	var error = this.textureParser.parse(root, id, this.scenePath);
	if (error != null) {
		return error;
	}

	this.textures[id] = this.textureParser.result;
};

/**
 * processa uma entidade do tipo <LEAF>, adicionando ao array de leaves do grafo
 * verifica ainda se existe uma leaf com o mesmo identificador no array
 * @param {XMLelement} root - estrutura de dados XML que contém os atributos de <LEAF>
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
MySceneGraph.prototype.parseLeaf = function(id, root) {

	if (this.leaves[id] != undefined) {
		return onElementDuplicate(root.nodeName, id);
	}

	var error = this.leafParser.parse(root, id);
	if (error != null) {
		return error;
	}

	this.leaves[id] = this.leafParser.result;
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
			if (this.nodes[children[i]] != undefined) {
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

			if (nodeIndegree == 0 && node != this.graphRoot) {
				ready = false;
				this.onProcessNode("Erasing", node);
				delete this.nodes[node];
				continue;
			}

			for (var n = 0; n < children.length; n++) {
				var currentChild = children[n];
				if (this.leaves[currentChild] == undefined && this.nodes[currentChild] == undefined && currentChild != node) {
					this.onEraseChildren(currentChild, node);
					children.splice(n--, 1);
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