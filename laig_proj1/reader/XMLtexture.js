/**
 * construtor default da classe XMLtexture
 * @param {CGFtexture} tex - estrutura de dados que contém a textura
 * @param {Float} factorS - factor de amplificação na coordenada S
 * @param {Float} factorS - factor de amplificação na coordenada T
 * @class
 */
function XMLtexture(tex, factorS, factorT) {
	this.tex = tex;
	this.factorS = factorS;
	this.factorT = factorT;
};

XMLtexture.prototype = Object.create(Object.prototype);
XMLtexture.prototype.constructor = XMLtexture;