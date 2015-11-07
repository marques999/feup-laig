/**
 * construtor default da classe 'MyTerrain'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {String} texturePath - caminho para o ficheiro de textura do terreno
 * @param {String} heightmapPath - caminho para o ficheiro de relevo do terreno
 * @return {null}
 */
function MyTerrain(scene, texturePath, heightmapPath) {

	CGFobject.call(this, scene);

	this.terrainShader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terain.frag");
	this.terrainTexture = new CGFtexture(this.scene, texturePath);
	this.heightmapTexture = new CGFtexture(this.scene, heightmapPath);

	this.terrainShader.setUniforms({
		heightmapTexture: 1
	});

	this.terrainPlane = new MyPlane(this.scene, 16);
	this.terrainPlane.initBuffers();
};

MyTerrain.prototype = Object.create(MyPrimitive.prototype);
MyTerrain.prototype.constructor = MyTerrain;

/**
 * desenha a primitva 'MyTerrain' na CGFscene correspondente
 * @return {null}
 */
MyTerrain.prototype.display = function() {

	this.scene.setActiveShader(this.terrainShader);
	this.terrainTexture.bind(0);
	this.heightmapTexture.bind(1);
	this.terrainPlane.display();
	this.terrainTexture.unbind();
	this.heightmapTexture.unbind();
	this.scene.resetActiveShader();
};