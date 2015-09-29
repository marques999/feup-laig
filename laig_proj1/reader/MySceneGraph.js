function MySceneGraph(filename, scene) {
	
	this.loadedOk = null;
	this.scene = scene;
	this.verbose = true;

	scene.graph = this;

	this.textures = {};
	this.lights = {};
	this.materials = {};
	this.nodes = {};
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
	
	this.nodeValidation();	
	this.fdsertch(this.graphRoot);

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
		return this.onElementDuplicate(parent, id);
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

	myLight.setPosition.apply(this.scene, lightPosition);
	myLight.setAmbient.apply(this.scene, lightAmbient);	
	myLight.setDiffuse.apply(this.scene, lightDiffuse);
	myLight.setSpecular.apply(this.scene, lightSpecular);
	lightEnabled ? myLight.enable.call(this.scene) : myLight.disable.call(this.scene);

	this.lights[id] = myLight;

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

MySceneGraph.prototype.getLights = function() {
	return this.lights;
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

	this.scene.setAmbient(globalAmbient);
	this.scene.setDoubleside(globalDoubleside);
	this.scene.setBackground(globalBackground);
	
	if (this.verbose) {
		this.printHeader('ILLUMINATION');
		this.printRGBA('ambient', globalAmbient);
		this.printValues('doubleside', 'value', globalDoubleside);
		this.printRGBA('background', globalBackground);
	}
	
	return null;	
}

MySceneGraph.prototype.parseRotation = function(id, axis, angle, axisFound) {

	if (axis != 'x' && axis != 'y' && axis != 'z') {
		console.warn("WARNING: unknown rotation axis '" + axis + "' found in <" + parent + ">.");
	}
	else if (axisFound[id]) {
		console.warn("WARNING: more than three 'rotate' properties found in <INITIALS>!");
	}
	else {
		axisFound[id] = true;
		this.scene.setRotation(id, axis, angle);
	}
}

MySceneGraph.prototype.parseNode = function(id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	console.log("processing node " +  id);
	if (id in this.nodes) {
		return this.onElementDuplicate(parent, id);
	}

	if (id == 'null' || id == 'clear') {
		return this.onReservedId(parent, id);
	}

	var nodeMaterial = this.parseString(root, 'MATERIAL', 'id');
	if (nodeMaterial == null) {
		parseErrors++;
		this.onXMLError(this.onAttributeMissing('MATERIAL', id, parent));
	}

	// var error = this.checkReference(this.materials, 'MATERIAL', id, nodeMaterial);
	// if (error != null) {
	// 	parseErrors++;
	// 	this.onXMLError(error);
	// }

	var nodeTexture = this.parseString(root, 'TEXTURE', 'id');
	if (nodeTexture == null) {
		parseErrors++;
		this.onXMLError(this.onAttributeMissing('TEXTURE', id, parent));
	}

	// error = this.checkReference(this.textures, 'TEXTURE', id, nodeTexture);
	// if (error != null) {
	// 	parseErrors++;
	// 	this.onXMLError(error);
	// }

	var node = new XMLNode(id, nodeTexture,nodeMaterial);
	var nnodes = root.children.length;

	for (var i=2; i< nnodes; i++)
	{
		var tranf = root.children[i];		
		var res = null;

		if(tranf.nodeName == 'TRANSLATION') {			
			res = this.parseNodeTranslation(tranf, node, id);
		}
		else if (tranf.nodeName == 'ROTATION') {						
			res = this.parseNodeRotation(tranf, node, id);
		}
		else if (tranf.nodeName == 'SCALE') {				
			res = this.parseNodeScale(tranf, node, id);			
		}
		else if (tranf.nodeName == 'DESCENDANTS') {			
			break;
		}
		else {
			console.warn("\t\tTag name: " + tranf.nodeName + " found in " + parent + " does not match the request. Skipping.... ");
		}	
			
		if(res != null) {
			this.onXMLError(res);			
		}
	}
	
	var nodeDescendants = root.getElementsByTagName('DESCENDANTS')[0].children;	
	nnodes=nodeDescendants.length;
	
	console.log("Descendents: ");
	if(nnodes == 0) {
		console.log("none!");
	}
	for(var i = 0; i < nnodes; i++) {
		var idd = this.reader.getString(nodeDescendants[i],'id',true);
		node.addChild(idd);
		console.log("\t\tid=" + idd);		
	}
	
	this.nodes[id] = node;
	console.log("read: " + id);

	return null;
}

MySceneGraph.prototype.parseNodeScale = function(root, node, id) {

	var parent = root.nodeName;
	var coords = this.parseNodeCoordinates(root, 'sx', 'sy', 'sz');
	
	var error = this.checkValue(coords, 'coordinates', parent, id);
	if(error != null){
		return error;
	}

	node.addTransformation(new TScale(this.scene, coords[0], coords[1], coords[2]));
	console.log("\t\tScale: sx=" + coords[0] + " sy=" + coords[1] + " sz=" + coords[2]);

	return null;		
};

MySceneGraph.prototype.getNodeTexture = function(node, parent) {

	if (node.getTexture() == 'null') {
		return parent.getTexture();	
	}

	if (node.getTexture() == 'clear') {
		return null;
	}

	return node.getTexture();
}

MySceneGraph.prototype.getNodeMaterial = function(node, parent) {

	if (node.getMaterial() == 'null') {
		return parent.getTexture();
	}

	return node.getTexture();
}

MySceneGraph.prototype.parseNodeTranslation = function(root, node, id) {

	var parent = root.nodeName;
	var coords = this.parseNodeCoordinates(root, 'x', 'y', 'z');				
	var error = this.checkValue(coords, 'coordinates', parent, id);

	if(error != null){
		return error;
	}

	node.addTransformation(new TTranslation(this.scene, coords[0], coords[1], coords[2]));			
	console.log("\t\tTranslation: x=" + coords[0] + " y=" + coords[1] + " z=" + coords[2]);

	return null;
}

MySceneGraph.prototype.parseNodeRotation = function(root, node, id) {

	var parent = root.nodeName;
	var parseErrors = 0;
	var axis = this.reader.getString(root, 'axis', true );
	var error = this.checkValue(axis, 'axis', parent, id);

	if (error != null){
		parseErrors++;
		this.onXMLError(error);
	}

	var ang = this.reader.getFloat(root,'angle', true);
	var error = this.checkValue(ang, 'angle', parent, id);

	if (error != null){
		parseErrors++;
		this.onXMLError(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
	}

	node.addTransformation(new TRotation(this.scene, axis, ang));
	console.log("\t\tRotation: axis=" + axis + " angle=" + ang);

	return null;
}

MySceneGraph.prototype.parseNodeCoordinates = function(node, coordA, coordB, coordC) {

	var x = this.reader.getFloat(node, coordA, true);
	if (x != x || x == null) {		
		return x;
	}

	var y = this.reader.getFloat(node, coordB, true);
	if (y != y || y == null) {		
		return y;
	}

	var z = this.reader.getFloat(node, coordC, true);
	if (z != z || z == null) {		
		return z;
	}

	return [ x, y, z ];
}

MySceneGraph.prototype.parseTexture = function(id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	if (id in this.textures) {
		return this.onElementDuplicate(parent, id);
	}

	if (id = 'null' || id == 'clear') {
		return this.onReservedId(parent, id);;
	}
	
	var texturePath = this.parseString(root, 'file', 'path');
	if (texturePath == null) {
		parseErrors++;
		this.onXMLError(this.onAttributeMissing('file', id, parent));
	}

	// if (!this.checkUrl(texturePath)) {
	// 	parseErrors++;
	// 	this.onXMLError(texturePath + " not found.");
	// }
	
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

MySceneGraph.prototype.onElementDuplicate = function(parent, id) {
	return parent + " with id=" + id + " already exists, skipping...";
}

MySceneGraph.prototype.onReservedId = function(id, root) {
	return parent + " ith id=" + id + " has a reserved id (null, clear), skipping...";
}

MySceneGraph.prototype.readRectangle = function(id, args) {

	if (args.length != 4) {
		return this.onInvalidArguments(id, leafArgs.length, 4);
	}

	var vec1 = [args[0], args[1]].map(parseFloat);
	if (vec1[0] != vec1[0] || vec1[1] != vec1[1]) {
		return this.onAttributeInvalid('first rectangle vertex', id, 'NODE');
	}

	var vec2 = [args[2], args[3]].map(parseFloat);
	if (vec2[0] != vec2[0] || vec2[1] != vec2[1]) {
		return this.onAttributeInvalid('second rectangle vertex', id, 'NODE');
	}

	this.leaves[id] = new MyRectangle(this.scene, vec1, vec2);

	return null;
}

MySceneGraph.prototype.readTriangle = function(id, leafArgs) {

	if (leafArgs.length != 9) {
		return this.onInvalidArguments(id, leafArgs.length, 9);
	}
		
	var vec1 = [leafArgs[0], leafArgs[1], leafArgs[2]].map(parseFloat);
	if (vec1[0] != vec1[0] || vec1[1] != vec1[1] || vec1[2] != vec1[2]) {
		return this.onAttributeInvalid('first triangle vertex', id, 'NODE');
	}

	var vec2 = [leafArgs[3], leafArgs[4], leafArgs[5]].map(parseFloat);
	if (vec2[0] != vec2[0] || vec2[1] != vec2[1] || vec2[2] != vec2[2]) {
		return this.onAttributeInvalid('second triangle vertex', id, 'NODE');
	}

	var vec3 = [leafArgs[6], leafArgs[7], leafArgs[8]].map(parseFloat);
	if (vec3[0] != vec3[0] || vec3[1] != vec3[1] || vec3[2] != vec3[2]) {
		return this.onAttributeInvalid('third triangle vertex', id, 'NODE');
	}

	this.leaves[id] = new MyTriangle(this.scene, vec1, vec2, vec3);

	return null;
}

MySceneGraph.prototype.readCylinder = function(id, args) {

	if (args.length != 5) {
		return this.onInvalidArguments(id, args.length, 5);
	}

	var myHeight = parseFloat(args[0]);
	if (myHeight != myHeight) {
		return this.onAttributeInvalid('cylinder height', id, 'NODE');
	}

	var myRadiusBottom = parseFloat(args[1]);
	if (myRadiusBottom != myRadiusBottom) {
		return this.onAttributeInvalid('cylinder bottom radius', id, 'NODE');
	}

	var myRadiusTop = parseFloat(args[2]);
	if (myRadiusTop != myRadiusTop) {
		return this.onAttributeInvalid('cylinder top radius', id, 'NODE');
	}

	var myStacks = parseInt(args[3]);
	if (myStacks != myStacks) {
		return this.onAttributeInvalid('number of stacks', id, 'NODE');
	}
	
	var mySlices = parseInt(args[4]);
	if (mySlices != mySlices) {
		return this.onAttributeInvalid('number of slices', id, 'NODE');
	}

	this.leaves[id] = new MyCylinder(this.scene, myRadiusBottom, myHeight,	mySlices, myStacks);

	return null;
}

MySceneGraph.prototype.readSphere = function(id, leafArgs) {

	if (leafArgs.length != 3) {
		return this.onInvalidArguments(id, leafArgs.length, 3);
	}

	var myRadius = parseFloat(leafArgs[0]);
	if (myRadius != myRadius) {
		return this.onAttributeInvalid('sphere radius', id, 'LEAF');
	}

	var myStacks = parseInt(leafArgs[1]);
	if (myStacks != myStacks) {
		return this.onAttributeInvalid('number of stacks', id, 'LEAF');
	}
	
	var mySlices = parseInt(leafArgs[2]);
	if (mySlices != mySlices) {
		return this.onAttributeInvalid('number of slices', id, 'LEAF');
	}

	this.leaves[id] = new MySphere(this.scene, myRadius, myStacks, mySlices);

	return null;
}

MySceneGraph.prototype.parseLeaf = function(id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	if (id in this.leaves) {
		return this.onElementDuplicate(parent, id);
	}

	var leafType = this.reader.getItem(root, 'type', this.primitiveTypes);
	var error = this.checkValue(leafType, 'type', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	var leafArgs = this.reader.getString(root, 'args', true).trim().split(' ');
	if (leafArgs == null) {
		parseErrors++;
		this.onXMLError(error);
	}
	
	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
	}

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

	if (error != null) {
		parseErrors++;
		this.onXMLError(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
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

MySceneGraph.prototype.onInvalidArguments = function(id, argsGot, argsExpected) {	
	return "LEAF with id=" + id + " has " + argsGot + " arguments, expected " + argsExpected + ".";
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

MySceneGraph.prototype.checkUrl = function(url) {

	var request = new XMLHttpRequest();

	if (request) 
	{
		request.open("GET", url);
	
		if (request.status == 200) 
		{
			return true; 
		}
	}

	return false;
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
		return NaN;
	}

	return checkResult;
}

MySceneGraph.prototype.parseCoordinates = function(root, attribute, coordA, coordB, coordC, coordD) {

	if (arguments.length < 5 || arguments.length > 6) {
		return null;
	}
	
	var node = root.getElementsByTagName(attribute);

	if (node == null || node.length == 0) {
		return null;
	}

	this.checkProperty(attribute, root.nodeName, node.length == 1);

	var x = this.reader.getFloat(node[0], coordA, true);
	if (x != x || x == null) {
		return NaN;
	}

	var y = this.reader.getFloat(node[0], coordB, true);
	if (y != y || y ==  null) {
		return NaN;
	}

	var z = this.reader.getFloat(node[0], coordC, true);
	if (z != z || z == null) {
		return NaN;
	}

	if (arguments.length == 6) {

		var w =  this.reader.getFloat(node[0], coordD, true);

		if (w != w || w == null) {
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

MySceneGraph.prototype.parseRGBA = function(root, attribute) {
	return this.parseCoordinates(root, attribute, 'r', 'g', 'b', 'a');
}

MySceneGraph.prototype.parseFloat = function(root, name, attribute) {

	var node = root.getElementsByTagName(name);

	if (node == null || node.length == 0) {
		return null;
	}

	this.checkProperty(name, root.nodeName, node.length == 1);
	return this.reader.getFloat(node[0], attribute, true);
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
		return this.onElementDuplicate(parent, id);
	}

	if (id == 'null' || id == 'clear') {
		return this.onReservedId(parent, id);
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
	
	var globalRotation = [];
	var axisFound = [false, false, false];

	for (var i = 0; i < node_sz; i++)
	{
		var axis = this.reader.getItem(node[i], 'axis', this.axisTypes);
		var angle = this.reader.getFloat(node[i], 'angle');
		this.parseRotation(i, axis, angle, axisFound);
	}

	// verificar se as tr^es coordenadas estão presentes

	if (!axisFound[0] || !axisFound[1] || !axisFound[2]) {
		return "at least one rotation axis is missing from INITIALS";
	}

	this.scene.initAxis(globalReference);
	this.scene.initFrustum(globalFrustumNear, globalFrustumFar);
	this.scene.initScale(globalScale);
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

MySceneGraph.prototype.fdsertch = function(root) {
	if(root in this.nodes){
		this.fdsertchAux(this.nodes[root]);
	}
	else {
		console.error("Root info. not found!");
	}
}

MySceneGraph.prototype.fdsertchAux = function(node) {

	console.log("S:" + node.id);	
	
	for(var i = 0; i < node.children.length; i++) {			
		
		var nextId = node.children[i];
		var nextElement = null;
		var isLeaf = false;

		if(nextId in this.nodes) {
			nextElement = this.nodes[nextId];
		}	
		else if(nextId in this.leaves) {
			isLeaf = true;
			nextElement = this.leaves[nextId];
		}
		else {
			console.error("Descendant of id=" + nextId + " not found while exploring node of id=" + node.id + ".");
			return
		}

		/*if(nextElement.textureId == null)
			nextElement.textureId = child.textureId;

		if(nextElement.materialId == null)
			nextElement.materialId = child.materialId;*/

		console.log("Seartching child id=" + nextElement.id);
		
		if (!isLeaf) {
			fdsertchAux(nextElement);
		}
	}
}

MySceneGraph.prototype.nodeValidation = function() {

	var ready = false;

	do {
		ready = true;

		for(var i in this.nodes) {	

			var children = this.nodes[i].children;
			//console.log("Processing id=" + this.nodes[i].id)

			for(var n = 0; n < children.length; n++) {
				if(!((children[n] in this.leaves || children[n] in this.nodes) && children[n] != this.nodes[i].id)){
					console.log("Erasing reference with id=" + children[n] + " from node id=" + this.nodes[i].id);				
					this.nodes[i].children.splice(n,1);
					console.log("new size:" + this.nodes[i].children.length);
				}
			}

			if(this.nodes[i].children.length == 0) {
				console.log("Erasing node id=" + this.nodes[i].id);
				delete this.nodes[i];
				ready = false;		
			}
		}		
	} while(!ready);
}

MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: " + message);	
	this.loadedOk = false;
};