import { Vector3, Color3, Scene, MeshBuilder } from '@babylonjs/core';

export default class Helpers {
  /**
   * Add XYZ gizmo axis into the scene
   * @param size the size of the axis
   * @param scene the scene were to import axis 
   */
  public static showAxis(size: number, scene: Scene): void {
    const axisX = MeshBuilder.CreateLines("axisX", {
      points: [Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
      new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)]
    }, scene);
    axisX.color = new Color3(1, 0, 0);
    const axisY = MeshBuilder.CreateLines("axisY", {
      points: [
        Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
      ]
    }, scene);
    axisY.color = new Color3(0, 1, 0);
    const axisZ = MeshBuilder.CreateLines("axisZ", {
      points: [Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
      new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)]
    }, scene);
    axisZ.color = new Color3(0, 0, 1);
  }
}
