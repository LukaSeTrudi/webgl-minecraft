import { Node } from "./Node.js";
import { vec3, mat4, quat } from "../../lib/gl-matrix-module.js";

import { Utils } from "./Utils.js";
import { Block } from "./world/Block.js";
import { BlockLoader } from "./loaders/BlockLoader.js";
import { Inventory } from "./player/Inventory.js";

export class Player extends Node {
  constructor(options) {
    super(options);
    Utils.init(this, this.constructor.defaults, options);
    this.grounded = false;
    this.sprinting = false;
    this.enableMove = true;
    this.verticalMomentum = 0;
    this.mousemoveHandler = this.mousemoveHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.keyupHandler = this.keyupHandler.bind(this);
    this.mouseClickHandler = this.mouseClickHandler.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.keys = {};
    this.disabled = false;
    this.inventory = new Inventory();
  }

  distanceTo(other) {
    // Block
    return Math.sqrt(Math.pow(this.translation[0] - other.translation[0], 2) + Math.pow(this.translation[1] - other.translation[1], 2) + Math.pow(this.translation[2] - other.translation[2], 2));
  }

  update(dt) {
    this.handleKeys();
    const c = this;
    const forward = vec3.set(vec3.create(), -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
    const right = vec3.set(vec3.create(), Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));
    const up = vec3.set(vec3.create(), 0, 1, 0);
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

    if (this.verticalMomentum > c.gravity) {
      this.verticalMomentum += c.gravity * dt;
    }

    if (this.sprinting) {
      // 2: update velocity
      vec3.scale(acc, acc, c.sprintSpeed);
    } else {
      vec3.scale(acc, acc, c.walkSpeed);
    }

    vec3.scaleAndAdd(acc, acc, up, this.verticalMomentum);

    if (acc[1] < 0) {
      acc[1] = this.grounded ? 0 : acc[1];
    }

    c.velocity = acc;
  }

  enableCamera() {
    document.addEventListener("mousemove", this.mousemoveHandler);
    document.addEventListener("click", this.mouseClickHandler);
    document.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("keyup", this.keyupHandler);
  }

  disableCamera() {
    document.removeEventListener("mousemove", this.mousemoveHandler);
    document.removeEventListener("click", this.mouseClickHandler);
    document.removeEventListener("keydown", this.keydownHandler);
    document.removeEventListener("keyup", this.keyupHandler);
    for (let key in this.keys) {
      this.keys[key] = false;
    }
  }

  handleKeys() {
    if (this.translation[1] < -10 || this.keys["KeyR"]) {
      this.translation[1] = 14;
      this.updateTransform();
    }

    if (this.keys["F5"]) {
      this.camera.switchPerson();
      this.keys["F5"] = false;
    }

    if (this.keys["Space"] && this.grounded && this.velocity[1] == 0) {
      this.verticalMomentum = this.jumpForce;
    }

    if (this.keys["ShiftLeft"]) {
      this.sprinting = true;
    } else {
      this.sprinting = false;
    }

    for(let i = 0; i < 9; i++) {
      if(this.keys["Digit"+(i+1)]) {
        this.inventory.changeSelectedIndex(i);
      }
    }

    if(this.keys["KeyE"]) {
      this.inventory.toggleInventory();
      this.keys["KeyE"] = false;
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

    if (c.head.rotation[0] > halfpi) {
      c.head.rotation[0] = halfpi;
    }
    if (c.head.rotation[0] < -halfpi / 1.1) {
      c.head.rotation[0] = -halfpi / 1.1;
    }
    c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
    c.head.updateTransform();
  }

  mouseClickHandler(e) {
    switch (e.which) {
      case 1:
        this.clickBlock(true);
        break;
      case 3:
        this.clickBlock(false);
        break;
      default:
        console.log("unknown mouse event");
    }
  }

  scrollHandler(e) {
    console.log(e)
  }

  keydownHandler(e) {
    e.preventDefault();
    this.keys[e.code] = true;
  }

  keyupHandler(e) {
    e.preventDefault();
    this.keys[e.code] = false;
  }

  clickBlock(_break) {
    this.ray.translation = [0, 0, 0];
    let bl = null;
    let last = null;
    let clicked = null;
    for (let i = 0; i < 10; i += 0.1) {
      this.ray.translation[2] = -i;
      this.ray.updateTransform();
      const mt = this.ray.getGlobalTransform();
      let v = vec3.create();
      mat4.getTranslation(v, mt);
      if (!bl || bl[0] != Math.floor(v[0]) || bl[1] != Math.floor(v[1]) || bl[2] != Math.floor(v[2])) {
        bl = [Math.floor(v[0]), Math.floor(v[1]), Math.floor(v[2])];
        let found = false;
        this.scene.traverse((node) => {
          if (node.translation[0] == bl[0] && node.translation[1] == bl[1] && node.translation[2] == bl[2] && node instanceof Block) {
            clicked = node;
            found = true;
            return;
          }
        });
        if (found) {
          if (last) {
            if (_break) {
              this.scene.removeNode(clicked);
              this.scene.cl.removeBlock(clicked);
            } else {
              const block = new Block(Block.originalMesh, Block.stoneTexture, { translation: [...last] });
              this.scene.addNode(block);
              this.scene.cl.insertBlock(block);
            }
          }
          return;
        }
        last = [...bl];
      }
    }
  }
}
Player.defaults = {
  velocity: [0, -1, 0],
  mouseSensitivity: 0.002,
  walkSpeed: 3,
  sprintSpeed: 5,
  jumpForce: 5,
  gravity: -9.8,
  acceleration: 20,
};
