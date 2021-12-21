import { GUI } from "../../lib/dat.gui.module.js";

import { Application } from "../../common/engine/Application.js";

import { Renderer } from "./Renderer.js";
import { Physics } from "./Physics.js";
import { Camera } from "./Camera.js";
import { SceneLoader } from "./loaders/SceneLoader.js";
import { SceneBuilder } from "./SceneBuilder.js";
import { BlockLoader } from './loaders/BlockLoader.js';
import { ItemLoader } from "./loaders/ItemLoader.js";
import { Player } from "./Player.js";
import { Block } from "./world/Block.js";

class App extends Application {
  async start() {
    const gl = this.gl;

    this.renderer = new Renderer(gl);
    this.time = Date.now();
    this.startTime = this.time;
    this.aspect = 1;

    this.guiInfo = {
      coordinates: {x:0,y:0,z:0},
    };
    this.loadGUI();
    this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
    document.addEventListener("pointerlockchange", this.pointerlockchangeHandler);
    
    this.blocks = await new BlockLoader().loadBlocks("/game/17-game/structure/blocks.json");
    this.items = await new ItemLoader().loadItems("/game/17-game/structure/items.json", this.blocks);
    this.load("/game/17-game/scene.json");
  }

  loadGUI() {
    const gui = new GUI();
    gui.add(this, "enableCamera");
    this.guiCoords = {};
    this.guiCoords.x = gui.add(this.guiInfo.coordinates, "x").listen();
    this.guiCoords.y = gui.add(this.guiInfo.coordinates, "y").listen();
    this.guiCoords.z = gui.add(this.guiInfo.coordinates, "z").listen();
  }

  updateGUI() {
    if(this.player) {
      // this.guiCoords.x.setValue(this.player.translation[0]);
      // this.guiCoords.y.setValue(this.player.translation[1]);
      // this.guiCoords.z.setValue(this.player.translation[2])
    }
  }

  async load(uri) {
    const scene = await new SceneLoader().loadScene(uri);
    const builder = new SceneBuilder(scene);
    this.scene = builder.build();
    this.chunkLoader = builder.proceduralBuild(this.blocks);
    this.chunkLoader.chunks.forEach(chunk => chunk.blocks.forEach(block => this.scene.addNode(block)));
    this.physics = new Physics(this.scene);
    this.camera = null;
    this.player = null;
    this.head = null;
    // Find first camera.
    this.scene.traverse((node) => {
      if (node.extra == "camera") {
        this.camera = node;
      }
      if (node.extra == "player") {
        this.player = node;
      }
      if (node.extra == "head") {
        this.head = node;
      }
    });
    this.scene.addNode(this.blocks[4]);
    this.camera.head = this.head;
    this.camera.switchPerson();
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
    const t = (this.time = Date.now());
    const dt = (this.time - this.startTime) * 0.001;
    this.startTime = this.time;
    
    if (this.player) {
      this.player.update(dt);
      this.chunkLoader.changeActiveChunk(this.scene, this.player.translation[0],this.player.translation[2]);
      this.updateGUI()
    }
    if (this.physics) {
      this.physics.update(dt);
    }
  }
  
  render() {
    if (this.scene) {
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

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("canvas");
  const app = new App(canvas);
});
