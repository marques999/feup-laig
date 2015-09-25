function MySceneGraph(filename, scene) {
	
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	this.textures = {};
	this.materials = {};
	this.leaves = {};

	this.primitiveTypes = [
		'rectangle',
		'cylinder',
		'sphere',
		'triangle',
	 ];
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.lights = {"default" : XMLlight()}; 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function() 
{
	///////////////////////////////////////////
	// 				   GLOBALS				 //
	///////////////////////////////////////////	

	var rootElement = this.reader.xmlDoc.documentElement;	
	var currentElement = rootElement.getElementsByTagName('INITIALS');
	var error = this.parseGlobals(currentElement[0]);

	if (error != null) {
		this.onXMLError(error);
		return;
	}
	
	///////////////////////////////////////////
	// 				  MATERIALS				 //
	///////////////////////////////////////////	

	currentElement = rootElement.getElementsByTagName('MATERIALS');
	error = this.parseMaterials(currentElement[0]);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	///////////////////////////////////////////
	// 				  TEXTURES				 //
	///////////////////////////////////////////	

	currentElement = rootElement.getElementsByTagName('TEXTURES');
	error = this.parseTextures(currentElement[0]);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	///////////////////////////////////////////
	// 				   LEAVES				 //
	///////////////////////////////////////////	

	currentElement = rootElement.getElementsByTagName('LEAVES');
	error = this.parseLeaves(currentElement[0]);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	////////////////////////////////////////////
	//					DISPLAY				 //
	////////////////////////////////////////////

	this.loadedOk=true;
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

MySceneGraph.prototype.parseCoordinates3 = function(xmlElement, coordA, coordB, coordC) {

	return [
		this.reader.getFloat(xmlElement, coordA, true), 
		this.reader.getFloat(xmlElement, coordB, true),
		this.reader.getFloat(xmlElement, coordC, true)
	];
}

MySceneGraph.prototype.parseRGBA = function(xmlElement) {
	
	return [
		 this.clampRGBA(this.reader.getFloat(xmlElement, 'r', true), 'r'), 
		 this.clampRGBA(this.reader.getFloat(xmlElement, 'g', true), 'g'), 
		 this.clampRGBA(this.reader.getFloat(xmlElement, 'b', true), 'b'),
		 this.clampRGBA(this.reader.getFloat(xmlElement, 'a', true), 'a')
	];
}

MySceneGraph.prototype.parseLights = function(rootElement) {

	var elementLIGHTS = rootElement.getElementsByTagName('LIGHTS');

	if (elementLIGHTS == null) {
		return "LIGHTS element is missing from the scene.";
	}

	this.checkProperty('LIGHTS', 'SCENE', elementLIGHTS.length == 1);
}

MySceneGraph.prototype.checkProperty = function(name, parentName, condition) {

	if (!condition) {
		console.warn("WARNING: multiple definitions for property '" + name + " found in <" + parentName + ">!");
	}
};

MySceneGraph.prototype.parseRotate = function(id, angle, axisFound) {

	if (axisFound[id]) {
		console.warn("WARNING: more than three 'rotate' properties found in <INITIALS>!");
	}
	else {
		axisFound[id] = true;
		this.gRotation[id] = angle;
	}
}

MySceneGraph.prototype.parseTexture = function(id, root) {

	var parent = root.nodeName;
	
	if (id in this.textures) {
		console.warn("WARNING: " + parent + " with id=" + id + " already exists, skipping...");
		return;
	}
	
	var node = root.getElementsByTagName('file');
	var node_sz = node.length;

	if (node == null || node_sz == 0) {
		return "texture with id=" + id + " is missing attribute path.";
	}

	this.checkProperty('path', parent, node_sz == 1);
	var texturePath = this.reader.getString(node[0], 'path', true);
	
	node = root.getElementsByTagName('amplif_factor');
	node_sz = node.length;

	if (node == null || node_sz == 0) {
		return "texture with id=" + id + " is missing amplification factor.";
	}

	this.checkProperty('amplif_factor', parent, node_sz == 1);
	var textureS = this.reader.getFloat(node[0], 's', true);
	var textureT = this.reader.getFloat(node[0], 't', true);
	this.textures[id] = new XMLtexture(texturePath, textureS, textureT);

	return null;
};

MySceneGraph.prototype.checkArguments = function(id, argsGot, argsExpected) {
	
	if (argsGot != argsExpected) {
		console.warn("WARNING: leaf with id=" + id + " has " + argsGot + " arguments, expected " + argsExpected);
	}
}

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
		var radius = leafArgs[0];
		var slices = leafArgs[1];
		var stacks = leafArgs[2];
	}

	return null;
};

MySceneGraph.prototype.parseMaterialRGBA = function(id, root, node_name) {

	var parent = root.nodeName;
	var node = root.getElementsByTagName(node_name);

	if (node == null || node.length == 0) {
		this.onXMLError(parent + " with id=" + id + " is missing attribute '" + node_name + "'.");
		return null;
	}

	this.checkProperty(node_name, parent, node.length == 1);
	
	return this.parseRGBA(node[0]);
}

