const vertex = `#version 300 es
layout (location = 0) in vec4 aPosition;
layout (location = 1) in vec2 aTexCoord;
layout (location = 2) in vec3 aNormal;

uniform mat4 uViewModel;
uniform mat4 uProjection;

out vec2 vTexCoord;
out float vLight;

void main() {
    vTexCoord = aTexCoord;
    if(aNormal.x != 0.0) {
        vLight = 1.0;
    } else if(aNormal.z != 0.0) {
        vLight = 0.96;
    } else {
        vLight = 0.98;
    }
    gl_Position = uProjection * uViewModel * aPosition;
}
`;

const fragment = `#version 300 es
precision mediump float;

uniform mediump sampler2D uTexture;

in vec2 vTexCoord;
in float vLight;

out vec4 oColor;

void main() {
    oColor = texture(uTexture, vTexCoord) * vLight;
}
`;

export const shaders = {
    simple: { vertex, fragment }
};
