uniform sampler2D heightmapTexture;

varying float vAmount;
varying vec2 vUV;

void main()
{
	vUV = uv;
	vAmount = texture2D(heightmapTexture, uv).r;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * vAmount, 1.0);
}