function MySceneGraph(filename, scene) {
	
	this.loadedOk = null;
	this.scene = scene;
	this.verbose = true;
	this.debug = false;
	scene.graph = this;

	this.textures = {};
	this.lights = {};
	this.materials = {};
	this.nodes = {};
	this.leaves = {};

	this.defaultMaterial = new CGFappearance(this.scene);
	this.defaultMaterial.setAmbient(0.2, 0.4, 0.8, 1.0);
	this.defaultMaterial.setDiffuse(0.2, 0.4, 0.8, 1.0);
	this.defaultMaterial.setSpecular(0.2, 0.4, 0.8, 1.0);

	this.primitiveTypes = [ 'rectangle', 'cylinder', 'sphere', 'triangle' ];
	this.axisTypes = ['x', 'y', 'z'];
	this.reader = new CGFXMLreader();
	this.reader.open('scenes/' + filename, this);  
}

/*
  _____ _   _ _____ _______ 
 |_   _| \ | |_   _|__   __|
   | | |  \| | | |    | |   
   | | | . ` | | |    | |   
  _| |_| |\  |_| |_   | |   
 |_____|_| \_|_____|  |_|   

*/

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
	
	if (!(this.graphRoot in this.nodes)) {
		this.onXMLError("invalid graph root - node with id=" + this.graphRoot + " not found in <NODES>");
		return;
	}

	this.resetIndegree();
	this.removeOrphans();
	this.validateNodes();
	this.loadedOk = true;
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.display = function() {
	this.processNodes(this.graphRoot);
}

MySceneGraph.prototype.getLights = function() {
	return this.lights;
}

