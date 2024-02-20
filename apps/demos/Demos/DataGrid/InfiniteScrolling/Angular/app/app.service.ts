import { Injectable } from '@angular/core';

export class Employee {
  id: number;

  firstName: string;

  lastName: string;

  gender: string;

  birthDate: Date;
}

const employees: Employee[] = [];

const surnames: string[] = [
  'Smith',
  'Johnson',
  'Brown',
  'Taylor',
  'Anderson',
  'Harris',
  'Clark',
  'Allen',
  'Scott',
  'Carter'];

const names: string[] = [
  'James',
  'John',
  'Robert',
  'Christopher',
  'George',
  'Mary',
  'Nancy',
  'Sandra',
  'Michelle',
  'Betty'];

const gender: string[] = ['Male', 'Female'];

let s = 123456789;

@Injectable()
export class Service {
  random() {
    s = (1103515245 * s + 12345) % 2147483647;
    return s % (10 - 1);
  }

  generateData(count: number) {
    let i: number;
    const startBirthDate = Date.parse('1/1/1975');
    const endBirthDate = Date.parse('1/1/1992');

    for (i = 0; i < count; i++) {
      const birthDate = new Date(startBirthDate + Math.floor(
        this.random()
                    * (endBirthDate - startBirthDate) / 10,
      ));
      birthDate.setHours(12);

      const nameIndex = this.random();
      const item = {
        id: i + 1,
        firstName: names[nameIndex],
        lastName: surnames[this.random()],
        gender: gender[Math.floor(nameIndex / 5)],
        birthDate,
      };
      employees.push(item);
    }

    return employees;
  }
}
