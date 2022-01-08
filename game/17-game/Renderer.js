import { mat4, vec3 } from "../../lib/gl-matrix-module.js";

import { WebGL } from "../../common/engine/WebGL.js";
import { Block } from "./world/Block.js";
import { shaders } from "./shaders.js";

export class Renderer {
  constructor(gl) {
    this.gl = gl;

    gl.clearColor(0.8, 1, 1, 1);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    this.programs = WebGL.buildPrograms(gl, shaders);

    this.defaultTexture = WebGL.createTexture(gl, {
      width: 1,
      height: 1,
      data: new Uint8Array([255, 255, 255, 255]),
    });
  }

  prepare(scene) {
    scene.nodes.forEach((node) => {
      node.traverse((_node) => {
        this.prepareNode(_node);
      });
    });
  }

  prepareNode(node) {
    if (!node.gl) {
      node.gl = {};
      if (node.mesh) {
        Object.assign(node.gl, this.createModel(node));
      }
      if (node.image) {
        node.gl.texture = this.createTexture(node.image);
      }
    }
  }

  getSunPosition(percent, translation) {
    const angle = this.lerp(180, 360, percent);
    const angleInRadians = angle * (Math.PI / 180);
    const dist = 30;
    const x = dist * Math.cos(angleInRadians);
    const y = dist * Math.sin(angleInRadians);
    return [translation[0]+y, translation[1]+x, translation[2]];
  }
  
  lerp(start, end, time) {
    return (1-time)*start+time*end
  }

  render(scene, camera) {
    const gl = this.gl;

    gl.clearColor(0.8*scene.sunPercent, 1*scene.sunPercent, 1*scene.sunPercent, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const program = this.programs.simple;
    const playerProgram = this.programs.player;
    gl.useProgram(program.program);

    let matrix = mat4.create();
    let matrixStack = [];
    let light = vec3.fromValues(1,1,1);

    const sunPos = this.getSunPosition(scene.sunPercent, camera.player.translation);
    scene.sun.translation = sunPos;
    scene.sun.updateTransform();
    const viewMatrix = camera.getGlobalTransform();
    mat4.invert(viewMatrix, viewMatrix);
    mat4.copy(matrix, viewMatrix);

    gl.uniformMatrix4fv(program.uniforms.uProjection, false, camera.projection);
    gl.uniform3fv(program.uniforms.uLightColor, light);
    gl.uniform1f(program.uniforms.uSunPercent, scene.sunPercent);
    gl.uniform3fv(program.uniforms.uSunPosition, sunPos);
    gl.uniform1f(program.uniforms.uAmbient, 0.2);
    
    scene.traverse(
      (node) => {
        matrixStack.push(mat4.clone(matrix));
        mat4.mul(matrix, matrix, node.transform);
        this.prepareNode(node);
        if (node.gl && node.gl.vao && node.extra != "raycast" && node.visible) {
          if(node.isPlayer){
            gl.useProgram(playerProgram.program);
            gl.uniformMatrix4fv(playerProgram.uniforms.uProjection, false, camera.projection);
            gl.uniform3fv(playerProgram.uniforms.uLightColor, light);
            gl.bindVertexArray(node.gl.vao);
            gl.uniformMatrix4fv(playerProgram.uniforms.uViewModel, false, matrix);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, node.gl.texture);
            gl.uniform1f(playerProgram.uniforms.uAmbient, scene.sunPercent+0.2);
            gl.uniformMatrix4fv(playerProgram.uniforms.uProjection, false, camera.projection);
            gl.drawElements(gl.TRIANGLES, node.gl.indices, gl.UNSIGNED_SHORT, 0);
            gl.useProgram(program.program);
          } else {
            gl.bindVertexArray(node.gl.vao);
            gl.uniformMatrix4fv(program.uniforms.uViewModel, false, matrix);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, node.gl.texture);
            gl.uniform1f(program.uniforms.uBehind, node.light[0]);
            gl.uniform1f(program.uniforms.uFront, node.light[1]);
            gl.uniform1f(program.uniforms.uRight, node.light[2]);
            gl.uniform1f(program.uniforms.uLeft, node.light[3]);
            gl.uniform1f(program.uniforms.uBottom, node.light[4]);
            gl.uniform1f(program.uniforms.uTop, node.light[5]);
            gl.uniform1f(program.uniforms.uSunLight, 0.8);
            gl.drawElements(gl.TRIANGLES, node.gl.indices, gl.UNSIGNED_SHORT, 0);
          }
        }
      },
      (node) => {
        matrix = matrixStack.pop();
      }
    );
  }

  createModel(node) {
    const gl = this.gl;
    const model = node.mesh;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.texcoords), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0);

    const indices = model.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

    return { vao, indices };
  }

  createTexture(texture) {
    const gl = this.gl;
    return WebGL.createTexture(gl, {
      image: texture,
      min: gl.NEAREST,
      mag: gl.NEAREST,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });
  }
}
