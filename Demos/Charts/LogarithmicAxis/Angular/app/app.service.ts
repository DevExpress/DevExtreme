import { Injectable } from '@angular/core';

export class RelativeMass {
    name: string;
    mass: number;
    type: string;
}

let relativeMasses: RelativeMass[] = [{
     name: "Sun",
     mass: 332837,
     type: 'Star'
 }, {
     name: "Jupiter",
     mass: 317.83,
     type: 'Planet'
 }, {
     name: "Saturn",
     mass: 95.159,
     type: 'Planet'
 }, {
     name: "Uranus",
     mass: 14.536,
     type: 'Planet'
 }, {
     name: "Neptune",
     mass: 17.147,
     type: 'Planet'
 }, {
     name: "Earth",
     mass: 1,
     type: 'Planet'
 }, {
     name: "Venus",
     mass: 0.815,
     type: "Planet"
 }, {
     name: "Mars",
     mass: 0.107,
     type: 'Planet'
 }, {
     name: "Mercury",
     mass: 0.0553,
     type: 'Planet'
 }, {
     name: "Moon",
     mass: 0.0123,
     type: 'Satellite'
 }, {
     name: "Europa (Jupiter's Moon)",
     mass: 0.00803,
     type: 'Satellite'
 }];

@Injectable()
export class Service {
    getRelativeMasses(): RelativeMass[] {
        return relativeMasses;
    }
}