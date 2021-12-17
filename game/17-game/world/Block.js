import { Model } from '../Model.js';

export class Block extends Model {
  constructor(mesh, texture, options) {
    super(mesh, texture, options);
    this.id = options.id;
    this.durability = options.durability;
  }

  clone() {
    const object = Object.assign({}, this);
    Object.setPrototypeOf(object, Block.prototype);
    return object;
  }
}