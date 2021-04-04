import { Scene, ArcRotateCamera, Mesh, Vector3, KeyboardEventTypes, CannonJSPlugin, PointLight, SceneLoader } from 'babylonjs';
import Helpers from './helpers/helpers'
import Core from './core'
import { Character, Ground, Skybox } from './components/index';
import * as States from './states/index';
import { Light } from 'babylonjs/Lights/light';

export default class Level {
  //public
  public scene: Scene;
  public _camera: ArcRotateCamera = null;
  public _character: Mesh = null;
  public _ground: Mesh = null;
  public _skybox: Mesh = null;
  public _lights: Light[] = [];
  public gameState: States.AbstractState;

  //private
  private env: Core;

  constructor(env: Core, levelname?: string) {

    this.env = env;
    /*
        BABYLON.SceneLoader.LoadAssetContainer("assets/mesh/", "house.babylon", scene, function (container) {
            defaultHouse= container.meshes[0];     
        });
    */
    if (levelname) {
      SceneLoader.LoadAsync(env.CONFIG.meshUrl, levelname + ".babylon", this.env.engine)
        .then((scene) => {
          this.scene = scene;
          this.InitLevel();
        });
    }
    else {
      this.scene = new Scene(this.env.engine);
      this.InitLevel();
    }

    this.gameState = new States.Default(this.env);
    this.scene.registerBeforeRender(() => { this.gameState.Update() });
  }
  private InitLevel(): void {
    //activate physic
    this.scene.enablePhysics(new Vector3(0, this.env.CONFIG.GRAVITY, 0), new CannonJSPlugin());
    //meshes
    this.loadMeshes();
    //actions
    this.bindActions();
    Helpers.showAxis(7, this.scene);
  }
  /*
   * load the meshes from the file and assign the rôles
   */
  private loadMeshes() {
    //setup a rotating camera around the center of the scene
    this._camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this.scene);
    this._camera.attachControl(this.env.canvas, true);
    this.scene.activeCamera = this._camera;

    //use this to setup a camera ready to follow the character
    /*
    this._camera = new ArcFollowCamera("ArcCamera", this.env.STARTSTATE.camera[0],this.env.STARTSTATE.camera[1],this.env.STARTSTATE.camera[2],this.scene.getMeshByName("collide"), this.scene);
    this.scene.activeCamera = this._camera;
    */

    //setup a character
    this._character = Character.create(this.env, this);

    //link character and camera if follow camera
    //this._camera.target=this._character;

    //setup lights
    this._lights.push(new PointLight("light", new Vector3(5, 5, -5), this.scene));

    //setup ground
    this._ground = Ground.create(this.env, this);

    //skybox

    this._skybox = Skybox.create(this.env, this);

  }

  private bindActions() {
    //actions from keys
    this.scene.onKeyboardObservable.add((kbInfo) => {
      if (kbInfo.type == KeyboardEventTypes.KEYDOWN) {
        switch (kbInfo.event.keyCode) {
          //spaceBar
          case 32:
            this._character.translate(new Vector3(1, 0, 0), 3);
            break;
        }
      }
    });

    //actions from mouse
    this.scene.onPointerDown = (evt, pickResult) => {
      // if the click hits the ground object, we change the impact position
      if (pickResult.hit) {
        console.log(" x = " + pickResult.pickedPoint.x + " y = " + pickResult.pickedPoint.z);
      }
    }
  }
}
