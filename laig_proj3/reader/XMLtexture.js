/**
 * construtor default da classe 'XMLtexture'
 * @constructor
 * @author Diogo Marques
 * @param {CGFtexture} tex - estrutura de dados que contém a textura
 * @param {Number} factorS - factor de amplificação na coordenada S
 * @param {Number} factorS - factor de amplificação na coordenada T
 * @return {null}
 */
function XMLtexture(tex, factorS, factorT) {
	this.tex = tex;
	this.factorS = factorS;
	this.factorT = factorT;
};
//--------------------------------------------------------
XMLtexture.prototype = Object.create(Object.prototype);
XMLtexture.prototype.constructor = XMLtexture;
//--------------------------------------------------------