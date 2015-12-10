function MyInvCylinder(scene, height, radiusBottom, radiusTop, stacks, slices) {

	MyPrimitive.call(this, scene);

	this.radiusBottom = radiusBottom;
	this.radiusTop = radiusTop;
	this.height = height;
	this.slices = slices;
	this.stacks = stacks;
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.initBuffers();
};

MyInvCylinder.prototype = Object.create(MyPrimitive.prototype);
MyInvCylinder.prototype.constructor = MyInvCylinder;

/**
 * inicializa os buffers WebGL da primitiva 'MyInvertedCylinder'
 * @return {null}
 */
MyInvCylinder.prototype.initBuffers = function() {

	var radiusIncrement = (this.radiusTop - this.radiusBottom) / this.stacks;
	var stackIncrement = this.height / this.stacks;
	var thetaIncrement = (2 * Math.PI) / this.slices;
	var texelIncrementS = 1.0 / this.slices;
	var texelIncrementT = 1.0 / this.stacks;
	var vertexNumber = 1;
	var sCoord = 0.0;
	var theta = 0;

	for (var i = 0; i <= this.slices; i++) {

		var tCoord = 1.0;
		var nRadius = this.radiusBottom;
		var x = Math.cos(theta);
		var y = Math.sin(theta);
		var z = 0;

		for (var j = 0; j <= this.stacks; j++) {

			this.vertices.push(x * nRadius, y * nRadius, z) ;
			this.normals.push(x * nRadius, -y * nRadius, 0);
			this.texCoords.push(sCoord, tCoord);

			if (i > 0 && j > 0) {

				this.indices.push(vertexNumber, vertexNumber + this.stacks + 1, vertexNumber + this.stacks);
				this.indices.push(vertexNumber + this.stacks, vertexNumber - 1, vertexNumber);

				vertexNumber++;
			}

			z += stackIncrement;
			tCoord -= texelIncrementT;
			nRadius += radiusIncrement;
		}

		if (i > 0) {
			vertexNumber++;
		}

		theta += thetaIncrement;
		sCoord += texelIncrementS;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};