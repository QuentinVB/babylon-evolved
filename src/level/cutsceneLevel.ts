import { KeyboardEventTypes, Camera, Color3, FreeCamera, Mesh, MeshBuilder, PointerEventTypes, PostProcess, Scene, StandardMaterial, Vector3, VideoTexture } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle, Image, StackPanel, Control, Button, TextBlock } from "babylonjs-gui";
import { KEYS } from '../common';
import Core from "../core";
import Level from "./level";

export default class CutsceneLevel extends Level {

  private _cutsceneName: string;
  /**
   *
   */
  constructor(env: Core, cutsceneName: string) {
    super(env);
    this._cutsceneName = cutsceneName;
  }

  public createLevel = async (): Promise<Scene> => {
    this.env.engine.displayLoadingUI();

    const scene = new Scene(this.env.engine);
    this.scene = scene;
    this.scene.clearColor = this.env.CONFIG.BG_COLOR;

    //setup a rotating camera around the center of the scene
    const camera = new FreeCamera("ViewCamera", Vector3.Backward(), this.scene);
    camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    camera.orthoTop = 5; //5 units to the top
    camera.orthoBottom = -5; //5 units to the bottom
    camera.orthoLeft = -5;  //5 units to the left
    camera.orthoRight = 5; //5 units to the right
    camera.setTarget(Vector3.Zero());
    //camera.attachControl(this.env.canvas, true);
    this._camera = camera;

    const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, this._camera);
    postProcess.onApply = (effect) => {
      effect.setFloat("fadeLevel", this.fadeLevel);
    };

    switch (this._cutsceneName) {
      case "opening": this._openingCutscene(); break;
      case "victory": this._victoryCutscene(); break;
      case "death": this._deathCutscene(); break;
      default: throw "WTF is this scene ?";
    }

    this.env.engine.hideLoadingUI(); //when the scene is ready, hide loading

