import { Chunk } from "./Chunk";

export class ChunkLoader {
  constructor() {
    this.chunks = [];
    this.activeChunks = [];
    this.activeChunk = null;
  }

  setSurroundingChunks() {
    this.activeChunks = this.chunks.map(chunk => {
      if(Math.abs(this.activeChunk.x-chunk.x) < 2 && Math.abs(this.activeChunk.y-chunk.y) < 2) {
        return true;
      }
      return false;
    })
  }

  changeActiveChunk(x, z) {
    if(this.activeChunk.x != x || this.activeChunk.z != z) {
      let chunk = this.chunks.find(chunk => chunk.x == x && chunk.z == z);
      if(!chunk) {
        chunk = new Chunk(x,z);
      }
    }
  }

  getActiveItems() {

  }

  insertBlock(block) {
    for(let i = 0; i < this.activeChunks; i++) {

    }
  }
}