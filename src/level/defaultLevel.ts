import { ArcRotateCamera, MeshBuilder, HemisphericLight, Scene, SphereBuilder, Vector3 } from "babylonjs";
import { Ground } from "../components/index";
import Level from "./level";

export default class DefaultLevel extends Level {

  public createLevel = async (): Promise<Scene> => {
    const scene = new Scene(this.env.engine);
    this.scene = scene;

    //setup a rotating camera around the center of the scene
    const camera = new ArcRotateCamera("DebugCamera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this.scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this.env.canvas, true);
    camera.useFramingBehavior = true;
    this._camera = camera;


    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    const sphere = SphereBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene
    );
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    const ground = new Ground(this);// MeshBuilder.CreateGround('ground', { width: 10, height: 10, subdivisions: 1 }, this.scene)

    return scene;
  };
}