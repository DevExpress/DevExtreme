import { Injectable } from '@angular/core';

export interface Employee {
  ID: number;
  Name: string;
}

const employees: Employee[] = [{
  ID: 1,
  Name: 'John Heart',
}, {
  ID: 2,
  Name: 'Samantha Bright',
}, {
  ID: 3,
  Name: 'Arthur Miller',
}, {
  ID: 4,
  Name: 'Robert Reagan',
}, {
  ID: 5,
  Name: 'Greta Sims',
}, {
  ID: 6,
  Name: 'Brett Wade',
}, {
  ID: 7,
  Name: 'Sandra Johnson',
}, {
  ID: 8,
  Name: 'Ed Holmes',
}, {
  ID: 9,
  Name: 'Barb Banks',
}, {
  ID: 10,
  Name: 'Kevin Carter',
}, {
  ID: 11,
  Name: 'Cindy Stanwick',
}, {
  ID: 12,
  Name: 'Sammy Hill',
}, {
  ID: 13,
  Name: 'Davey Jones',
}, {
  ID: 14,
  Name: 'Victor Norris',
}, {
  ID: 15,
  Name: 'Mary Stern',
}, {
  ID: 16,
  Name: 'Robin Cosworth',
}, {
  ID: 17,
  Name: 'Kelly Rodriguez',
}, {
  ID: 18,
  Name: 'James Anderson',
}, {
  ID: 19,
  Name: 'Antony Remmen',
}, {
  ID: 20,
  Name: 'Olivia Peyton',
}, {
  ID: 21,
  Name: 'Taylor Riley',
}, {
  ID: 22,
  Name: 'Amelia Harper',
}, {
  ID: 23,
  Name: 'Wally Hobbs',
}, {
  ID: 24,
  Name: 'Brad Jameson',
}, {
  ID: 25,
  Name: 'Karen Goodson',
}, {
  ID: 26,
  Name: 'Marcus Orbison',
}, {
  ID: 27,
  Name: 'Sandy Bright',
}, {
  ID: 28,
  Name: 'Morgan Kennedy',
}, {
  ID: 29,
  Name: 'Violet Bailey',
}, {
  ID: 30,
  Name: 'Ken Samuelson',
}, {
  ID: 31,
  Name: 'Nat Maguiree',
}, {
  ID: 32,
  Name: 'Bart Arnaz',
}, {
  ID: 33,
  Name: 'Leah Simpson',
}, {
  ID: 34,
  Name: 'Arnie Schwartz',
}, {
  ID: 35,
  Name: 'Billy Zimmer',
}, {
  ID: 36,
  Name: 'Samantha Piper',
}, {
  ID: 37,
  Name: 'Maggie Boxter',
}, {
  ID: 38,
  Name: 'Terry Bradley',
}, {
  ID: 39,
  Name: 'Gabe Jones',
}, {
  ID: 40,
  Name: 'Lucy Ball',
}, {
  ID: 41,
  Name: 'Jim Packard',
}, {
  ID: 42,
  Name: 'Hannah Brookly',
}, {
  ID: 43,
  Name: 'Harv Mudd',
}, {
  ID: 44,
  Name: 'Clark Morgan',
}, {
  ID: 45,
  Name: 'Todd Hoffman',
}, {
  ID: 46,
  Name: 'Jackie Garmin',
}, {
  ID: 47,
  Name: 'Lincoln Bartlett',
}, {
  ID: 48,
  Name: 'Brad Farkus',
}, {
  ID: 49,
  Name: 'Jenny Hobbs',
}, {
  ID: 50,
  Name: 'Dallas Lou',
}, {
  ID: 51,
  Name: 'Stu Pizaro',
}];


@Injectable()
export class EmployeeService {
  getEmployees() {
    return employees;
  }
}
