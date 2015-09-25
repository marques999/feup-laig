function MyCylinder(scene, radius, height, slices, stacks)
{
	CGFobject.call(this, scene);

	this.radius = radius;
	this.height = height;
	this.slices = slices;
	this.stacks = stacks;

	this.minS = 0.0;
	this.maxS = 1.0;
	this.minT = 0.0;
	this.maxT = 1.0;

	this.texelLengthS = (this.maxS - this.minS) / this.slices;
	this.texelLengthT = (this.maxT - this.minT) / this.stacks;
	this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function()
{
	this.vertices = [];
	this.texCoords = [];
	this.normals = [];

	var theta = 0;
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var stackIncrement = this.height/ this.stacks;
	var sCoord = this.maxS;

	for (var i = 0; i <= this.slices; i++)
	{
		var tCoord = this.maxT;
		var x = this.radius * Math.cos(theta);
		var y = this.radius * Math.sin(theta);
		var z = 0;

		for (var j = 0; j <= this.stacks; j++)
		{
			this.vertices.push(x, z, y);
			this.normals.push(x, 0, y);
			this.texCoords.push(sCoord, tCoord);

			z += stackIncrement;
			tCoord -= this.texelLengthT;
		}

		theta += thetaIncrement;
		sCoord -= this.texelLengthS;
	}

	this.indices = [];

	var vertexNumber = 1;

	for (var i = 0; i < this.slices; i++)
	{
		for (var j = 0; j < this.stacks; j++)
		{
			this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber + this.stacks + 1);
			this.indices.push(vertexNumber + this.stacks, vertexNumber, vertexNumber - 1);
			this.indices.push(vertexNumber + this.stacks + 1, vertexNumber + this.stacks, vertexNumber);
			this.indices.push(vertexNumber, vertexNumber + this.stacks, vertexNumber - 1);

			vertexNumber++;
		}

		vertexNumber++;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};