/*
   _____ _      ____  ____          _       _____
  / ____| |    / __ \|  _ \   /\   | |     / ____|
 | |  __| |   | |  | | |_) | /  \  | |    | (___
 | | |_ | |   | |  | |  _ < / /\ \ | |     \___ \
 | |__| | |___| |__| | |_) / ____ \| |____ ____) |
  \_____|______\____/|____/_/    \_\______|_____/

	<INITIALS>
		<frustum near="ff" far="ff" />
		<translation x="ff" y="ff" z="ff"/>
		<rotation axis="x" angle="ff" />
		<rotation axis="y" angle="ff" />
		<rotation axis="z" angle="ff" />
		<scale sx="ff" sy="ff" sz="ff" />
		<reference length="ff" />
	</INITIALS>
*/

/**
 * construtor por omissão da classe 'GlobalsParser'
 * @constructor
 * @author Diogo Marques
 * @param {CGFxmlReader} reader
 * @param {CGFscene} scene
 * @return {null}
 */
function GlobalsParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

GlobalsParser.prototype = Object.create(BaseParser.prototype);
GlobalsParser.prototype.constructor = GlobalsParser;

/**
 * processa todas as entidades presentes no bloco <INITIALS>
 * @param {XMLElement} root - estrutura de dados XML que contém as entidades descendentes de <INITIALS>
 * @param {Number} id - identificador do elemento a ser processado
 * @return {String|null} - null se a função terminar com sucesso, caso contrário retorna uma mensagem de erro
 */
GlobalsParser.prototype.parse = function(root, id) {

	var parseErrors = 0;
	var globalFrustumNear = this.parseFloat(root, 'frustum', 'near');
	var error = checkValue(globalFrustumNear, 'near', 'frustum');

	if (error != null) {
		return error;
	}

	var globalFrustumFar = this.parseFloat(root, 'frustum', 'far');
	var error = checkValue(globalFrustumFar, 'far', 'frustum');

	if (error != null) {
		return error;
	}

	var globalReference = this.parseFloat(root, 'reference', 'length');
	var error = checkValue(globalReference, 'length', 'reference');

	if (error != null) {
		return error;
	}

	var globalScale = this.parseCoordinatesScale(root, 'scale');
	var error = checkValue(globalScale, 'scale', root.nodeName);

	if (error != null) {
		return error;
	}

	var globalTranslate = this.parseCoordinatesXYZ(root, 'translation');
	var error = checkValue(globalTranslate, 'translation', root.nodeName);

	if (error != null) {
		return error;
	}

	var node = root.getElementsByTagName('rotation');
	var node_sz = node.length;

	if (node == null || node_sz == 0) {
		return onElementMissing('rotation', root.nodeName);
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
		error = checkValue(axis, 'rotation axis', root.nodeName);

		if (error != null) {
			return error;
		}

		if (axis != 'x' && axis != 'y' && axis != 'z') {
			onUnknownAxis(axis, node[i].nodeName, root.nodeName);
			continue;
		}

		if (axisFound[axis]) {
			onMultipleAxis(axis);
			continue;
		}

		var angle = this.reader.getFloat(node[i], 'angle');
		error = checkValue(angle, 'rotation angle', root.nodeName);

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
};