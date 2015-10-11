function XMLscene() {
	CGFscene.call(this);
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function(application) {

	CGFscene.prototype.init.call(this, application);

	this.initCameras();
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.defaultAmbient = [0.1, 0.1, 0.1, 1.0];
	this.defaultBackground = [0.0, 0.0, 0.0, 1.0];
	this.defaultReference = 2.0;
	this.defaultRotation = [];
	this.defaultScale = [1.0, 1.0, 1.0];
	this.defaultTranslate = [0.0, 0.0, 0.0];
	this.axis = new CGFaxis(this);
	this.activeLights = 0;
	this.enableTextures(true);
};

XMLscene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setInterface = function(guiInterface) {
	this.guiInterface = guiInterface;
};

XMLscene.prototype.setDefaultAppearance = function() {
	this.setAmbient(0.2, 0.4, 0.8, 1.0);
	this.setDiffuse(0.2, 0.4, 0.8, 1.0);
	this.setSpecular(0.2, 0.4, 0.8, 1.0);
	this.setShininess(10.0);
};

XMLscene.prototype.initAxis = function(length) {
	this.defaultReference = length;
};

XMLscene.prototype.initFrustum = function(near, far) {
	this.frustumNear = near;
	this.frustumFar = far;
};

XMLscene.prototype.drawPrimitive = function(primitive) {
	primitive.display();
};

XMLscene.prototype.applyMaterial = function(appearance) {
	appearance.apply();
}

XMLscene.prototype.setRotation = function(id, axis, angle) {
	if (axis == 'x') {
		this.defaultRotation[id] = [angle * Math.PI / 180, 1, 0, 0]
	}
	else if (axis == 'y') {
		this.defaultRotation[id] = [angle * Math.PI / 180, angle, 0, 1, 0];
	}
	else if (axis == 'z') {
		this.defaultRotation[id] = [angle * Math.PI / 180, angle, 0, 0, 1];
	}
};

XMLscene.prototype.pushLight = function(id, enabled, position, ambient, diffuse, specular) {
	
	var currentLight = this.lights[this.activeLights];
	
	currentLight.setPosition(position[0], position[1], position[2], position[3]);
	currentLight.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
	currentLight.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
	currentLight.setSpecular(specular[0], specular[1], specular[2], specular[3]);
	currentLight.setVisible(true);

	this.toggleLight(this.activeLights, enabled);
	this.guiInterface.pushLight(id, this.activeLights, enabled);

	return this.lights[this.activeLights++];
};

XMLscene.prototype.toggleLight = function(id, enabled) {
	enabled ? this.lights[id].enable() : this.lights[id].disable();
};

XMLscene.prototype.initScale = function(matrix) {
	this.defaultScale = matrix;
};

XMLscene.prototype.initTranslate = function(matrix) {
	this.defaultTranslate = matrix;
};

XMLscene.prototype.setBackground = function(rgba) {
	this.defaultBackground = rgba;
}

XMLscene.prototype.setAmbient = function(rgba) {
	this.defaultAmbient = rgba;
};

XMLscene.prototype.onGraphLoaded = function() {
	
	// SET BACKGROUND
	this.gl.clearColor(this.defaultBackground[0], this.defaultBackground[1], 
					   this.defaultBackground[2], this.defaultBackground[3]);

	// SET GLOBAL ILLUMINATION
	this.setGlobalAmbientLight(this.defaultAmbient[0], this.defaultAmbient[1], 
							   this.defaultAmbient[2], this.defaultAmbient[3]);

	// SET AXIS
	this.axis = new CGFaxis(this, this.defaultReference);

	// SET FRUSTUM
	this.camera.far = this.frustumFar;
	this.camera.near = this.frustumNear;

	// INITIALIZE LIGHTS
	if (this.activeLights == 0) {
		this.shader.bind();
		this.lights[0].setPosition(2, 3, 3, 1);
		this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[0].setVisible(true);
		this.lights[0].enable();
		this.activeLights++;
		this.shader.unbind();
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
	this.rotate.apply(this, this.defaultRotation[0]);
	this.rotate.apply(this, this.defaultRotation[1]);
	this.rotate.apply(this, this.defaultRotation[2]);
	this.translate.apply(this, this.defaultTranslate);

	// Draw axis
	this.axis.display();
	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	if (this.graph.loadedOk) {

		for (var i = 0; i < this.activeLights; i++) {
			this.lights[i].update();
		}

		this.graph.display();
	}

	this.shader.unbind();
};