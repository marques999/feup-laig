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

	this.terrainTexture = new CGFtexture(scene, texturePath);
	this.heightmapTexture = new CGFtexture(scene, heightmapPath);
	this.terrainPlane = new MyPlane(scene, 64);

	this.terrainShader = new CGFshader(scene.gl, "shaders/MyTerrain.vert", "shaders/MyTerrain.frag");
	this.terrainShader.setUniformsValues({
		terrainTexture: 0,
		heightmapTexture: 1
	});
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
	this.heightmapTexture.unbind(1);
	this.terrainTexture.unbind(0);
	this.scene.resetActiveShader();
};

MyTerrain.prototype.setWireframe = function(we) {

	if (we) {
		this.primitiveType = this.scene.gl.LINES;
	}
	else {
		this.primitiveType = this.scene.gl.TRIANGLES;
	}
};