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
 * construtor default da classe 'GlobalsParser'
 * @constructor
 * @author Diogo Marques
 * @return {null}
 */
function GlobalsParser(reader, scene) {
	BaseParser.call(this, reader, scene);
};

GlobalsParser.prototype = Object.create(BaseParser.prototype);
GlobalsParser.prototype.constructor = GlobalsParser;

GlobalsParser.prototype.parse = function(root, id) {

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
		return onElementMissing('rotation', parent);
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