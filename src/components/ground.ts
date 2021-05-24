import Level from '../level'
import { PhysicsImpostor, MeshBuilder, } from '@babylonjs/core';
import GameObject from './gameobject';

export default class Ground extends GameObject {
  //, parameters: unknown
  /**
   *
   */
  constructor(level: Level) {
    super(level);
    //mesh
    const ground = MeshBuilder.CreateGround('ground', { width: 512, height: 512, subdivisions: 32 }, this.Level.scene);
    ground.position.set(0, -1, 0);

    //physic
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, {
      mass: 0,
      restitution: 0,
      friction: 1.0
    });

    this.MainMesh = ground;
  }
}
