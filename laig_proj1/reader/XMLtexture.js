function XMLtexture(path, factorS, factorT)
{
	this.path = path;
	this.factorS = factorS;
	this.factorT = factorT;
};

XMLtexture.prototype = Object.create(Object.prototype);
XMLtexture.prototype.constructor = XMLtexture;

XMLtexture.prototype.setFactor = function(factorS, factorT)
{
	null != factorS && (this.factorS = factorS);
	null != factorT && (this.factorT = factorT);
};