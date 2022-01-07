import { Mesh } from "../Mesh.js";
import { Block } from "../world/Block.js";

export class BlockLoader {

  static availableBlocks = [];

  async loadBlocks(uri) {
      let blocks = await this.loadJson(uri);
      let blockMesh = await this.loadJson("/common/models/cube.json");
      let doubleSide = await this.loadJson("/common/models/doublesidecube.json");
      Block.originalMesh = blockMesh;
      Block.doubleSide = doubleSide;
      blockMesh = new Mesh(blockMesh);
      let _blocks = [];
      for(let i = 0; i < blocks.length; i++) {
        let texture = await this.loadImage("/common/textures/"+blocks[i].texture).then((x) => blocks[i].texture = x);
        _blocks.push(new Block(blockMesh, texture, blocks[i]));
      }
      Block.grassTexture = _blocks[0].image;
      Block.stoneTexture = _blocks[4].image;
      Block.sunTexture = _blocks[44].image;
      return _blocks;
  }

  loadImage(uri) {
      return new Promise((resolve, reject) => {
          let image = new Image();
          image.addEventListener('load', () => resolve(image));
          image.addEventListener('error', reject);
          image.src = uri;
      });
  }

  loadJson(uri) {
      return fetch(uri).then(response => response.json());
  }

}
