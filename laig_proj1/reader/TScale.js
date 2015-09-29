function TScale(sceen, x, y, z) {

    TTransformation.call(this, sceen);    
    TTransformation.prototype.setCoords.call(this,x,y,z); 
};

TScale.prototype = Object.create(TTransformation.prototype);
TScale.prototype.constructor = TScale; 
