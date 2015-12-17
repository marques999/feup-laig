function GameMenu(scene) {
	MyPrimitive.call(this, scene);

};

GameMenu.prototype = Object.create(MyPrimitive.prototype);
GameMenu.prototype.constructor = GameMenu;

GameMenu.prototype.loadJSON = function(path) {
	var self = this;
	$.getJSON('./json/' + path, function(data) {
		self.parseMenu(data);
	});
};

GameMenu.prototype.parseMenu = function(data) {
	console.log(data);
	if (data['menu'] == undefined) {
		alert("ERROR: could not find menu root in JSON!");
		return null;
	}

	var rootMenu = data['menu'];

	console.log(rootMenu.length);

	this.numberItems = parseInt(rootMenu.length);

	if (this.numberItems != this.numberItems || this.numberItems == null) {
		return null;
	}

	if (rootMenu.background_color == undefined) {
		return null;
	}

	this.backgroundColor = this.parseColor(rootMenu.background_color);

	if (this.backgroundColor == null || rootMenu.title == undefined) {
		return null;
	}

	console.log(this.backgroundColor);
	this.menuTitle = rootMenu.title;

	console.log(this.menuTitle);

	if (this.menuTitle == null || rootMenu.type == undefined) {
		return null;
	}

	this.menuType = rootMenu.type;
	this.animationAngle = 0.0;
	this.cosAngle = 1.0;
	this.buttonHeight = 8.0;
	this.buttonWidth = 12.0/this.numberItems;
	this.objects = [];
	
	for ( var i = 0; i < this.numberItems; i++) {
		this.objects[i] = new MyCube(this.scene);
	}
};

GameMenu.prototype.display = function() {

	var currentPositionX = 0.0;
	var scaleFactorY = 0.5 ;
	this.scene.pushMatrix();
	var scaleFactorX = this.buttonHeight + Math.abs(2.0 * this.cosAngle);
	var scaleFactorZ = this.buttonWidth + Math.abs(0.5 * this.cosAngle);
	this.scene.rotate(Math.PI/2, 0, 0, 1);
	this.scene.rotate(Math.PI/2, 0, 1, 0);
	
	for ( var i = 0; i < this.numberItems; i++) {
		this.scene.scale(scaleFactorX, scaleFactorY, scaleFactorZ);
		this.scene.translate(-0.5, 0.0, currentPositionX);
		this.objects[i].display();
		this.scene.translate(0.5, 0.0, -currentPositionX);
		this.scene.scale(1/scaleFactorX, 1/scaleFactorY, 1/scaleFactorZ);
		currentPositionX += 1.5;
	}

	this.scene.popMatrix();
}
GameMenu.prototype.parseColor = function(hex) {

    hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
        a: 1.0
    } : null;
};

GameMenu.prototype.update = function(delta) {
	
	this.animationAngle += delta * 0.003;
	this.cosAngle = Math.cos(this.animationAngle);
};