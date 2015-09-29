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

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.rotation = [];
	this.axis = new CGFaxis(this);
	this.activeLights = 1;
};

XMLscene.prototype.initLights = function() {
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

XMLscene.prototype.initAxis = function(length) {
	this.reference = length;
};

XMLscene.prototype.initFrustum = function(far, near) {
	this.frustumFar = far;
	this.frustumNear = near;
};

XMLscene.prototype.setRotation = function(id, axis, angle) {

	if (axis == 'x') {
		this.rotation[id] = [angle, 1, 0, 0]
	}
	else if (axis == 'y') {
		this.rotation[id] = [angle, 0, 1, 0];
	}
	else if (axis == 'z') {
		this.rotation[id] = [angle, 0, 0, 1];
	}
};

XMLscene.prototype.initScale = function(matrix) {
	this.defaultScale = matrix;
};

XMLscene.prototype.initTranslate = function(matrix) {
	this.defaultTranslate = matrix;
};

XMLscene.prototype.setBackground = function(rgba) {
	this.background = rgba;
}

XMLscene.prototype.setDoubleside = function(doubleside) {
	this.doubleside = doubleside;
}

XMLscene.prototype.setAmbient = function(rgba) {
	this.ambient = rgba;
};

XMLscene.prototype.onGraphLoaded = function() {
	
	// SET BACKGROUND
	this.gl.clearColor(this.background[0], this.background[1], this.background[2], this.background[3]);
	
	// SET GLOBAL ILLUMINATION
	this.setGlobalAmbientLight.apply(this, this.ambient);

	// SET AXIS LENGTH
	this.axis = new CGFaxis(this, this.reference);

	// SET FRUSTUM
	this.camera.far = this.frustumFar;
	this.camera.near = this.frustumNear;

	// INITIALIZE LIGHTS
	this.lights[0].enable();

	var lightsArray = this.graph.getLights();

	for (var light in lightsArray) {
		this.lights[this.activeLights] = lightsArray[light];
		this.lights[this.activeLights].setVisible(true);
		this.activeLights++;
	}
};

XMLscene.prototype.display = function () {

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
	this.rotate.apply(this, this.rotation[0]);
	this.rotate.apply(this, this.rotation[1]);
	this.rotate.apply(this, this.rotation[2]);
	this.translate.apply(this, this.defaultTranslate);

	// Draw axis
	this.axis.display();
	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk) {

			this.lights[0].update();	
	
		this.graph.display();
	};

	this.shader.unbind();
};