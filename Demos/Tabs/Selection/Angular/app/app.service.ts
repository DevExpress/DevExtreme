import { Injectable } from '@angular/core';

export class Tab {
  id: number;

  text: string;

  icon: string;
}

const employees: any = [
  {
    id: 0,
    icon: 'user',
    text: 'John Heart',
    position: 'CEO',
    picture: '../../../../images/employees/01.png',
    notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003. When not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
  },
  {
    id: 1,
    icon: 'user',
    text: 'Olivia Peyton',
    position: 'Sales Assistant',
    picture: '../../../../images/employees/09.png',
    notes: 'Olivia loves to sell. She has been selling DevAV products since 2012.  Olivia was homecoming queen in high school. She is expecting her first child in 6 months. Good Luck Olivia.',
  },
  {
    id: 2,
    icon: 'user',
    text: 'Robert Reagan',
    position: 'CMO',
    picture: '../../../../images/employees/03.png',
    notes: 'Robert was recently voted the CMO of the year by CMO Magazine. He is a proud member of the DevAV Management Team. Robert is a championship BBQ chef, so when you get the chance ask him for his secret recipe.',
  },
];

@Injectable()
export class Service {
  getEmployees(): Tab[] {
    return employees;
  }
}
