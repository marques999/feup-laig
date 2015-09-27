function MyCylinder(scene, radius, height, slices, stacks) {

	CGFobject.call(this, scene);

	this.radius = radius;
	this.height = height;
	this.slices = slices;
	this.stacks = stacks;
	this.minS = 0.0;
	this.maxS = 1.0;
	this.minT = 0.0;
	this.maxT = 1.0;
	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {

	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];

	var texelIncrementS = (this.maxS - this.minS) / this.slices;
	var texelIncrementT = (this.maxT - this.minT) / this.stacks;
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var stackIncrement = this.height / this.stacks;
	var sCoord = this.maxS;
	var theta = 0;
	var vertexNumber = 1;

	for (var i = 0; i <= this.slices; i++) {

		var tCoord = this.maxT;
		var x = this.radius * Math.cos(theta);
		var y = this.radius * Math.sin(theta);
		var z = 0;

		for (var j = 0; j <= this.stacks; j++) {

			this.vertices.push(x, z, y);
			this.normals.push(x, 0, y);
			this.texCoords.push(sCoord, tCoord);

			z += stackIncrement;
			tCoord -= texelIncrementT;

			if (j < this.stacks) {

				this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber + this.stacks + 1);
				this.indices.push(vertexNumber + this.stacks, vertexNumber, vertexNumber - 1);
				this.indices.push(vertexNumber + this.stacks + 1, vertexNumber + this.stacks, vertexNumber);
				this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber - 1);

				vertexNumber++;
			}
		}

		theta += thetaIncrement;
		sCoord -= texelIncrementS;

		if (i < this.slices) {
			vertexNumber++;
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};