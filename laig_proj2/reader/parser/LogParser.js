function onAttributeMissing(node, id, parent) {
	return "<" + parent + "> with id=" + id + " is missing attribute '" + node + "'!";
};

function onAttributeInvalid(node, id, parent) {
	return parent + " with id=" + id + " has an invalid value for '" + node + "' attribute!";
};

function onAttributeInvalidWarn(node, id, parent) {
	console.warn("WARNING:" + parent + " with id=" + id + " has an invalid value for '" + node + "' attribute!");
};

function onCoordinateInvalid(coord, parent) {
	console.warn("WARNING: coordinate '" + coord + "' from <" + parent + "> has an invalid value!");
};

function onCoordinateMissing(coord, parent) {
	console.warn("WARNING: coordinate '" + coord + "' is missing from <" + parent + ">!");
};

function onElementDuplicate(parent, id) {
	return parent + " with id=" + id + " already exists, skipping...";
};

function onElementInvalid(node, parent) {
	return node + " attribute from <" + parent + "> has an invalid value!";
};

function onElementMissing(node, parent) {
	return node + " attribute is missing from <" + parent + ">";
};

function onInvalidPoints(id, lenghtExpected) {
	return "invalid number of control points for surface with id=" + id + ", expected " + lenghtExpected;
}

function onInvalidKnots(id, attribute, lenghtExpected) {
	return "invalid number of " + attribute + " for surface with id=" + id + ", expected " + lenghtExpected;
}

function onInvalidArguments(id, argsGot, argsExpected) {
	return "LEAF with id=" + id + " has " + argsGot + " arguments, expected " + argsExpected + "...";
};

function onURLInvalid(node, id, parent) {
	console.warn("WARNING: " + parent + " with id=" + id + " has an invalid URL for '" + node + "' attribute!");
};

function onReservedId(id, root) {
	return parent + " with id=" + id + " has a reserved ID ['null', 'clear'], skipping...";
};

function onDegreeOutOfRange(id) {
	console.warn("WARNING: <PATCH> with id=" + id + " has invalid value for 'degree', must be between 1 and 3");
}

function onMaximumLights(number) {
	return "maximum number of " + number + " lights reached, the following lights will be ignored...";
};

function onMultipleElements(node, parent) {
	console.warn("WARNING: either zero or more than one '" + node + "' elements found in <" + parent + ">!");
};

function onMultipleDefinitions(name, parent) {
	console.warn("WARNING: multiple definitions for <" + name + "> found in <" + parent + ">!");
};

function onMultipleAxis(axis) {
	console.warn("WARNING: more than one rotation found for axis " + axis + " in <INITIALS>!");
};

function onUnexpectedTag(tag, expected, parent, id) {
	return "invalid tag <" + tag + "> found in " + parent + " with id=" + id + ", expected <" + expected + ">!";
};

function onUnknownAxis(axis, node, parent) {
	return "unknown axis '" + axis + "' for <" + node + "> found in <" + parent + ">!";
};

function onXMLWarning(message) {
	console.warn("WARNING: " + message);
};

function onParseError(parent, nerr, id) {

	if (id == undefined) {
		return nerr + " errors found while parsing <" + parent + ">!";
	}

	return nerr + " errors found while parsing <" + parent + "> with id=" + id + "...";
};

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

function printSingle(attribute, value) {
	console.log("\t\t" + attribute + ": " + value);
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

function checkUrl(url) {
	var http = new XMLHttpRequest();
	http.open("HEAD", url, false);
	http.send();
	return http.status != 404;
};

function checkValue(value, node, parent, id) {

	if (value == null) {
		return id == undefined ? onElementMissing(node, parent) : onAttributeMissing(node, id, parent);
	}

	if (value != value) {
		return id == undefined ? onElementInvalid(node, parent) : onAttributeInvalid(node, id, parent);
	}

	return null;
};