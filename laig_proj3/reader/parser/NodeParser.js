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
 * construtor por omissão da classe 'NodeParser'
 * @constructor
 * @author Diogo Marques
 * @param {CGFxmlReader} reader
 * @param {CGFscene} scene
 * @return {null}
 */
function NodeParser(reader, graph) {
	BaseParser.call(this, reader, graph);
};

NodeParser.prototype = Object.create(BaseParser.prototype);
NodeParser.prototype.constructor = NodeParser;

/**
 * processa uma determinada entidade presente no bloco <NODES>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <NODES>
 * @param {Number} id - identificador do elemento a ser processado
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
NodeParser.prototype.parse = function(root, id) {

	var parent = root.nodeName;
	var xmlIndex = 2;
	var parseErrors = 0;
	var nodeMaterial = null;
	var nodeTexture = null;

	if (id == 'null' || id == 'clear') {
		return onReservedId(id, parent);
	}

	if (root.children[0].nodeName != 'MATERIAL') {
		return onUnexpectedTag(root.children[0].nodeName, 'MATERIAL', parent, id);
	}

	nodeMaterial = this.reader.getString(root.children[0], 'id');

	if (nodeMaterial == null) {
		return onAttributeMissing('MATERIAL', id, parent);
	}

	if (root.children[1].nodeName != 'TEXTURE') {
		return onUnexpectedTag(root.children[0].nodeName, 'TEXTURE', parent, id);
	}

	nodeTexture = this.reader.getString(root.children[1], 'id');

	if (nodeTexture == null) {
		return onAttributeMissing('TEXTURE', id, parent);
	}

	if (this.verbose) {
		printHeader(parent, id);
		printValues('MATERIAL', 'id', nodeMaterial);
		printValues('TEXTURE', 'id', nodeTexture);
	}

	var node = new XMLnode(id, nodeTexture, nodeMaterial);
	var node_sz = root.children.length;

	if (root.children[2].nodeName == 'ANIMATIONREF') {

		xmlIndex++;

		var error = this.parseAnimations(root, node);

		if (error != null) {
			return error;
		}
	}

	for (; xmlIndex < node_sz; xmlIndex++) {

		var child = root.children[xmlIndex];
		var error = null;

		if (child.nodeName == 'TRANSLATION') {
			error = this.parseTranslation(child, node);
		}
		else if (child.nodeName == 'ROTATION') {
			error = this.parseRotation(child, node);
		}
		else if (child.nodeName == 'SCALE') {
			error = this.parseScale(child, node);
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

	error = this.parseDescendants(root, node);

	if (error != null) {
		return error;
	}

	this.result = node;
};

/**
 * processa uma animação presente num bloco <NODE>
 * @param {XMLElement} root - estrutura que dados XML que contém o atributo <animation>
 * @param {XMLnode} node - estrutura de dados que contém as informações do nó atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
NodeParser.prototype.parseAnimations = function(root, node) {

	var nodeAnimation = root.getElementsByTagName('ANIMATIONREF');

	if (nodeAnimation == null || nodeAnimation.length == 0) {
		return null;
	}

	if (nodeAnimation.length != 1) {
		onMultipleElements('ANIMATIONREF', parent);
	}

	nodeAnimation = nodeAnimation[0].children;

	if (nodeAnimation.length == 0) {
		return null;
	}

	if (this.verbose) {
		console.log("\t\tANIMATIONREF:");
	}

	for (var i = 0; i < nodeAnimation.length; i++) {

		var thisAnimation = nodeAnimation[i];

		if (!thisAnimation.hasAttribute('id')) {
			onAttributeMissingWarn('animation id', node.id, root.nodeName);
			continue;
		}

		var animationId = this.reader.getString(thisAnimation, 'id');
		var error = checkValue(animationId, 'id', thisAnimation.nodeName, node.id);

		if (error != null) {
			onXMLWarning(error);
			continue;
		}

		error = this.scene.checkAnimationReference(node.id, animationId);

		if (error != null) {
			onXMLWarning(error);
			continue;
		}

		node.addAnimation(this.scene.animations[animationId]);

		if (this.verbose) {
			console.log("\t\t\t id=" + animationId);
		}
	}
};

/**
 * processa um escalamento presente num bloco <NODE>
 * @param {XMLElement} root - estrutura que dados XML que contém o atributo <scale>
 * @param {XMLnode} node - estrutura de dados que contém as informações do nó atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
NodeParser.prototype.parseScale = function(root, node) {

	var coords = this.parseCoordinatesScale(root, null);
	var error = checkValue(coords, 'coordinates', root.nodeName, node.id);

	if (error != null) {
		return error;
	}

	node.scale(coords);

	if (this.verbose) {
		printXYZ('SCALE', coords);
	}
};

/**
 * processa uma translação presente num bloco <NODE>
 * @param {XMLElement} root - estrutura que dados XML que contém o atributo <translation>
 * @param {XMLnode} node - estrutura de dados que contém as informações do nó atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
NodeParser.prototype.parseTranslation = function(root, node) {

	var coords = this.parseCoordinatesXYZ(root, null);
	var error = checkValue(coords, 'coordinates', root.nodeName, node.id);

	if (error != null) {
		return error;
	}

	node.translate(coords);

	if (this.verbose) {
		printXYZ('TRANSLATION', coords);
	}
};

/**
 * processa todos os descendentes presentes num bloco <NODE>
 * @param {XMLElement} root - estrutura que dados XML que contém o atributo <DESCENDANTS>
 * @param {XMLnode} node - estrutura de dados que contém as informações do nó atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
NodeParser.prototype.parseDescendants = function(root, node) {

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
			onAttributeMissingWarn('id', id, parent);
			continue;
		}

		node.addChild(childId);

		if (this.verbose) {
			console.log("\t\t\t id=" + childId);
		}
	}
}

/**
 * processa uma rotação presente num bloco <NODE>
 * @param {XMLelement} root - estrutura que dados XML que contém o atributo <rotation>
 * @param {XMLnode} node - estrutura de dados que contém as informações do nó atual
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
NodeParser.prototype.parseRotation = function(root, node) {

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
	var error = checkValue(angle, 'angle', parent, node.id);

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
};