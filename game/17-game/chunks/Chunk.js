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
        this.addBlock(block);
      }
    }
  };

  addBlock(block) {
    if(block.translation[0] >= this.x && block.translation[0] < this.x + Chunk.SIZE && block.translation[2] >= this.z && block.translation[2] < this.z+Chunk.SIZE) {
      this.blocks.push(block);
      return true;
    }
    return false;
  }
  removeBlock(block) {
    let findInd = this.blocks.findIndex(bl => bl.translation[0] == block.translation[0] && bl.translation[1] == block.translation[1] && bl.translation[2] == block.translation[2]);
    if(findInd >= 0) {
      block = null;
      this.blocks.splice(findInd, 1);
      return true;
    }
    return false;
  }
}