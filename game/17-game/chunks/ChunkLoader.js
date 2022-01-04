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
      let chunk = this.findOrCreateChunk(fixedX, fixedZ, scene);
      this.activeChunk = chunk;
      this.chunks.forEach((chunk) => chunk.blocks.forEach((block) => (block.chunkVisible = false)));

      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          let chunk = this.findOrCreateChunk(fixedX + i * Chunk.SIZE, fixedZ + j * Chunk.SIZE, scene);
          if (chunk) {
            chunk.blocks.forEach((block) => (block.chunkVisible = true));
          }
        }
      }
    }
  }

  removeBlock(block) {
    this.optimizeBlock(block, true);
  }

  insertBlock(block) {
    this.optimizeBlock(block);
    if (block.lightSource) this.setLight(block, 10);
    for (let i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].addBlock(block)) return;
    }
    this.chunks.push(new Chunk(Math.floor(block.translation[0] / Chunk.SIZE) * Chunk.SIZE, Math.floor(block.translation[2] / Chunk.SIZE) * Chunk.SIZE, [block]));
  }

  findOrCreateChunk(x, z, scene) {
    const fixedX = Math.floor(x / Chunk.SIZE) * Chunk.SIZE;
    const fixedZ = Math.floor(z / Chunk.SIZE) * Chunk.SIZE;
    let ch = this.chunks.find((chunk) => chunk.x == fixedX && chunk.z == fixedZ);
    if (!ch) {
      return ch;
      ch = new Chunk(fixedX, fixedZ);
      ch.blocks.forEach((block) => scene.addNode(block));
      this.chunks.push(ch);
      ch.blocks.forEach((block) => this.optimizeBlock(block));
    }
    return ch;
  }

  optimizeBlock(block, destroyed = false) {
    let center = block;
    if (center.transparent) return;
    let behind = null;
    let front = null;
    let right = null;
    let left = null;
    let bottom = null;
    let top = null;
    const x = center.translation[0];
    const y = center.translation[1];
    const z = center.translation[2];
    for (let i = 0; i < this.chunks.length; i++) {
      for (let j = 0; j < this.chunks[i].blocks.length; j++) {
        let node = this.chunks[i].blocks[j];
        if (node.transparent) continue;
        if (node.translation[0] == x && node.translation[1] == y && node.translation[2] == z + 1) {
          behind = node;
        }
        if (node.translation[0] == x && node.translation[1] == y && node.translation[2] == z - 1) {
          front = node;
        }
        if (node.translation[0] == x - 1 && node.translation[1] == y && node.translation[2] == z) {
          right = node;
        }
        if (node.translation[0] == x + 1 && node.translation[1] == y && node.translation[2] == z) {
          left = node;
        }
        if (node.translation[0] == x && node.translation[1] == y - 1 && node.translation[2] == z) {
          bottom = node;
        }
        if (node.translation[0] == x && node.translation[1] == y + 1 && node.translation[2] == z) {
          top = node;
        }
      }
    }
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
    if (destroyed) {
      this.chunks.forEach((chunk) => {
        if (chunk.removeBlock(block)) {
          return;
        }
      });
    }
  }

  findBlock(x, y, z) {
    for (let i = 0; i < this.chunks.length; i++) {
      for (let j = 0; j < this.chunks[i].blocks.length; j++) {
        let node = this.chunks[i].blocks[j];
        if (node.translation[0] == x && node.translation[1] == y && node.translation[2] == z) {
          return node;
        }
      }
    }
    return null;
  }

  setLight(_center, lightLevel) {
    const center = new Air(_center.translation[0], _center.translation[1], _center.translation[2], lightLevel);
    let elements = [center];
    let explored = [];
    _center.setLightning("all", lightLevel);
    while (elements.length > 0) {
      let block = elements.shift();
      const light = block.light;
      if (explored.some(x => x.isEqual(block)) || light <= 5) continue;
      explored.push(block);
      let behind = this.findBlock(block.x, block.y, block.z + 1);
      let front = this.findBlock(block.x, block.y, block.z - 1);
      let right = this.findBlock(block.x - 1, block.y, block.z);
      let left = this.findBlock(block.x + 1, block.y, block.z);
      let bottom = this.findBlock(block.x, block.y - 1, block.z);
      let top = this.findBlock(block.x, block.y + 1, block.z);

      if(behind) {
        behind.setLightning("front", light-1);
      } else{
        let air = new Air(block.x, block.y, block.z + 1, light-1)
        elements.push(air);
      }

      if(front) {
        front.setLightning("front", light-1);
      } else{
        let air = new Air(block.x, block.y, block.z - 1, light-1)
        elements.push(air);
      }

      if(right) {
        right.setLightning("front", light-1);
      } else{
        let air = new Air(block.x-1, block.y, block.z, light-1)
        elements.push(air);
      }

      if(left) {
        left.setLightning("front", light-1);
      } else{
        let air = new Air(block.x+1, block.y, block.z, light-1)
        elements.push(air);
      }

      if(bottom) {
        bottom.setLightning("front", light-1);
      } else{
        let air = new Air(block.x, block.y-1, block.z, light-1)
        elements.push(air);
      }

      if(top) {
        top.setLightning("front", light-1);
      } else{
        let air = new Air(block.x, block.y+1, block.z, light-1)
        elements.push(air);
      }

    }
  }
}

class Air {
  constructor(_x, _y, _z, _light) {
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.light = _light;
  }

  isEqual(a) {
    return this.x == a.x && this.y == a.y && this.z == a;
  }
}
