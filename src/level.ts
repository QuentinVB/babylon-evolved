import { Scene, ArcRotateCamera, Mesh, Vector3, KeyboardEventTypes, CannonJSPlugin, PointLight } from 'babylonjs';
import Helpers from './helpers/helpers'
import Main from './main'
import { Character, Ground, Skybox } from './actors';

export default class Level {
  //public
  public scene: Scene;
  public _camera: ArcRotateCamera = null;
  public _character: Mesh = null;
  public _ground: Mesh = null;
  public _skybox: Mesh = null;

  //private
  private env: Main;

  constructor(levelname: string, env: Main) {

    this.env = env;

    this.scene = new Scene(this.env.engine);

    //activate physic
    this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

    //meshes
    this.loadMeshes();

    //actions
    this.bindActions();

    Helpers.showAxis(7, this.scene);

    //use this to load a level from babylon 3D file
    /*
    SceneLoader.LoadAsync("../assets/", levelname+".babylon", env.engine).then((scene)=>
    {
        
    });
    */
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
    const light = new PointLight("light", new Vector3(5, 5, -5), this.scene);

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
