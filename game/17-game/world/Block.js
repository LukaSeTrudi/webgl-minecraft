import { Model } from '../Model.js';

export class Block extends Model {
  static originalMesh = null;
  constructor(mesh, texture, options) {
    mesh = {...Block.originalMesh};
    super(mesh, texture, options);
    this.id = options.id;
    this.durability = options.durability;
    this.fac = ["behind", "front", "right", "left", "bottom", "top"];
    this.faces = [true, true, true, true, true, true];
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
}