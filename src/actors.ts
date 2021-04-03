import Main from './main'
import Level from './level'
import { Mesh, StandardMaterial, Vector3, Color3, PhysicsImpostor, GroundMesh, CubeTexture, MeshBuilder, Texture } from 'babylonjs';

//TODO : should use the 
export class Character {
  public static create(env: Main, level: Level): Mesh {
    //mesh
    const character = MeshBuilder.CreateBox("character", { size: 0.5 }, level.scene);
    character.position = new Vector3(...env.CONFIG.player);

    //materials
    const material = new StandardMaterial("material", level.scene);
    material.diffuseColor = new Color3(0.9, 0.2, 0);
    character.material = material;

    //physic
    character.position.y += 0.5;
    character.physicsImpostor = new PhysicsImpostor(character, PhysicsImpostor.BoxImpostor, {
      mass: 1,
      restitution: 0.2,
      friction: 1.0
    });



    return character;
  }
}

export class Ground {
  public static create(env: Main, level: Level): Mesh {
    //mesh
    const ground = MeshBuilder.CreateGround('ground', { width: 512, height: 512, subdivisions: 32 }, level.scene);
    ground.position.set(0, -1, 0);

    //physic
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, {
      mass: 0,
      restitution: 0,
      friction: 1.0
    });

    return ground;
  }
}

export class Skybox {
  public static create(env: Main, level: Level): Mesh {
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