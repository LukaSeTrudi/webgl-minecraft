export class Chunk {
  static SIZE = 16;

  constructor(x, z, blocks=[]) {
    this.x = x;
    this.z = z;
    this.blocks = blocks;
  }

  addBlock(block) {
    if(block.translation[0] >= this.x && block.translation[0] < this.x + Chunk.SIZE && block.translation[2] >= this.z && block.translation[2] < this.z) {
      this.blocks.push(block);
      return true;
    }
    return false;
  }
}