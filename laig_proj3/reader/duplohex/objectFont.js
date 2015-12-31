/**
 * construtor default da classe 'ObjectFont'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectFont(scene, string) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.fontPlane = new ObjectPlane(scene, 2);
	this.fontDimensions = [16, 16];
	this.fontTexture = new CGFtexture(scene, "resources/oolite-font.png");
	this.fontShader = new CGFshader(scene.gl, "shaders/MyFont.vert", "shaders/MyFont.frag");
	this.fontShader.setUniformsValues({
		'dims': this.fontDimensions
	});
	//--------------------------------------------------------
	this.defaultAppearance = new CGFappearance(scene);
	this.fontAppearance = new CGFappearance(scene);
	this.fontAppearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.fontAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.fontAppearance.setSpecular(0.0, 0.0, 0.0, 1);
	this.fontAppearance.setTexture(this.fontTexture);
	this.fontAppearance.setShininess(120);
	//--------------------------------------------------------
	this.updateString(string);
};
//--------------------------------------------------------
ObjectCube.prototype = Object.create(MyPrimitive.prototype);
ObjectCube.prototype.constructor = ObjectCube;
//--------------------------------------------------------
ObjectFont.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.setActiveShaderSimple(this.fontShader);
	this.fontAppearance.apply();
	for (var i = 0; i < this.coordsArray.length; i++) {
		this.fontShader.setUniformsValues({
			'charCoords': this.coordsArray[i]
		});
		this.fontPlane.display();
		this.scene.translate(1.0, 0.0, 0.0);
	}
	this.defaultAppearance.apply();
	this.scene.resetActiveShaderSimple();
	this.scene.popMatrix();
};
//--------------------------------------------------------
ObjectFont.prototype.updateString = function(string) {
	//--------------------------------------------------------
	this.coordsArray = [];
	//--------------------------------------------------------
	for (var i = 0; i < string.length; i++) {
		var characterCode = string.charCodeAt(i);
		if (characterCode >= 0 && characterCode < 256) {
			this.coordsArray.push([
				characterCode % this.fontDimensions[0],
				~~(characterCode / this.fontDimensions[1])
			]);
		}
		else {
			this.coordsArray.push([0, 0]);
		}
	}
};