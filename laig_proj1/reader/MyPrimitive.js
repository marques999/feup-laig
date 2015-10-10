function MyPrimitive(scene) {
	CGFobject.call(this, scene);
};

MyPrimitive.prototype = Object.create(CGFobject.prototype);
MyPrimitive.prototype.constructor = MyPrimitive;
MyPrimitive.prototype.updateTexCoords = function(ampS, ampT) {};