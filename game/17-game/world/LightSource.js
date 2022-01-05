export class LightSource {
  constructor(block, blocks) {
    this.source = block;
    this.radiusBlocks = blocks;
  }

  destroy() {
    this.radiusBlocks.forEach((bl) => bl.setLightning("all", 0));
  }

  findAdjacent(air) {
    let arr = Array(6).fill(null);
    const x = air.x;
    const y = air.y;
    const z = air.z;
    for (let i = 0; i < this.radiusBlocks.length; i++) {
      let node = this.radiusBlocks[i];

      if (node.translation[0] == x && node.translation[1] == y && node.translation[2] == z + 1) {
        arr[0] = node;
      } else if (node.translation[0] == x && node.translation[1] == y && node.translation[2] == z - 1) {
        arr[1] = node;
      } else if (node.translation[0] == x - 1 && node.translation[1] == y && node.translation[2] == z) {
        arr[2] = node;
      } else if (node.translation[0] == x + 1 && node.translation[1] == y && node.translation[2] == z) {
        arr[3] = node;
      } else if (node.translation[0] == x && node.translation[1] == y - 1 && node.translation[2] == z) {
        arr[4] = node;
      } else if (node.translation[0] == x && node.translation[1] == y + 1 && node.translation[2] == z) {
        arr[5] = node;
      }
      if (!arr.some((x) => x == null)) return arr;
    }
    return arr;
  }

  lightScene() {
    this.destroy();
    let elements = [new Air(this.source.translation[0], this.source.translation[1], this.source.translation[2], 10)];
    let explored = [];
    this.source.setLightning("all", 10 / 15);
    while (elements.length > 0) {
      const block = elements.shift();
      const light = block.light;
      if (light <= 5 || explored.some((x) => x.isEqual(block))) continue;
      explored.push(block);

      let adjacent = this.findAdjacent(block);

      let behind = adjacent[0];
      let front = adjacent[1];
      let right = adjacent[2];
      let left = adjacent[3];
      let bottom = adjacent[4];
      let top = adjacent[5];

      const newLight = (light - 1) / 15;

      if (behind && !explored.some((x) => x.isEqual(behind))) {
        behind.setLightning("front", newLight);
      } else {
        let air = new Air(block.x, block.y, block.z + 1, light - 1);
        elements.push(air);
      }

      if (front && !explored.some((x) => x.isEqual(front))) {
        front.setLightning("behind", newLight);
      } else {
        let air = new Air(block.x, block.y, block.z - 1, light - 1);
        elements.push(air);
      }

      if (right && !explored.some((x) => x.isEqualNode(right))) {
        right.setLightning("left", newLight);
      } else {
        let air = new Air(block.x - 1, block.y, block.z, light - 1);
        elements.push(air);
      }

      if (left && !explored.some((x) => x.isEqualNode(left))) {
        left.setLightning("right", newLight);
      } else {
        let air = new Air(block.x + 1, block.y, block.z, light - 1);
        elements.push(air);
      }

      if (bottom && !explored.some((x) => x.isEqualNode(bottom))) {
        bottom.setLightning("top", newLight);
      } else {
        let air = new Air(block.x, block.y - 1, block.z, light - 1);
        elements.push(air);
      }
      if (top && !explored.some((x) => x.isEqualNode(top))) {
        top.setLightning("bottom", newLight);
      } else {
        let air = new Air(block.x, block.y + 1, block.z, light - 1);
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

  isEqualNode(a) {
    return this.x == a.translation[0] && this.y == a.translation[1] && this.z == a.translation[2];
  }
}
