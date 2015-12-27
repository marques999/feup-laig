/**
 * construtor default da classe 'XMLscene'
 * @constructor
 * @augments CGFscene
 * @author Carlos Samouco, Diogo Marques
 * @return {null}
 */
function XMLscene() {
	CGFscene.call(this);
};
//--------------------------------------------------------
XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;
//--------------------------------------------------------
XMLscene.prototype.init = function(application) {

	CGFscene.prototype.init.call(this, application);
	//---------------------------------------------------------
	this.gameMode = true;
	this.serverHostname = 'localhost';
	this.serverPort = 8081;
	//---------------------------------------------------------
	this.initCameras();
	this.initDefaults();
	this.initGL();
	//---------------------------------------------------------
	this.enableTextures(true);
	this.resetDisplay();
};
//--------------------------------------------------------
XMLscene.prototype.initGame = function() {

	if (this.gameMode) {
		this.currentId = 0;
		this.boardMatrix = null;
		this.board = new GameBoard(this);
		this.board.updateMatrix(this.gameSettings.getBoard());
		this.board.updatePlayer(this.gameSettings.getMode(), this.gameSettings.getColor());
	}
};
//--------------------------------------------------------
XMLscene.prototype.initGL = function() {
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(1000.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);
};
//--------------------------------------------------------
XMLscene.prototype.initServer = function() {

	if (this.httpServer == null || this.httpServer == undefined) {
		this.httpServer = new GameServer(this, this.serverHostname, this.serverPort);
		this.httpServer.requestGame();
	}
};
//--------------------------------------------------------
XMLscene.prototype.onConnect = function() {
	alert("connection established successfully!");
	this.guiInterface.onConnect();
	this.board.setServer(this.httpServer);
};
//--------------------------------------------------------
XMLscene.prototype.onDisconnect = function() {
	this.httpServer = null;
	this.guiInterface.onDisconnect();
};
//--------------------------------------------------------
XMLscene.prototype.onServerError = function() {
	this.httpServer = null;
	this.guiInterface.onServerError();
};
//--------------------------------------------------------
XMLscene.prototype.disconnectServer = function() {

	if (this.httpServer != null && this.httpServer != undefined) {
		this.httpServer.requestQuit();
	}
};
//--------------------------------------------------------
XMLscene.prototype.setSettings = function(gameSettings) {
	this.gameSettings = gameSettings;
	this.setUpdatePeriod(1000 / this.gameSettings.getFps());
	this.initGame();
};
//--------------------------------------------------------
XMLscene.prototype.getPreferences = function() {
	return this.gameSettings;
};
//--------------------------------------------------------
XMLscene.prototype.setBoardMatrix = function(boardMatrix) {
	this.boardMatrix = boardMatrix;
};
//--------------------------------------------------------
XMLscene.prototype.setBoardPosition = function(vec3) {
	this.boardPosition = vec3;
};
//--------------------------------------------------------
XMLscene.prototype.setFrontView = function(vector3) {
	this.cameraFrontView = vector3;
};
//--------------------------------------------------------
XMLscene.prototype.setSceneView = function(vector3) {
	this.cameraSceneView = vector3;
};
//--------------------------------------------------------
XMLscene.prototype.setTopView = function(vec3) {
	this.cameraTopView = vec3;
};
//--------------------------------------------------------
XMLscene.prototype.disablePicking = function() {
	this.setPickEnabled(false);
};
//--------------------------------------------------------
XMLscene.prototype.enablePicking = function() {
	this.setPickEnabled(true);
};
//--------------------------------------------------------
XMLscene.prototype.updatePicking = function() {

	if (this.pickMode || this.pickResults == null || this.pickResults.length <= 0) {
		return;
	}

	for (var i = 0; i < this.pickResults.length; i++) {
		if (this.pickResults[i][0]) {
			this.board.updatePicking(this.pickResults[i][1]);
		}
	}

	this.pickResults.splice(0, this.pickResults.length);
};
//---------------------------------------------------------
XMLscene.prototype.resetDisplay = function() {
	//---------------------------------------------------------
	this.axis = new CGFaxis(this);
	this.activeLights = 0;
	this.startAfterTransition = false;
	//---------------------------------------------------------
	this.cameraRotationActive = false;
	this.cameraTiltActive = false;
	this.cameraZoomActive = false;
	//---------------------------------------------------------
	this.currentCameraRotation = Math.PI / 4;
	this.currentCameraTilt = 0.0;
	this.currentCameraZoom = 0.0;
	//---------------------------------------------------------
	this.cameraRotationAmount = 0.0;
	this.cameraTiltAmount = 0.0;
	this.cameraZoomAmount = 0.0;
	//---------------------------------------------------------
	this.targetCameraRotation = 0.0;
	this.targetCameraZoom = 0.0;
	//---------------------------------------------------------
	this.initialCameraPosition = vec3.clone(this.camera.position);
	this.initialCameraTilt = vec3.clone(this.camera.position);
	//---------------------------------------------------------
	this.frontViewMode = false;
	this.sceneViewMode = true;
	this.topViewMode = false;
	//---------------------------------------------------------
	for (var i = 0; i < this.lights; i++) {
		this.lights[i].disable();
	}
	//---------------------------------------------------------
	mat4.identity(this.defaultMatrix);
}
//---------------------------------------------------------
XMLscene.prototype.loadGraph = function(lsxPath) {
	this.resetDisplay();
	this.guiInterface.resetLights();
	this.guiInterface.setActiveCamera(this.camera);
	new MySceneGraph(lsxPath, this);
};
//---------------------------------------------------------
XMLscene.prototype.resetCamera = function() {

	if (this.cameraAnimationActive()) {
		return;
	}

	this.camera.setPosition(this.initialCameraPosition);
	this.initialCameraTilt = this.initialCameraPosition;
};
//---------------------------------------------------------
XMLscene.prototype.cameraTilt = function() {

	if (this.cameraZoomActive || this.cameraRotationActive || this.cameraTransitionActive) {
		return;
	}

	this.cameraTiltActive = true;
};
//--------------------------------------------------------
XMLscene.prototype.switchFrontView = function() {

	if (this.frontViewMode || this.cameraAnimationActive()) {
		return;
	}

	this.frontViewMode = true;
	this.sceneViewMode = false;
	this.topViewMode = false;
	this.cameraTransitionActive = true;
	this.cameraTransitionTarget = this.cameraFrontView;
	this.processCameraDelta();
};
//--------------------------------------------------------
XMLscene.prototype.switchSceneView = function() {

	if (this.sceneViewMode || this.cameraAnimationActive()) {
		return;
	}

	this.frontViewMode = false;
	this.sceneViewMode = true;
	this.topViewMode = false;
	this.cameraTransitionActive = true;
	this.cameraTransitionTarget = this.cameraSceneView;
	this.processCameraDelta();
};
//--------------------------------------------------------
XMLscene.prototype.switchTopView = function() {

	if (this.topViewMode || this.cameraAnimationActive()) {
		return;
	}

	this.frontViewMode = false;
	this.sceneViewMode = false;
	this.topViewMode = true;
	this.cameraTransitionActive = true;
	this.cameraTransitionTarget = this.cameraTopView;
	this.processCameraDelta();
};
//--------------------------------------------------------
XMLscene.prototype.zoomOut = function() {

	if (this.cameraTiltActive || this.cameraRotationActive || this.cameraTransitionActive) {
		return;
	}

	this.cameraZoomActive = true;
	this.cameraZoomAmount = -4.0;
	this.targetCameraZoom = this.currentCameraZoom + this.cameraZoomAmount;
};
//--------------------------------------------------------
XMLscene.prototype.startGame = function() {
	this.switchFrontView();
	this.startAfterTransition = true;
};
//--------------------------------------------------------
XMLscene.prototype.zoomIn = function() {

	if (this.cameraTiltActive || this.cameraRotationActive || this.cameraTransitionActive) {
		return;
	}

	this.cameraZoomActive = true;
	this.cameraZoomAmount = 4.0;
	this.targetCameraZoom = this.currentCameraZoom + this.cameraZoomAmount;
};
//---------------------------------------------------------
XMLscene.prototype.processCameraZoom = function(deltaTime) {

	if (this.cameraZoomAmount > 0 && this.currentCameraZoom < this.targetCameraZoom) {
		this.currentCameraZoom += this.cameraZoomAmount * deltaTime;
		this.camera.zoom(this.cameraZoomAmount * deltaTime);
	}
	else if (this.cameraZoomAmount < 0 && this.currentCameraZoom > this.targetCameraZoom ) {
		this.currentCameraZoom += this.cameraZoomAmount * deltaTime;
		this.camera.zoom(this.cameraZoomAmount * deltaTime);
	}
	else {
		this.cameraZoomActive = false;
		this.initialCameraTilt = vec3.clone(this.camera.position);
	}
};
//--------------------------------------------------------
XMLscene.prototype.processCameraRotation = function(deltaTime) {

	if (this.cameraRotationAmount > 0.0 && this.currentCameraRotation <= this.targetCameraRotation) {
		this.currentCameraRotation += this.cameraRotationAmount * deltaTime;
	}
	else if (this.cameraRotationAmount < 0.0 && this.currentCameraRotation >= this.targetCameraRotation) {
		this.currentCameraRotation += this.cameraRotationAmount * deltaTime;
	}
	else {
		this.currentCameraRotation = this.targetCameraRotation;
		this.initialCameraTilt = vec3.clone(this.camera.position);
		this.board.onRotationDone();
		this.cameraRotationActive = false;
	}
};
//--------------------------------------------------------
XMLscene.prototype.processCameraTilt = function(deltaTime) {

	if (this.cameraTiltAmount < 0.0 && this.currentCameraTilt > -20.0) {
		this.currentCameraTilt += this.cameraTiltAmount;
		this.camera.orbit([0.0, 1.0, 0.0], 2.0 * this.cameraTiltAmount * deltaTime);
	}
	else if (this.cameraTiltAmount > 0.0 && this.currentCameraTilt < 20.0) {
		this.currentCameraTilt += this.cameraTiltAmount;
		this.camera.orbit([0.0, 1.0, 0.0], 2.0 * this.cameraTiltAmount * deltaTime);
	}
	else {
		this.cameraTiltActive = false;
	}
};
//--------------------------------------------------------
XMLscene.prototype.processCameraTransition = function(deltaTime) {

	if (this.currentTransitionDistance <= this.cameraTransitionDistance) {
		var cameraPosition = vec3.create();
		vec3.scale(cameraPosition, this.cameraTransitionDelta, deltaTime);
		var cameraDistance = vec3.len(cameraPosition);
		vec3.add(cameraPosition, cameraPosition, this.camera.position);
		this.camera.setPosition(cameraPosition);
		this.currentTransitionDistance += cameraDistance;
	}
	else {
		this.initialCameraPosition = vec3.clone(this.cameraTransitionTarget);
		this.initialCameraTilt = vec3.clone(this.cameraTransitionTarget);

		this.currentTransitionDistance = 0.0;
		this.cameraTransitionActive = false;

		if (this.startAfterTransition) {
			this.startAfterTransition = false;
			this.board.startGame();
		}
	}
};
//--------------------------------------------------------
XMLscene.prototype.processCameraDelta = function() {
	this.currentTransitionDistance = 0.0;
	this.cameraTransitionDelta = vec3.clone(this.cameraTransitionTarget);
	this.cameraTransitionDistance = vec3.dist(this.camera.position, this.cameraTransitionTarget);
	vec3.sub(this.cameraTransitionDelta, this.cameraTransitionDelta, this.camera.position);
};
//--------------------------------------------------------
XMLscene.prototype.rotateCamera = function() {
	this.cameraRotationActive = true;
	this.cameraRotationAmount = Math.PI;
	this.targetCameraRotation = this.currentCameraRotation + Math.PI;
};
//--------------------------------------------------------
XMLscene.prototype.resetRotation = function() {
	this.cameraTiltAmount = 0.0;
	this.currentCameraTilt = 0.0;
	this.camera.setPosition(this.initialCameraTilt);
};
//--------------------------------------------------------
XMLscene.prototype.cameraAnimationActive = function() {
	return this.cameraRotationActive || this.cameraTiltActive || this.cameraTransitionActive || this.cameraZoomActive;
}
//--------------------------------------------------------
XMLscene.prototype.resetPicking = function() {
	this.currentId = 0;
};
//--------------------------------------------------------
XMLscene.prototype.registerPicking = function(object) {
	this.registerForPick(++this.currentId, object);
	return this.currentId;
};
//--------------------------------------------------------
XMLscene.prototype.defaultPicking = function(object) {
	this.registerForPick(0, object);
};
//--------------------------------------------------------
XMLscene.prototype.applyInitialMatrix = function() {

	if (this.gameMode && this.graph.loadedOk) {
		this.rotate(this.currentCameraRotation, 0, 1, 0);
		this.translate(this.boardPosition[0], this.boardPosition[1], this.boardPosition[2]);
	}
	else {
		this.multMatrix(this.defaultMatrix);
	}
};
//--------------------------------------------------------
XMLscene.prototype.displayBoard = function() {

	if (this.boardMatrix != null) {
		this.multMatrix(this.boardMatrix);
	}

	this.board.display();
};
//--------------------------------------------------------
/**
 * altera o comprimento dos eixos visíveis na cena
 * @param {Number} length - comprimento dos eixos
 * @return {null}
 */
