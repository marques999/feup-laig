function MyCylinder(scene, radiusBottom, radiusTop, height, slices, stacks) {

	CGFobject.call(this, scene);

	this.radiusBottom = radiusBottom;
	this.radiusTop = radiusTop;
	this.height = height;
	this.slices = slices;
	this.stacks = stacks;
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.minS = 0.0;
	this.maxS = 1.0;
	this.minT = 0.0;
	this.maxT = 1.0;
	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {

	var texelIncrementS = (this.maxS - this.minS) / this.slices;
	var texelIncrementT = (this.maxT - this.minT) / this.stacks;
	var radiusStep = (this.radiusTop - this.radiusBottom) / this.stacks;
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var stackIncrement = this.height / this.stacks;
	var sCoord = this.maxS;
	var vertexNumber = 1;
	var theta = 0;

	for (var i = 0; i <= this.slices; i++) {

		var tCoord = this.maxT;
		var newRadius = this.radiusBottom;
		var x = Math.cos(theta);
		var y = Math.sin(theta);
		var z = 0;

		for (var j = 0; j <= this.stacks; j++) {

			this.vertices.push(x * newRadius, z, y * newRadius);
			this.normals.push(x * newRadius, 0, y * newRadius);
			this.texCoords.push(sCoord, tCoord);

			if (i > 0 && j > 0) {

				this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber + this.stacks + 1);
				this.indices.push(vertexNumber + this.stacks, vertexNumber, vertexNumber - 1);
				this.indices.push(vertexNumber + this.stacks + 1, vertexNumber + this.stacks, vertexNumber);
				this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber - 1);

				vertexNumber++;
			}

			z += stackIncrement;
			tCoord -= texelIncrementT;
			newRadius += radiusStep;
		}

		if (i > 0) {
			vertexNumber++;
		}

		theta += thetaIncrement;
		sCoord -= texelIncrementS;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};