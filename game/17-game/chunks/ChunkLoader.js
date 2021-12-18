import { Chunk } from "./Chunk.js";

export class ChunkLoader {
  constructor() {
    this.chunks = [];
    this.activeChunk = null;
  }

  changeActiveChunk(scene, x, z) {
    const fixedX = Math.floor(x / Chunk.SIZE) * Chunk.SIZE;
    const fixedZ = Math.floor(z / Chunk.SIZE) * Chunk.SIZE;

    if (!this.activeChunk || this.activeChunk.x != fixedX || this.activeChunk.z != fixedZ) {
      let chunk = this.chunks.find((chunk) => chunk.x == fixedX && chunk.z == fixedZ);
      if (!chunk) {
        chunk = new Chunk(fixedX, fixedZ);
      }
      this.activeChunk = chunk;
      this.chunks.forEach((chunk) => {
        if (Math.abs(this.activeChunk.x - chunk.x) < 2 * Chunk.SIZE && Math.abs(this.activeChunk.z - chunk.z) < 2 * Chunk.SIZE) {
          chunk.blocks.forEach((block) => scene.addNode(block));
        } else {
          chunk.blocks.forEach((block) => scene.removeNode(block));
        }
      });
    }
  }

  insertBlock(block) {
    for (let i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].addBlock(block)) return;
    }
    this.chunks.push(new Chunk(Math.floor(block.translation[0] / Chunk.SIZE) * Chunk.SIZE, Math.floor(block.translation[2] / Chunk.SIZE) * Chunk.SIZE, [block]));
  }

  optimizeBlock(block, destroyed = false) {
    let center = block;
    let behind = this.findBlock(block.translation[0], block.translation[1], block.translation[2] + 1);
    let front = this.findBlock(block.translation[0], block.translation[1], block.translation[2] - 1);
    let right = this.findBlock(block.translation[0] - 1, block.translation[1], block.translation[2]);
    let left = this.findBlock(block.translation[0] + 1, block.translation[1], block.translation[2]);
    let bottom = this.findBlock(block.translation[0], block.translation[1] - 1, block.translation[2]);
    let top = this.findBlock(block.translation[0], block.translation[1] + 1, block.translation[2]);
    
    //types - behind, front, right, left, bottom, top;
    center.setFace("left", left ? false : true);
    center.setFace("right", right ? false : true);
    center.setFace("top", top ? false : true);
    center.setFace("bottom", bottom ? false : true);
    center.setFace("front", front ? false : true);
    center.setFace("behind", behind ? false : true);

    center.updateMesh();
    if (left) {
      left.setFace("right", destroyed);
      left.updateMesh();
    }
    if (right) {
      right.setFace("left", destroyed);
      right.updateMesh();
    }
    if (top) {
      top.setFace("bottom", destroyed);
      top.updateMesh();
    }
    if (bottom) {
      bottom.setFace("top", destroyed);
      bottom.updateMesh();
    }
    if (front) {
      front.setFace("behind", destroyed);
      front.updateMesh();
    }
    if (behind) {
      behind.setFace("front", destroyed);
      behind.updateMesh();
    }
  }

  findBlock(x, y, z) {
    for(let i = 0; i < this.chunks.length; i++) {
      for(let j = 0; j < this.chunks[i].blocks.length; j++) {
        let node = this.chunks[i].blocks[j];
        if(node.translation[0] == x && node.translation[1] == y && node.translation[2] == z) {
          return node;
        }
      }
    }
    return null;
  }
}
