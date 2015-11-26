#ifdef GL_ES
precision highp float;
#endif

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D heightmapTexture;

varying vec2 vTextureCoord;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

void main() {
	float vScale = 0.25;
	float vAmount = texture2D(heightmapTexture, aTextureCoord).r;
	
	vTextureCoord = aTextureCoord;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + aVertexNormal * vAmount * vScale, 1.0);
	
}