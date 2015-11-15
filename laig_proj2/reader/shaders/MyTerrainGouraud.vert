#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

struct lightProperties {
	vec4 position;
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec4 half_vector;
	vec3 spot_direction;
	float spot_exponent;
	float spot_cutoff;
	float constant_attenuation;
	float linear_attenuation;
	float quadratic_attenuation;
	bool enabled;
};

struct materialProperties {
	vec4 ambient;
	vec4 diffuse;
	vec4 specular;
	vec4 emission;
	float shininess;
};

#define NUMBER_OF_LIGHTS 8

uniform mat4 uMVMatrix;
uniform mat4 uNMatrix;
uniform mat4 uPMatrix;
uniform sampler2D heightmapTexture;
uniform vec4 uGlobalAmbient;
uniform lightProperties uLight[NUMBER_OF_LIGHTS];
uniform materialProperties uFrontMaterial;
uniform materialProperties uBackMaterial;

varying float vAmount;
varying vec4 vFinalColor;
varying vec2 vTextureCoord;

vec4 doLighting(vec4 vertex, vec3 E, vec3 N) {

	vec4 result = vec4(0.0, 0.0, 0.0, 0.0);

	for (int i = 0; i < NUMBER_OF_LIGHTS; i++) {

		if (uLight[i].enabled) {

			float att = 1.0;
			float spot_effect = 1.0;
			vec3 L = vec3(0.0);

			if (uLight[i].position.w == 1.0) {

				L = (uLight[i].position - vertex).xyz;
				float dist = length(L);
				L = normalize(L);

				if (uLight[i].spot_cutoff != 180.0) {
					vec3 sd = normalize(vec3(uLight[i].spot_direction));
					float cos_cur_angle = dot(sd, -L);
					float cos_inner_cone_angle = cos(radians(clamp(uLight[i].spot_cutoff, 0.0, 89.0)));
					spot_effect = pow(clamp(cos_cur_angle/ cos_inner_cone_angle, 0.0, 1.0), clamp(uLight[i].spot_exponent, 0.0, 128.0));
				}

				att = 1.0 / (uLight[i].constant_attenuation + uLight[i].linear_attenuation * dist + uLight[i].quadratic_attenuation * dist * dist);
			}
			else {
				L = normalize(uLight[i].position.xyz);
			}

			float lambertTerm = max(dot(N, L), 0.0);

			vec4 Ia = uLight[i].ambient * uFrontMaterial.ambient;
			vec4 Id = uLight[i].diffuse * uFrontMaterial.diffuse * lambertTerm;
			vec4 Is = vec4(0.0, 0.0, 0.0, 0.0);

			if (lambertTerm > 0.0) {
				vec3 R = reflect(-L, N);
				float specular = pow( max( dot(R, E), 0.0 ), uFrontMaterial.shininess);
				Is = uLight[i].specular * uFrontMaterial.specular * specular;
			}

			if (uLight[i].position.w == 1.0) {
			   result += att * max(spot_effect * (Id + Is), Ia);
			}
			else {
			   result += att * spot_effect * (Ia + Id + Is);
			}
		}
	}

	result += uGlobalAmbient * uFrontMaterial.ambient + uFrontMaterial.emission;
	result = clamp(result, vec4(0.0), vec4(1.0));
	result.a = 1.0;

	return result;
}

void main() {

	vTextureCoord = aTextureCoord;
	vAmount = texture2D(heightmapTexture, vTextureCoord).r;

	float vScale = 0.25;
	vec4 vertex = uMVMatrix * vec4(aVertexPosition + aVertexNormal * vAmount * vScale, 1.0);
	vec3 N = normalize(vec3(uNMatrix * vec4(aVertexNormal, 1.0)));
	vec3 E = normalize(-vec3(vertex.xyz));

	vFinalColor = doLighting(vertex, E, N);
	gl_Position = uPMatrix * vertex;
}