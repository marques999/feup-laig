function TRotation(sceen, axis, ang) {

    TTransformation.call(this, sceen);
       
    this.ang = ang;
    this.setCoord(axis);
};

TRotation.prototype = Object.create(TTransformation.prototype);
TRotation.prototype.constructor = TRotation; 

   

TRotation.prototype.setCoord = function(axis) {

   if(axis == 'x') {
      TTransformation.prototype.setCoords.call(this,1,0,0);        
   }
   else if(axis == 'y') {
       TTransformation.prototype.setCoords.call(this,0,1,0);
   }
   else if(axis == 'z') {
        TTransformation.prototype.setCoords.call(this,0,0,1);
   }
   
      
};

