import { Injectable } from '@angular/core';

export class Person {
  id: number
  firstName: string;
  surname: string
  phone: number;
  position: Position;
}

export class Organisation {
  name: string;
}

export class PersonTO {
  person: Person;
  organisation: Organisation;
}

export class Position {
  title: string
}


let data: PersonTO[] = [];

let names: string[] = [
    "Robert",
    "Ben",
    "James",
    "Don",
    "Troy",
    "Sue",
    "Kara",
    "Jane",
    "Bob",
    "Jim"];

let titles: string[] = [
  "CEO",
  "Manager",
  "Client Adviser",
  "Support",
  "Developer"
];

let orgNames: string[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J"
];

@Injectable()
export class Service {
    random(i: number) {
        return Math.floor(Math.random()*i);
    }

    generateData(count: number) {
        let i: number;

        for (i = 0; i < count; i++) {

            let firstNameIndex = this.random(10);
            let surnameIndex = this.random(10);
            let phone = this.random(50000000);
            let titleIndex = this.random(5);
            let orgNameIndex = this.random(10);

            let position: Position = {
              title: titles[titleIndex]
            }

            let person: Person = {
                id: i + 1,
                firstName: names[firstNameIndex],
                surname: names[surnameIndex],
                phone: phone,
                position: position
            };

            let organisation = {
                name: orgNames[orgNameIndex]
            }

            let personTO: PersonTO = {
              person: person,
              organisation: organisation
            }
            data.push(personTO);
        }
        return data;
    }
}
