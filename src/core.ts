import { Engine, Scene } from '@babylonjs/core';
import Level from './level';
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";


/**
 * The main game container, it will handle high level logic and rendering of the game
 */
export default class Core {
  // private members
  public engine: Engine;
  /**
   * The actual level loaded in the Core
   */
  public level: Level;
  public canvas: HTMLCanvasElement;
  public get scene(): Scene {
    return this.level.scene;
  }

  /**
   * game and physic constants
   */
  public readonly CONFIG = {
    camera: [3 * Math.PI / 2, 0, 10],
    player: [1.3, 2, -1.6],
    MAX_VELOCITY: 1.5,
    TERMINAL_VELOCITY: 20,
    JUMP_FORCE: 4,
    SPEED: 3,
    GRAVITY: -9.81,
    meshUrl: "./public/mesh/"
  }

  // Constructor
  constructor() {
    //Engine.isSupported()
    this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    this.engine = new Engine(this.canvas);
    //asset manager : https://doc.babylonjs.com/divingDeeper/importers/assetManager
    this.loadLevel();//"level0"
  }
  /**
   * Runs the engine to render the level into the canvas
   */
  public run(): void {
    /*        var options = new BABYLON.SceneOptimizerOptions();
        options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1));

        // Optimizer
        var optimizer = new BABYLON.SceneOptimizer(this.scene, options);
        optimizer.start();*/
    this.engine.runRenderLoop(() => {
      if (this.level != undefined && this.level.scene != undefined) this.scene.render();
    });
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }
  public loadLevel(levelname?: string): void {
    if (this.level) this.level.scene.dispose();
    this.level = new Level(this, levelname);
    this.level.InitLevel();
  }
}