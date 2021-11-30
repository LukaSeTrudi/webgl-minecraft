import {
  GUI
} from '../../lib/dat.gui.module.js';

import {
  Application
} from '../../common/engine/Application.js';

import {
  Renderer
} from './Renderer.js';
import {
  Physics
} from './Physics.js';
import {
  Camera
} from './Camera.js';
import {
  SceneLoader
} from './SceneLoader.js';
import {
  SceneBuilder
} from './SceneBuilder.js';
import {
  Player
} from './Player.js';

class App extends Application {

  start() {
    const gl = this.gl;

    this.renderer = new Renderer(gl);
    this.time = Date.now();
    this.startTime = this.time;
    this.aspect = 1;

    this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
    document.addEventListener('pointerlockchange', this.pointerlockchangeHandler);

    this.load('/game/17-game/scene.json');
  }

  async load(uri) {
    const scene = await new SceneLoader().loadScene(uri);
    const builder = new SceneBuilder(scene);
    this.scene = builder.build();
    this.physics = new Physics(this.scene);

    // Find first camera.
    this.camera = null;
    this.player = null;
    this.head = null;
    this.scene.traverse(node => {
      if (node.extra == 'camera') {
        this.camera = node;
      }
      if (node.extra == 'player') {
        this.player = node
      }
      if (node.extra == 'head') {
        this.head = node;
      }
    });
    this.player.head = this.head;
    this.player.camera = this.camera;
    this.camera.aspect = this.aspect;
    this.camera.updateProjection();
    this.renderer.prepare(this.scene);
  }

  enableCamera() {
    this.canvas.requestPointerLock();
  }

  pointerlockchangeHandler() {
    if (!this.camera) {
      return;
    }
    if (document.pointerLockElement === this.canvas) {
      this.player.enableCamera();
    } else {
      this.player.disableCamera();
    }
  }

  update() {
    const t = this.time = Date.now();
    const dt = (this.time - this.startTime) * 0.001;
    this.startTime = this.time;

    if (this.player) {
      this.player.update(dt);
    }
    if (this.physics) {
      this.physics.update(dt);
    }
  }

  render() {
    if (this.scene) {
      this.scene.traverse(node => {
        if(node.extra == 'head') {
          //console.log(node.rotation)
        }
      });
      this.renderer.render(this.scene, this.camera);
    }
  }

  resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.aspect = w / h;
    if (this.camera) {
      this.camera.aspect = this.aspect;
      this.camera.updateProjection();
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  const app = new App(canvas);
  const gui = new GUI();
  gui.add(app, 'enableCamera');
});