XMLscene.prototype.initAxis = function(length) {
	this.defaultReference = length;
};

/**
 * cria um observador na cena com os valores por omissão
 * @return {null}
 */
XMLscene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

/**
 * inicializa várias propriedades desta cena com os seus valores por omissão
 * @return {null}
 */
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
 * @param {Number} near - posição do plano mais próximo do observador
 * @param {Number} far - posição do plano mais afastado do obeservador
 * @return {null}
 */
XMLscene.prototype.initFrustum = function(near, far) {
	this.frustumNear = near;
	this.frustumFar = far;
};

/**
 * altera as coordenadas de escalamento inicial da cena
 * @param {Number[]} matrix - vetor de coordenadas do escalamento
 * @return {null}
 */
XMLscene.prototype.initScale = function(matrix) {
	this.defaultScale = matrix;
};

/**
 * altera as coordenadas da translação inicial da cena
 * @param {Number[]} matrix - vetor de coordenadas da translação
 * @return {null}
 */
XMLscene.prototype.initTranslate = function(matrix) {
	this.defaultTranslate = matrix;
};

/**
 * altera a CGFinterface associada a esta cena
 * @param {CGFinterface} guiInterface
 * @return {null}
 */
XMLscene.prototype.setInterface = function(guiInterface) {
	this.guiInterface = guiInterface;
	this.guiInterface.setActiveCamera(this.camera);
	this.guiInterface.setScene(this);
};

