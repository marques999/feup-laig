/**
 * construtor default da classe 'ObjectRamp'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLscene} scene - XMLscene onde esta primitiva será desenhada
 * @return {null}
 */
function ObjectRamp(scene) {
	//--------------------------------------------------------
	MyPrimitive.call(this, scene);
	//--------------------------------------------------------
	this.triangle1 = new MyTriangle(scene, [0.0, 0.0, 0.0], [1.0+Math.cos(Math.PI/4),0.0,0.0], [1.0+Math.cos(Math.PI/4),Math.cos(Math.PI/4),0.0]);
	this.triangle2 = new MyTriangle(scene, [0.0, 0.0, 0.0], [1.0+Math.cos(Math.PI/4),Math.cos(Math.PI/4),0.0], [1.0+Math.cos(Math.PI/4),0.0,0.0]);
	this.rectangle = new MyRectangle(scene, 0.0, 0.5+2.0*Math.cos(Math.PI/4), 1.0, 0.0);
};

ObjectRamp.prototype = Object.create(MyPrimitive.prototype);
ObjectRamp.prototype.constructor = ObjectRamp;

/**
 * desenha a primitva 'ObjectRamp' na respetiva cena
 * @return {null}
 */
ObjectRamp.prototype.display = function() {

	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, 1.0);
		this.scene.rotate(Math.PI/2, 0.0, 1.0, 0.0);
		this.triangle2.display();
		this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
	   	this.scene.translate(1.0, 0.0, 0.0);
	   	this.scene.rotate(Math.PI/2, 0.0, 1.0, 0.0);
	   this.triangle1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, 1.0);
		this.scene.rotate(-Math.PI/3, 1.0, 0.0, 0.0);
		this.rectangle.display();
	this.scene.popMatrix();
 };