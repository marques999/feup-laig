#ifdef GL_ES
precision highp float;
#endif

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D heightmapTexture;
uniform sampler2D terrainTexture;

varying float vAmount;
varying vec2 vTextureCoord;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

void main() {
	vTextureCoord = aTextureCoord;
	vAmount = 1.0 - texture2D(heightmapTexture, vTextureCoord).r;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + aVertexNormal * vAmount, 1.0);
}