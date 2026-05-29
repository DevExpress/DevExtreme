import {
  Injectable,
} from '@angular/core';

export class DataItem {
  country: string;

  commodity: string;

  total: number;
}
const data: DataItem[] = [
  { country: 'France', commodity: 'Nuclear', total: 360000 },
  { country: 'France', commodity: 'Thermal', total: 52000 },
  { country: 'Germany', commodity: 'Thermal', total: 210000 },
  { country: 'France', commodity: 'Wind', total: 50000 },
  { country: 'Germany', commodity: 'Wind', total: 140000 },
  { country: 'France', commodity: 'Solar', total: 23000 },
  { country: 'Germany', commodity: 'Solar', total: 70000 },
  { country: 'Germany', commodity: 'Hydro', total: 20000 },
  { country: 'France', commodity: 'Hydro', total: 65000 },
  { country: 'Germany', commodity: 'Biomass', total: 45000 },
];

const cache = {};

@Injectable()
export class Service {
  getData(country?: string): DataItem[] {
    if (country) {
      if (!cache[country]) {
        cache[country] = data.filter((item) => item.country === country);
      }

      return cache[country];
    }
    return data;
  }
}
