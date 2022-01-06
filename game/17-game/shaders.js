const vertex = `#version 300 es
layout (location = 0) in vec4 aPosition;
layout (location = 1) in vec2 aTexCoord;
layout (location = 2) in vec3 aNormal;

uniform float uBehind;
uniform float uFront;
uniform float uRight;
uniform float uLeft;
uniform float uBottom;
uniform float uTop;

uniform float uAmbient; 
uniform float uSunLight;
uniform float uSunPercent;

uniform vec3 uSunPosition;
uniform vec3 uLightColor;

uniform mat4 uViewModel;
uniform mat4 uProjection;

out vec2 vTexCoord;
out vec3 vLight;


void main() {
    float sideLight;

    vec3 vertexPosition = (uViewModel * vec4(aPosition)).xyz;
    vec3 sunPosition = (uViewModel * vec4(uSunPosition, 1)).xyz;

    sideLight = 0.5;
    if(aNormal.z == -1.0) {
        sideLight = uBehind;
    } else if(aNormal.z == 1.0) {
        sideLight = uFront;
    } else if(aNormal.x == 1.0) {
        sideLight = uRight;
    } else if(aNormal.x == -1.0) {
        sideLight = uLeft;
    } else if(aNormal.y == 1.0) {
        sideLight = uBottom;
    } else if(aNormal.y == -1.0) {
        sideLight = uTop;
    }

    vTexCoord = aTexCoord;

    vec3 N = (uViewModel * vec4(aNormal, 0)).xyz;
    vec3 L = normalize(sunPosition - vertexPosition);

    float diffuse = 0.1 * max(0.0, dot(L, N));
    float sunColor = max(sideLight,uSunLight*uSunPercent);

    vLight = min((uAmbient + sunColor + diffuse), 1.0) * uLightColor;
    gl_Position = uProjection * vec4(vertexPosition, 1);
}
`;

const fragment = `#version 300 es
precision mediump float;

uniform mediump sampler2D uTexture;

in vec2 vTexCoord;
in vec3 vLight;

out vec4 oColor;

void main() {
    vec4 _text = texture(uTexture, vTexCoord);
    if( _text.a < 0.5) {
        discard;
    }
    oColor = _text * vec4(vLight, 1);
}
`;

const playerVertex = `#version 300 es
layout (location = 0) in vec4 aPosition;
layout (location = 1) in vec2 aTexCoord;

uniform float uAmbient;

uniform vec3 uLightColor;

uniform mat4 uViewModel;
uniform mat4 uProjection;

out vec2 vTexCoord;
out vec3 vLight;

void main() {

    vec3 vertexPosition = (uViewModel * vec4(aPosition)).xyz;

    vTexCoord = aTexCoord;
    vLight = min(uAmbient,1.0) * uLightColor;
    gl_Position = uProjection * vec4(vertexPosition, 1);
}
`;

export const shaders = {
  simple: { vertex, fragment },
  player: { vertex: playerVertex, fragment },
};
