import { SceneBuilder } from "./SceneBuilder.js";
export class TerrainBuilder {
  
  constructor(seed) {
    this.seed = seed;
  }

  getSpecs() {
    let spec = []
    for(let i=0; i < 10; i++) {
      spec.push({
        aabb: { min: [-1, -1, -1], max: [1, 1, 1] },
        mesh: 0,
        texture: 0,
        translation: [i, 1, -5],
        type: 'model'
      })
    }
    return spec;
  }
}