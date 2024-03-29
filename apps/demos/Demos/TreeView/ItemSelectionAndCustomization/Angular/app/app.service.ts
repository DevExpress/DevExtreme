import { Injectable } from '@angular/core';

export class Employee {
  id: number;

  fullName: string;

  prefix: string;

  position: string;

  expanded?: boolean;

  selected?: boolean;

  items?: Employee[];
}

const employees: Employee[] = [{
  id: 1,
  fullName: 'John Heart',
  prefix: 'Dr.',
  position: 'CEO',
  expanded: true,
  items: [{
    id: 2,
    fullName: 'Samantha Bright',
    prefix: 'Dr.',
    position: 'COO',
    expanded: true,
    items: [{
      id: 3,
      fullName: 'Kevin Carter',
      prefix: 'Mr.',
      position: 'Shipping Manager',
    }, {
      id: 14,
      fullName: 'Victor Norris',
      prefix: 'Mr.',
      selected: true,
      position: 'Shipping Assistant',
    }],
  }, {
    id: 4,
    fullName: 'Brett Wade',
    prefix: 'Mr.',
    position: 'IT Manager',
    expanded: true,
    items: [{
      id: 5,
      fullName: 'Amelia Harper',
      prefix: 'Mrs.',
      position: 'Network Admin',
    }, {
      id: 6,
      fullName: 'Wally Hobbs',
      prefix: 'Mr.',
      position: 'Programmer',
    }, {
      id: 7,
      fullName: 'Brad Jameson',
      prefix: 'Mr.',
      position: 'Programmer',
    }, {
      id: 8,
      fullName: 'Violet Bailey',
      prefix: 'Ms.',
      position: 'Jr Graphic Designer',
    }],
  }, {
    id: 9,
    fullName: 'Barb Banks',
    prefix: 'Mrs.',
    position: 'Support Manager',
    expanded: true,
    items: [{
      id: 10,
      fullName: 'Kelly Rodriguez',
      prefix: 'Ms.',
      position: 'Support Assistant',
    }, {
      id: 11,
      fullName: 'James Anderson',
      prefix: 'Mr.',
      position: 'Support Assistant',
    }],
  }],
}];

@Injectable()
export class Service {
  getEmployees(): Employee[] {
    return employees;
  }
}
