import Core from '../core'
import Level from '../level'
import { Mesh, StandardMaterial, Vector3, Color3, PhysicsImpostor, MeshBuilder } from 'babylonjs';

//TODO : should use the 
export default class Character {
  public static create(env: Core, level: Level): Mesh {
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

