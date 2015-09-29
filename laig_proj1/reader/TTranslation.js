function TTranslation(sceen, x, y, z) {

    TTransformation.call(this, sceen);    
    TTransformation.prototype.setCoords.call(this,x,y,z); 
};

TTranslation.prototype = Object.create(TTransformation.prototype);
TTranslation.prototype.constructor = TTranslation; 