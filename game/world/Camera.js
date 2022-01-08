import { vec3, mat4 } from "../../lib/gl-matrix-module.js";

import { Utils } from "../Utils.js";
import { Node } from "../structure/Node.js";
import { CAMERA_SETTINGS } from "../settings/CameraSettings.js";

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
    this.head.translation = [0, 1.05, 0];
    this.head.updateTransform();
    switch (this.personMode) {
      case 0:
        this.head.visible = false;
        this.head.translation = [0, 1.45, -0.2]
        this.head.updateTransform();
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
}

Camera.defaults = {
  aspect: 1,
  fov: 1.5,
  near: 0.01,
  far: 100,
};
