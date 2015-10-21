function MyPlane(scene, nrDivs, minS, maxS, minT, maxT) 
{
	CGFobject.call(this, scene);

	this.nrDivs = nrDivs;
	this.patchLength = 1.0 / nrDivs;
	this.vertices = [];
	this.normals = [];
	this.texCoords = [];
	this.initBuffers();
};

MyPlane.prototype = Object.create(MyPrimitive.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.initBuffers = function() {

	var yCoord = 0.0;
	var tCoord = 1.0;

	for (var j = 0; j <= this.nrDivs; j++) {
	
		var xCoord = 0.0;

		for (var i = 0; i <= this.nrDivs; i++) {
		
			this.vertices.push(xCoord, yCoord, 0);
			this.texCoords.push(xCoord, tCoord);
			this.normals.push(0, 0, 1);

			xCoord += this.patchLength;
		}

		yCoord += this.patchLength;
		tCoord -= this.patchLength;
	}

	this.indices = [];

	var ind = 0;

	for (var j = 0; j < this.nrDivs; j++) {
	
		for (var i = 0; i <= this.nrDivs; i++) {
			this.indices.push(ind);
			this.indices.push(ind++ + this.nrDivs + 1);
		}

		if (j + 1 < this.nrDivs) {
			this.indices.push(ind + this.nrDivs);
			this.indices.push(ind);
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
	this.initGLBuffers();
};