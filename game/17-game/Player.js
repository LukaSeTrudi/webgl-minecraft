import { Node } from "./Node.js";
import { vec3, mat4 } from "../../lib/gl-matrix-module.js";

import { Utils } from "./Utils.js";
export class Player extends Node {
  constructor(options) {
    super(options);
    Utils.init(this, this.constructor.defaults, options);
    this.grounded = false;
    this.mousemoveHandler = this.mousemoveHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.keyupHandler = this.keyupHandler.bind(this);
    this.keys = {};
  }

  distanceTo(other) {
    // Block
    return Math.sqrt(Math.pow(this.translation[0] - other.translation[0], 2) + Math.pow(this.translation[1] - other.translation[1], 2) + Math.pow(this.translation[2] - other.translation[2], 2));
  }

  update(dt) {
    const c = this;
    const forward = vec3.set(vec3.create(), -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
    const right = vec3.set(vec3.create(), Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));
    const up = vec3.set(vec3.create(), 0, this.flySpeed, 0);
    // 1: add movement acceleration
    let acc = vec3.create();
    if (this.keys["KeyW"]) {
      vec3.add(acc, acc, forward);
    }
    if (this.keys["KeyS"]) {
      vec3.sub(acc, acc, forward);
    }
    if (this.keys["KeyD"]) {
      vec3.add(acc, acc, right);
    }
    if (this.keys["KeyA"]) {
      vec3.sub(acc, acc, right);
    }
    if (this.keys["Digit5"]) {
      this.camera.switchPerson();
      this.keys["Digit5"] = false;
    }

    c.velocity[1] = 0;
    
    // 2: update velocity
    vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

    // 3: if no movement, apply friction
    if (!this.keys["KeyW"] && !this.keys["KeyS"] && !this.keys["KeyD"] && !this.keys["KeyA"] && c.velocity[1] <= 0) {
      vec3.scale(c.velocity, c.velocity, 1 - c.friction);
    }

    // 4: limit speed
    const len = vec3.len(c.velocity);
    if (len > c.maxSpeed) {
      vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
    }
    if(this.keys["KeyF"]) {
      vec3.scale(c.velocity,c.velocity,2);
    }
    if (this.keys["Space"]) {
      c.velocity[1] = this.flySpeed;
    }
    if(this.keys["ShiftLeft"]) {
      c.velocity[1] = -this.flySpeed;
    }
  }

  enableCamera() {
    document.addEventListener("mousemove", this.mousemoveHandler);
    document.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("keyup", this.keyupHandler);
  }

  disableCamera() {
    document.removeEventListener("mousemove", this.mousemoveHandler);
    document.removeEventListener("keydown", this.keydownHandler);
    document.removeEventListener("keyup", this.keyupHandler);

    for (let key in this.keys) {
      this.keys[key] = false;
    }
  }

  mousemoveHandler(e) {
    const dx = e.movementX;
    const dy = e.movementY;
    const c = this;
    c.head.rotation[0] -= dy * this.mouseSensitivity;
    c.rotation[1] -= dx * this.mouseSensitivity;

    const pi = Math.PI;
    const twopi = pi * 2;
    const halfpi = pi / 2;

    if (c.head.rotation[0] > halfpi / 4) {
      c.head.rotation[0] = halfpi / 4;
    }
    if (c.head.rotation[0] < -halfpi) {
      c.head.rotation[0] = -halfpi;
    }
    c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
    c.head.updateTransform();
  }

  keydownHandler(e) {
    this.keys[e.code] = true;
  }

  keyupHandler(e) {
    this.keys[e.code] = false;
  }
}
Player.defaults = {
  velocity: [0, -1, 0],
  mouseSensitivity: 0.002,
  maxSpeed: 7,
  flySpeed: 8,
  friction: 0.2,
  acceleration: 20,
};
