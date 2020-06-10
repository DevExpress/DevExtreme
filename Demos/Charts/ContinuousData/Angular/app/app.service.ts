import { Injectable } from '@angular/core';

export class Coordinate {
    arg: number;
    val: number;
}

let coordinates: Coordinate[] = [{
    arg: 0,
    val: 0
}, {
    arg: 30,
    val: 1.7
}, {
    arg: 45,
    val: 0
}, {
    arg: 60,
    val: 1.7
}, {
    arg: 90,
    val: 0
}, {
    arg: 120,
    val: 1.7
}, {
    arg: 135,
    val: 0
}, {
    arg: 150,
    val: 1.7
}, {
    arg: 180,
    val: 0
}, {
    arg: 210,
    val: 1.7
}, {
    arg: 225,
    val: 0
}, {
    arg: 240,
    val: 1.7
}, {
    arg: 270,
    val: 0
}, {
    arg: 300,
    val: 1.7
}, {
    arg: 315,
    val: 0
}, {
    arg: 330,
    val: 1.7
}, {
    arg: 360,
    val: 0
}];

@Injectable()
export class Service {
    getCoordinates(): Coordinate[] {
        return coordinates;
    }
}
