import Core from '../core'
import Level from '../level'
import { Mesh, PhysicsImpostor, MeshBuilder, } from 'babylonjs';

export default class Ground {
  public static create(env: Core, level: Level): Mesh {
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
