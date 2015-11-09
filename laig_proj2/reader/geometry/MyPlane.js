/**
 * construtor default da classe 'MyPlane'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} nrDivs - número de divisões do plano em partes por eixo
 * @return {null}
 */
function MyPlane(scene, nrDivs) {

	CGFobject.call(this, scene);

	var controlPoints = [
		[[0.5, 0.0, 0.5, 1.0], [-0.5, 0.0, 0.5, 1.0]],
		[[0.5, 0.0, -0.5, 1.0], [-0.5, 0.0, -0.5, 1.0]]
	];

	var nurbsSurface = new CGFnurbsSurface(1, 1, [0, 0, 1, 1], [0, 0, 1, 1], controlPoints);

	function getSurfacePoint(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.nurbsObject = new CGFnurbsObject(scene, getSurfacePoint, nrDivs, nrDivs);
	this.nurbsObject.initBuffers();
};

MyPlane.prototype = Object.create(MyPrimitive.prototype);
MyPlane.prototype.constructor = MyPlane;

/**
 * desenha a primitva 'MyPlane' na CGFscene correspondente
 * @return {null}
 */
MyPlane.prototype.display = function() {
	this.nurbsObject.display();
};