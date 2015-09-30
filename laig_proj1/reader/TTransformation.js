function TTransformation(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

TTransformation.prototype = Object.create(Object.prototype);
TTransformation.prototype.constructor = TTransformation;

TTransformation.prototype.apply = function (scene) {
    return null;
}