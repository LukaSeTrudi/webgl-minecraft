import { Model } from '../Model.js';

export class Block extends Model {
  static originalMesh = null;
  static doubleSide = null;
  static grassTexture = null;
  static stoneTexture = null;

  constructor(mesh, texture, options) {
    if(options.doubleSide) {
      mesh = {...Block.doubleSide};
      for(let i = 72; i < 144; i++) {
        mesh.vertices[i] = Math.abs(mesh.vertices[i]-0.001);
      }
    } else {
      mesh = {...Block.originalMesh};
    }
    super({...mesh}, texture, options);
    this.id = options.id;
    this.setLightning("all", 0);
    this.changedLightning = false;
    this.durability = options.durability;
    this.fac = ["behind", "front", "right", "left", "bottom", "top"];
    this.faces = [true, true, true, true, true, true];
    this.updateMesh();
  }

  clone() {
    const object = Object.assign({}, this);
    Object.setPrototypeOf(object, Block.prototype);
    return object;
  }

  //types - behind, front, right, left, bottom, top;
  setFace(type, val) {
    let i = this.fac.findIndex(x => x == type);
    if(i !== -1) {
      this.faces[i] = val;
    }
    if(this.faces.some(x => x == true)) {
      this.visible = true;
    } else {
      this.visible = false;
    }
  };

  updateMesh() {
    if(this.transparent) return;
    this.mesh.indices = [...Block.originalMesh.indices].filter((x, index) => {
      if(this.faces[0] && index < 6) return true;
      if(this.faces[1] && index >= 6 && index < 12) return true;
      if(this.faces[2] && index >= 12 && index < 18) return true;
      if(this.faces[3] && index >= 18 && index < 24) return true;
      if(this.faces[4] && index >= 24 && index < 30) return true;
      if(this.faces[5] && index >= 30 && index < 36) return true;
      return false;
    })
    this.gl = null;
  }

  setLightning(side, val) {
    this.changedLightning = true;
    if(side == "all") {
      this.light = this.light.map(x => val);
      return;
    }
    let i = this.fac.findIndex(x => x == side);
    this.light[i] = Math.max(this.light[i], val);
  }
}