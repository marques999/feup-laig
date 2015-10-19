/**
 * construtor default da classe 'MyPrimitive'
 * @constructor
 * @author Diogo Marques
 * @augments CGFobject
 * @param {CGFscene} scene - CGFscene onde esta primitiva será desenhada
 * @return {null}
 */
function MyPrimitive(scene) {
	CGFobject.call(this, scene);
};

MyPrimitive.prototype = Object.create(CGFobject.prototype);
MyPrimitive.prototype.constructor = MyPrimitive;

/**
 * atualiza as coordenadas de textura do retângulo com os valores recebidos
 * @param {Number} ampS - factor de amplificação na coordenada S
 * @param {Number} ampT - factor de amplificação na coordenada T
 * @return {null}
 */
MyPrimitive.prototype.updateTexCoords = function(ampS, ampT) {};