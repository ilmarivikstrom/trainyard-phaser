import Phaser from 'phaser';
import { Track, TrackHorizontal, TrackVertical, TrackCurved } from "./Track";
import { Train } from "./Train";


class MainScene extends Phaser.Scene {
  private tracks: Track[] = [];
  private train1: Train;
  private light: Phaser.GameObjects.Light;
  private speedUpKey: Phaser.Input.Keyboard.Key;
  private speedDownKey: Phaser.Input.Keyboard.Key;
  private deleteModeKey: Phaser.Input.Keyboard.Key;
  private speedModifier: number;
  private globalTrainSpeed: integer;
  private placementSlots: Phaser.Math.Vector2[] = [];
  private pointerDown = false;
  private timeDisplay: Phaser.GameObjects.Text;
  private speedDisplay: Phaser.GameObjects.Text;
  public constructor() {
    super('MainScene');
  }

  public preload(): void {
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

  private determineTrackPlacement(pointer: Phaser.Input.Pointer): void {
    if (!this.pointerDown) {
      this.placementSlots = [];
      return;
    }

    const i = Math.floor(pointer.x / sizes.tile);
    const j = Math.floor(pointer.y / sizes.tile);

    const currentPointerLocation = new Phaser.Math.Vector2(i, j);

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

  private handlePointerMove(): void {
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.light.x = pointer.x;
      this.light.y = pointer.y;

      this.determineTrackPlacement(pointer);

    });
  }

  private updateSpeed(): void {
    this.globalTrainSpeed = this.speedModifier * 128 / 1000;
  }

  private addTimeDisplay(): void {
    this.timeDisplay = this.add.text(24, 24, "", {backgroundColor: "#222222"});
    this.timeDisplay.setDepth(3);
  }

  private addSpeedDisplay(): void {
    this.speedDisplay = this.add.text(24, 48, "", {backgroundColor: "#222222"});
    this.speedDisplay.setDepth(3);
  }

  private setupControls(): void {
    if (this.input.keyboard == null) {
      throw new Error("Keyboard not found!");
    }

    this.speedUpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.speedDownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    this.speedUpKey.on("down", () => {
      this.speedModifier += speedConfig.step;
      if (this.speedModifier > speedConfig.max) {
        this.speedModifier = speedConfig.max;
      }
      this.updateSpeed();
      console.log("speedup: ", this.speedModifier);
    });

    this.speedDownKey.on("down", () => {
      this.speedModifier -= speedConfig.step;
      if (this.speedModifier < speedConfig.min) {
        this.speedModifier = speedConfig.min;
      }
      this.updateSpeed();
      console.log("speeddown: ", this.speedModifier);
    });

    this.input.on("pointerdown", () => {
      this.pointerDown = true;
    });

    this.input.on("pointerup", () => {
      this.pointerDown = false;
      this.placementSlots = [];
    });

  }


  private addVisualGrid(): void {
    const visualGrid = new Phaser.GameObjects.Grid(this, 0, 0, config.width * 2, config.height * 2, sizes.tile, sizes.tile, 0x777777, 0.2, 0x111111, 0.2);
    visualGrid.addToDisplayList();
  }


  private setupPointerLight(): void {
    const pointerLight = {
      x: 280,
      y: 280,
      radius: 256,
      rgb: 0x665555,
      intensity: 2,
    };

    this.light = this.lights.addLight(pointerLight.x, pointerLight.y, pointerLight.radius, pointerLight.rgb, pointerLight.intensity);
    this.lights.enable().setAmbientColor(0x666666);
  }


  public create(): void {
    this.speedModifier = speedConfig.default;
    this.updateSpeed();

    this.addTimeDisplay();
    this.addSpeedDisplay();

    this.addVisualGrid();

    this.setupControls();

    this.setupPointerLight();

    this.handlePointerMove();

    for (let x = 0; x <= config.width / sizes.tile; x++) {
      const track = new TrackHorizontal(this, x, 5);
      this.tracks.push(track);
    }

    this.train1 = new Train(this, 1, 5, 0);

  }

  private moveTrains(dt: number): void {
    this.train1.x += this.globalTrainSpeed * dt;
    if (this.train1.x > config.width) {
      this.train1.x -= config.width;
    }
  }

  private updateTimeDisplay(timestep: number): void {
    this.timeDisplay.setText("Time: " + (timestep / 1000).toFixed(2) + "s");
  }

  private updateSpeedDisplay(): void {
    this.speedDisplay.setText("Speed: " + this.speedModifier.toString() + "/" + speedConfig.max.toString());
  }

  public update(timestep: number, dt: number): void {
    // Phaser.Actions.RotateAroundDistance([this.train0], { x: 320 + 32, y: 320 + 32 }, this.speedModifier * -Math.PI / (2 * 64), 32);
    // this.train0.angle += this.speedModifier * -180 / (2 * 64);
    this.moveTrains(dt);
    this.updateTimeDisplay(timestep);
    this.updateSpeedDisplay();
  }
}

const speedConfig = {
  min: 0,
  max: 10,
  step: 1,
  default: 1,
};

const sizes = {
  tile: 64,
};


const config = {
  type: Phaser.WEBGL,
  width: sizes.tile * 10,
  height: sizes.tile * 10,
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
