#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying float vMask;

uniform sampler2D terrainTexture;
uniform sampler2D maskTexture;

void main() {

	if (vMask < 0.2) {
		gl_FragColor = texture2D(maskTexture, vTextureCoord);
	}
	else {
		gl_FragColor = texture2D(terrainTexture, vTextureCoord);
	}
}