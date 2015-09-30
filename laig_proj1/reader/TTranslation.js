function TTranslation(x, y, z) {
    TTransformation.call(this, x, y, z);
};

TTranslation.prototype = Object.create(TTransformation.prototype);
TTranslation.prototype.constructor = TTranslation;

TTranslation.prototype.apply = function (scene) {
    scene.translate(x, y, z);
}