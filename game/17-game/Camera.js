import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';

export class Camera extends Node {

    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);

        this.firstPerson = false;
        this.projection = mat4.create();
        this.updateProjection();
    }

    updateProjection() {
        mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
    }

    switchPerson() {
      this.firstPerson = !this.firstPerson;
      if(this.firstPerson) {
        this.translation = [0,0,0];
      } else {
        this.translation = [0.5, 3, 9];
      }
      console.log(this.translation);
      this.updateTransform();
    }

}

Camera.defaults = {
    aspect           : 1,
    fov              : 1.5,
    near             : 0.01,
    far              : 100,
};
