import { Engine } from 'babylonjs';
import Level from './level';

export default class Main {
  // private members
  public engine: Engine;
  public level: Level;
  public canvas: HTMLCanvasElement;

  //const
  public readonly CONFIG = {
    camera: [3 * Math.PI / 2, 0, 10],
    player: [1.3, 2, -1.6],
    MAX_VELOCITY: 1.5,
    TERMINAL_VELOCITY: 20,
    JUMP_FORCE: 4,
    SPEED: 3
  }

  // Constructor
  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
    this.engine = new Engine(this.canvas);
    this.loadLevel("level0");
  }
  /**
   * Runs the engine to render the level into the canvas
   */
  public run(): void {
    this.engine.runRenderLoop(() => {
      if (this.level != undefined && this.level.scene != undefined) this.level.scene.render();
    });
  }
  public loadLevel(levelname: string): void {
    if (this.level) this.level.scene.dispose();
    this.level = new Level(levelname, this);
  }
}