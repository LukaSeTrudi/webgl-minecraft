import { Block } from "../world/Block.js";

export class Chunk {
  static SIZE = 12;
  static HEIGHT = 4;

  constructor(x, z, blocks = []) {
    this.x = x;
    this.z = z;
    this.blocks = blocks;
    this.removedBlocks = [];
    this.createChunk();
  }

  getRandomTreePos(arr) {
    let availbs = [];
    for (let y = 2; y < arr.length - 2; y++) {
      for (let x = 2; x < arr[y].length - 2; x++) {
        let gud = true;
        for (let j = y - 2; j < y + 2; j++) {
          for (let i = x - 2; i < x + 2; i++) {
            if (arr[j][i] == null) {
              gud = false;
            }
          }
        }
        if (gud) {
          availbs.push({
            x,
            y,
            val: arr[y][x],
          });
        }
      }
    }
    if (availbs.length == 0) return null;
    let selected = availbs[Math.floor(availbs.length * Math.random())];
    for (let i = selected.x - 2; i < selected.x + 3; i++) {
      for (let j = selected.y - 2; j < selected.y + 3; j++) {
        arr[j][i] = null;
      }
    }
    return availbs[Math.floor(availbs.length * Math.random())];
  }

  createTree(x, y, val) {
    for (let i = val; i < val + 5; i++) {
      let block = new Block(Block.originalMesh, Block.oakTexture, { translation: [this.x + x, i, this.z + y] });
      this.addBlock(block);
    }
    for (let i = x - 2; i <= x + 2; i++) {
      for (let j = y - 2; j <= y + 2; j++) {
        if (i == x && j == y) continue;
        let block = new Block(Block.originalMesh, Block.leavesTexture, { translation: [this.x + i, val + 3, this.z + j] });
        this.addBlock(block);
      }
    }
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i == x && j == y) continue;
        let block = new Block(Block.originalMesh, Block.leavesTexture, { translation: [this.x + i, val + 4, this.z + j] });
        this.addBlock(block);
      }
    }
    let block = new Block(Block.originalMesh, Block.leavesTexture, { translation: [this.x + x, val + 5, this.z + y] });
    this.addBlock(block);
  }

  createTrees(availablePos) {
    let num = Math.random() * 2;
    availablePos = availablePos.map((y, yindex) => {
      if (yindex < 2 || yindex >= Chunk.SIZE - 2) return Array(Chunk.SIZE).fill(null);
      return y.map((x, xindex) => {
        if (xindex < 2 || xindex >= Chunk.SIZE - 2) return null;
        return x;
      });
    });
    for (let i = 0; i < num; i++) {
      let k = this.getRandomTreePos(availablePos);
      if (!k) return;
      this.createTree(k.y, k.x, k.val);
    }
  }

  createChunk() {
    let treeAvailablePos = [];
    for (let i = this.x; i < this.x + Chunk.SIZE; i++) {
      let row = [];
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
        row.push(value + 1);
      }
      treeAvailablePos.push(row);
    }
    this.createTrees(treeAvailablePos);
  }

  checkSun(block, removing = false) {
    let blR = this.blocks.filter((x) => !x.transparent && x.translation[0] == block.translation[0] && x.translation[2] == block.translation[2]).sort((b, a) => a.translation[1] - b.translation[1]);
    let k = 1.0;
    blR.forEach((bl, ind, arr) => {
      if (!(removing && block == bl)) {
        arr[ind].sunLight = Math.max(k, 0);
        k -= 0.3;
      }
    });
  }

  addBlock(block) {
    if (block.translation[0] >= this.x && block.translation[0] < this.x + Chunk.SIZE && block.translation[2] >= this.z && block.translation[2] < this.z + Chunk.SIZE) {
      this.blocks.push(block);
      this.checkSun(block);
      return true;
    }
    return false;
  }
  removeBlock(block) {
    let findInd = this.blocks.findIndex((bl) => bl.translation[0] == block.translation[0] && bl.translation[1] == block.translation[1] && bl.translation[2] == block.translation[2]);
    if (findInd >= 0) {
      this.checkSun(block, true);
      block = null;
      this.blocks.splice(findInd, 1);
      return true;
    }
    return false;
  }
}
