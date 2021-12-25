import { Block } from "./world/Block.js";

export class Scene {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    let found = this.nodes.findIndex((x) => x === node);
    if (found === -1) {
      this.nodes.push(node);
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

  clone() {
    return [...this.nodes];
  }
}
