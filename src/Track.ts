import Phaser from "phaser";


export class Track extends Phaser.GameObjects.Image {
    public endpoints: Phaser.Geom.Point[] = [];
    public i: number;
    public j: number;

    constructor(scene: Phaser.Scene, i: number, j: number, sprite: string, angle: number) {
        super(scene, i * 64 + 32, j * 64 + 32, sprite, 0);
        this.i = i;
        this.j = j;
        this.setPipeline("Light2D");
        this.setAngle(angle);
        scene.add.existing(this);
    }
}

export class TrackHorizontal extends Track {
    constructor(scene: Phaser.Scene, i: number, j: number) {
        super(scene, i, j, "track", 0);
        this.endpoints.push(new Phaser.Geom.Point(this.x - 32, this.y));
        this.endpoints.push(new Phaser.Geom.Point(this.x + 32, this.y));
    }
}

export class TrackVertical extends Track {
    constructor(scene: Phaser.Scene, i: number, j: number) {
        super(scene, i, j, "track", 90);
        this.endpoints.push(new Phaser.Geom.Point(this.x, this.y - 32));
        this.endpoints.push(new Phaser.Geom.Point(this.x, this.y + 32));
    }
}

export class TrackCurved extends Track {
    constructor(scene: Phaser.Scene, i: number, j: number, angle: number) {
        super(scene, i, j, "track_c", angle);
        if (angle == 0) {
            this.endpoints.push(new Phaser.Geom.Point(this.x, this.y + 32));
            this.endpoints.push(new Phaser.Geom.Point(this.x + 32, this.y));
        } else if (angle == 90) {
            this.endpoints.push(new Phaser.Geom.Point(this.x + 32, this.y));
            this.endpoints.push(new Phaser.Geom.Point(this.x, this.y - 32));
        } else if (angle == 180) {
            this.endpoints.push(new Phaser.Geom.Point(this.x, this.y - 32));
            this.endpoints.push(new Phaser.Geom.Point(this.x - 32, this.y));
        } else if (angle == 270) {
            this.endpoints.push(new Phaser.Geom.Point(this.x - 32, this.y));
            this.endpoints.push(new Phaser.Geom.Point(this.x, this.y + 32));
        }
    }
}