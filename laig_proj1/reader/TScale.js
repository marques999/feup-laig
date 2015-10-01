function TScale(x, y, z) {
    TTransformation.call(this, x, y, z);
};

TScale.prototype = Object.create(TTransformation.prototype);
TScale.prototype.constructor = TScale;

TScale.prototype.apply = function (scene) {
    scene.scale(this.x, this.y, this.z);
}