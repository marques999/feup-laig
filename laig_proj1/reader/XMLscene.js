function XMLscene()
{
	CGFscene.call(this);
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application)
{
	CGFscene.prototype.init.call(this, application);

	this.enableTextures(true);
	this.initCameras();
	this.initLights();
	this.defaultScale = [1.0, 1.0, 1.0];
	this.defaultTranslate = [0.0, 0.0, 0.0];
	this.defaultRotateX = 0.0;
	this.defaultRotateY = 0.0;
	this.defaultRotateZ = 0.0;

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	//this.gl.cullFace(this.gl.FRONT);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {
	this.shader.bind();
	this.lights[0].setPosition(2, 3, 3, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].update();
	this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
	this.setAmbient(0.2, 0.4, 0.8, 1.0);
	this.setDiffuse(0.2, 0.4, 0.8, 1.0);
	this.setSpecular(0.2, 0.4, 0.8, 1.0);
	this.setShininess(10.0);
};

XMLscene.prototype.addLight = function (paramLight)
{
	if (paramLight != null)
	{
		this.lights.push(paramLight);
	}
};

XMLscene.prototype.initAxis = function (length)
{
	this.axis.length = length;
	this.axis.display();
};

XMLscene.prototype.initFrustum = function (far, near) {
};

XMLscene.prototype.initRotation = function (matrix) {
	this.rotateX = matrix[0];
	this.rotateY = matrix[1];
	this.rotateZ = matrix[2];
};

XMLscene.prototype.initScale = function (matrix) {
	this.defaultScale = matrix;
};

XMLscene.prototype.initTranslate = function (matrix) {
	this.defaultTranslate = matrix;
};

XMLscene.prototype.updateLights = function () {
	this.lights[0].update();
};

XMLscene.prototype.setGlobalAmbient = function (r, g, b, a) {
	this.scene.setGlobalAmbientLight(r, g, b, a);
};

XMLscene.prototype.onGraphLoaded = function () {
	this.gl.clearColor(this.graph.gBackground[0], this.graph.gBackground[1], this.graph.gBackground[2], this.graph.gBackground[3]);
	this.lights[0].setVisible(true);
	this.lights[0].enable();
};

XMLscene.prototype.display = function ()
{
	// ---- BEGIN Background, camera and axis setup
	this.shader.bind();

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	this.scale.apply(this, this.defaultScale);
	this.rotate(1, 0, 0, this.rotateX);
	this.rotate(0, 1, 0, this.rotateY);
	this.rotate(0, 0, 1, this.rotateZ);
	this.translate.apply(this, this.defaultTranslate);
	
	// Draw axis
	this.axis.display();
	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk) {
		this.updateLights();
		this.graph.display();
	};

	this.shader.unbind();
};