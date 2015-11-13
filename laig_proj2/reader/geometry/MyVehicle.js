/**
 * construtor default da classe 'MyVehicle'
 * @constructor
 * @augments MyPrimitive
 * @author Carlos Samouco
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @return {null}
 */
function MyVehicle(scene) {

	MyPrimitive.call(this, scene);

	this.front = new MyVehicleFront(scene);
	this.body = new MyVehicleBody(scene);
	this.tail = new MyTail(scene);
	this.tailBooster = new MyTailBooster(scene);
	this.tailEnd = new MyTailEnd(scene);
	this.wing = new MyVehicleWing(scene);
};

MyVehicle.prototype = Object.create(MyPrimitive.prototype);
MyVehicle.prototype.constructor = MyVehicle;

/**
 * desenha a primitva 'MyVehicle' na XMLScene correspondente
 * @return {null}
 */
MyVehicle.prototype.display = function() {

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI/2, 1, 0, 0);
	this.scene.translate(3.6, -0.65, 0.0);

		this.scene.pushMatrix();
		this.scene.scale(1.4, 0.8, 0.5);
		this.scene.translate(-1.4, 0.2, 0.0);
		this.scene.rotate(Math.PI/15, 0.0, 0.0, 1.0);

			this.scene.pushMatrix();
			this.scene.translate(0.0, 0.0, 1.0);
			this.wing.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.translate(0.0, 0.0, -1.0);
			this.scene.scale(1.0, -1.0, -1.0);
			this.wing.display();
			this.scene.popMatrix();

		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.scale(0.5, 0.5, 0.5);

			this.scene.pushMatrix();
			this.scene.translate(5.0, -0.3, -1.5);
			this.front.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.scale(3.0, 1.0, 1.0);
			this.scene.translate(1.0, -0.3, -1.5);
			this.body.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.translate(-6.0, -0.3, -1.5);
			this.tailEnd.display();
			this.scene.popMatrix();

			this.scene.pushMatrix();
			this.scene.translate(-6.0, 0.0, 0.0);
			this.scene.scale(1.2, 1.2, 1.2);

				this.scene.pushMatrix();
				this.scene.translate(0.0, 0.7, -0.7);
				this.scene.rotate(-Math.PI / 2, 0.0, 1.0, 0.0);
				this.tailBooster.display();
				this.scene.popMatrix();

				this.scene.pushMatrix();
				this.scene.translate(0.0, 0.7, 0.7);
				this.scene.rotate(-Math.PI / 2, 0.0, 1.0, 0.0);
				this.tailBooster.display();
				this.scene.popMatrix();

				this.scene.pushMatrix();
				this.scene.translate(0.0, 1.9, 0.0);
				this.scene.rotate(-Math.PI / 2, 0.0, 1.0, 0.0);
				this.tailBooster.display();
				this.scene.popMatrix();

			this.scene.popMatrix();

		this.scene.popMatrix();
		this.scene.pushMatrix();
		this.scene.translate(-2.85, 1.4, 0.0);
		this.scene.scale(0.6, 0.5, 0.9);
		this.scene.rotate(Math.PI/15, 0, 0, 1);
		this.tail.display();
		this.scene.popMatrix();

	this.scene.popMatrix();
 };