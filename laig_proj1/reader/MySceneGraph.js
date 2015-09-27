function MySceneGraph(filename, scene) {
	
	this.loadedOk = null;
	this.scene = scene;
	this.gVerbose = true;

	scene.graph = this;

	this.textures = {};
	this.lights = {};
	this.materials = {};
	this.leaves = {};

	this.primitiveTypes = [	'rectangle', 'cylinder', 'sphere', 'triangle' ];
	this.axisTypes = ['x', 'y', 'z'];
	
	this.reader = new CGFXMLreader();
	this.reader.open('scenes/'+filename, this);  
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
		var error = rootParsers[i].call(this, currentElement[0]);

		if (error != null) {
			this.onXMLError(error);
			return;
		}
	}
	
	this.loadedOk = true;
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.clampRGBA = function(value, coord)
{
	var valueChanged = false;
	
	if (value < 0.0) {
		value = 0.0;
		valueChanged = true;
	}
	else if (value > 1.0) {
		value = 1.0;
		valueChanged = true;
	}

	if (valueChanged) {
		console.warn("WARNING: invalid value for coordinate '" + coord + "', setting to default value...");
	}
	
	return value;
}

MySceneGraph.prototype.display = function() {

	for (var leaf in this.leaves) {
		this.leaves[leaf].display();
	}
}

