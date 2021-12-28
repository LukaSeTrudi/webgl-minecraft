
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
import { Chunk } from "./chunks/Chunk.js";

class App extends Application {
  async start() {

    window.startGame = () => { this.enableCamera() };

    const gl = this.gl;

    this.renderer = new Renderer(gl);
    this.time = Date.now();
    this.startTime = this.time;
    this.aspect = 1;

    this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
    document.addEventListener("pointerlockchange", this.pointerlockchangeHandler);
    
    document.addEventListener('keydown', (e) => {
      if(e.code == "KeyE" && this.player && this.player.inventory.openedInventory) {
        this.player.inventory.toggleInventory();
      }
    })

    this.blocks = await new BlockLoader().loadBlocks("/game/17-game/structure/blocks.json");
    this.items = await new ItemLoader().loadItems("/game/17-game/structure/items.json", this.blocks);
    this.load("/game/17-game/scene.json");
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
    this.ray = null;
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
      if(node.extra == "raycast") {
        this.ray = node;
      }
    });
    this.scene.addNode(this.blocks[4]);
    this.camera.head = this.head;
    this.camera.switchPerson();
    this.scene.cl = this.chunkLoader;

    for(let i = -Chunk.SIZE*2; i < Chunk.SIZE*2; i+= Chunk.SIZE) {
      for(let j = -Chunk.SIZE*2; j < Chunk.SIZE*2; j+= Chunk.SIZE) {
        let ch = new Chunk(i, j);
        this.scene.cl.chunks.push(ch);
        ch.blocks.forEach(block => this.scene.addNode(block))
      }
    }
    this.scene.cl.chunks.forEach(chunk => chunk.blocks.forEach(block => this.scene.cl.optimizeBlock(block)));
    
    this.player.head = this.head;
    this.player.scene = this.scene;
    this.player.camera = this.camera;
    this.player.ray = this.ray;
    this.camera.aspect = this.aspect;
    this.camera.updateProjection();
    this.renderer.prepare(this.scene);
  }
  
  enableCamera() {
    this.canvas.requestPointerLock();
  }
  
  pointerlockchangeHandler(e) {
    if (!this.camera) {
      return;
    }
    if (document.pointerLockElement === this.canvas) {
      document.querySelector('.start').classList.add('hidden');
      this.player.enableCamera();
    } else {  
      this.player.disableCamera();
      if(!this.player.inventory.openedInventory) {
        document.querySelector('.start').classList.remove('hidden');
      }
    }
  }
  
  update() {
    const t = (this.time = Date.now());
    const dt = (this.time - this.startTime) * 0.001;
    this.startTime = this.time;
    if(dt > 1) return;
    if (this.player) {
      this.chunkLoader.changeActiveChunk(this.scene, this.player.translation[0],this.player.translation[2]);
      this.player.update(dt);
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
