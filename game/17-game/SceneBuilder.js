import { Mesh } from "./Mesh.js";

import { Node } from "./Node.js";
import { Model } from "./Model.js";
import { Camera } from "./Camera.js";

import { Scene } from "./Scene.js";
import { Player } from "./Player.js";
import { Block } from "./world/Block.js";
import { ChunkLoader } from "./chunks/ChunkLoader.js";

export class SceneBuilder {
  constructor(spec) {
    this.spec = spec;
  }

  createNode(spec) {
    let n;
    switch (spec.type) {
      case "camera":
        n = new Camera(spec);
        break;
      case "model": {
        const mesh = new Mesh(this.spec.meshes[spec.mesh]);
        const texture = this.spec.textures[spec.texture];
        n = new Model(mesh, texture, spec);
        break;
      }
      case "player": {
        n = new Player(spec);
        break;
      }
      default:
        n = new Node(spec);
        break;
    }
    if (spec.children) {
      spec.children.forEach((child) => n.addChild(this.createNode(child)));
    }
    return n;
  }

  build() {
    let scene = new Scene();
    this.spec.nodes.forEach((spec) => scene.addNode(this.createNode(spec)));
    return scene;
  }

  proceduralBuild(blocks) {
    let nodes = 15;
    noise.seed(5);
    let grid = [];
    let cl = new ChunkLoader();
    const grassMesh = blocks[0].mesh;
    const grassTexture = blocks[0].image;
    const stoneMesh = blocks[4].mesh;
    const stoneTexture = blocks[4].image;

    for (let i = -nodes; i < nodes; i++) {
      for (let j = -nodes; j < nodes; j++) {
        let value = Math.floor(noise.perlin2(i / 10, j / 10) * 4) + 15;
        for (let y = 0; y < value; y++) {
          let block = new Block(stoneMesh, stoneTexture, { translation: [i, y, j] });
          cl.optimizeBlock(block);
          cl.insertBlock(block);
        }
        let block = new Block(grassMesh, grassTexture, { translation: [i, value, j] });
        cl.optimizeBlock(block);
        cl.insertBlock(block);
      }
      console.log(i);
    }
    return cl;
  }
}
