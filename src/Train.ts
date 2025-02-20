import Phaser from "phaser";

enum Direction {
    Right = 0,
    Up = 1,
    Left = 2,
    Down = 3,
}

export class Train extends Phaser.GameObjects.Image {
    constructor(scene: Phaser.Scene, i: number, j: number, angle: number) {
        super(scene, i * 64 + 32, j * 64 + 32, "train", 0);
        this.setPipeline("Light2D");
        this.setAngle(angle);
        scene.add.existing(this);
        this.setDepth(1);
    }
}