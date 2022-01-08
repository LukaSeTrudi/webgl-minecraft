import { Mesh } from "./structure/Mesh.js";

import { Node } from "./structure/Node.js";
import { Model } from "./structure/Model.js";
import { Camera } from "./world/Camera.js";

import { Scene } from "./Scene.js";
import { Player } from "./player/Player.js";
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
        n.isPlayer = true;
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
    noise.seed(5);
    let cl = new ChunkLoader();
    
    return cl;
  }
}
