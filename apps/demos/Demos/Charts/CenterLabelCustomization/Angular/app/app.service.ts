import {
  Injectable,
} from '@angular/core';

export class DataItem {
  country: string;

  commodity: string;

  total: number;
}
const data:DataItem[] = [
  { country: 'France', commodity: 'Nuclear', total: 413278 },
  { country: 'Germany', commodity: 'Nuclear', total: 76536 },
  { country: 'France', commodity: 'Thermal', total: 47594 },
  { country: 'Germany', commodity: 'Thermal', total: 375809 },
  { country: 'France', commodity: 'Wind', total: 21033 },
  { country: 'Germany', commodity: 'Wind', total: 58228 },
  { country: 'France', commodity: 'Solar', total: 7274 },
  { country: 'Germany', commodity: 'Solar', total: 37520 },
  { country: 'France', commodity: 'Tidal, Wave', total: 618 },
];

const cache = {};

@Injectable()
export class Service {
  getData(country?: string): DataItem[] {
    if (country) {
      return cache[country] = cache[country] || data.filter((item) => item.country === country);
    }
    return data;
  }
}
