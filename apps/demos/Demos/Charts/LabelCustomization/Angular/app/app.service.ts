import {
  Injectable,
} from '@angular/core';

export class MedalsInfo {
  country: string;

  medals: number;
}

const medals: MedalsInfo[] = [{
  country: 'USA',
  medals: 126,
}, {
  country: 'Great Britain',
  medals: 65,
}, {
  country: 'France',
  medals: 64,
}, {
  country: 'Australia',
  medals: 53,
}, {
  country: 'Japan',
  medals: 45,
}, {
  country: 'Italy',
  medals: 40,
}, {
  country: 'Germany',
  medals: 33,
}];

@Injectable()
export class Service {
  getMedalsData(): MedalsInfo[] {
    return medals;
  }
}
