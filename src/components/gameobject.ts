import { Mesh, Scene } from '@babylonjs/core';
import Core from '../core'
import Level from '../level'

/**
 * base Abstract class for all game objects within the game, it binds the main mesh, the core, the current level and the data model.
 */
export default abstract class GameObject {
  protected Level: Level;
  //, parameters: unknown
  constructor(level: Level) {
    this.Level = level;
  }
  protected MainMesh: Mesh;
  protected get Env(): Core { return this.Level.env; }
  protected get Scene(): Scene { return this.Level.scene; }
  //public abstract Create(env: Core): GameObject;
}