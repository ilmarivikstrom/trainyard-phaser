// const track = this.add.image(320, 320, 'track_c').setPipeline("Light2D");;
// track.setAngle(180);
// this.tracks.push(track);

// const track1 = this.add.image(320, 256, 'track_c').setPipeline("Light2D");;
// track1.setAngle(90);
// this.tracks.push(track1);

// const track2 = this.add.image(256, 256, 'track_c').setPipeline("Light2D");;
// track2.setAngle(0);
// this.tracks.push(track2);

// const track3 = this.add.image(256, 320, 'track_c').setPipeline("Light2D");;
// track3.setAngle(270);
// this.tracks.push(track3);


import Phaser, { Tilemaps } from 'phaser';
import { Track, TrackHorizontal, TrackVertical, TrackCurved } from "./Track";
import { Train } from "./Train";


class MainScene extends Phaser.Scene {
  private tracks: Track[] = [];
  private train1: Train;
  private light: Phaser.GameObjects.Light;
  private speedUpKey: Phaser.Input.Keyboard.Key;
  private speedDownKey: Phaser.Input.Keyboard.Key;
  private speedModifier: integer = 1;
  private placementSlots: Phaser.Math.Vector2[] = [];
  private pointerDown: boolean = false;
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image(
      {
        key: "train",
        url: "assets/train.png",
        normalMap: "assets/train-n.png",
      }
    );
    this.load.image(
      {
        key: "track",
        url: "assets/track.png",
        normalMap: "assets/track-n.png",
      }
    );
    this.load.image(
      {
        key: "track_c",
        url: "assets/track_c_bright.png",
        normalMap: "assets/track_c-n.png",
      }
    );
  }

  determineTrackPlacement(pointer: Phaser.Input.Pointer): void {
    if (!this.pointerDown) {
      this.placementSlots = [];
      return;
    }

    let i = Math.floor(pointer.x / 64);
    let j = Math.floor(pointer.y / 64);

    let currentPointerLocation = new Phaser.Math.Vector2(i, j);

    if (this.placementSlots.length == 0) {
      this.placementSlots.push(currentPointerLocation);
      return;
    }

    if (this.placementSlots.length == 1) {
      if (this.placementSlots[0].distance(currentPointerLocation) != 1) {
        this.placementSlots[0] = currentPointerLocation;
        return;
      }
      this.placementSlots.push(currentPointerLocation);
      return;
    }

    if (this.placementSlots.length == 2) {
      if (this.placementSlots[0].distance(currentPointerLocation) == 0) {
        this.placementSlots[0] = this.placementSlots[1];
        this.placementSlots.pop();
        return;
      }
      if (this.placementSlots[1].distance(currentPointerLocation) == 1) {
        if (this.placementSlots[0].x != currentPointerLocation.x && this.placementSlots[0].y == currentPointerLocation.y) {
          const track = new TrackHorizontal(this, this.placementSlots[1].x, this.placementSlots[1].y);
          this.tracks.push(track);
        } else if (this.placementSlots[0].x == currentPointerLocation.x && this.placementSlots[0].y != currentPointerLocation.y) {
          const track = new TrackVertical(this, this.placementSlots[1].x, this.placementSlots[1].y);
          this.tracks.push(track);
        } else if (this.placementSlots[0].x < currentPointerLocation.x && this.placementSlots[0].y < currentPointerLocation.y) {
          if (this.placementSlots[0].x < this.placementSlots[1].x) {
            const track = new TrackCurved(this, this.placementSlots[1].x, this.placementSlots[1].y, 90);
            this.tracks.push(track);
          } else {
            const track = new TrackCurved(this, this.placementSlots[1].x, this.placementSlots[1].y, 270);
            this.tracks.push(track);
          }
        } else if (this.placementSlots[0].x > currentPointerLocation.x && this.placementSlots[0].y < currentPointerLocation.y) {
          if (this.placementSlots[0].x > this.placementSlots[1].x) {
            const track = new TrackCurved(this, this.placementSlots[1].x, this.placementSlots[1].y, 0);
            this.tracks.push(track);
          } else {
            const track = new TrackCurved(this, this.placementSlots[1].x, this.placementSlots[1].y, 180);
            this.tracks.push(track);
          }
        } else if (this.placementSlots[0].x < currentPointerLocation.x && this.placementSlots[0].y > currentPointerLocation.y) {
          if (this.placementSlots[0].x < this.placementSlots[1].x) {
            const track = new TrackCurved(this, this.placementSlots[1].x, this.placementSlots[1].y, 180);
            this.tracks.push(track);
          } else {
            const track = new TrackCurved(this, this.placementSlots[1].x, this.placementSlots[1].y, 0);
            this.tracks.push(track);
          }
        } else if (this.placementSlots[0].x > currentPointerLocation.x && this.placementSlots[0].y > currentPointerLocation.y) {
          if (this.placementSlots[0].x > this.placementSlots[1].x) {
            const track = new TrackCurved(this, this.placementSlots[1].x, this.placementSlots[1].y, 270);
            this.tracks.push(track);
          } else {
            const track = new TrackCurved(this, this.placementSlots[1].x, this.placementSlots[1].y, 90);
            this.tracks.push(track);
          }
        }
        this.placementSlots.reverse();
        this.placementSlots.pop();
        this.placementSlots.reverse();
      }
    }
  }

  handlePointerMove(): void {
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.light.x = pointer.x;
      this.light.y = pointer.y;

      this.determineTrackPlacement(pointer)

    });
  }

  create(): void {
    let grid = new Phaser.GameObjects.Grid(this, 0, 0, sizes.width * 2, sizes.height * 2, 64, 64, 0x777777, 0.2, 0x111111, 0.2);
    grid.addToDisplayList();

    this.speedUpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.speedDownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    this.speedUpKey.on("down", (event) => {
      this.speedModifier += speedConfig.step;
      if (this.speedModifier > speedConfig.max) {
        this.speedModifier = speedConfig.max;
      }
      console.log("speedup: ", this.speedModifier);
    });

    this.speedDownKey.on("down", (event) => {
      this.speedModifier -= speedConfig.step;
      if (this.speedModifier < speedConfig.min) {
        this.speedModifier = speedConfig.min;
      }
      console.log("speeddown: ", this.speedModifier);
    });


    this.light = this.lights.addLight(280, 280, 256, 0x665555, 2);
    this.lights.enable().setAmbientColor(0x666666);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.pointerDown = true;
    });

    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      this.pointerDown = false;
      this.placementSlots = [];
    });

    this.handlePointerMove();

    for (let x = 0; x <= config.width / 64; x++) {
      const track = new TrackHorizontal(this, x, 5);
      this.tracks.push(track);
    }

    // this.train0 = new Train(this, 320, 320, 0)
    this.train1 = new Train(this, 1, 5, 0)

  }

  update(): void {
    // Phaser.Actions.RotateAroundDistance([this.train0], { x: 320 + 32, y: 320 + 32 }, this.speedModifier * -Math.PI / (2 * 64), 32);
    // this.train0.angle += this.speedModifier * -180 / (2 * 64);
    this.train1.x += this.speedModifier * 1;
    if (this.train1.x > config.width) {
      this.train1.x -= config.width;
    }
  }
}

const sizes = {
  width: 640,
  height: 640
};

const speedConfig = {
  min: 0,
  max: 5,
  step: 0.5,
};

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  backgroundColor: "#00001C",
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    }
  },
  scene: MainScene,
};

const game = new Phaser.Game(config);

export default game;
