import { Texture, Color3, StandardMaterial, AbstractMesh, ArcRotateCamera, CannonJSPlugin, HemisphericLight, Scene, SceneLoader, Vector3, PhysicsImpostor, Mesh, Camera, MeshBuilder, ShadowGenerator, Sprite, FollowCamera, DirectionalLight, ExecuteCodeAction, ActionManager, Sound } from "babylonjs";
import { AdvancedDynamicTexture, Control, Rectangle, Image } from "babylonjs-gui";
import { Character, Ground, SeaLevel } from "../components/index";
import { ISpriteInfo, SpriteLibrary } from "../services/spriteLib";
import Level from "./level";
import * as States from '../states/index';
import { WaterMaterial } from "babylonjs-materials";

export default class FromFileLevel extends Level {

  public _grounds: Ground[] = [];
  public _seaLevel: SeaLevel;

  public createLevel = async (): Promise<Scene> => {
    await SceneLoader.LoadAsync(this.env.CONFIG.meshUrl, this.env.levelName + ".babylon", this.env.engine)
      .then((scene) => {
        this.scene = scene;
        this.scene.clearColor = this.env.CONFIG.BG_COLOR;
        this.scene.collisionsEnabled = true;
        if (!this.env.CONFIG.DEBUG) {
          this.scene.fogColor = this.env.CONFIG.FOG_COLOR;
          this.scene.fogMode = Scene.FOGMODE_LINEAR;
          this.scene.fogStart = this.env.CONFIG.FOG_START;
          this.scene.fogEnd = this.env.CONFIG.FOG_END;
        }
      });
    //SOUND
    /*
    const underwaterAmbient = new Sound("underwaterambient", this.env.CONFIG.soundUrl + "Ambiance-ocean.mp3", this.scene, () => {
      underwaterAmbient.play();
    }, {
      volume: 0.1,
    });*/
    this.env.soundLibrary.underwaterAmbient.play();


    //PHYSIC
    this.scene.enablePhysics(new Vector3(0, this.env.CONFIG.GRAVITY, 0), new CannonJSPlugin());

    //SPRITE
    this.spriteLibrary = new SpriteLibrary(this.scene);




    //LOAD turtle
    this.ManageTurtle(this.scene.getMeshByName("Turtle"));

    //LIGHTS
    //TODO : should be removed
    const dome = new HemisphericLight("light", new Vector3(0, -1, 0), this.scene);
    dome.intensity = 0.7;
    const dirlight = new DirectionalLight("sun", new Vector3(0, -1, 0.5), this.scene);
    /*
    dirlight.autoCalcShadowZBounds = true;
    const shadowGenerator = new ShadowGenerator(1024, dirlight);
    shadowGenerator.addShadowCaster(this._character.MainMesh);
    //shadowGenerator.useExponentialShadowMap = true;
    shadowGenerator.useBlurExponentialShadowMap = true;
    //shadowGenerator.useKernelBlur = true;
    //shadowGenerator.blurKernel = 64;
    //shadowGenerator.getShadowMap().renderList.push();
    shadowGenerator.darkness = 0.3;*/

    //LOAD OBJECTS
    this.AddSpritesFromTag("Medusa");
    this.AddSpritesFromTag("PinkCoral");
    this.AddSpritesFromTag("Bag");
    this.AddSpritesFromTag("Gorgon");
    this.AddSpritesFromTag("Poisson");
    this.AddFishAnimationFor("Poisson");

    this.ManageGoodItems("Medusa");
    this.ManageBadItems("Bag");

    this.ManageRock("Rock");
    this.ManageWalls("Wall");
    this.ManageGrounds("Ground");
    this.CreateOceanRoof();


    //CAMERA
    this._camera = this.CreateCameraFromExistingOne(this.scene.getCameraByName("Camera") as Camera, this._character)
    this.scene.activeCamera = this._camera;
    //DEBUG CAMERA
    if (this.env.CONFIG.DEBUG) {
      const camera = new ArcRotateCamera("DebugCamera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this.scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(this.env.canvas, true);
      camera.useFramingBehavior = true;
    }

    //GUI
    this.CreateUI();

    //STATE
    const trigger = this.scene.getMeshByName("Trigger");
    trigger.visibility = 0;
    this.gameState = new States.Game(this.env, trigger as Mesh);



    return this.scene;
  };
  /**
   * replace camera by follow camera and copy information
   * @param originalCamera 
   * @param targetCharacter 
   * @returns 
   */
  CreateCameraFromExistingOne(originalCamera: Camera, targetCharacter: Character): FollowCamera {
    const originalCoordinates = [];
    originalCamera.position.toArray(originalCoordinates);
    const camera = new FollowCamera("MainCamera", Vector3.Zero(), this.scene);
    camera.fov = originalCamera.fov;
    camera.maxZ = 150;
    camera.radius = 7;
    camera.lowerRadiusLimit = 4;
    camera.upperRadiusLimit = 8;
    camera.heightOffset = 0;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.5;
    camera.maxCameraSpeed = 20;
    camera.inertia = 0.5;
    //camera.ellipsoid = new Vector3(1, 1, 1);
    camera.lockedTarget = targetCharacter.turtleCameraTarget; //version 2.5 onwards
    return camera;
  }
  CreateUI(): void {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const size = 0.5;


    const hp = 771 * size;
    const x = 60 * size;
    const y = 155 * size;
    const mainContainer = new Rectangle();
    mainContainer.height = "20px";
    mainContainer.width = hp + "px";
    mainContainer.thickness = 0;
    mainContainer.background = "";
    mainContainer.top = x + "px";
    //mainContainer.left = y + "px";
    mainContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    mainContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(mainContainer);

    const containerbg = new Rectangle();
    containerbg.thickness = 0;
    containerbg.background = "lime";
    containerbg.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    mainContainer.addControl(containerbg);


    const bgContainer = new Rectangle("bgContainer");
    bgContainer.width = size * 996 + "px";
    bgContainer.height = size * 145 + "px";
    bgContainer.thickness = 0;
    bgContainer.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_TOP;
    bgContainer.horizontalAlignment = Rectangle.HORIZONTAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(bgContainer);

    const imageBg = new Image("startbg", "./public/img/Stamina-bar.png");
    imageBg.stretch = Image.STRETCH_EXTEND;
    bgContainer.addControl(imageBg);

    this.scene.onBeforeRenderObservable.add(() => {
      containerbg.width = this.env.stamina / this.env.CONFIG.MAXSTAMINA;
    });
  }

  ManageTurtle(mesh: AbstractMesh): void {
    this._character = new Character(this, mesh as Mesh);
  }
  ManageGrounds(tagQuery: string): void {
    const allGround = this.scene.getMeshesByTags(tagQuery);
    allGround.forEach(item => {
      this._grounds.push(new Ground(this, item));
    });
  }

  ManageGoodItems(tagQuery: string): void {
    const goodItems = this.scene.getMeshesByTags(tagQuery);
    goodItems.forEach(item => {
      item.checkCollisions = true;
      if (this.env.CONFIG.DEBUG) item.isVisible = true;
      this._character.MainMesh.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnIntersectionEnterTrigger,
            parameter: item
          },
          () => {
            this.env.stamina += this.env.CONFIG.MEDUSASTAMINAVALUE;
            console.info("collided with medusa !");
            //this.env.soundLibrary.crounch.stop();
            this.env.soundLibrary.crounch.play();
            this.removeItemAndSprite(item.name);
          }
        )
      );
    });
  }
  ManageBadItems(tagQuery: string): void {
    const badItems = this.scene.getMeshesByTags(tagQuery);
    badItems.forEach(item => {
      item.checkCollisions = true;
      if (this.env.CONFIG.DEBUG) item.isVisible = true;
      this._character.MainMesh.actionManager.registerAction(
        new ExecuteCodeAction(
          {
            trigger: ActionManager.OnIntersectionEnterTrigger,
            parameter: item
          },
          () => {
            this.env.stamina -= this.env.CONFIG.BAGSTAMINACOST;
            console.info("collided with bag !");
            this.env.soundLibrary.bonk.play();
            this.removeItemAndSprite(item.name);
          }
        )
      );
    });
  }


  ManageRock(tagQuery: string): void {
    const rock = this.scene.getMeshesByTags(tagQuery);
    rock.forEach(item => {
      item.checkCollisions = true;
      item.physicsImpostor = new PhysicsImpostor(item, PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 1.0
      });
    });
  }
  ManageWalls(tagQuery: string): void {
    const walls = this.scene.getMeshesByTags(tagQuery);
    walls.forEach(item => {
      const mesh = MeshBuilder.CreateBox("wallCollider", { width: 11, height: 18, depth: 9 }, this.scene);
      mesh.position = new Vector3(item.position.x, item.position.y + 2, item.position.z);
      mesh.rotation = item.rotation;
      mesh.checkCollisions = true;
      mesh.visibility = 0;

      mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, {
        mass: 0,
        friction: 1.0
      });
    });
  }

  CreateOceanRoof(): void {
    this._seaLevel = new SeaLevel(this);
  }



  //TODO : should refactor sprite creation...


  /*
    public preTasks? = (): Promise<unknown>[] => {
      return undefined;
    };
    */
  /*
       BABYLON.SceneLoader.LoadAssetContainer("assets/mesh/", "house.babylon", scene, function (container) {
           defaultHouse= container.meshes[0];     
       });
   */
  /*
   if (levelname) {
     
   }
   else {
     this.scene = new Scene(this.env.engine);
 
     //this.InitLevel();
   }
*/
}
    /*
for (const mesh of this.scene.meshes) {
//console.log(mesh.name);
switch (mesh.name) {
case "Turtle": this.ManageTurtle(mesh); break;
case "": break;
default:
break;
}
}*/