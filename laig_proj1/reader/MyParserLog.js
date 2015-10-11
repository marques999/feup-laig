function onAttributeMissing(node, id, parent) {
	return parent + " with id=" + id + " is missing attribute '" + node + "'.";
};

function onAttributeInvalid(node, id, parent) {
	return parent + " with id=" + id + " has an invalid value for '" + node + "' attribute.";
};

function onURLInvalid(node, id, parent) {
	return parent + " with id=" + id + " has an invalid URL for '" + node + "' attribute.";
};

function onElementDuplicate(parent, id) {
	return parent + " with id=" + id + " already exists, skipping...";
};

function onReservedId(id, root) {
	return parent + " with id=" + id + " has a reserved ID ['null', 'clear'], skipping...";
};

function onElementMissing(node, parent) {
	return node + " attribute is missing from <" + parent + ">.";
};

function onElementInvalid(node, parent) {
	return node + " attribute from <" + parent + "> has an invalid value.";
};

function onMultipleElements(node, parent) {
	console.warn("WARNING: either zero or more than one '" + node + "' elements found in <" + parent + ">.");
};

function onMultipleDefinitions(name, parent) {
	console.warn("WARNING: multiple definitions for property '" + name + " found in <" + parent + ">, skipping duplicates...");
};

function onProcessNode(message, id) {
	console.log("[VALIDATE NODES] " + message + ": " + id);
};

function onMultipleAxis(axis) {
	console.warn("WARNING: more than one rotation found for axis " + axis + " in <INITIALS>!");
}

function onInvalidArguments(id, argsGot, argsExpected) {	
	return "LEAF with id=" + id + " has " + argsGot + " arguments, expected " + argsExpected + ".";
};

function onUnexpectedTag(node, parent) {
	console.warn("WARNING: unexpected tag <" + node + "> found in " + parent + ", skipping...");
};

function onUnknownAxis(axis, node, parent) {
	console.warn("WARNING: unknown rotation axis '" + axis + "'for " + node + " found in <" + parent + ">.");
}

function onXMLWarning(message) {
	console.warn("WARNING: " + message);	
};

function onParseError(parent, nerr, id) {

	if (id == undefined) {
		return nerr + " errors found while parsing <" + parent + ">.";
	}

	return nerr + " errors found while parsing <" + parent + "> with id=" + id + ".";
}

/*       
  _      ____   _____  _____ _____ _   _  _____ 
 | |    / __ \ / ____|/ ____|_   _| \ | |/ ____|
 | |   | |  | | |  __| |  __  | | |  \| | |  __ 
 | |   | |  | | | |_ | | |_ | | | | . ` | | |_ |
 | |___| |__| | |__| | |__| |_| |_| |\  | |__| |
 |______\____/ \_____|\_____|_____|_| \_|\_____|
                                  
*/

function printHeader(attribute, id) {
	if (id == undefined) {
		console.log("[" + attribute + "]");
	}
	else {
		console.log(attribute + " sucessfully read from file [ID=" + id + "]");
	}
};

function printValues() {

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
};

function printXYZ(attribute, xyz) {
	console.log("\t\t" + attribute + ": { x=" + xyz[0] + ", y=" + xyz[1] + ", z=" + xyz[2] + " }");
};

function printRGBA(attribute, rgba) {
	console.log("\t\t" + attribute + ": { r=" + rgba[0] + ", g=" + rgba[1] + ", b=" + rgba[2] + ", a=" + rgba[3] + " }");
};

function printXYZW(attribute, xyzw) {
	console.log("\t\t" + attribute + ": { x=" + xyzw[0] + ", y=" + xyzw[1] + ", z=" + xyzw[2] + ", w=" + xyzw[3] + " }");
};

/*
 __      __     _      _____ _____       _______ _____ ____  _   _ 
 \ \    / /\   | |    |_   _|  __ \   /\|__   __|_   _/ __ \| \ | |
  \ \  / /  \  | |      | | | |  | | /  \  | |    | || |  | |  \| |
   \ \/ / /\ \ | |      | | | |  | |/ /\ \ | |    | || |  | | . ` |
    \  / ____ \| |____ _| |_| |__| / ____ \| |   _| || |__| | |\  |
     \/_/    \_\______|_____|_____/_/    \_\_|  |_____\____/|_| \_|
                                                                   
*/

function checkReference(array, name, nodeId, objectId) {

	if (objectId == 'null' || objectId == 'clear') {
		return null;
	}

	if (!(objectId in array)) {
		return "<NODE> with id=" + nodeId + " references " + name + " id=" + objectId +" which doesn't exist, using defaults...";
	}

	return null;
}

function checkUrl(url) {

	var http = new XMLHttpRequest();

	http.open("HEAD", url, false);
	http.send();

	return http.status != 404;
}

function checkValue(value, node, parent, id) {

	if (value == null) {

		if (id == undefined) {
			return onElementMissing(node, parent);
		}

		return onAttributeMissing(node, id, parent);
	}

	if (value != value) {

		if (id == undefined) {
			return onElementInvalid(node, parent);
		}
		
		return onAttributeInvalid(node, id, parent);
	}

	return null;
}