MySceneGraph.prototype.parseLight = function(id, root) {
	
	var parent = root.nodeName;

	if (id in this.lights) {
		console.warn("WARNING: " + parent + " with id=" + id + " already exists, skipping...");
		return;
	}
	
	var myLight = new CGFlight(this.scene, id);

	var lightEnabled = this.parseBoolean(root, 'enable');
	if (lightEnabled == null) {
		return this.onAttributeMissing('enable', id, parent);
	}
	
	var lightPosition = this.parseCoordinatesXYZW(root, 'position');
	if (lightPosition == null) {
		return this.onAttributeMissing('position', id, parent);
	}

	var lightAmbient = this.parseRGBA(root, 'ambient');	
	if (lightAmbient == null) {
		return this.onAttributeMissing('ambient', id, parent);
	}

	var lightDiffuse = this.parseRGBA(root, 'diffuse');	
	if (lightDiffuse == null) {
		return this.onAttributeMissing('diffuse', id, parent);
	}

	var lightSpecular = this.parseRGBA(root, 'specular');
	if (lightSpecular == null) {
		return this.onAttributeMissing('specular', id, parent);
	}

	myLight.setPosition.apply(this, lightPosition);	
	myLight.setAmbient.apply(this, lightAmbient);	
	myLight.setDiffuse.apply(this, lightDiffuse);
	myLight.setSpecular.apply(this, lightSpecular);
	lightEnabled ? myLight.enable() : myLight.disable();

	this.lights[id] = myLight;
	this.scene.addLight(myLight);

	if (this.gVerbose) {
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

	var parent = root.nodeName;

	if (root == null || root.length == 0) {
		return this.onElementMissing(parent, 'SCENE');
	}

	if (root.length > 1) {
		return this.onMultipleElements(parent);
	}
	
	var globalAmbient = this.parseRGBA(root, 'ambient');
	if (globalAmbient == null) {
		return this.onElementMissing('ambient', parent);
	}

	var globalDoubleside = this.parseBoolean(root, 'doubleside');
	if (globalDoubleside == null) {
		return this.onElementMissing('doubleside', parent);
	}

	var globalBackground = this.parseRGBA(root, 'background');
	if (globalBackground == null) {
		return this.onElementMissing('background', parent);
	}

	this.gAmbient = globalAmbient;
	this.gDoubleside = globalDoubleside;
	this.gBackground = globalBackground;

	this.scene.setGlobalAmbient.apply(this, this.gAmbient);

	if (this.gVerbose) {
		this.printHeader('ILLUMINATION');
		this.printRGBA('ambient', this.gAmbient);
		this.printValues('doubleside', 'value', this.gDoubleside);
		this.printRGBA('background', this.gBackground);
	}
	
	return null;	
}

MySceneGraph.prototype.parseRotate = function(array, id, angle, axisFound) {

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
	
	if (id in this.textures) {
		console.warn("WARNING: " + parent + " with id=" + id + " already exists, skipping...");
		return;
	}
	
	var texturePath = this.parseString(root, 'file', 'path');
	if (texturePath == null) {
		return this.onAttributeMissing('file', id, parent);
	}

	var textureS = this.parseFloat(root, 'amplif_factor', 's');
	if (textureS == null) {
		return this.onAttributeMissing('amplification factor S', id, parent);
	}

	var textureT = this.parseFloat(root, 'amplif_factor', 't');	
	if (textureT == null) {
		return this.onAttributeMissing('amplification factor T', id, parent);
	}

	this.textures[id] = new XMLtexture(texturePath, textureS, textureT);

	if (this.gVerbose) {
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

	if (this.gVerbose) {
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
		console.warn("WARNING: multiple definitions for property '" + name + " found in <" + parentName + ">!");
	}
}

MySceneGraph.prototype.checkReference = function (array, name, nodeId, objectId) {

	if (!(objectId in array)) {
		return "NODE with id=" + nodeId + " referenced " + name + " id=" + objectId +", which doesn't exist.";
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

MySceneGraph.prototype.onMultipleElements = function(node) {
	return "more than one '" + node + "' element found.";
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
	return this.reader.getBoolean(node[0], 'value', true);
}

MySceneGraph.prototype.parseCoordinates = function(root, attribute, coordA, coordB, coordC, coordD) {

	var node = root.getElementsByTagName(attribute);

	if (node == null || node.length == 0) {
		return null;
	}

	this.checkProperty(attribute, root.nodeName, node.length == 1);

	if (arguments.length == 6) {
		return [
			this.reader.getFloat(node[0], coordA, true), 
			this.reader.getFloat(node[0], coordB, true),
			this.reader.getFloat(node[0], coordC, true),
			this.reader.getFloat(node[0], coordD, true),
		];
	}

	return [
		this.reader.getFloat(node[0], coordA, true), 
		this.reader.getFloat(node[0], coordB, true),
		this.reader.getFloat(node[0], coordC, true),
	];
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
	
	return [
		 this.clampRGBA(this.reader.getFloat(node[0], 'r', true), 'r'), 
		 this.clampRGBA(this.reader.getFloat(node[0], 'g', true), 'g'), 
		 this.clampRGBA(this.reader.getFloat(node[0], 'b', true), 'b'),
		 this.clampRGBA(this.reader.getFloat(node[0], 'a', true), 'a')
	];
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
	
	if (id in this.materials) {
		console.warn("WARNING: " + parent + " with id=" + id + " already exists, skipping...");
		return;
	}
	
	var materialShininess = this.parseFloat(root, 'shininess', 'value');
	if (materialShininess == null) {
		return this.onAttributeMissing('shininess', id, parent);
	}

	var materialSpecular = this.parseRGBA(root, 'specular');
	if (materialSpecular == null) {
		return this.onAttributeMissing('specular', id, parent);
	}

	var materialDiffuse = this.parseRGBA(root, 'diffuse');
	if (materialDiffuse == null) {
		return this.onAttributeMissing('diffuse', id, parent);
	}

	var materialAmbient = this.parseRGBA(root, 'ambient');
	if (materialAmbient == null) {
		return this.onAttributeMissing('ambient', id, parent);
	}

	var materialEmission = this.parseRGBA(root, 'emission');
	if (materialEmission == null) {
		return this.onAttributeMissing('emission', id, parent);
	}

	var myMaterial = new CGFappearance(this.scene);

	myMaterial.setAmbient(materialAmbient);
	myMaterial.setDiffuse(materialDiffuse);
	myMaterial.setEmission(materialEmission);
	myMaterial.setSpecular(materialSpecular);
	myMaterial.setShininess(materialShininess);
	
	this.materials[id] = myMaterial;

	if (this.gVerbose) {
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

	var root_sz = rootElement.length;

	if (rootElement == null || root_sz == 0) {
		return "'" + rootElement.nodeName + "' element is missing from <SCENE>.";
	}

	if (root_sz > 1) {
		return "either zero or more than one '" + rootElement.nodeName + "' elements found.";
	}

	var sz = rootElement.children.length;

	for (var i = 0; i < sz; i++) {
		
		var currentElement = rootElement.children[i];

		if (currentElement.nodeName != nodeName) {
			console.warn("WARNING: element has invalid name (expected " + nodeName + ", got " + currentElement.nodeName + ").");
			continue;
		}
		
		var id = this.reader.getString(currentElement, 'id', true);
		var error = parseFunc.call(this, id, currentElement);

		if (error != null) {
			this.onXMLError(error);
		}
	}

	return null;
}

MySceneGraph.prototype.parseLeaves = function(rootElement) {
	return this.parseArray(rootElement, 'LEAF', this.parseLeaf);
}

MySceneGraph.prototype.parseLights = function(rootElement) {
	return this.parseArray(rootElement, 'LIGHT', this.parseLight);
}

MySceneGraph.prototype.parseMaterials = function(rootElement) {
	return this.parseArray(rootElement, 'MATERIAL', this.parseMaterial);
}

MySceneGraph.prototype.parseNodes = function(rootElement) {

	var globalRoot = this.parseString(rootElement, 'ROOT', 'id');

	if (globalRoot == null) {
		return this.onElementMissing('ROOT', rootElement.nodeName);
	}

	this.gRoot = globalRoot;

	if (this.gVerbose) {
		this.printHeader("NODES");
		this.printValues('root', 'id', globalRoot);
	}

	return this.parseArray(rootElement, 'NODE', this.parseNode);
}

MySceneGraph.prototype.parseTextures = function(rootElement) {
	return this.parseArray(rootElement, 'TEXTURE', this.parseTexture);
}

MySceneGraph.prototype.parseGlobals = function(root) {

	if (root == null || root.length == 0) {
		return this.onElementMissing('INITIALS', 'SCENE');
	}

	this.checkProperty('INITIALS', root.nodeName, root.length == 1);

	// <frustum near="ff" far="ff/>	
	//
	var parent = root.nodeName;
	var node = root.getElementsByTagName('frustum');
	var node_sz = node.length;

	if (node == null || node_sz == 0) {
		return this.onElementMissing('frustum', parent);
	}

	this.checkProperty('frustum', 'INITIALS', node_sz == 1);
	var globalFrustumNear = this.reader.getFloat(node[0], 'near', true);
	var globalFrustumFar = this.reader.getFloat(node[0], 'far', true);

	// <reference length="ff"/>
	var globalReference = this.parseFloat(root, 'reference', 'length');
	if (globalReference == null) {
		return this.onElementMissing('reference', parent);
	}

	// <scale sx="ff" sy="ff" sz="ff"/>
	var globalScale = this.parseCoordinatesScale(root, 'scale');
	if (globalScale == null) {
		return this.onElementMissing('scale', parent);
	}

	// <translate x="ff" y="ff" z="ff"/>
	var globalTranslate = this.parseCoordinatesXYZ(root, 'translate');
	if (globalTranslate == null) {
		return this.onElementMissing('translate', parent);
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
			this.parseRotate(globalRotation, 0, angle, axisFound);
			break;
		case 'y':
			this.parseRotate(globalRotation, 1, angle, axisFound);
			break;
		case 'z':
			this.parseRotate(globalRotation, 2, angle, axisFound);
			break;
		default:
			console.warn("WARNING: unknown axis '" + axis + "' found in 'rotation'.");
			break;
		}
	}

	this.scene.initAxis(globalReference);
	this.scene.initFrustum(globalFrustumNear, globalFrustumFar);
	this.scene.initScale(globalScale);
	this.scene.initRotation(globalRotation);
	this.scene.initTranslate(globalTranslate);

	if (this.gVerbose) {
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

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: " + message);	
	this.loadedOk = false;
};