    return scene;
  };
  private _openingCutscene(): void {
    //--GUI--
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    //background
    const bgContainer = new Rectangle("bgContainer");
    bgContainer.width = 1;
    bgContainer.height = 1;
    bgContainer.thickness = 1;
    bgContainer.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_CENTER;
    bgContainer.horizontalAlignment = Rectangle.HORIZONTAL_ALIGNMENT_CENTER;
    guiMenu.addControl(bgContainer);

    const imageBg = new Image("startbg", "./public/img/Titre-bg.jpg");
    imageBg.stretch = Image.STRETCH_EXTEND;
    bgContainer.addControl(imageBg);


    //comic image
    const imageRect = new Rectangle("banddessinée");
    imageRect.width = 0.8;
    imageRect.thickness = 0;
    guiMenu.addControl(imageRect);

    //TODO : animage from slideshow !!!
    //const imgBD = new Image("bd_image", "./public/img/BD_Intro.png");
    const cellCount = 6;
    const imgBD = new Image("bd_image", "./public/img/Sprite-BD-1x6-min.png");
    imgBD.stretch = Image.STRETCH_UNIFORM;
    imgBD.cellId = 0;
    imgBD.cellHeight = 540;
    imgBD.cellWidth = 5760 / cellCount;
    imgBD.sourceHeight = 540;
    imgBD.sourceWidth = 540;
    imageRect.addControl(imgBD);
    /*
        const comicTimer = setInterval(() => {
          if (imgBD.cellId < cellCount - 1) {
            imgBD.cellId++;
          } else {
            imgBD.cellId = 0;
          }
        }, 2500);*/

    const slideShowControllerRect = new StackPanel("comicControlRect");
    slideShowControllerRect.width = "90px";
    slideShowControllerRect.height = "40px";
    slideShowControllerRect.isVertical = false;
    slideShowControllerRect.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_BOTTOM;
    slideShowControllerRect.horizontalAlignment = Rectangle.HORIZONTAL_ALIGNMENT_CENTER;
    imageRect.addControl(slideShowControllerRect);

    const previousBtn = Button.CreateImageOnlyButton("previous", "./public/img/arrowBtn.png");
    previousBtn.image.stretch = Image.STRETCH_UNIFORM;
    previousBtn.image.rotation = -Math.PI / 2;
    previousBtn.width = "40px";
    previousBtn.height = "40px";
    previousBtn.thickness = 0;
    slideShowControllerRect.addControl(previousBtn);
    previousBtn.onPointerDownObservable.add(() => {
      ComicBackward();

    });

    const nextBtn = Button.CreateImageOnlyButton("next", "./public/img/arrowBtn.png");
    nextBtn.image.stretch = Image.STRETCH_UNIFORM;
    nextBtn.image.rotation = Math.PI / 2;
    nextBtn.width = "40px";
    nextBtn.height = "40px";
    nextBtn.thickness = 0;
    slideShowControllerRect.addControl(nextBtn);
    nextBtn.onPointerDownObservable.add(() => {
      ComicForward();
    });

    this.scene.onKeyboardObservable.add((kbInfo) => {
      // console.log("key pressed");
      if (kbInfo.type == KeyboardEventTypes.KEYDOWN) {
        switch (kbInfo.event.keyCode) {
          case KEYS.LEFT: ComicBackward(); break;
          case KEYS.RIGHT: ComicForward(); break;
        }
      }
    });

    function ComicForward() {
      imgBD.cellId = (imgBD.cellId < cellCount - 1) ? imgBD.cellId + 1 : 0;
    }
    function ComicBackward() {
      imgBD.cellId = (imgBD.cellId > 0) ? imgBD.cellId - 1 : cellCount - 1;
    }


    const startBtn = Button.CreateSimpleButton("Skip", "SKIP");
    startBtn.fontFamily = "Viga";
    startBtn.width = 0.2
    startBtn.height = "40px";
    startBtn.color = "white";
    startBtn.thickness = 1;
    startBtn.cornerRadius = 5;
    startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    startBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    imageRect.addControl(startBtn);

    startBtn.onPointerDownObservable.add(() => {
      //fade screen
      this._transition = true;
      //clearInterval(comicTimer);
      console.log("launch the game !")
    });

    this.registredTransiton = () => {
      console.log("fade done");
      this.env.setScenarioStep(2);
    }

  }
  private _victoryCutscene(): void {
    const size = 1;
    const planeOpts = {
      height: 4.80 * size,
      width: 3.52 * size,
      sideOrientation: Mesh.FRONTSIDE
    };
    /*  height: 5.4762 * size,
          width: 7.3967 * size,*/
    const ANote0Video = MeshBuilder.CreatePlane("plane", planeOpts, this.scene);
    const vidPos = new Vector3(0, 0, 0.1);
    ANote0Video.position = vidPos;
    const ANote0VideoMat = new StandardMaterial("m", this.scene);
    const ANote0VideoVidTex = new VideoTexture("vidtex", "./public/img/Illustration_sans_titre.mp4", this.scene);
    ANote0VideoVidTex.video.loop = false;
    ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
    ANote0VideoMat.roughness = 1;
    ANote0VideoMat.emissiveColor = Color3.White();
    ANote0Video.material = ANote0VideoMat;

    this.scene.onPointerObservable.add(function (evt) {
      if (evt.pickInfo.pickedMesh === ANote0Video) {
        //console.log("picked");
        if (ANote0VideoVidTex.video.paused)
          ANote0VideoVidTex.video.play();
        else
          ANote0VideoVidTex.video.pause();
        console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing");
      }
    }, PointerEventTypes.POINTERPICK);


    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    const bgContainer = new Rectangle("bgContainer");
    bgContainer.width = 1;
    bgContainer.height = 1;
    bgContainer.thickness = 1;
    bgContainer.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_CENTER;
    bgContainer.horizontalAlignment = Rectangle.VERTICAL_ALIGNMENT_BOTTOM;
    guiMenu.addControl(bgContainer);

    const imageRect = new Rectangle("banddessinée_perdu");
    imageRect.width = 0.8;
    bgContainer.height = 1;
    bgContainer.thickness = 0;
    bgContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiMenu.addControl(imageRect);

    const title = new TextBlock("info", "JustKeepSwimming\nTHANKS FOR PLAYING !\nESIEA-GameJam-2021\nPÿrenia et kiu");
    title.fontFamily = "Arial";
    title.fontSize = "20px";
    title.color = "white";
    title.top = "-20px";
    title.resizeToFit = true;
    title.width = 0.8;
    bgContainer.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_CENTER;
    title.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    imageRect.addControl(title);


  }
  private _deathCutscene(): void {
    //--GUI--
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    //background image
    const imageRect = new Rectangle("banddessinée_perdu");
    imageRect.width = 0.8;
    imageRect.thickness = 0;
    guiMenu.addControl(imageRect);

    const startbg = new Image("startbg", "./public/img/Écran_Lose.jpg");
    startbg.stretch = Image.STRETCH_UNIFORM;
    imageRect.addControl(startbg);

    const startBtn = Button.CreateSimpleButton("Skip", "RETRY");
    startBtn.fontFamily = "Viga";
    startBtn.width = 0.2
    startBtn.height = "40px";
    startBtn.color = "white";
    startBtn.thickness = 0;
    startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    startBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    imageRect.addControl(startBtn);

    startBtn.onPointerDownObservable.add(() => {
      //fade screen
      this._transition = true;
      console.log("restart the game !")
    });
    this.registredTransiton = () => {
      console.log("fade done");
      this.env.setScenarioStep(0);
    }
  }
}
