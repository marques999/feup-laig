/**
 * construtor default da classe 'XMLtexture'
 * @param {CGFtexture} tex - estrutura de dados que contém a textura
 * @param {Number} factorS - factor de amplificação na coordenada S
 * @param {Number} factorS - factor de amplificação na coordenada T
 * @constructor
 */
function XMLtexture(tex, factorS, factorT) {
	this.tex = tex;
	this.factorS = factorS;
	this.factorT = factorT;
};

XMLtexture.prototype = Object.create(Object.prototype);
XMLtexture.prototype.constructor = XMLtexture;