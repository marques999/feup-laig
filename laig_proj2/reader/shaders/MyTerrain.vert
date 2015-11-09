#ifdef GL_ES
precision highp float;
#endif

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D heightmapTexture;

varying float vAmount;
varying vec2 vTextureCoord;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

const float vScale = 0.3;

void main() {
	vTextureCoord = aTextureCoord;
	vAmount = texture2D(heightmapTexture, vTextureCoord).r;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + aVertexNormal * vAmount * vScale, 1.0);
}