/**
 * retorna o número de CGFlights inicializadas nesta cena
 * @return {Number} - numero de luzes ativas
 */
 XMLscene.prototype.getActiveLights = function() {
	return this.activeLights;
};

/**
 * retorna o número máximo de CGFlights que podem existir nesta cena
 * @return {Number} - numero máximo de luzes
 */
XMLscene.prototype.getNumberLights = function() {
	return this.lights.length;
};

/**
 * inicializa a aparência por omissão dos objetos
 * @return {null}
 */
XMLscene.prototype.resetAppearance = function() {
	this.setAmbient(0.5, 0.5, 0.5, 1.0);
	this.setDiffuse(0.5, 0.5, 0.5, 1.0);
	this.setSpecular(0.5, 0.5, 0.5, 1.0);
	this.setShininess(10.0);
};

/**
 * regressa ao shader default definido pela cena
 * @return {null}
 */
XMLscene.prototype.resetActiveShader = function() {
	this.setActiveShader(this.defaultShader);
};

/**
 * regressa ao shader default definido pela cena
 * @return {null}
 */
XMLscene.prototype.resetActiveShaderSimple = function() {
	this.setActiveShaderSimple(this.defaultShader);
};

/**
 * desenha uma primitiva na cena
 * @param {CGFobject} primitive
 * @return {null}
 */