MySceneGraph.prototype.parseMaterial = function(id, root) {
	
	var parent = root.nodeName;
	
	if (id in this.materials) {
		console.warn("WARNING: " + parent + " with id=" + id + " already exists, skipping...");
		return;
	}
	
	var node = root.getElementsByTagName('shininess');
	var node_sz = node.length;

	if (node == null || node_sz == 0) {
		return "WARNING: " + parent + " with id=" + id + " is missing attribute '" + 'shininess' + "'.";
	}

	this.checkProperty('shininess', parent, node_sz == 1);

	var materialShininess = this.reader.getFloat(node[0], 'value');
	var materialSpecular = this.parseMaterialRGBA(id, root, 'specular');
	var materialDiffuse = this.parseMaterialRGBA(id, root, 'diffuse');
	var materialAmbient = this.parseMaterialRGBA(id, root, 'ambient');
	var materialEmission = this.parseMaterialRGBA(id, root, 'emission');

	if (materialSpecular == null || materialDiffuse == null || materialAmbient == null || materialEmission == null) {
		return "could not parse material with id=" + id + ".";
	}

	var myMaterial = new CGFappearance(this.scene);

	myMaterial.setAmbient(materialAmbient);
	myMaterial.setDiffuse(materialDiffuse);
	myMaterial.setEmission(materialEmission);
	myMaterial.setSpecular(materialSpecular);
	myMaterial.setShininess(materialShininess);
	
	this.materials[id] = myMaterial;
	
	return null;
};

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

MySceneGraph.prototype.parseTextures = function(rootElement) {
	return this.parseArray(rootElement, 'TEXTURE', this.parseTexture);
}

MySceneGraph.prototype.parseMaterials = function(rootElement) {
	return this.parseArray(rootElement, 'MATERIAL', this.parseMaterial);
}

MySceneGraph.prototype.parseLeaves = function(rootElement) {
	return this.parseArray(rootElement, 'LEAF', this.parseLeaf);
}

MySceneGraph.prototype.parseGlobals = function(rootElement) {

	if (rootElement == null) {
		this.onXMLError("INITIALS element is missing from <SCENE>.");
		return;
	}

	if (rootElement.length > 1) {
		this.onXMLError("Either zero or more than one \'INITIALS' elements found.");
		return;
	}

	var globalsFrustum = rootElement.getElementsByTagName('frustum');

	if (globalsFrustum == null) {
		return "frustum attribute is missing from INITIALS";
	}

	this.checkProperty('frustum', 'INITIALS', globalsFrustum.length == 1);

	var globalsReference = rootElement.getElementsByTagName('reference');

	if (globalsReference == null) {
		return "reference attribute is mising from INITIALS";
	}

	this.checkProperty('reference', 'INITIALS', globalsReference.length == 1);

	var globalsTranslation = rootElement.getElementsByTagName('translate');

	if (globalsTranslation == null) {
		return "translate attribute is missing from INITIALS";
	}

	this.checkProperty('translate', 'INITIALS', globalsTranslation.length == 1);

	var globalsScale = rootElement.getElementsByTagName('scale');

	if (globalsScale == null) {
		return "scale attribute is missing from INITIALS";
	}

	this.checkProperty('scale', 'INITIALS', globalsScale.length == 1);

	var globalsRotate = rootElement.getElementsByTagName('rotation');

	if (globalsRotate == null) {
		return "ERROR: rotate attributes are missing from INITIALS."
	}

	var globalsRotate_sz = globalsRotate.length;

	if (globalsRotate_sz < 3) {
		return "at least one rotate attribute is missing from INITIALS."
	}

	// <frustum near="ff" far="ff/>	
	this.gFrustrumNear = this.reader.getFloat(globalsFrustum[0], 'near', true);
	this.gFrustumFar = this.reader.getFloat(globalsFrustum[0], 'far', true);
//	this.scene.setFrustum(this.gFrustumFar, this.gFrustumNear);
	
	// <reference length="ff"/>
	this.gReferenceLength = this.reader.getFloat(globalsReference[0], 'length', true);
//	this.scene.setAxis(this.gReferenceLength);
	
	//<scale sx="ff" sy="ff" sz="ff"/>
	this.gScale = this.parseCoordinates3(globalsScale[0], 'sx', 'sy', 'sz');
	
	//<translate x="ff", y="ff", z="ff"/>
	this.gTranslate = this.parseCoordinates3(globalsTranslation[0], 'x', 'y', 'z');
	
	// <rotate axis="x" angle="ff"/>
	// <rotate axis="y" angle="ff"/>
	// <rotate axis="z" angle="ff"/>
	this.gRotation = [];
	var axisFound = [false, false, false];

	for (var i = 0; i < globalsRotate_sz; i++)
	{
		var axis = this.reader.getItem(globalsRotate[i], 'axis', ['x', 'y', 'z'], true);
		var angle = this.reader.getFloat(globalsRotate[i], 'angle', true);

		switch (axis)
		{
		case 'x':
			this.parseRotate(0, angle, axisFound);
			break;
		case 'y':
			this.parseRotate(1, angle, axisFound);
			break;
		case 'z':
			this.parseRotate(2, angle, axisFound);
			break;
		default:
			console.warn("WARNING: unknown axis '" + axis + "' found in 'rotate'.");
			break;
		}
	}

	console.log("Globals[FRUSTUM]: frustum_near=" + this.gFrustrumNear + ", frustum_far=" + this.gFrustumFar);
	console.log("Globals[TRANSLATE]: x=" + this.gTranslate[0] + ", y=" + this.gTranslate[1] + ", z=" + this.gTranslate[2]);
	console.log("Globals[ROTATION_X]: angle=" + this.gRotation[0]);
	console.log("Globals[ROTATION_Y]: angle=" + this.gRotation[1]);
	console.log("Globals[ROTATION_Z]: angle=" + this.gRotation[2]);
	console.log("Globals[SCALE]: x=" + this.gScale[0] + ", y=" + this.gScale[1] + ", z=" + this.gScale[2]);
	console.log("Globals[REFERNECE]: length=" + this.gReferenceLength);
};
	
/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};