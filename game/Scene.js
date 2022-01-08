import { Block } from "./world/Block.js";

export class Scene {
  constructor() {
    this.nodes = [];
    this.sunPercent = 0.9;
    window.scene = this;
    this.sun = new Block(Block.original, Block.sunTexture, {});
    this.addNode(this.sun);
  }

  addNode(node) {
    let found = this.nodes.findIndex((x) => x === node);
    if (found === -1) {
      if(node instanceof Block && node.id == 6) {
        this.nodes.push(node);
      } else {
        this.nodes.unshift(node);
      }
    }
  }

  removeNode(node) {
    let found = this.nodes.findIndex((x) => x === node);
    if (found !== -1) {
      this.nodes.splice(found, 1);
    }
  }

  traverse(before, after) {
    this.nodes.filter((node) => node.chunkVisible && node.visible).forEach((node) => node.traverse(before, after));
  }

  setTime(time) {
    this.sunPercent = time;
  }

  clone() {
    return [...this.nodes];
  }
}
