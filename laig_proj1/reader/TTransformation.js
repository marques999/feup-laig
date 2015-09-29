function TTransformation(scene) {
   this.scene = scene;

    this.coords = [];
};



TTransformation.prototype = Object.create(Object.prototype);
TTransformation.prototype.constructor = TTransformation;  

TTransformation.prototype.setCoords = function(x, y, z) {
   this.coords[0] = x;
   this.coords[1] = y;
   this.coords[2] = z;
}
