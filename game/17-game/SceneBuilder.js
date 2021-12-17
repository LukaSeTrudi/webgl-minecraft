import { Mesh } from "./Mesh.js";

import { Node } from "./Node.js";
import { Model } from "./Model.js";
import { Camera } from "./Camera.js";

import { Scene } from "./Scene.js";
import { Player } from "./Player.js";
import { Block } from "./world/Block.js";

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

  proceduralBuild(scene, blocks) {
    let nodes = 10;
    noise.seed(Math.random());
    let grid = [];
    const blockMesh = blocks[0].mesh;
    const blockTexture = blocks[0].image;
    for(let i = 0; i < nodes; i++) {
      let row = [];
      for(let j = 0; j < nodes; j++) {
        let value = Math.floor(noise.perlin3(i, Math.random(), j)*3);
        
        for(let x=0; x < 4; x++) {
          for(let y=0; y <4; y++) {
            let block = new Block(blockMesh, blockTexture, {translation: [i*4+x, value, j*4+y]});
            scene.addNode(block);
          }
        }
        row.push(value);
      }
      grid.push(row);
    }

    

  }

}
