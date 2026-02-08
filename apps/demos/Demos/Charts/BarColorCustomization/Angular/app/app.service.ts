import { Injectable } from '@angular/core';

export class UserData {
  age: string;

  number: number;
}

const userData: UserData[] = [
  { age: '13-17', number: 6869661 },
  { age: '18-24', number: 40277957 },
  { age: '25-34', number: 53481235 },
  { age: '35-44', number: 40890002 },
  { age: '45-54', number: 31916371 },
  { age: '55-64', number: 13725406 },
  { age: '65+', number: 16732183 },
];

@Injectable()
export class Service {
  getUserData(): UserData[] {
    return userData;
  }
}
