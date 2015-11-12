/**
 * construtor default da classe 'TailBooster'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function TailBooster(scene) {

	MyPrimitive.call(this, scene);
	this.scene = scene;

	this.BOOSTER1 = new MyCylinder(this.scene, 1, 0.4, 0.7, 20, 20);
		
	this.initBuffers();
};

TailBooster.prototype = Object.create(MyPrimitive.prototype);
TailBooster.prototype.constructor = TailBooster;

TailBooster.prototype.display = function() {

    this.scene.pushMatrix();  
    this.BOOSTER1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();     
    this.scene.scale(1.0, -1.0, 1.0);  
    this.BOOSTER1.display();
    this.scene.popMatrix();
 }; 