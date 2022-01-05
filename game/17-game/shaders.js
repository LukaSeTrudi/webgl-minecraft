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

uniform mat4 uViewModel;
uniform mat4 uProjection;

uniform vec3 uLightColor;

out vec2 vTexCoord;
out vec3 vLight;


void main() {
    float sideLight;

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
    vLight = (uAmbient + sideLight + uSunLight) * uLightColor;
    gl_Position = uProjection * uViewModel * aPosition;
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

export const shaders = {
    simple: { vertex, fragment }
};
