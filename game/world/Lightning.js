import { LightSource } from "./LightSource.js";

export class Lightning {
  constructor(cl) {
    this.chunkLoader = cl;
    this.lightSources = [];
  }

  findRadiusBlocks(block) {
    let blocks = [];
    this.chunkLoader.chunks.forEach(chunk => {
      chunk.blocks.forEach(bl => {
        if(this.distanceTo(bl, block) <= 3 && !bl.transparent) { 
          blocks.push(bl);
        }
      });
    })
    return blocks;
  }

  addBlock(block) {
    let light = this.getClosestLight(block.translation[0], block.translation[1], block.translation[2]);
    if(light.closest && light.dist <= 3) {
      light.closest.radiusBlocks.push(block);
      light.closest.lightScene();
    }
  }

  removeBlock(block) {
    let light = this.getClosestLight(block.translation[0], block.translation[1], block.translation[2]);
    if(light.closest && light.dist <= 3) {
      let ind = light.closest.radiusBlocks.findIndex(x => x == block);
      if(ind >= 0) {
        light.closest.radiusBlocks.splice(ind, 1);
      }
      light.closest.lightScene();
    }
  }

  resetLightBlock(block) {
    let light = this.getClosestLight(block.translation[0], block.translation[1], block.translation[2]);
    if(light.closest && light.dist <= 3) {
      light.closest.lightScene();
    }
  }

  distanceTo(bl1, bl2) {
    return Math.sqrt(Math.pow(bl1.translation[0]-bl2.translation[0],2)+Math.pow(bl1.translation[1]-bl2.translation[1],2)+Math.pow(bl1.translation[2]-bl2.translation[2],2))
  }

  getClosestLight(x, y, z) {
    let closest = null;
    let dist = 10;
    this.lightSources.forEach(light => {
      const d = Math.sqrt(Math.pow(light.source.translation[0]-x,2)+Math.pow(light.source.translation[1]-y,2)+Math.pow(light.source.translation[2]-z,2));
      if(d <= dist) {
        dist = d;
        closest = light;
      }
    })
    return {closest, dist};
  }

  addLight(block) {
    let blocks = this.findRadiusBlocks(block);
    this.lightSources.push(new LightSource(block, blocks));
  }

  removeLight(block) {
    let ind = this.lightSources.findIndex(x => x.source === block);
    if (ind >= 0) {
      this.lightSources[ind].destroy();
      this.lightSources.splice(ind, 1);
    }
  }
}

