import Core from '../core'
import Level from '../level'
import { Mesh, StandardMaterial, Color3, CubeTexture, MeshBuilder, Texture } from '@babylonjs/core';

export default class Skybox {
  public static create(env: Core, level: Level): Mesh {
    //https://doc.babylonjs.com/babylon101/environment
    //mesh
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, level.scene);
    const skyboxMaterial = new StandardMaterial("skyBox", level.scene);

    //material
    skyboxMaterial.reflectionTexture = new CubeTexture("./public/img/skybox/day", level.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);

    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    //beahvior infinity
    skybox.infiniteDistance = true;

    return skybox;
  }
}