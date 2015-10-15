/**
 * construtor default da classe 'XMLScene'
 * @class
 */
function XMLscene() {
	CGFscene.call(this);
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * inicializa cena com valores default e define alguns aspetos da linguagem WebG
 * @param {CGFapplication} application
 * @return {null}
 */
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

/**
 * altera o comprimento dos eixos da cena
 * @param {Float} length - comprimento dos eixos
 * @return {null}
 */
XMLscene.prototype.initAxis = function(length) {
	this.defaultReference = length;
};

/**
 * inicializa uma câmara na cena com os valores default
 * @return {null}
 */
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

/**
 * altera as posições dos planos do observador da cena
 * @param {Float} near - posição do plano mais próximo do observador
 * @param {Float} far - posição do plano mais afastado do obeservador
 * @return {null}
 */
XMLscene.prototype.initFrustum = function(near, far) {
	this.frustumNear = near;
	this.frustumFar = far;
};

/**
 * altera as coordenadas de escalamento inicial da cena
 * @param {Array} matrix - vetor de coordenadas do escalamento
 * @return {null}
 */
XMLscene.prototype.initScale = function(matrix) {
	this.defaultScale = matrix;
};

/*
 * altera as coordenadas da translação inicial da cena
 * @param {Array} matrix - vetor de coordenadas da translação
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

/*
 * 
 * @return {null}
 */
XMLscene.prototype.setDefaultAppearance = function() {
	this.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.setDiffuse(0.5, 0.5, 0.5, 1.0);
	this.setSpecular(0.5, 0.5, 0.5, 1.0);
	this.setShininess(10.0);
};

/*
 * desenha uma primitiva na cena
 * @param {CGFobject} primitive
 * @return {null}
 */
XMLscene.prototype.drawPrimitive = function(primitive) {
	primitive.display();
};

/*
 * associa uma CGFappearance a esta CGFscene
 * @param {CGFappearance} appearance - material da leaf
 * @return {null}
 */
XMLscene.prototype.applyMaterial = function(appearance) {
	appearance.apply();
}

/*
 * altera o valor da componente de iluminação global ambiente
 * @param {Array} rgba - vetor de coordenadas (r, g, b, a) da componente
 * @return {null}
 */
XMLscene.prototype.setAmbient = function(rgba) {
	this.defaultAmbient = rgba;
};

/*
 * altera o valor da cor de fundo da cena
 * @param {Array} rgba - vetor de coordenadas (r, g, b, a) da componente
 * @return {null}
 */
XMLscene.prototype.setBackground = function(rgba) {
	this.defaultBackground = rgba;
};

/**
 * altera as coordenadas da rotação inicial da cena
 * @param {Integer} id - ordem da rotação na cena
 * @param {Character} axis - eixo da rotação (x, y, z)
 * @param {Float} angle - ângulo da rotação (em graus)
 */
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

/**
 * adiciona uma nova CGFlight ao array de luzes da cena
 * @param {String} id - identificador da CGFlight
 * @param {Boolean} enabled - estado ON/OFF inicial da CGFlight
 * @param {Array} position - vetor de coordenadas (x, y, z, w) da posição
 * @param {Array} ambient - vetor com componentes (r, g, b, a) da componente ambiente
 * @param {Array} diffuse - vetor com componentes (r, g, b, a) da componente difusa
 * @param {Array} specular - vetor com componentes (r, g, b, a) da componente especular
 * @return {CGFlight}
 */
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

/**
 * altera o estado ON/OFF de uma CGFlight existente na cena
 * @param {Integer} id - índice da CGFlight no array de luzes da cena
 * @param {Boolean} enabled - novo estado da CGFlight
 * @return {null}
 */
XMLscene.prototype.toggleLight = function(id, enabled) {
	enabled ? this.lights[id].enable() : this.lights[id].disable();
};

/**
 * 
 * @return {null}
 */
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

/**
 * funçao de display principal da cena
 * @return {null}
 */
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