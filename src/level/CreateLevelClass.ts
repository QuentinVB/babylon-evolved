import { Scene } from '@babylonjs/core';

//TODO : Should be in a different file
export default interface CreateLevelClass {
  /**
   * Call this method to setup the scene of the current level
   */
  createLevel: () => Promise<Scene>;
  /**
   * Promises that should be resolved before creating the level
   */
  preTasks?: Promise<unknown>[];
}



