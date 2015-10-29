/**
 * construtor default da classe 'MyPatch'
 * @constructor
 * @augments MyPrimitive
 * @author Diogo Marques
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @param {Number} degree1 - grau da superfície NURBS na coordenada U
 * @param {Number} degree2 - grau da superfície NURBS na coordenada V
 * @param {Number[]} knots1 - knots da superfície NURBS na coordenada U
 * @param {Number[]} knots2 - knots da superfície NURBS na coordenada V
 * @param {Number[][]} controlvertexes - vértices de controlo da superfície NURBS
 * @return {null}
 */
function MyPatch(scene, udivs, vdivs, degree1, degree2, knots1, knots2, controlvertexes) {

	CGFobject.call(this, scene);

	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);

	function getSurfacePoint(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.nurbsObject = new CGFnurbsObject(scene, getSurfacePoint, udivs, vdivs);
	this.nurbsObject.initBuffers();
};

MyPatch.prototype = Object.create(MyPrimitive.prototype);
MyPatch.prototype.constructor = MyPatch;

/**
 * inicializa os buffers WebGL da primitiva 'MyPatch'
 * @return {null}
 */
MyPatch.prototype.display = function() {
	this.nurbsObject.display();
};