const vertex = `#version 300 es
layout (location = 0) in vec4 aPosition;
layout (location = 1) in vec2 aTexCoord;
layout (location = 2) in vec3 aNormal;
layout (location = 3) in float aLightLevel;

uniform mat4 uViewModel;
uniform mat4 uProjection;

uniform vec3 uLightColor;

uniform float uAmbient; 

out vec2 vTexCoord;
out vec3 vLight;

void main() {
    vTexCoord = aTexCoord;
    vLight = (uAmbient + aLightLevel) * uLightColor;
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
