import { Block } from "../world/Block.js";

export class Chunk {
  static SIZE = 12;
  static HEIGHT = 4;

  constructor(x, z, blocks=[]) {
    this.x = x;
    this.z = z;
    this.blocks = blocks;
    this.removedBlocks = [];
    this.createChunk();
  }

  createChunk() {
    for (let i = this.x; i < this.x + Chunk.SIZE; i++) {
      for (let j = this.z; j < this.z + Chunk.SIZE; j++) {
        let value = Math.floor(noise.perlin2(i / 10, j / 10) * 4) + Chunk.HEIGHT;
        for (let y = 0; y < value; y++) {
          let block = new Block(Block.originalMesh, Block.stoneTexture, { translation: [i, y, j] });
          block.visible = false;
          this.addBlock(block);
        }
        let block = new Block(Block.originalMesh, Block.grassTexture, { translation: [i, value, j] });
        block.sunLight = true;
        this.addBlock(block);
      }
    }
  };

  checkSun(block, removing=false) {
    let bl = this.blocks.find(x => x.sunLight && x.translation[0] == block.translation[0] && x.translation[2] == block.translation[2]);
    if(removing) {
      let blR = this.blocks.filter(x => !x.sunLight && x.translation[0] == block.translation[0] && x.translation[2] == block.translation[2]).sort((a, b) => a.translation[1] > b.translation[1]);
      blR[blR.length-1].sunLight = true;
      bl.sunLight = false;
      return;
    }


    if(bl && block.translation[1] > bl.translation[1]) {
      block.sunLight = true;
      bl.sunLight = false;
    }
  }

  addBlock(block) {
    if(block.translation[0] >= this.x && block.translation[0] < this.x + Chunk.SIZE && block.translation[2] >= this.z && block.translation[2] < this.z+Chunk.SIZE) {
      this.blocks.push(block);
      this.checkSun(block);
      return true;
    }
    return false;
  }
  removeBlock(block) {
    let findInd = this.blocks.findIndex(bl => bl.translation[0] == block.translation[0] && bl.translation[1] == block.translation[1] && bl.translation[2] == block.translation[2]);
    if(findInd >= 0) {
      this.checkSun(block,true);
      block = null;
      this.blocks.splice(findInd, 1);
      return true;
    }
    return false;
  }
}