/*
  _____ _      _     _    _ __  __ _____ _   _       _______ _____ ____  _   _ 
 |_   _| |    | |   | |  | |  \/  |_   _| \ | |   /\|__   __|_   _/ __ \| \ | |
   | | | |    | |   | |  | | \  / | | | |  \| |  /  \  | |    | || |  | |  \| |
   | | | |    | |   | |  | | |\/| | | | | . ` | / /\ \ | |    | || |  | | . ` |
  _| |_| |____| |___| |__| | |  | |_| |_| |\  |/ ____ \| |   _| || |__| | |\  |
 |_____|______|______\____/|_|  |_|_____|_| \_/_/    \_\_|  |_____\____/|_| \_|
                                                                               
*/
MySceneGraph.prototype.parseIllumination = function (root) {

	var globalAmbient = this.parseRGBA(root, 'ambient');	
	var error = this.checkValue(globalAmbient, 'ambient', root.nodeName);
	if (error != null) {
		return error;
	}

	var globalDoubleside = this.parseBoolean(root, 'doubleside');
	var error = this.checkValue(globalDoubleside, 'doubleside', root.nodeName);
	if (error != null) {
		return error;
	}

	var globalBackground = this.parseRGBA(root, 'background');
	var error = this.checkValue(globalBackground, 'background', root.nodeName);
	if (error != null) {
		return error;
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

/*
  _______ _____            _   _  _____ ______ ____  _____  __  __ 
 |__   __|  __ \     /\   | \ | |/ ____|  ____/ __ \|  __ \|  \/  |
    | |  | |__) |   /  \  |  \| | (___ | |__ | |  | | |__) | \  / |
    | |  |  _  /   / /\ \ | . ` |\___ \|  __|| |  | |  _  /| |\/| |
    | |  | | \ \  / ____ \| |\  |____) | |   | |__| | | \ \| |  | |
    |_|  |_|  \_\/_/    \_\_| \_|_____/|_|    \____/|_|  \_\_|  |_|

*/

MySceneGraph.prototype.parseRotation = function (id, axis, angle, axisFound) {

	if (axis != 'x' && axis != 'y' && axis != 'z') {
		this.onXMLWarning("unknown rotation axis '" + axis + "' found in <rotate>.");
		return false;
	}

	if (axisFound[axis]) {
		this.onXMLWarning("more than two 'rotate' properties found for axis " + axis + " in <INITIALS>!");
		return false;
	}

	axisFound[axis] = true;
	this.scene.setRotation(id, axis, angle);

	return true;
};

MySceneGraph.prototype.getNodeTexture = function(currTextureId, nextElement) {

	if (nextElement.textureId == 'null') {
		return currTextureId;
	}

	if (nextElement.textureId == 'clear') {
		return null;
	}

	return nextElement.textureId;
}

MySceneGraph.prototype.getNodeMaterial = function(currMaterialId, nextElement) {

	if (nextElement.materialId == 'null') {
		return currMaterialId;
	}

	return nextElement.materialId;
}

MySceneGraph.prototype.parseNodeScale = function (root, node, id) {

	var coords = this.parseNodeCoordinates(root, 'sx', 'sy', 'sz');
	var error = this.checkValue(coords, 'coordinates', root.nodeName, id);
	
	if (error != null) {
		return error;
	}

	mat4.scale(node.matrix, node.matrix, coords);

	if (this.verbose) {
		console.log("\t\tnode with id=" + id + " has scale: { sx=" + coords[0] + " sy=" + coords[1] + " sz=" + coords[2] + " }");
	}

	return null;
};

MySceneGraph.prototype.parseNodeTranslation = function(root, node, id) {

	var coords = this.parseNodeCoordinates(root, 'x', 'y', 'z');				
	var error = this.checkValue(coords, 'coordinates', root.nodeName, id);
	
	if (error != null) {
		return error;
	}

	mat4.translate(node.matrix, node.matrix, coords);			

	if (this.verbose) {
		console.log("\t\tnode with id=" + id + " has translation: { x=" + coords[0] + " y=" + coords[1] + " z=" + coords[2] + " }");
	}

	return null;
}

MySceneGraph.prototype.parseNodeRotation = function(root, node, id) {

	var parent = root.nodeName;
	var parseErrors = 0;
	var axis = this.reader.getString(root, 'axis', true);
	var error = this.checkValue(axis, 'axis', parent, id);
	
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var angle = this.reader.getFloat(root, 'angle', true);
	var error = this.checkValue(angle, 'angle', parent, id);
	
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
	}

    if (axis == 'x') {
        mat4.rotateX(node.matrix, node.matrix, angle * Math.PI / 180);
    }
    else if (axis == 'y') {
        mat4.rotateY(node.matrix, node.matrix, angle * Math.PI / 180);
    }
    else if (axis == 'z') {
        mat4.rotateZ(node.matrix, node.matrix, angle * Math.PI / 180);
    }

	if (this.verbose) {
		console.log("\t\tnode with id=" + id + " has rotation: { axis=" + axis + " angle=" + angle + " }");
	}

	return null;
}

MySceneGraph.prototype.onElementDuplicate = function(parent, id) {
	return parent + " with id=" + id + " already exists, skipping...";
}

MySceneGraph.prototype.onReservedId = function(id, root) {
	return parent + " ith id=" + id + " has a reserved id (null, clear), skipping...";
}

MySceneGraph.prototype.onInvalidArguments = function(id, argsGot, argsExpected) {	
	return "LEAF with id=" + id + " has " + argsGot + " arguments, expected " + argsExpected + ".";
}

/*
  _____  _____  _____ __  __ _____ _______ _______      ________  _____ 
 |  __ \|  __ \|_   _|  \/  |_   _|__   __|_   _\ \    / /  ____|/ ____|
 | |__) | |__) | | | | \  / | | |    | |    | |  \ \  / /| |__  | (___  
 |  ___/|  _  /  | | | |\/| | | |    | |    | |   \ \/ / |  __|  \___ \ 
 | |    | | \ \ _| |_| |  | |_| |_   | |   _| |_   \  /  | |____ ____) |
 |_|    |_|  \_\_____|_|  |_|_____|  |_|  |_____|   \/   |______|_____/ 

*/

MySceneGraph.prototype.readRectangle = function(id, args) {

	if (args.length != 4) {
		return this.onInvalidArguments(id, leafArgs.length, 4);
	}

	var vec1 = [args[0], args[1]].map(parseFloat);
	if (vec1[0] != vec1[0] || vec1[1] != vec1[1]) {
		return this.onAttributeInvalid('first rectangle vertex', id, 'RECTANGLE');
	}

	var vec2 = [args[2], args[3]].map(parseFloat);
	if (vec2[0] != vec2[0] || vec2[1] != vec2[1]) {
		return this.onAttributeInvalid('second rectangle vertex', id, 'RECTANGLE');
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
		return this.onAttributeInvalid('first triangle vertex', id, 'TRIANGLE');
	}

	var vec2 = [leafArgs[3], leafArgs[4], leafArgs[5]].map(parseFloat);
	if (vec2[0] != vec2[0] || vec2[1] != vec2[1] || vec2[2] != vec2[2]) {
		return this.onAttributeInvalid('second triangle vertex', id, 'TRIANGLE');
	}

	var vec3 = [leafArgs[6], leafArgs[7], leafArgs[8]].map(parseFloat);
	if (vec3[0] != vec3[0] || vec3[1] != vec3[1] || vec3[2] != vec3[2]) {
		return this.onAttributeInvalid('third triangle vertex', id, 'TRIANGLE');
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
		return this.onAttributeInvalid('cylinder height', id, 'CYLINDER');
	}

	var myRadiusBottom = parseFloat(args[1]);
	if (myRadiusBottom != myRadiusBottom) {
		return this.onAttributeInvalid('cylinder bottom radius', id, 'CYLINDER');
	}

	var myRadiusTop = parseFloat(args[2]);
	if (myRadiusTop != myRadiusTop) {
		return this.onAttributeInvalid('cylinder top radius', id, 'CYLINDER');
	}

	var myStacks = parseInt(args[3]);
	if (myStacks != myStacks) {
		return this.onAttributeInvalid('number of stacks', id, 'CYLINDER');
	}
	
	var mySlices = parseInt(args[4]);
	if (mySlices != mySlices) {
		return this.onAttributeInvalid('number of slices', id, 'CYLINDER');
	}

	this.leaves[id] = new MyCylinder(this.scene, myRadiusBottom, myRadiusTop, myHeight,	mySlices, myStacks);

	return null;
}

MySceneGraph.prototype.readSphere = function(id, leafArgs) {

	if (leafArgs.length != 3) {
		return this.onInvalidArguments(id, leafArgs.length, 3);
	}

	var myRadius = parseFloat(leafArgs[0]);
	if (myRadius != myRadius) {
		return this.onAttributeInvalid('sphere radius', id, 'SPHERE');
	}

	var myStacks = parseInt(leafArgs[1]);
	if (myStacks != myStacks) {
		return this.onAttributeInvalid('number of stacks', id, 'SPHERE');
	}
	
	var mySlices = parseInt(leafArgs[2]);
	if (mySlices != mySlices) {
		return this.onAttributeInvalid('number of slices', id, 'SPHERE');
	}

	this.leaves[id] = new MySphere(this.scene, myRadius, myStacks, mySlices);

	return null;
}

MySceneGraph.prototype.checkProperty = function(name, parentName, condition) {

	if (!condition) {
		console.warning("WARNING: multiple definitions for property '" + name + " found in <" + parentName + ">!");
	}
}

MySceneGraph.prototype.checkReference = function (array, name, nodeId, objectId) {

	if (objectId == 'null' || objectId == 'clear') {
		return null;
	}

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

/*
  _____        _____   _____ ______ _____   _____ 
 |  __ \ /\   |  __ \ / ____|  ____|  __ \ / ____|
 | |__) /  \  | |__) | (___ | |__  | |__) | (___  
 |  ___/ /\ \ |  _  / \___ \|  __| |  _  / \___ \ 
 | |  / ____ \| | \ \ ____) | |____| | \ \ ____) |
 |_| /_/    \_\_|  \_\_____/|______|_|  \_\_____/ 
                                                  
*/

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

MySceneGraph.prototype.parseNodeCoordinates = function (node, coordA, coordB, coordC) {

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

	return [x, y, z];
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
	return this.reader.getFloat(node[0], attribute);
}

MySceneGraph.prototype.parseString = function(root, name, attribute) {

	var node = root.getElementsByTagName(name);
	if (node == null || node.length == 0) {
		return null;
	}

	this.checkProperty(name, root.nodeName, node.length == 1);
	return this.reader.getString(node[0], attribute);
}

/*
           _____  _____        __     _______ 
     /\   |  __ \|  __ \     /\\ \   / / ____|
    /  \  | |__) | |__) |   /  \\ \_/ / (___  
   / /\ \ |  _  /|  _  /   / /\ \\   / \___ \ 
  / ____ \| | \ \| | \ \  / ____ \| |  ____) |
 /_/    \_\_|  \_\_|  \_\/_/    \_\_| |_____/ 
                                              
*/

MySceneGraph.prototype.parseArray = function(rootElement, nodeName, parseFunc) {

	var parent = rootElement.nodeName;

	for (var i = 0; i < rootElement.children.length; i++) {
		
		var currentElement = rootElement.children[i];

		if (currentElement.nodeName != nodeName) {
			this.onXMLWarning("element in " + rootElement.nodeName + " has invalid name (expected " + nodeName + ", got " + currentElement.nodeName + ").");
			continue;
		}
		
		var id = this.reader.getString(currentElement, 'id');

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

/*
  _   _  ____  _____  ______  _____ 
 | \ | |/ __ \|  __ \|  ____|/ ____|
 |  \| | |  | | |  | | |__  | (___  
 | . ` | |  | | |  | |  __|  \___ \ 
 | |\  | |__| | |__| | |____ ____) |
 |_| \_|\____/|_____/|______|_____/ 
                                    
*/

MySceneGraph.prototype.parseNodes = function (root) {

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

MySceneGraph.prototype.parseNode = function (id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	if (id in this.nodes) {
		return this.onElementDuplicate(parent, id);
	}

	if (id == 'null' || id == 'clear') {
		return this.onReservedId(parent, id);
	}

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

	var node = new XMLNode(id, nodeTexture, nodeMaterial);
	var node_sz = root.children.length;

	for (var i = 2; i < node_sz; i++) {
		var tranf = root.children[i];
		var res = null;

		if (tranf.nodeName == 'TRANSLATION') {
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
			this.onXMLWarning("\t\tunexpected tag: " + tranf.nodeName + " found in " + parent + ", skipping.... ");
		}

		if (res != null) {
			return this.onXMLError(res);
		}
	}

	var nodeDescendants = root.getElementsByTagName('DESCENDANTS')[0].children;
	node_sz = nodeDescendants.length;

	console.log("Descendents: ");
	if (node_sz == 0) {
		console.error("Node with id=" + id + " has no descendets!");
	}
	for (var i = 0; i < node_sz; i++) {
		var idd = this.reader.getString(nodeDescendants[i], 'id', true);
		node.addChild(idd);
		console.log("\t\tid=" + idd);
	}

	this.nodes[id] = node;

	return null;
}

/*
  _      _____ _____ _    _ _______ _____ 
 | |    |_   _/ ____| |  | |__   __/ ____|
 | |      | || |  __| |__| |  | | | (___  
 | |      | || | |_ |  __  |  | |  \___ \ 
 | |____ _| || |__| | |  | |  | |  ____) |
 |______|_____\_____|_|  |_|  |_| |_____/ 
                                          
*/

MySceneGraph.prototype.parseLights = function (root) {
	return this.parseArray(root, 'LIGHT', this.parseLight);
}

MySceneGraph.prototype.parseLight = function (id, root) {

	var parseErrors = 0;
	var parent = root.nodeName;

	if (id in this.lights) {
		return this.onElementDuplicate(parent, id);
	}

	if (id == 'null' || id == 'clear') {
		return this.onReservedId(parent, id);
	}

	var lightEnabled = this.parseBoolean(root, 'enable');
	var error = this.checkValue(lightEnabled, 'enable', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var lightPosition = this.parseCoordinatesXYZW(root, 'position');
	var error = this.checkValue(lightPosition, 'position', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var lightAmbient = this.parseRGBA(root, 'ambient');
	var error = this.checkValue(lightAmbient, 'ambient', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var lightDiffuse = this.parseRGBA(root, 'diffuse');
	var error = this.checkValue(lightDiffuse, 'diffuse', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var lightSpecular = this.parseRGBA(root, 'specular');
	var error = this.checkValue(lightSpecular, 'specular', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
	}

	this.lights[id] = this.scene.pushLight(id, lightEnabled, lightPosition, lightAmbient, lightDiffuse, lightSpecular);

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

/*
  __  __       _______ ______ _____  _____          _       _____ 
 |  \/  |   /\|__   __|  ____|  __ \|_   _|   /\   | |     / ____|
 | \  / |  /  \  | |  | |__  | |__) | | |    /  \  | |    | (___  
 | |\/| | / /\ \ | |  |  __| |  _  /  | |   / /\ \ | |     \___ \ 
 | |  | |/ ____ \| |  | |____| | \ \ _| |_ / ____ \| |____ ____) |
 |_|  |_/_/    \_\_|  |______|_|  \_\_____/_/    \_\______|_____/ 
                                                                 
*/

MySceneGraph.prototype.parseMaterials = function(root) {
	return this.parseArray(root, 'MATERIAL', this.parseMaterial);
}

MySceneGraph.prototype.parseMaterial = function (id, root) {

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
		this.onXMLWarning(error);
	}

	var materialSpecular = this.parseRGBA(root, 'specular');
	var error = this.checkValue(materialSpecular, 'specular', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var materialDiffuse = this.parseRGBA(root, 'diffuse');
	var error = this.checkValue(materialDiffuse, 'diffuse', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var materialAmbient = this.parseRGBA(root, 'ambient');
	var error = this.checkValue(materialAmbient, 'ambient', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var materialEmission = this.parseRGBA(root, 'emission');
	var error = this.checkValue(materialEmission, 'emission', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
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
		this.printHeader('MATERIAL', id);
		this.printValues('shininess', 'value', materialShininess);
		this.printRGBA('specular', materialSpecular);
		this.printRGBA('diffuse', materialDiffuse);
		this.printRGBA('ambient', materialAmbient);
		this.printRGBA('emission', materialEmission);
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
                                                           
*/

MySceneGraph.prototype.parseTextures = function(rootElement) {
	return this.parseArray(rootElement, 'TEXTURE', this.parseTexture);
}

MySceneGraph.prototype.parseTexture = function (id, root)
{
	var parent = root.nodeName;
	var parseErrors = 0;

	if (id in this.textures) {
		return this.onElementDuplicate(parent, id);
	}

	if (id == 'null' || id == 'clear') {
		return this.onReservedId(parent, id);;
	}

	var texturePath = this.parseString(root, 'file', 'path');
	if (texturePath == null) {
		parseErrors++;
		this.onXMLWarning(this.onAttributeMissing('file', id, parent));
	}

	var textureS = this.parseFloat(root, 'amplif_factor', 's');
	var error = this.checkValue(textureS, 'amplification factor S', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var textureT = this.parseFloat(root, 'amplif_factor', 't');
	var error = this.checkValue(textureT, 'amplification factor T', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	if (parseErrors != 0) {
		return this.onParseError(parent, parseErrors, id);
	}

	var textureObject = new CGFtexture(this.scene, texturePath);

	if (textureObject == null) {
	 	return texturePath + " not found.";
	}

	this.textures[id] = new XMLtexture(textureObject, textureS, textureT);

	if (this.verbose) {
		this.printHeader('TEXTURE', id);
		this.printValues('file', 'path', texturePath);
		this.printValues('amplif_factor', 's', textureS, 't', textureT);
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
                                           
*/

MySceneGraph.prototype.parseLeaves = function (root) {
	return this.parseArray(root, 'LEAF', this.parseLeaf);
}

MySceneGraph.prototype.parseLeaf = function (id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	if (id in this.leaves) {
		return this.onElementDuplicate(parent, id);
	}

	var leafType = this.reader.getItem(root, 'type', this.primitiveTypes);
	var error = this.checkValue(leafType, 'type', parent, id);
	if (error != null) {
		parseErrors++;
		this.onXMLWarning(error);
	}

	var leafArgs = this.reader.getString(root, 'args', true).trim().split(' ');
	if (leafArgs == null) {
		parseErrors++;
		this.onXMLWarning(error);
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
		this.onXMLWarning(error);
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

/*
   _____ _      ____  ____          _       _____ 
  / ____| |    / __ \|  _ \   /\   | |     / ____|
 | |  __| |   | |  | | |_) | /  \  | |    | (___  
 | | |_ | |   | |  | |  _ < / /\ \ | |     \___ \ 
 | |__| | |___| |__| | |_) / ____ \| |____ ____) |
  \_____|______\____/|____/_/    \_\______|_____/ 
                                                  
*/

MySceneGraph.prototype.parseGlobals = function(root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	// <frustum near="ff" far="ff" />	
	var globalFrustumNear = this.parseFloat(root, 'frustum', 'near');
	var error = this.checkValue(globalFrustumNear, 'near', 'frustum');
	if (error != null) {
		return error;
	}

	// <frustum near="ff" far="ff" />	
	var globalFrustumFar = this.parseFloat(root, 'frustum', 'far');
	var error = this.checkValue(globalFrustumFar, 'far', 'frustum');
	if (error != null) {
		return error;
	}

	// <reference length="ff" />
	var globalReference = this.parseFloat(root, 'reference', 'length');
	var error = this.checkValue(globalReference, 'length', 'reference');
	if (error != null) {
		return error;
	}

	// <scale sx="ff" sy="ff" sz="ff" />
	var globalScale = this.parseCoordinatesScale(root, 'scale');
	var error = this.checkValue(globalScale, 'scale', parent);
	if (error != null) {
		return error;
	}

	// <translate x="ff" y="ff" z="ff"/>
	var globalTranslate = this.parseCoordinatesXYZ(root, 'translate');
	var error = this.checkValue(globalTranslate, 'translate', parent);
	if (error != null) {
		return error;
	}
	
	// <rotate axis="x" angle="ff" />
	// <rotate axis="y" angle="ff" />
	// <rotate axis="z" angle="ff" />
	//
	var node = root.getElementsByTagName('rotation');
	var node_sz = node.length;

	if (node == null || node_sz == 0) {
		return this.onElementMissing('rotation', parent);
	}
	
	// inicialização de um array associativo para registar as coordenadas lidas
	var axisFound = {
		'x': false, 
		'y': false,
		'z': false
	};

	var j = 0;

	for (var i = 0; i < node_sz; i++) {

		var axis = this.reader.getItem(node[i], 'axis', this.axisTypes);
		var error = this.checkValue(axis, 'rotation axis', parent);
		
		if (error != null) {
			return error;
		}

		var angle = this.reader.getFloat(node[i], 'angle');
		var error = this.checkValue(angle, 'rotation angle', parent);

		if (error != null) {
			return error;
		}
		
		if (this.parseRotation(j, axis, angle, axisFound) == true) {
			j++;
		}
	}

	// verificar se as três coordenadas estão presentes
	if (!axisFound['x']) {
		return "X rotation axis is missing from <INITIALS>";
	}

	if (!axisFound['y']) {
		return "Y rotation axis is missing from <INITIALS>";
	}

	if (!axisFound['z']) {
		return "Z rotation axis is missing from <INITIALS>";
	}

	this.scene.initAxis(globalReference);
	this.scene.initFrustum(globalFrustumNear, globalFrustumFar);
	this.scene.initScale(globalScale);
	this.scene.initTranslate(globalTranslate);

	if (this.verbose) {
		this.printHeader('INITIALS');
		this.printValues('frustum', 'near', globalFrustumNear, 'far', globalFrustumFar);
		this.printXYZ('translate', globalTranslate);
		this.printValues('rotation', 'axis', 'x', 'angle', this.scene.rotation[0]);
		this.printValues('rotation', 'axis', 'y', 'angle', this.scene.rotation[1]);
		this.printValues('rotation', 'axis', 'z', 'angle', this.scene.rotation[2]);
		this.printXYZ('scale', globalScale);
		this.printValues('reference', 'length', globalReference);
	}
	
	return null;
};


/*
  _____ _____  _____ _____  _           __     __
 |  __ \_   _|/ ____|  __ \| |        /\\ \   / /
 | |  | || | | (___ | |__) | |       /  \\ \_/ / 
 | |  | || |  \___ \|  ___/| |      / /\ \\   /  
 | |__| || |_ ____) | |    | |____ / ____ \| |   
 |_____/_____|_____/|_|    |______/_/    \_\_|   
                                                 
*/

MySceneGraph.prototype.processNodes = function() {

	var rootNode = this.nodes[this.graphRoot];
	this.scene.pushMatrix();
	this.scene.applyMaterial(this.materials[rootNode.materialId]);
	this.processNodesAux(rootNode, rootNode.materialId, rootNode.textureId);
	this.scene.popMatrix();
};

MySceneGraph.prototype.processNodesAux = function(node, materialId, textureId) {

	this.scene.multMatrix(node.matrix);

	for (var i = 0; i < node.children.length; i++) {			
		
		var nextId = node.children[i];
		var nextElement = null;
		var isLeaf = false;
		var mId = materialId;
		var tId = textureId;

		if (nextId in this.nodes) {
			nextElement = this.nodes[nextId];
		}	
		else if(nextId in this.leaves) {
			isLeaf = true;
			nextElement = this.leaves[nextId];			
		}
		else {
			continue;
		}

		if (isLeaf) 
		{
			var leafMaterial = null;

			if (mId == null || mId == 'null') {
				leafMaterial = this.defaultMaterial;
			}
			else {
				leafMaterial = this.materials[mId];
			}

			if (tId == null) {
				leafMaterial.setTexture(null);
			}
			else {
				var leafTexture = this.textures[tId];

				//nextElement.setTextureFactor(leafTexture.factorS, leafTexture.factorT);
				leafMaterial.setTexture(leafTexture.path);	
			}
			
			this.scene.applyMaterial(leafMaterial);
			this.scene.drawPrimitive(nextElement);
			this.onProcessNode("Drawing", nextId);
		}
		else 
		{
			this.scene.pushMatrix();	
			this.processNodesAux(nextElement, this.getNodeMaterial(mId, nextElement), this.getNodeTexture(tId, nextElement));			
			this.scene.popMatrix();
		}		
	}
}

MySceneGraph.prototype.resetIndegree = function() {

	for (var node in this.nodes) {
		var children = this.nodes[node].children;
		for (var i = 0; i < children.length; i++) {
			if (children[i] in this.nodes) {
				this.nodes[children[i]].indegree++;
			}
		}
	}
}

MySceneGraph.prototype.removeOrphans = function () {

	for (var node in this.nodes) {
		var nodeIndegree = this.nodes[node].indegree;
		this.onDebug("[PROCESS NODES] node id=" + node + " has indegree=" + this.nodes[node].indegree);
		if (nodeIndegree == 0 && node != this.graphRoot) {
			this.onProcessNode("Erasing", node);
			delete this.nodes[node];
		}
	}
}

MySceneGraph.prototype.validateNodes = function() {

	var ready = false;

	do {
		ready = true;

		for(var node in this.nodes) {	

			var children = this.nodes[node].children;
			//console.log("Processing id=" + this.nodes[i].id)

			for(var n = 0; n < children.length; n++) {				
				if (!((children[n] in this.leaves || children[n] in this.nodes) && children[n] != this.nodes[node].id)) {
					this.onDebug("Erasing reference with id=" + children[n] + " from node id=" + this.nodes[node].id);				
					this.nodes[node].children.splice(n, 1);
					n--;
				}
			}

			if (this.nodes[node].children.length == 0) {
				this.onProcessNode("Deleting", this.nodes[node]);
				delete this.nodes[node];
				ready = false;		
			}
		}		
	} while(!ready);
}

/*       
  _      ____   _____  _____ _____ _   _  _____ 
 | |    / __ \ / ____|/ ____|_   _| \ | |/ ____|
 | |   | |  | | |  __| |  __  | | |  \| | |  __ 
 | |   | |  | | | |_ | | |_ | | | | . ` | | |_ |
 | |___| |__| | |__| | |__| |_| |_| |\  | |__| |
 |______\____/ \_____|\_____|_____|_| \_|\_____|
                                  
*/

MySceneGraph.prototype.printValues = function ()
{
	if (arguments.length < 3) {
		return;
	}

	var string = "\t\t" + arguments[0] + ": { ";

	for (var i = 1; i < arguments.length; i += 2) {

		string += arguments[i] + "=" + arguments[i + 1];

		if (i + 2 < arguments.length) {
			string += ", ";
		}
	}

	string += " }";
	console.log(string);
}

MySceneGraph.prototype.printHeader = function (attribute, id) {

	if (id == undefined) {
		console.log("[" + attribute + "]");
	}
	else {
		console.log(attribute + " sucessfully read from file [ID=" + id + "]");
	}
}

MySceneGraph.prototype.printXYZ = function (attribute, xyz) {
	console.log("\t\t" + attribute + ": { x=" + xyz[0] + ", y=" + xyz[1] + ", z=" + xyz[2] + " }");
}

MySceneGraph.prototype.printRGBA = function (attribute, rgba) {
	console.log("\t\t" + attribute + ": { r=" + rgba[0] + ", g=" + rgba[1] + ", b=" + rgba[2] + ", a=" + rgba[3] + " }");
}

MySceneGraph.prototype.printXYZW = function (attribute, xyzw) {
	console.log("\t\t" + attribute + ": { x=" + xyzw[0] + ", y=" + xyzw[1] + ", z=" + xyzw[2] + ", w=" + xyzw[3] + " }");
}

MySceneGraph.prototype.onProcessNode = function(message, id) {
	
	if (this.debug) {
		console.log("[PROCESS NODES] " + message + ": " + id);
	}
}

MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: " + message);	
	this.loadedOk = false;
};

MySceneGraph.prototype.onXMLWarning = function (message) {
	console.warn("WARNING: " + message);	
};

MySceneGraph.prototype.onDebug = function (message) {
	if (this.debug) {
		console.log("DEBUG: " + message);
	}
}