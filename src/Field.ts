import { Track } from './Track';

type Grid = { [key: string]: Array<Track> };

function coordinatesKey(x: number, y: number): string {
    return `${x.toString()},${y.toString()}`;
  }

export class Field {
    private grid: Grid = {};

    constructor(width: number, height: number) {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.grid[coordinatesKey(x, y)] = [];
            }
          }
    }

    public add(track: Track) {
        const key = coordinatesKey(track.i, track.j);
        const arr = this.grid[key];
        if (arr.length >= 2) {
            arr.shift();
        }
        arr.push(track);
    }
}