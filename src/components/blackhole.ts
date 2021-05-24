import Level from '../level'
import GameObject from './gameobject';
import { Mesh, StandardMaterial, Texture, Vector3, Color3, SpriteManager, Sprite, MeshBuilder, PointLight, Animation } from '@babylonjs/core';

//TODO : should use the 
export default class Blackhole extends GameObject {
  private flare: Sprite;
  private disk: Mesh;
  /**
   *
   */
  constructor(level: Level) {
    super(level);
    const horizonRadius = 1;//TODO : should be in parameters

    //blackhole mesh
    const blackhole = MeshBuilder.CreateSphere("blackhole_horizon", { diameter: horizonRadius * 2 }, this.Scene);
    blackhole.position = new Vector3(0, 0, 0);//TODO : should be in parameters

    //materials
    const material = new StandardMaterial("material", this.Scene);
    material.diffuseColor = Color3.Black();
    material.specularColor = Color3.Black();
    blackhole.material = material;

    //blackhole flare
    const spriteManagerFlare = new SpriteManager("blackholeFlare", "./public/img/blackhole_line.png", 1, 128, this.Scene);
    this.flare = new Sprite("starFlare", spriteManagerFlare);
    this.flare.size = 4;
    this.flare.position = blackhole.position;
    //TODO sprite alpha

    //blackhole disk
    const diskSize = 14.5;//TODO : should be in parameters
    this.disk = MeshBuilder.CreatePlane("blackholeDisk", { width: diskSize, height: diskSize }, this.Scene);
    this.disk.position = blackhole.position;
    this.disk.rotation = new Vector3(Math.PI / 2, 0, 0);
    //disk.visibility = 0.8;


    const diskMaterial = new StandardMaterial("diskMaterial", this.Scene);
    diskMaterial.backFaceCulling = false;
    /*
    diskMaterial.emissiveTexture = new Texture("./public/img/blackhole.png", level.scene);
    diskMaterial.emissiveTexture.hasAlpha = true;*/
    const diskTexture = new Texture("./public/img/blackhole.png", this.Scene);
    diskTexture.hasAlpha = true;
    diskMaterial.diffuseTexture = diskTexture;
    diskMaterial.opacityTexture = diskTexture;
    diskMaterial.emissiveTexture = diskTexture;
    diskMaterial.specularColor = Color3.Black();
    this.disk.material = diskMaterial;
    diskMaterial.freeze();

    const frameRate = 20;
    const yRotate = new Animation("yRotate", "rotation.y", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const keyFrames = [{
      frame: 0,
      value: 0,
    }, {
      frame: frameRate,
      value: Math.PI,
    }, {
      frame: 2 * frameRate,
      value: 2 * Math.PI,
    }];
    yRotate.setKeys(keyFrames);
    this.disk.animations.push(yRotate);
    this.Scene.beginAnimation(this.disk, 0, 2 * frameRate, true, 0.7, () => { console.log("the blackhole spin !") });

    //blackhole light
    this.Level._lights.push(new PointLight("blackholelight", new Vector3(0, 0, 0), this.Scene));

    this.MainMesh = blackhole;
  }
}

/*
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    const diskSize = 4;//TODO : should be in parameters
    const disk = BABYLON.MeshBuilder.CreatePlane("blackholeDisk", { width: diskSize, height: diskSize }, scene);
    disk.position = sphere.position;
    disk.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    const frameRate = 20;
    var yRot = new BABYLON.Animation(
    "yRot",
    "rotation.y",
    frameRate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    var keyFramesR = [];
    keyFramesR.push({
    frame: 0,
    value: 0
    });
    keyFramesR.push({
    frame: frameRate,
    value: Math.PI
    });
    keyFramesR.push({
    frame: 2 * frameRate,
    value: 2 * Math.PI
    });
    yRot.setKeys(keyFramesR);

    //yRotate.setKeys(keyFrames);
    disk.animations.push(yRot);
    scene.beginAnimation(disk, 0, 2 * frameRate, true, 0.5);


    return scene;
};*/