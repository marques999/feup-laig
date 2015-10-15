function XMLscene() {
	CGFscene.call(this);
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function(application) {

	CGFscene.prototype.init.call(this, application);

	this.initCameras();
	this.initDefaults();
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.axis = new CGFaxis(this);
	this.activeLights = 0;
	this.enableTextures(true);

	mat4.identity(this.defaultMatrix);
		
};

XMLscene.prototype.initAxis = function(length) {
	this.defaultReference = length;
};

XMLscene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.initDefaults = function() {
	this.defaultAmbient = [0.1, 0.1, 0.1, 1.0];
	this.defaultBackground = [0.0, 0.0, 0.0, 1.0];
	this.defaultMatrix = mat4.create();
	this.defaultReference = 2.0;
	this.defaultRotationAngle = [];
	this.defaultRotationAxis = [];
	this.defaultScale = [1.0, 1.0, 1.0];
	this.defaultTranslate = [0.0, 0.0, 0.0];
};

XMLscene.prototype.initFrustum = function(near, far) {
	this.frustumNear = near;
	this.frustumFar = far;
};

XMLscene.prototype.initScale = function(matrix) {
	this.defaultScale = matrix;
};

/*
 * sets default translation coordinate for the secene
 * @param {array3} matrix
 * @return {null}
 */
XMLscene.prototype.initTranslate = function(matrix) {
	this.defaultTranslate = matrix;
};

/*
 * sets current application interface
 * @param {CGFinterface} guiInterface
 * @return {null}
 */
XMLscene.prototype.setInterface = function(guiInterface) {
	this.guiInterface = guiInterface;
};

XMLscene.prototype.setDefaultAppearance = function() {
	this.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.setDiffuse(0.5, 0.5, 0.5, 1.0);
	this.setSpecular(0.5, 0.5, 0.5, 1.0);
	this.setShininess(10.0);
};

/*
 * draws primitive buffers on the screen
 * @param {CGFobject} primitive
 * @return {null}
 */
XMLscene.prototype.drawPrimitive = function(primitive) {
	primitive.display();
};

/*
 * binds CGFappearance to this scene
 * @param {CGFappearance} appearance
 * @return {null}
 */
XMLscene.prototype.applyMaterial = function(appearance) {
	appearance.apply();
}

/*
 * sets default value for the global ambient light
 * @param {array4} rgba
 * @return {null}
 */
XMLscene.prototype.setAmbient = function(rgba) {
	this.defaultAmbient = rgba;
};

XMLscene.prototype.setBackground = function(rgba) {
	this.defaultBackground = rgba;
};

XMLscene.prototype.setRotation = function(id, axis, angle) {

	this.defaultRotationAngle[id] = angle * Math.PI / 180;

	if (axis == 'x') {
		this.defaultRotationAxis[id] = [1, 0, 0];
	}
	else if (axis == 'y') {
		this.defaultRotationAxis[id] = [0, 1, 0];
	}
	else if (axis == 'z') {
		this.defaultRotationAxis[id] = [0, 0, 1];
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
	this.guiInterface.pushLight(id, this.activeLights++, enabled);
	
	return currentLight;
};

XMLscene.prototype.toggleLight = function(id, enabled) {
	enabled ? this.lights[id].enable() : this.lights[id].disable();
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

	// SET TRANSFORMATIONS
	mat4.scale(this.defaultMatrix, this.defaultMatrix, this.defaultScale);
	mat4.rotate(this.defaultMatrix, this.defaultMatrix, this.defaultRotationAngle[0], this.defaultRotationAxis[0]);
	mat4.rotate(this.defaultMatrix, this.defaultMatrix, this.defaultRotationAngle[1], this.defaultRotationAxis[1]);
	mat4.rotate(this.defaultMatrix, this.defaultMatrix, this.defaultRotationAngle[2], this.defaultRotationAxis[2]);
	mat4.translate(this.defaultMatrix, this.defaultMatrix, this.defaultTranslate);

	// INITIALIZE LIGHTS
	if (this.activeLights == 0) {
		this.pushLight('default', true, [2, 3, 3, 1], [0.1, 0.1, 0.1, 1.0], [1.0, 1.0, 1.0, 1.0], [0.1, 0.1, 0.1, 1.0]);
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
	this.multMatrix(this.defaultMatrix);

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