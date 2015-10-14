function MySceneGraph(filename, scene) {
	
	this.loadedOk = null;
	this.scene = scene;
	this.verbose = true;
	
	scene.graph = this;

	this.lights = {};
	this.textures = {};
	this.materials = {};
	this.leaves = {};
	this.nodes = {};

	this.defaultMaterial = new CGFappearance(this.scene);
	this.defaultMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.defaultMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
	this.defaultMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);

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

MySceneGraph.prototype.onXMLReady = function() 
{
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
	
	if (this.graphRoot in this.nodes) {
		this.loadedOk = true;
		this.scene.onGraphLoaded();
	}
	else {
		this.onXMLError("invalid graph root '" + this.graphRoot + "'' not found in <NODES>!");
	}
};

/*
  _____ _____  _____ _____  _           __     __
 |  __ \_   _|/ ____|  __ \| |        /\\ \   / /
 | |  | || | | (___ | |__) | |       /  \\ \_/ / 
 | |  | || |  \___ \|  ___/| |      / /\ \\   /  
 | |__| || |_ ____) | |    | |____ / ____ \| |   
 |_____/_____|_____/|_|    |______/_/    \_\_|   
                                                 
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

MySceneGraph.prototype.processNodes = function(node, materialId, textureId) {

	this.scene.multMatrix(node.matrix);

	for (var i = 0; i < node.children.length; i++) {			
		
		var nextId = node.children[i];	
		var mId = materialId;
		var tId = textureId;

		if (nextId in this.leaves) {

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
		else if (nextId in this.nodes) {
			var nextElement = this.nodes[nextId];
			this.scene.pushMatrix();	
			this.processNodes(nextElement, this.getNodeMaterial(mId, nextElement), this.getNodeTexture(tId, nextElement));			
			this.scene.popMatrix();
		}
	}
};

MySceneGraph.prototype.getNodeTexture = function(currTextureId, nextElement) {

	if (nextElement.textureId == 'null') {
		return currTextureId;
	}

	if (nextElement.textureId == 'clear') {
		return null;
	}

	return nextElement.textureId;
};

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

MySceneGraph.prototype.parseNodeScale = function(root, node, id) {

	var coords = this.parseNodeCoordinates(root, 'sx', 'sy', 'sz');
	var error = checkValue(coords, 'coordinates', root.nodeName, id);
	
	if (error != null) {
		return error;
	}

	node.scale(coords);

	if (this.verbose) {
		printXYZ('SCALE', coords);
	}

	return null;
};

MySceneGraph.prototype.parseNodeTranslation = function(root, node, id) {

	var coords = this.parseNodeCoordinates(root, 'x', 'y', 'z');				
	var error = checkValue(coords, 'coordinates', root.nodeName, id);
	
	if (error != null) {
		return error;
	}

	node.translate(coords);		

	if (this.verbose) {
		printXYZ('TRANSLATION', coords);
	}

	return null;
}

MySceneGraph.prototype.parseNodeRotation = function(root, node, id) {

	var parent = root.nodeName;
	var parseErrors = 0;
	var axis = this.reader.getString(root, 'axis', true);
	var error = checkValue(axis, 'axis', parent, id);
	
	if (error != null) {
		return error;
	}

	if (axis != 'x' && axis != 'y' && axis != 'z') {
		onUnknownAxis(axis, root.nodeName, 'NODE');
	}

	var angle = this.reader.getFloat(root, 'angle', true);
	error = checkValue(angle, 'angle', parent, id);
	
	if (error != null) {
		parseErrors++;
		onXMLWarning(error);
	}

    if (parseErrors != 0) {
		return onParseError(parent, parseErrors, id);
	}
	
	node.rotate(axis, angle);

	if (this.verbose) {
		printValues('ROTATION', 'axis', axis, 'angle', angle);
	}

	return null;
}

/*
  _____  _____  _____ __  __ _____ _______ _______      ________  _____ 
 |  __ \|  __ \|_   _|  \/  |_   _|__   __|_   _\ \    / /  ____|/ ____|
 | |__) | |__) | | | | \  / | | |    | |    | |  \ \  / /| |__  | (___  
 |  ___/|  _  /  | | | |\/| | | |    | |    | |   \ \/ / |  __|  \___ \ 
 | |    | | \ \ _| |_| |  | |_| |_   | |   _| |_   \  /  | |____ ____) |
 |_|    |_|  \_\_____|_|  |_|_____|  |_|  |_____|   \/   |______|_____/ 

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
}

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
}

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
}

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

	if (node.length != 1) {
		onMultipleDefinitions(attribute, root.nodeName);
	}

	if (!node[0].hasAttribute('value')) {
		return null;
	}

	var checkResult = this.reader.getBoolean(node[0], 'value', true);
	
	return checkResult == null ? NaN : checkResult;
}

MySceneGraph.prototype.parseNodeCoordinates = function(node, coordA, coordB, coordC) {

	if (!node.hasAttribute(coordA) | !node.hasAttribute(coordB) || !node.hasAttribute(coordC)) {
		return NaN;
	}

	var x = this.reader.getFloat(node, coordA);
	var y = this.reader.getFloat(node, coordB);
	var z = this.reader.getFloat(node, coordC);

	if (x != x || y != y || z != z) {
		return NaN;
	}

	return [ x, y, z ];
}

MySceneGraph.prototype.parseCoordinates = function(root, attribute) {

	var error = false;
	var arr = [];

	if (arguments.length < 5) {
		return null;
	}
	
	var node = root.getElementsByTagName(attribute);

	if (node == null || node.length == 0) {
		return null;
	}

	if (node.length != 1) {
		onMultipleDefinitions(attribute, root.nodeName);
	}

	for (var i = 2; i < arguments.length; i++) {

		var coordName = arguments[i];

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
}

MySceneGraph.prototype.parseCoordinatesRGBA = function(root, attribute) {
	return this.parseCoordinates(root, attribute, 'r', 'g', 'b', 'a');
}

MySceneGraph.prototype.parseCoordinatesXYZ = function(root, attribute) {
	return this.parseCoordinates(root, attribute, 'x', 'y', 'z');
}

MySceneGraph.prototype.parseCoordinatesXYZW = function(root, attribute) {
	return this.parseCoordinates(root, attribute, 'x', 'y', 'z', 'w');
}

MySceneGraph.prototype.parseCoordinatesScale = function(root, attribute) {
	return this.parseCoordinates(root, attribute, 'sx', 'sy', 'sz');
}

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
}

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

	var childrenSize = rootElement.children.length;
	var parent = rootElement.nodeName;

	if (childrenSize == 0) {
		return "<" + parent + "> is empty.";
	}

	for (var i = 0; i < childrenSize; i++) {
		
		var currentElement = rootElement.children[i];

		if (currentElement.nodeName != nodeName) {
			console.warn("WARNING: invalid tag found <" + currentElement.nodeName + "> found in <" + parent + ">, expected <" + nodeName + ">!");
			continue;
		}
		
		if (!currentElement.hasAttribute('id')) {
			console.warn("WARNING: <" + currentElement.nodeName + "> with index=" + i + " is missing ID!");
			continue;
		}

		var id = this.reader.getString(currentElement, 'id');
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
}

MySceneGraph.prototype.parseNode = function(id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;
	var nodeMaterial = null;
	var nodeTexture = null;

	if (id in this.nodes) {
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

	var node = new XMLNode(id, nodeTexture, nodeMaterial);
	var node_sz = root.children.length;

	for (var i = 2; i < node_sz; i++) {
	
		var child = root.children[i];
		var error = null;

		if (child.nodeName == 'TRANSLATION') {
			error = this.parseNodeTranslation(child, node, id);
		}
		else if (child.nodeName == 'ROTATION') {
			error = this.parseNodeRotation(child, node, id);
		}
		else if (child.nodeName == 'SCALE') {
			error = this.parseNodeScale(child, node, id);
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
}

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

MySceneGraph.prototype.parseLights = function(root) {
	return this.parseArray(root, 'LIGHT', this.parseLight);
}

MySceneGraph.prototype.parseLight = function(id, root) {

	var parseErrors = 0;
	var parent = root.nodeName;

	if (id in this.lights) {
		return onElementDuplicate(parent, id);
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
}

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

MySceneGraph.prototype.parseMaterials = function(root) {
	return this.parseArray(root, 'MATERIAL', this.parseMaterial);
}

MySceneGraph.prototype.parseMaterial = function(id, root) {

	var parent = root.nodeName;
	var parseErrors = 0;

	if (id in this.materials) {
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

MySceneGraph.prototype.parseTextures = function(rootElement) {
	return this.parseArray(rootElement, 'TEXTURE', this.parseTexture);
}

MySceneGraph.prototype.parseTexture = function(id, root)
{
	var parent = root.nodeName;
	var parseErrors = 0;

	if (id in this.textures) {
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

MySceneGraph.prototype.parseLeaves = function(root) {
	return this.parseArray(root, 'LEAF', this.parseLeaf);
};

MySceneGraph.prototype.parseLeaf = function(id, root) {

	var parent = root.nodeName;

	if (id in this.leaves) {
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

		var angle = this.reader.getFloat(node[i], 'angle');
		error = checkValue(angle, 'rotation angle', parent);

		if (error != null) {
			return error;
		}
		
		if (this.parseSceneRotation(j, axis, angle, axisFound)) {
			j++;
		}
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

MySceneGraph.prototype.parseSceneRotation = function(id, axis, angle, axisFound) {

	if (axisFound[axis]) {
		onMultipleAxis(axis);
		return false;
	}

	axisFound[axis] = true;
	this.scene.setRotation(id, axis, angle);

	return true;
};


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

MySceneGraph.prototype.onXMLError = function(message) {
	console.error("XML Loading ERROR: " + message);	
	this.loadedOk = false;
};