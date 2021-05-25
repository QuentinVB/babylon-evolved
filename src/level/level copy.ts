import { Scene, Camera, Vector3, Animation, Mesh, Sprite, Effect } from 'babylonjs';
import Helpers from '../helpers/helpers'
import Core from '../core'
import { ISpriteInfo, SpriteLibrary } from '../services/index';
import { AbstractState, Default } from '../states/index';
import { Light } from 'babylonjs/Lights/light';
import ICreateLevelClass from './ICreateLevelClass';
import Character from '../components/character';



export default abstract class Level implements ICreateLevelClass {
  //public
  public scene: Scene;
  public _camera: Camera = null;
  public _character: Character = null;
  public _lights: Light[] = [];
  public gameState: AbstractState;
  public _transition = false;
  public registredTransiton: () => void;
  public fadeLevel = 0;
  public readonly env: Core;

  //protected
  protected spriteLibrary: SpriteLibrary;
  protected spriteRefs: { [name: string]: Sprite } = {};

  constructor(env: Core) {
    this.env = env;

    this.gameState = new Default(this.env);
    Effect.RegisterShader("fade",
      "precision highp float;" +
      "varying vec2 vUV;" +
      "uniform sampler2D textureSampler; " +
      "uniform float fadeLevel; " +
      "void main(void){" +
      "vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" +
      "baseColor.a = 1.0;" +
      "gl_FragColor = baseColor;" +
      "}");

  }
  public abstract createLevel: () => Promise<Scene>;

  public InitLevel(): void {
    //DEBUG
    if (this.env.CONFIG.DEBUG) {
      this.scene.debugLayer.show();
      Helpers.showAxis(7, this.scene);
    }
    this.env.registerFunctionBeforeUpdate(() => { this.gameState.Update() });

    this.fadeLevel = 1.0;
    this._transition = false;
    this.env.registerFunctionBeforeUpdate(() => {
      if (this._transition && this.registredTransiton != undefined) {
        this.fadeLevel -= .05;
        if (this.fadeLevel <= 0) {
          this.registredTransiton();
          this._transition = false;
        }
      }
    });
  }
  AddSpritesFromTag(tag: string): Mesh[] {
    const meshes = this.scene.getMeshesByTags(tag);
    const spriteInfo: ISpriteInfo = this.spriteLibrary[tag];
    for (const mesh of meshes) {
      const code = Math.random().toString(36).substring(7);
      const instanceOfSprite = new Sprite(tag + "-sprite-" + code, spriteInfo.manager);
      instanceOfSprite.playAnimation(spriteInfo.animationStart, spriteInfo.animationEnd, true, spriteInfo.animationDelay);
      instanceOfSprite.size = spriteInfo.size;
      instanceOfSprite.position = mesh.position;

      this.spriteRefs[instanceOfSprite.name] = instanceOfSprite;
      mesh.name = tag + "-hitbox-" + code;
      mesh.isVisible = false;
    }
    return meshes;
  }
  removeItemAndSprite(name: string): void {
    const item = this.scene.getMeshByName(name);
    const nameArray = name.split('-');
    const spriteName = nameArray[0] + "-sprite-" + nameArray[2];
    const sprite = this.spriteRefs[spriteName];

    if (sprite) sprite.dispose();
    if (item) item.dispose();
    if (item && sprite) delete this.spriteRefs[spriteName];
    //

    //
    //item.isVisible = false;
  }
  AddFishAnimationFor(tag: string): void {
    Object.keys(this.spriteRefs).forEach((key) => {
      const sprite = this.spriteRefs[key];
      if (sprite.name.split('-')[0] == tag) {
        const positionXOffset = sprite.position.x;
        let timer = 0;
        const randomOffset = 300 + Math.round(Math.random() * 100);
        this.env.registerFunctionBeforeUpdate(() => {
          timer++;
          const value = (timer + randomOffset) / this.env.CONFIG.FISHSPEED;
          sprite.position.x = positionXOffset + Math.sin(value) * randomOffset / 100;

          if (Math.cos(value) > 0) sprite.invertU = true;
          else sprite.invertU = false;

          //console.log(sprite.position.x);

        })
        if (this.env.CONFIG.DEBUG) console.log("added animation for " + sprite.name);
      }
    })
  }



  private bindActions() {
    //actions from mouse
    this.scene.onPointerDown = (evt, pickResult) => {
      // if the click hits the ground object, we change the impact position
      if (pickResult.hit) {
        console.log(" x = " + pickResult.pickedPoint.x + " y = " + pickResult.pickedPoint.z);
      }
    }
  }
}
