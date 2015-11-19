/**
 * construtor default da classe 'MyPatch'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {XMLScene} scene - XMLScene onde esta primitiva será desenhada
 * @param {Number} uDivs - número de divisões da superfície NURBS na coordenada U
 * @param {Number} vDivs - número de divisões da superfície NURBS na coordenada V
 * @param {Number} uDegree - grau da superfície NURBS na coordenada U
 * @param {Number} vDegree - grau da superfície NURBS na coordenada V
 * @param {Number[][]} controlPoints - vértices de controlo da superfície NURBS
 * @return {null}
 */
function MyPatch(scene, uDivs, vDivs, uDegree, vDegree, controlPoints) {

	CGFobject.call(this, scene);

	var knotsArray = [
		[0, 0, 1, 1],
		[0, 0, 0, 1, 1, 1],
		[0, 0, 0, 0, 1, 1, 1, 1]
	];

	var nurbsSurface = new CGFnurbsSurface(uDegree, vDegree,
		knotsArray[uDegree - 1], knotsArray[vDegree - 1], controlPoints);

	function getSurfacePoint(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.nurbsObject = new CGFnurbsObject(scene, getSurfacePoint, uDivs, vDivs);
};

MyPatch.prototype = Object.create(MyPrimitive.prototype);
MyPatch.prototype.constructor = MyPatch;

/**
 * desenha a primitva 'MyPatch' na XMLScene correspondente
 * @return {null}
 */
MyPatch.prototype.display = function() {
	this.nurbsObject.display();
};