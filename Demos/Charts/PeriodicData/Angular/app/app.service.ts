import { Injectable } from '@angular/core';

export class Coordinate {
    arg: number;
    val: number;
}

let coordinates: Coordinate[] = [{
    arg: 0,
    val: 0
}, {
    arg: 720,
    val: 2
}];

@Injectable()
export class Service {
    getCoordinates(): Coordinate[] {
        return coordinates;
    }
}
