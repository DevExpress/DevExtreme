import { Injectable } from '@angular/core';

export class Owner {
    text: string;
    id: number;
    color: string;
}

let Owners: Owner[] = [
    {
        text: 'Samantha Bright',
        id: 1,
        color: '#cb6bb2'
    }, {
        text: 'John Heart',
        id: 2,
        color: '#56ca85'
    }, {
        text: 'Todd Hoffman',
        id: 3,
        color: '#1e90ff'
    }, {
        text: 'Sandra Johnson',
        id: 4,
        color: '#ff9747'
    }
];

@Injectable()
export class OwnerService {
  getOwners() {
    return Owners;
  }
}
