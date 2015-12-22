/**
 * construtor default da classe 'CustomCircle'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} slices - número de divisões do círculo em torno do raio
 * @param {Number} angle - comprimento do arco de circunferência
 * @param {Number} radius - raio da circunferência
 * @return {null}
 */
function CustomCircle(scene, slices, radius, angle) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.vertices = [];
	this.radius = radius || 1.0;
	this.slices = slices;
	this.angle = angle;
	this.initBuffers();
};
//--------------------------------------------------------
CustomCircle.prototype = Object.create(MyPrimitive.prototype);
CustomCircle.prototype.constructor = CustomCircle;
//--------------------------------------------------------
CustomCircle.prototype.initBuffers = function() {
	//--------------------------------------------------------
	var halfRadius = this.radius / 2;
	var thetaIncrement = this.angle / this.slices;
	var vertexNumber = 1;
	//--------------------------------------------------------
	this.vertices.push(0.0, 0.0, 0.0);
	this.texCoords.push(halfRadius, halfRadius);
	this.normals.push(0.0, 0.0, 1.0);
	//--------------------------------------------------------
	for (var i = 0; i <= this.slices; i++) {
		var x = this.radius * Math.cos(thetaIncrement * i);
		var y = this.radius * Math.sin(thetaIncrement * i);
		this.vertices.push(x, y, 0);
		this.texCoords.push(x * halfRadius + halfRadius, halfRadius - y * halfRadius);
		this.normals.push(0, 0, 1);
		if (i > 0) {
			this.indices.push(vertexNumber++, vertexNumber, 0);
		}
	}
	//--------------------------------------------------------
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};