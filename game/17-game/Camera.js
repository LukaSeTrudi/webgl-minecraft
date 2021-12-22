import { vec3, mat4 } from "../../lib/gl-matrix-module.js";

import { Utils } from "./Utils.js";
import { Node } from "./Node.js";
import { CAMERA_SETTINGS } from "./settings/CameraSettings.js";

export class Camera extends Node {
  constructor(options) {
    super(options);
    Utils.init(this, this.constructor.defaults, options);

    this.personMode = 0;
    this.projection = mat4.create();
    this.updateProjection();
  }

  updateProjection() {
    mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
  }

  switchPerson() {
    this.personMode = (this.personMode + 1) % 3; // 0 - first person, 1- third person, 2- front third person,
    this.head.visible = true;
    switch (this.personMode) {
      case 0:
        this.head.visible = false;
        this.translation = CAMERA_SETTINGS.FIRST_PERSON_POSITION;
        this.rotation = CAMERA_SETTINGS.FIRST_PERSON_ROTATION;
        break;
      case 1:
        this.translation = CAMERA_SETTINGS.THIRD_PERSON_POSITION;
        this.rotation = CAMERA_SETTINGS.THIRD_PERSON_ROTATION;
        break;
      case 2:
        this.translation = CAMERA_SETTINGS.FRONT_PERSON_POSITION;
        this.rotation = CAMERA_SETTINGS.FRONT_PERSON_ROTATION;
        break;
    }
    this.updateTransform();
  }

  lookingAt() {
    
  }
}

Camera.defaults = {
  aspect: 1,
  fov: 1.5,
  near: 0.01,
  far: 100,
};