XMLscene.prototype.drawPrimitive = function(primitive) {
	primitive.display();
};

/**
 * associa uma CGFappearance aos objetos da cena atual
 * @param {CGFappearance} appearance
 * @return {null}
 */
XMLscene.prototype.applyMaterial = function(appearance) {
	appearance.apply();
};

/**
 * altera a componente de iluminação global ambiente da cena atual
 * @param {Number[]} rgba - vetor com as componentes (r, g, b, a) da iluminação ambiente
 * @return {null}
 */
XMLscene.prototype.setAmbient = function(rgba) {
	this.defaultAmbient = rgba;
};

/**
 * altera a cor de background da cena atual
 * @param {Number[]} rgba - vetor com as componentes (r, g, b, a) da cor de background
 * @return {null}
 */
XMLscene.prototype.setBackground = function(rgba) {
	this.defaultBackground = rgba;
};

/**
 * altera as coordenadas de rotação inicial da cena atual
 * @param {Number} id - ordem da rotação
 * @param {Character} axis - eixo da rotação (x, y, z)
 * @param {Number} angle - ângulo da rotação (em graus)
 * @return {null}
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
 * adiciona uma nova CGFlight ao array de luzes da cena atual
 * @param {String} id - identificador da luz
 * @param {Boolean} enabled - estado ON/OFF inicial da luz
 * @param {Number[]} position - vetor de coordenadas (x, y, z, w) da posição
 * @param {Number[]} ambient - vetor com componentes (r, g, b, a) da componente ambiente
 * @param {Number[]} diffuse - vetor com componentes (r, g, b, a) da componente difusa
 * @param {Number[]} specular - vetor com componentes (r, g, b, a) da componente especular
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
 * altera o estado ON/OFF de uma CGFlight existente na cena atual
 * @param {Number} id - índice da CGFlight no array de luzes da cena
 * @param {Boolean} enabled - novo estado desta CGFlight
 * @return {null}
 */
