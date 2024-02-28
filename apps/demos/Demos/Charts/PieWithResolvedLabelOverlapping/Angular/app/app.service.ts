import {
  Injectable,
} from '@angular/core';

export class MedalsInfo {
  country: string;

  medals: number;
}

const medals: MedalsInfo[] = [{
  country: 'USA',
  medals: 112,
}, {
  country: 'China',
  medals: 100,
}, {
  country: 'Russia',
  medals: 60,
}, {
  country: 'Britain',
  medals: 49,
}, {
  country: 'Australia',
  medals: 46,
}, {
  country: 'France',
  medals: 43,
}, {
  country: 'Germany',
  medals: 41,
}, {
  country: 'South Korea',
  medals: 32,
}, {
  country: 'Cuba',
  medals: 29,
}, {
  country: 'Italy',
  medals: 27,
}, {
  country: 'Japan',
  medals: 25,
}, {
  country: 'Ukraine',
  medals: 22,
}, {
  country: 'Canada',
  medals: 20,
}, {
  country: 'Spain',
  medals: 19,
}];

@Injectable()
export class Service {
  getMedalsData(): MedalsInfo[] {
    return medals;
  }
}
