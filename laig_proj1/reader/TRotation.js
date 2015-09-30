function TRotation(axis, angle) {
    this.axis = axis;
    this.angle = angle;
};

TRotation.prototype = Object.create(TTransformation.prototype);
TRotation.prototype.constructor = TRotation;

TRotation.prototype.apply = function (scene) {

    var degToRad = this.angle * Math.PI / 180;

    if (this.axis == 'x') {
        scene.rotate(degToRad, 1, 0, 0);
    }
    else if (this.axis == 'y') {
        scene.rotate(degToRad, 0, 1, 0);
    }
    else if (this.axis == 'z') {
        scene.rotate(degToRad, 0, 0, 1);
    }
}