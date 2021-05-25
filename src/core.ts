import { Color3, Color4, Engine, KeyboardEventTypes, Scene, SceneOptimizer, SceneOptimizerOptions, Vector3 } from '@babylonjs/core';
import { Level } from './level/index';
import CreateLevelClass from './level/CreateLevelClass'
import { KEYS } from './common';
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
//todo : make import condtionnal

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
  public levelName: string;
  public canvas: HTMLCanvasElement;
  private pauseElement: HTMLDivElement;
  public get scene(): Scene {
    return this.level.scene;
  }
  public soundLibrary: SoundLibrary = null;

  //score
  public stamina: number;
  public isPaused = false;
  private registredFunction = [];

  private readonly MAX_VELOCITY = 1.5;
  /**
   * game and physic constants
   */
  public readonly CONFIG = {
    camera: [3 * Math.PI / 2, 0, 10],
    player: [1.3, 2, -1.6],
    MIN_VELOCITY_VECTOR: new Vector3(-this.MAX_VELOCITY, -this.MAX_VELOCITY, -this.MAX_VELOCITY),
    MAX_VELOCITY_VECTOR: new Vector3(this.MAX_VELOCITY, this.MAX_VELOCITY, this.MAX_VELOCITY),
    TERMINAL_VELOCITY: 20,
    JUMP_FORCE: 4,
    SPEED: 3,
    GRAVITY: 0,//-9.81
    BG_COLOR: new Color4(40 / 255, 105 / 255, 144 / 255, 1),//new Color4(52 / 255, 99 / 255, 185 / 255, 1)
    FOG_COLOR: new Color3(40 / 255, 105 / 255, 144 / 255),//(65 / 255, 188 / 255, 238 / 255)
    FOG_START: 5,
    FOG_END: 40,
    meshUrl: "./public/mesh/",
    soundUrl: "./public/sounds/",
    MEDUSASTAMINAVALUE: 10,
    BAGSTAMINACOST: 20,
    BASESTAMINA: 50,
    MAXSTAMINA: 100,
    FISHSPEED: 40,//the smaller the faster
    //add other ?
    DEBUG: false
  }

  private readonly SCENARIO = [
    "menu",
    "opening",
    "level1",
    "victory",
    "death"
  ];
  private _scenarioStep = 0;
  public byPassScenario = false;
  private loading = false;

  // Constructor
  constructor(startlevelName?: string) {
    if (startlevelName) {
      this.byPassScenario = true;
      this.levelName = startlevelName;
    }
    else {
      this._scenarioStep = 0;
    }
    this.registredFunction = [];
    this.stamina = this.CONFIG.BASESTAMINA; //TODO : this for instance is a data stored in local storage, via a service and a model
  }
  /**
   * Runs the engine to render the level into the canvas
   */
  public run(): void {
    this.loading = true;
    const createLevelModule = this.loadLevel();
    this.Init(createLevelModule).then(() => {
      this.loading = false;
      // scene started rendering, everything is initialized
    });
  }

  public async Init(createLevelModule: CreateLevelClass): Promise<void> {
    //load pre task in the module
    await Promise.all(createLevelModule.preTasks || []);
    this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true);
    //engine options here !
    this.pauseElement = this.CreatePauseElement()

    if (this.soundLibrary === null) {
      this.soundLibrary = new SoundLibrary(this.engine, this.CONFIG.soundUrl);
      this.soundLibrary.loadSounds();
      //this.soundLibrary.aquariumMusic.play();
    }

    await createLevelModule.createLevel().then(() => {
      //TODO :music should be loaded from another scene
      this.level.InitLevel();

      if (!this.CONFIG.DEBUG) {
        const options = new SceneOptimizerOptions();
        //options.a
        //options.addOptimization(new HardwareScalingOptimization(0, 1));

        // Optimizer
        const optimizer = new SceneOptimizer(this.scene, options);
        optimizer.start();
      }
      //bind controls
      this.scene.onKeyboardObservable.add((kbInfo) => {
        if (kbInfo.type == KeyboardEventTypes.KEYDOWN) {
          switch (kbInfo.event.keyCode) {
            case KEYS.ESC://UP
              this.TogglePauseMenu();
              console.log("pressed escape");
              break;
          }
        }
      });

    });
    const registred = this.registredFunction;
    /*
    this.canvas.onclick = () => {
      console.log("clicked on canvas");
      this.soundLibrary.loadSounds().then(() => {
        console.log("sound loaded !");
        Engine.audioEngine.unlock();
        this.soundLibrary.underwaterAmbient.play();
      });
  
    };
  */
    this.scene.registerBeforeRender(() => {
      for (const callback of registred) {
        callback();
      }
    });
    this.engine.runRenderLoop(() => {
      if (!this.loading && !this.isPaused) this.scene.render();
    });

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }


  public loadLevel(): ICreateLevelClass {


    if (this.byPassScenario) {
      if (this.levelName == "scene_start_menu") {
        this.level = new MenuLevel(this);
      }
      else if (this.levelName == "default") {
        this.level = new DefaultLevel(this);
      }
      else if (this.levelName.startsWith("cutscene")) {

        this.level = new CutsceneLevel(this, this.levelName.split("-")[1]);
      }
      else {
        this.level = new FromFileLevel(this);
      }
    }
    else {
      if (this.level) this.level.scene.dispose();

      const scenario = this.SCENARIO[this._scenarioStep];
      console.log(`load scenario, scene number ${this._scenarioStep} : "${scenario}"`);
      if (scenario === "menu") this.level = new MenuLevel(this);
      if (scenario === "opening") this.level = new CutsceneLevel(this, "opening");
      if (scenario === "victory") this.level = new CutsceneLevel(this, "victory");
      if (scenario === "death") this.level = new CutsceneLevel(this, "death");
      if (scenario.startsWith("level")) {
        this.levelName = "scene_" + scenario;
        this.level = new FromFileLevel(this);
      }
    }

    return this.level;
  }
  public ChangeLevel(levelName?: string): void {
    this.levelName = levelName;
    this.run();
  }
  public setScenarioStep(step: number): void {
    //TODO : add guards !
    this._scenarioStep = step;
    this.run();
  }
  public getScenarioStep(): number {
    return this._scenarioStep;
  }
  //TODO callback could request time ?
  //TODO change to beforeUpdateObservable !
  public registerFunctionBeforeUpdate(callback: () => void): void {
    this.registredFunction.push(callback);
  }
  private TogglePauseMenu() {
    if (this.level instanceof FromFileLevel) {
      this.isPaused = !this.isPaused;
      this.pauseElement.style.visibility = (this.isPaused == true) ? "visible" : "hidden";
    }
  }
  CreatePauseElement(): HTMLDivElement {
    const element = document.createElement("div");
    element.innerHTML = "Game Paused<p>Press ESC to resume</p>";
    element.classList.add("pause");
    document.body.appendChild(element);
    return element;
  }
  //goto()per state
}