XMLscene.prototype.toggleLight = function(id, enabled) {
	enabled ? this.lights[id].enable() : this.lights[id].disable();
};

/**
 * callback executado no final do processamento do MySceneGraph
 * @return {null}
 */
XMLscene.prototype.onGraphLoaded = function() {
	//--------------------------------------------------------
	this.camera.far = this.frustumFar;
	this.camera.near = this.frustumNear;
	this.axis = new CGFaxis(this, this.defaultReference);
	//--------------------------------------------------------
	this.gl.clearColor(this.defaultBackground[0], this.defaultBackground[1],
					   this.defaultBackground[2], this.defaultBackground[3]);
	//--------------------------------------------------------
	this.setGlobalAmbientLight(this.defaultAmbient[0], this.defaultAmbient[1],
							   this.defaultAmbient[2], this.defaultAmbient[3]);
	//--------------------------------------------------------
	if (this.gameMode) {
		vec3.multiply(this.boardPosition, this.boardPosition, [-1, -1, -1]);
	}
	else {
		mat4.translate(this.defaultMatrix, this.defaultMatrix, this.defaultTranslate);
		mat4.rotate(this.defaultMatrix, this.defaultMatrix, this.defaultRotationAngle[0], this.defaultRotationAxis[0]);
		mat4.rotate(this.defaultMatrix, this.defaultMatrix, this.defaultRotationAngle[1], this.defaultRotationAxis[1]);
		mat4.rotate(this.defaultMatrix, this.defaultMatrix, this.defaultRotationAngle[2], this.defaultRotationAxis[2]);
		mat4.scale(this.defaultMatrix, this.defaultMatrix, this.defaultScale);
	}
	//--------------------------------------------------------
	if (this.activeLights == 0) {
		this.initLights();
	}
	//--------------------------------------------------------
	if (this.gameMode) {
		this.camera.setTarget(vec3.fromValues(0.0, 0.0, 0.0));
		this.camera.setPosition(this.cameraSceneView);
		this.initialCameraPosition = vec3.clone(this.camera.position);
		this.initialCameraTilt = vec3.clone(this.camera.position);
		this.setPickEnabled(true);
	}
};
//--------------------------------------------------------
XMLscene.prototype.initLights = function() {
	this.lights[0].setPosition(2.0, 3.0, 3.0, 1.0);
	this.lights[0].setAmbient(0.1, 0.1, 0.1, 1.0);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(0.1, 0.1, 0.1, 1.0);
	this.lights[0].setVisible(true);
	this.lights[0].enable();
	this.guiInterface.pushLight('default', this.activeLights++, true);
};

/**
 * altera o modo de reprodução de todas as animações presentes na cena
 * @param {Boolean} loopValue - "true" repete as animações, "false" para não repetir
 * @return {null}
 */
XMLscene.prototype.setAnimationLoop = function(loopValue) {
	this.graph.loadedOk && this.graph.setAnimationLoop(loopValue);
};

/**
 * callback executado periodicamente para atualizar as animações presentes na cena
 * @param {Number} currTime - tempo atual (em milisegundos)
 * @return {null}
 */
XMLscene.prototype.update = function(currTime) {
	//--------------------------------------------------------
	var deltaTime = (currTime - this.lastUpdate) / 1000;
	//--------------------------------------------------------
	if (this.gameMode) {
		this.updatePicking();
		this.clearPickRegistration();
		this.board.update(currTime, this.lastUpdate);
	}
	//--------------------------------------------------------
	this.cameraTransitionActive && this.processCameraTransition(deltaTime);
	this.cameraZoomActive && this.processCameraZoom(deltaTime);
	this.cameraRotationActive && this.processCameraRotation(deltaTime);
	this.cameraTiltActive && this.processCameraTilt(deltaTime);
	//--------------------------------------------------------
	if (this.graph.loadedOk) {
		this.graph.processAnimations(deltaTime);
	}
};

/**
 * callback executado periodicamente para atualizar a visualização da cena
 * @return {null}
 */
XMLscene.prototype.display = function() {
	//--------------------------------------------------------
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	//--------------------------------------------------------
	this.updateProjectionMatrix();
	this.loadIdentity();
	this.applyViewMatrix();
	this.applyInitialMatrix();
	//--------------------------------------------------------
	for (var i = 0; i < this.activeLights; i++) {
		this.lights[i].update();
	}
	//--------------------------------------------------------
	this.axis.display();
	this.resetAppearance();
	//--------------------------------------------------------
	if (!this.graph.loadedOk) {
		return;
	}
	//--------------------------------------------------------
	this.graph.display();
	this.gameMode && this.displayBoard();
};