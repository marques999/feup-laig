#ifdef GL_ES
precision highp float;
#endif

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D heightmapTexture;
uniform sampler2D maskTexture;

varying vec2 vTextureCoord;
varying float vMask;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

void main() {
	float vScale = 0.25;
	float vAmount = texture2D(heightmapTexture, aTextureCoord).r;

	vMask = texture2D(maskTexture, aTextureCoord).r;
	vTextureCoord = aTextureCoord;

	if (vMask < 0.2) {
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition * vScale * 0.5, 1.0);
	}
	else {
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + aVertexNormal * vAmount * vScale, 1.0);
	}
}