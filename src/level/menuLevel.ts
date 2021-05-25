import { FreeCamera, PostProcess, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle, Image, TextBlock, Control, Button } from "babylonjs-gui";
import Level from "./level";

export default class MenuLevel extends Level {

  public createLevel = async (): Promise<Scene> => {
    this.env.engine.displayLoadingUI();

    const scene = new Scene(this.env.engine);
    this.scene = scene;
    this.scene.clearColor = this.env.CONFIG.BG_COLOR;

    //setup a rotating camera around the center of the scene
    const camera = new FreeCamera("DebugCamera", Vector3.Backward(), this.scene);
    camera.setTarget(Vector3.Zero());
    //camera.attachControl(this.env.canvas, true);
    this._camera = camera;

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

    //title image
    const imageRect = new Rectangle("titleContainer");
    imageRect.width = 0.8;
    imageRect.height = 0.5;
    imageRect.thickness = 0;
    imageRect.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_TOP;
    guiMenu.addControl(imageRect);

    const startbg = new Image("startbg", "./public/img/Titre.png");
    startbg.stretch = Image.STRETCH_UNIFORM;
    imageRect.addControl(startbg);

    const visuelContainer = new Rectangle("visuelContainer");
    visuelContainer.width = 0.8;
    visuelContainer.height = 0.5;
    visuelContainer.thickness = 0;
    visuelContainer.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_CENTER;
    guiMenu.addControl(visuelContainer);

    const visuel = new Image("startbg", "./public/img/Visuel-Accueil.png");
    visuel.stretch = Image.STRETCH_UNIFORM;
    visuelContainer.addControl(visuel);

    const title = new TextBlock("info", "2021 - Pÿrenia et kiu");
    title.resizeToFit = true;
    title.fontFamily = "Arial";
    title.fontSize = "10px";
    title.color = "white";
    title.top = "0px";
    title.width = 0.8;
    title.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiMenu.addControl(title);




    //button
    const startBtn = Button.CreateSimpleButton("start", "PLAY");
    startBtn.fontFamily = "Arial";
    startBtn.width = 0.2
    startBtn.height = "40px";
    startBtn.color = "white";
    startBtn.thickness = 0;
    startBtn.top = "15px";
    startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    startBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    visuelContainer.addControl(startBtn);

    startBtn.onPointerDownObservable.add(() => {
      //fade screen
      //TODO : should be in another method ?
      const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
      postProcess.onApply = (effect) => {
        effect.setFloat("fadeLevel", this.fadeLevel);
      };
      this._transition = true;



      //scene.detachControl(); //observables disabled

      console.log("launch the cutscene !");
    });
    this.registredTransiton = () => {

      console.log("fade done");
      this.env.setScenarioStep(1);
    }

    //--SCENE FINISHED LOADING--
    //await scene.whenReadyAsync();
    this.env.engine.hideLoadingUI(); //when the scene is ready, hide loading
    //lastly set the current state to the start state and set the scene to the start scene
    //this._scene.dispose();
    //this._scene = scene;
    //this._state = State.START;
    return scene;
  };


  /*
    public preTasks? = (): Promise<unknown>[] => {
      return undefined;
    };
    */
}
