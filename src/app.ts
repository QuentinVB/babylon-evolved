import "./sass/style.scss";
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Mesh } from "babylonjs";
import Main from './main';

/*
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const canvas: any = document.getElementById("renderCanvas");
const engine: Engine = new Engine(canvas, true);

function createScene(): Scene {
    const scene: Scene = new Scene(engine);
    const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
    const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    return scene;
}

const scene: Scene = createScene();
engine.runRenderLoop(() => {
    scene.render();
});
*/
/*


*/
const main = new Main();
main.run();