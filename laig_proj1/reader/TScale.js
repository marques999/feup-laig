function TScale(sceen, x, y, z) {
    TTransformation.call(this, x, y, z);
};

TScale.prototype = Object.create(TTransformation.prototype);
TScale.prototype.constructor = TScale;

TScale.prototype.apply = function (scene) {
     console.log("Applying Scale!");
    scene.scale(x, y, z);
}