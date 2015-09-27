function MySceneGraph(filename, scene) {
	
	this.loadedOk = null;
	this.scene = scene;
	this.verbose = true;

	scene.graph = this;

	this.textures = {};
	this.lights = {};
	this.materials = {};
	this.leaves = {};

	this.primitiveTypes = [ 'rectangle', 'cylinder', 'sphere', 'triangle' ];
	this.axisTypes = ['x', 'y', 'z'];
	
	this.reader = new CGFXMLreader();
	this.reader.open('scenes/' + filename, this);  
}

MySceneGraph.prototype.onXMLReady = function() 
{
	var rootElement = this.reader.xmlDoc.documentElement;	

	var rootTags = [
		'INITIALS',
		'ILUMINATION',
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
			this.onXMLError(this.onElementMissing(rootTags[i], 'SCENE'));
			return;
		}

		if (currentElement.length != 1) {
			this.onXMLError(this.onMultipleElements(rootTags[i], 'SCENE'));
			return;
		}

		var error = rootParsers[i].call(this, currentElement[0]);

		if (error != null) {
			this.onXMLError(error);
			return;
		}
	}
	
	this.loadedOk = true;
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.display = function() {

	for (var leaf in this.leaves) {
		this.leaves[leaf].display();
	}
}

MySceneGraph.prototype.parseLight = function(id, root) {
	
	var parseErrors = 0;
	var parent = root.nodeName;

	if (id in this.lights) {
		console.warn("WARNING: " + parent + " with id=" + id + " already exists, skipping...");
		return null;
	}
	
	var lightEnabled = this.parseBoolean(root, 'enable');
	var error = this.checkValue(lightEnabled, 'enable', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}
	
	var lightPosition = this.parseCoordinatesXYZW(root, 'position');
	var error = this.checkValue(lightPosition, 'position', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var lightAmbient = this.parseRGBA(root, 'ambient');	
	var error = this.checkValue(lightAmbient, 'ambient', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var lightDiffuse = this.parseRGBA(root, 'diffuse');	
	var error = this.checkValue(lightDiffuse, 'diffuse', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var lightSpecular = this.parseRGBA(root, 'specular');
	var error = this.checkValue(lightSpecular, 'specular', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
	}

	var myLight = new CGFlight(this.scene, id);

	myLight.setPosition.apply(this, lightPosition);	
	myLight.setAmbient.apply(this, lightAmbient);	
	myLight.setDiffuse.apply(this, lightDiffuse);
	myLight.setSpecular.apply(this, lightSpecular);
	lightEnabled ? myLight.enable() : myLight.disable();

	this.lights[id] = myLight;
	this.scene.addLight(myLight);

	if (this.verbose) {
		this.printHeader('LIGHT', id)
		this.printValues('enable', 'value', lightEnabled);
		this.printXYZW('position', lightPosition);
		this.printRGBA('ambient', lightAmbient);
		this.printRGBA('diffuse', lightDiffuse);
		this.printRGBA('specular', lightSpecular);
	}
	
	return null;
}

MySceneGraph.prototype.parseIllumination = function(root) {

	var parseErrors = 0;
	var parent = root.nodeName;
	
	var globalAmbient = this.parseRGBA(root, 'ambient');	
	var error = this.checkValue(globalAmbient, 'ambient', parent);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var globalDoubleside = this.parseBoolean(root, 'doubleside');
	var error = this.checkValue(globalDoubleside, 'doubleside', parent);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var globalBackground = this.parseRGBA(root, 'background');
	var error = this.checkValue(globalBackground, 'background', parent);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors);
	}

	this.gAmbient = globalAmbient;
	this.gDoubleside = globalDoubleside;
	this.gBackground = globalBackground;
	this.scene.setGlobalAmbient.apply(this, this.gAmbient);

	if (this.verbose) {
		this.printHeader('ILLUMINATION');
		this.printRGBA('ambient', this.gAmbient);
		this.printValues('doubleside', 'value', this.gDoubleside);
		this.printRGBA('background', this.gBackground);
	}
	
	return null;	
}

MySceneGraph.prototype.parseRotation = function(array, id, angle, axisFound) {

	if (axisFound[id]) {
		console.warn("WARNING: more than three 'rotate' properties found in <INITIALS>!");
	}
	else {
		axisFound[id] = true;
		array[id] = angle;
	}
}

MySceneGraph.prototype.parseNode = function(id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	var nodeMaterial = this.parseString(root, 'MATERIAL', 'id');
	if (nodeMaterial == null) {
		return this.onAttributeMissing('MATERIAL', id, parent);
	}

	var error = this.checkReference(this.materials, 'MATERIAL', id, nodeMaterial);
	if (error != null) {
		return error;
	}

	var nodeTexture = this.parseString(root, 'TEXTURE', 'id');
	if (nodeTexture == null) {
		return this.onAttributeMissing('TEXTURE', id, parent);
	}

	error = this.checkReference(this.textures, 'TEXTURE', id, nodeTexture);
	if (error != null) {
		return error;
	}

	return null;
}

MySceneGraph.prototype.parseTexture = function(id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	if (id in this.textures) {
		console.warn("WARNING: " + parent + " with id=" + id + " already exists, skipping...");
		return;
	}
	
	var texturePath = this.parseString(root, 'file', 'path');
	if (texturePath == null) {
		parseErrors++;
		this.onXMLError(this.onAttributeMissing('file', id, parent));
	}

	var textureS = this.parseFloat(root, 'amplif_factor', 's');
	var error = this.checkValue(textureS, 'amplification factor S', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var textureT = this.parseFloat(root, 'amplif_factor', 't');	
	var error = this.checkValue(textureT, 'amplification factor T', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
	}

	this.textures[id] = new XMLtexture(texturePath, textureS, textureT);

	if (this.verbose) {
		this.printHeader('TEXTURE', id);
		this.printValues('file', 'path', texturePath);
		this.printValues('amplif_factor', 's', textureS, 't', textureT);
	}

	return null;
};

MySceneGraph.prototype.parseLeaf = function(id, root) {

	var leafType = this.reader.getItem(root, 'type', this.primitiveTypes);
	var leafArgs = this.reader.getString(root, 'args', true).trim().split(' ');
	
	if (id in this.leaves) {
		console.warn("WARNING: leaf with id=" + id + " already exists, skipping...");
		return;
	}

	if (leafType == 'rectangle') {
		this.checkArguments(id, leafArgs.length, 4);
		var vec1 = [leafArgs[0], leafArgs[1]].map(parseFloat);
		var vec2 = [leafArgs[2], leafArgs[3]].map(parseFloat);
		this.leaves[id] = new MyRectangle(this.scene, vec1, vec2);
	}
	else if (leafType == 'triangle') {
		this.checkArguments(id, leafArgs.length, 9);
		var vec1 = [leafArgs[0], leafArgs[1], leafArgs[2]].map(parseFloat);
		var vec2 = [leafArgs[3], leafArgs[4], leafArgs[5]].map(parseFloat);
		var vec3 = [leafArgs[6], leafArgs[7], leafArgs[8]].map(parseFloat);
		this.leaves[id] = new MyTriangle(this.scene, vec1, vec2, vec3);
	}
	else if (leafType == 'cylinder') {
		this.checkArguments(id, leafArgs.length, 5);
	}
	else if (leafType == 'sphere') {
		this.checkArguments(id, leafArgs.length, 3);
		this.leaves[id] = new MySphere(this.scene, leafArgs[0], leafArgs[1], leafArgs[2]);
	}

	if (this.verbose) {
		this.printHeader("LEAF", id);
		this.printValues(null, 'type', leafType, 'args', leafArgs);
	}

	return null;
};

///////////////////////////////////////////
// 				DATA VALIDATION			 //
///////////////////////////////////////////	

MySceneGraph.prototype.checkArguments = function(id, argsGot, argsExpected) {
	
	if (argsGot != argsExpected) {
		console.warn("WARNING: leaf with id=" + id + " has " + argsGot + " arguments, expected " + argsExpected);
	}
}

MySceneGraph.prototype.checkProperty = function(name, parentName, condition) {

	if (!condition) {
		console.warning("WARNING: multiple definitions for property '" + name + " found in <" + parentName + ">!");
	}
}

MySceneGraph.prototype.checkReference = function (array, name, nodeId, objectId) {

	if (!(objectId in array)) {
		return "NODE with id=" + nodeId + " references " + name + " id=" + objectId +", which doesn't exist.";
	}

	return null;
}

MySceneGraph.prototype.checkValue = function(value, node, parent, id) {

	if (value == null) {

		if (id == undefined) {
			return this.onElementMissing(node, parent);
		}

		return this.onAttributeMissing(node, id, parent);
	}

	if (value != value) {

		if (id == undefined) {
			return this.onElementInvalid(node, parent);
		}
		
		return this.onAttributeInvalid(node, id, parent);
	}

	return null;
}

MySceneGraph.prototype.onAttributeMissing = function(node, id, parent) {
	return parent + " with id=" + id + " is missing attribute '" + node + "'.";
}

MySceneGraph.prototype.onAttributeInvalid = function(node, id, parent) {
	return parent + " with id=" + id + " has an invalid value for '" + node + "' attribute.";
}

MySceneGraph.prototype.onElementMissing = function(node, parent) {
	return node + " attribute is missing from <" + parent + ">.";
}

MySceneGraph.prototype.onElementInvalid = function(node, parent) {
	return node + " attribute from <" + parent + "> has an invalid value.";
}

MySceneGraph.prototype.onMultipleElements = function(node, parent) {
	return "more than one '" + node + "' element found in <" + parent + ">.";
}

MySceneGraph.prototype.onParseError = function(parent, nerr, id) {

	if (id == undefined) {
		return nerr + " errors found while parsing <" + parent + ">.";
	}

	return nerr + " errors found while parsing " + parent + " with id=" + id + ".";
}

///////////////////////////////////////////
// 			AUXILLIARY PARSING			 //
///////////////////////////////////////////	

MySceneGraph.prototype.parseBoolean = function(root, attribute) {

	var node = root.getElementsByTagName(attribute);

	if (node == null || node.length == 0) {
		return null;
	}

	this.checkProperty(attribute, root.nodeName, node.length == 1);	
	var checkResult = this.reader.getBoolean(node[0], 'value', true);
	
	if (checkResult == null) {
		checkResult = NaN;
	}

	return checkResult;
}

MySceneGraph.prototype.parseCoordinates = function(root, attribute, coordA, coordB, coordC, coordD) {

	if (arguments.length < 5) {
		return null;
	}
	
	var node = root.getElementsByTagName(attribute);

	if (node == null || node.length == 0) {
		return null;
	}

	this.checkProperty(attribute, root.nodeName, node.length == 1);

	var x = this.reader.getFloat(node[0], coordA, true);
	if (x != x) {
		return NaN;
	}

	var y = this.reader.getFloat(node[0], coordB, true);
	if (y != y) {
		return NaN;
	}

	var z = this.reader.getFloat(node[0], coordC, true);
	if (z != z) {
		return NaN;
	}

	if (x == null || y == null || z == null) {
		return NaN;
	}

	if (arguments.length == 6) {

		var w =  this.reader.getFloat(node[0], coordD, true);

		if (w != w) {
			return NaN;
		}

		return [ x, y, z, w ];
	}

	return [ x, y, z ];
}

MySceneGraph.prototype.parseCoordinatesXYZW = function(root, attribute) {
	return this.parseCoordinates(root, attribute, 'x', 'y', 'z', 'w');
}

MySceneGraph.prototype.parseCoordinatesXYZ = function(root, attribute) {
	return this.parseCoordinates(root, attribute, 'x', 'y', 'z');
}

MySceneGraph.prototype.parseCoordinatesScale = function(root, attribute) {
	return this.parseCoordinates(root, attribute, 'sx', 'sy', 'sz');
}

MySceneGraph.prototype.parseFloat = function(root, name, attribute) {

	var node = root.getElementsByTagName(name);

	if (node == null || node.length == 0) {
		return null;
	}

	this.checkProperty(name, root.nodeName, node.length == 1);
	return this.reader.getFloat(node[0], attribute, true);
}

MySceneGraph.prototype.parseRGBA = function(root, attribute) {

	var node = root.getElementsByTagName(attribute);

	if (node == null || node.length == 0) {
		return null;
	}

	this.checkProperty(attribute, root.nodeName, node.length == 1);
	
	var r = this.reader.getFloat(node[0], 'r', true);
	if (r !== r) {
		return NaN;
	}

	var g = this.reader.getFloat(node[0], 'g', true);
	if (g !== g) {
		return NaN;
	}

	var b = this.reader.getFloat(node[0], 'b', true);
	if (b !== b) {
		return NaN;
	}

	var a = this.reader.getFloat(node[0], 'a', true);
	if (a !== a) {
		return NaN;
	}

	if (r == null || g == null || b == null || a == null) {
		return NaN;
	}

	return [ r, g, b, a ];
}

MySceneGraph.prototype.parseString = function(root, name, attribute) {

	var node = root.getElementsByTagName(name);

	if (node == null || node.length == 0) {
		return null;
	}

	this.checkProperty(name, root.nodeName, node.length == 1);
	return this.reader.getString(node[0], attribute, true);
}

///////////////////7

MySceneGraph.prototype.parseMaterial = function(id, root) {
	
	var parent = root.nodeName;
	var parseErrors = 0;
	
	if (id in this.materials) {
		console.warn("WARNING: " + parent + " with id=" + id + " already exists, skipping...");
		return null;
	}
	
	var materialShininess = this.parseFloat(root, 'shininess', 'value');
	var error = this.checkValue(materialShininess, 'shininess', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var materialSpecular = this.parseRGBA(root, 'specular');	
	var error = this.checkValue(materialSpecular, 'specular', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var materialDiffuse = this.parseRGBA(root, 'diffuse');
	var error = this.checkValue(materialDiffuse, 'diffuse', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var materialAmbient = this.parseRGBA(root, 'ambient');	
	var error = this.checkValue(materialDiffuse, 'ambient', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var materialEmission = this.parseRGBA(root, 'emission');	
	var error = this.checkValue(materialDiffuse, 'emission', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
	}

	var myMaterial = new CGFappearance(this.scene);

	myMaterial.setAmbient(materialAmbient);
	myMaterial.setDiffuse(materialDiffuse);
	myMaterial.setEmission(materialEmission);
	myMaterial.setSpecular(materialSpecular);
	myMaterial.setShininess(materialShininess);
	
	this.materials[id] = myMaterial;

	if (this.verbose) {
		this.printHeader('MATERIAL', id);
		this.printValues('shininess', 'value', materialShininess);
		this.printRGBA('specular', materialSpecular);
		this.printRGBA('diffuse', materialDiffuse);
		this.printRGBA('ambient', materialAmbient);
		this.printRGBA('emission', materialEmission);
	}
	
	return null;
};

///////////////////////////////////////////
// 			 CONSOLE LOGGING			 //
///////////////////////////////////////////	

MySceneGraph.prototype.printValues = function() {

	if (arguments.length < 3) {
		return;
	}

	var string = "\t\t" + arguments[0] + ": { ";
		
	for (var i = 1; i < arguments.length; i += 2) {

		string += arguments[i] + "=" + arguments[i+1];

		if (i + 2 < arguments.length) {
			string += ", ";
		}
	}

	string += " }";
	console.log(string);
}

MySceneGraph.prototype.printHeader = function(attribute, id) {
	
	if (id == undefined) {
		console.log("[" + attribute + "]");
	}
	else {
		console.log(attribute + " sucessfully read from file [ID=" + id + "]");
	}
}

MySceneGraph.prototype.printXYZ = function(attribute, xyz) {
	console.log("\t\t" + attribute + ": { x=" + xyz[0] + ", y=" + xyz[1] + ", z=" + xyz[2] + " }");
}

MySceneGraph.prototype.printRGBA = function(attribute, rgba) {
	console.log("\t\t" + attribute + ": { r=" + rgba[0] + ", g=" + rgba[1] + ", b=" + rgba[2] + ", a=" + rgba[3] + " }");
}

MySceneGraph.prototype.printXYZW = function(attribute, xyzw) {
	console.log("\t\t" + attribute + ": { x=" + xyzw[0] + ", y=" + xyzw[1] + ", z=" + xyzw[2] + ", w=" + xyzw[3] + " }");
}

///////////////////////////////////////////
// 			AUXILLIARY PARSE			 //
///////////////////////////////////////////	

MySceneGraph.prototype.parseArray = function(rootElement, nodeName, parseFunc) {

	var parent = rootElement.nodeName;

	for (var i = 0; i < rootElement.children.length; i++) {
		
		var currentElement = rootElement.children[i];

		if (currentElement.nodeName != nodeName) {
			this.onXMLError("element in " + rootElement.nodeName + " has invalid name (expected " + nodeName + ", got " + currentElement.nodeName + ").");
			continue;
		}
		
		var id = this.reader.getString(currentElement, 'id', false);

		if (id == null) {
			this.onXMLError(this.onElementMissing('id', nodeName));
			continue;
		}

		var error = parseFunc.call(this, id, currentElement);

		if (error != null) {
			this.onXMLError(error);
		}
	}

	return null;
}

MySceneGraph.prototype.parseLeaves = function(root) {
	return this.parseArray(root, 'LEAF', this.parseLeaf);
}

MySceneGraph.prototype.parseLights = function(root) {
	return this.parseArray(root, 'LIGHT', this.parseLight);
}

MySceneGraph.prototype.parseMaterials = function(root) {
	return this.parseArray(root, 'MATERIAL', this.parseMaterial);
}

MySceneGraph.prototype.parseNodes = function(root) {

	var globalRoot = this.parseString(root, 'ROOT', 'id');
	if (globalRoot == null) {
		return this.onElementMissing('ROOT', root.nodeName);
	}

	this.graphRoot = globalRoot;

	if (this.verbose) {
		this.printHeader("NODES");
		this.printValues('root', 'id', globalRoot);
	}

	return this.parseArray(root, 'NODE', this.parseNode);
}

MySceneGraph.prototype.parseTextures = function(rootElement) {
	return this.parseArray(rootElement, 'TEXTURE', this.parseTexture);
}

MySceneGraph.prototype.parseGlobals = function(root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	// <frustum near="ff" far="ff/>	
	var globalFrustumNear = this.parseFloat(root, 'frustum', 'near');
	var error = this.checkValue(globalFrustumNear, 'near', 'frustum');
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	// <frustum near="ff" far="ff/>	
	var globalFrustumFar = this.parseFloat(root, 'frustum', 'far');
	var error = this.checkValue(globalFrustumFar, 'far', 'frustum');
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	// <reference length="ff"/>
	var globalReference = this.parseFloat(root, 'reference', 'length');
	var error = this.checkValue(globalReference, 'length', 'reference');
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	// <scale sx="ff" sy="ff" sz="ff"/>
	var globalScale = this.parseCoordinatesScale(root, 'scale');
	var error = this.checkValue(globalScale, 'scale', parent);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	// <translate x="ff" y="ff" z="ff"/>
	var globalTranslate = this.parseCoordinatesXYZ(root, 'translate');
	var error = this.checkValue(globalTranslate, 'translate', parent);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors);
	}
	
	// <rotate axis="x" angle="ff"/>
	// <rotate axis="y" angle="ff"/>
	// <rotate axis="z" angle="ff"/>
	//
	node = root.getElementsByTagName('rotation');
	node_sz = node.length;

	if (node == null || node_sz == 0) {
		return this.onElementMissing('rotation', parent);
	}

	if (node_sz < 3) {
		return "at least one rotate attribute is missing from INITIALS."
	}
	
	var globalRotation = [];
	var axisFound = [false, false, false];

	for (var i = 0; i < node_sz; i++)
	{
		var axis = this.reader.getItem(node[i], 'axis', this.axisTypes, true);
		var angle = this.reader.getFloat(node[i], 'angle', true);

		switch (axis)
		{
		case 'x':
			this.parseRotation(globalRotation, 0, angle, axisFound);
			break;
		case 'y':
			this.parseRotation(globalRotation, 1, angle, axisFound);
			break;
		case 'z':
			this.parseRotation(globalRotation, 2, angle, axisFound);
			break;
		default:
			console.warn("WARNING: unknown rotation axis '" + axis + "' found in <" + parent + ">.");
			break;
		}
	}

	this.scene.initAxis(globalReference);
	this.scene.initFrustum(globalFrustumNear, globalFrustumFar);
	this.scene.initScale(globalScale);
	this.scene.initRotation(globalRotation);
	this.scene.initTranslate(globalTranslate);

	if (this.verbose) {
		this.printHeader('INITIALS');
		this.printValues('frustum', 'near', globalFrustumNear, 'far', globalFrustumFar);
		this.printXYZ('translate', globalTranslate);
		this.printValues('rotation', 'axis', 'x', 'angle', globalRotation[0]);
		this.printValues('rotation', 'axis', 'y', 'angle', globalRotation[1]);
		this.printValues('rotation', 'axis', 'z', 'angle', globalRotation[2]);
		this.printXYZ('scale', globalScale);
		this.printValues('reference', 'length', globalReference);
	}
};

MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: " + message);	
	this.loadedOk = false;
};