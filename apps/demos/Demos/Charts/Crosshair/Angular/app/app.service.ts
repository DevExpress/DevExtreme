import { Injectable } from '@angular/core';

export class CountryInfo {
  country: string;

  hydro: number;

  oil: number;

  gas: number;

  coal: number;

  nuclear: number;
}

export class EnergyDescription {
  value: string;

  name: string;
}

const energySources: EnergyDescription[] = [
  { value: 'hydro', name: 'Hydro-electric' },
  { value: 'oil', name: 'Oil' },
  { value: 'gas', name: 'Natural gas' },
  { value: 'coal', name: 'Coal' },
  { value: 'nuclear', name: 'Nuclear' },
];

const countriesInfo: CountryInfo[] = [{
  country: 'USA',
  hydro: 60,
  oil: 940,
  gas: 910,
  coal: 210,
  nuclear: 230,
}, {
  country: 'Japan',
  hydro: 20,
  oil: 170,
  gas: 85,
  coal: 120,
  nuclear: 35,
}, {
  country: 'India',
  hydro: 40,
  oil: 260,
  gas: 60,
  coal: 620,
  nuclear: 10,
}, {
  country: 'Germany',
  hydro: 7,
  oil: 110,
  gas: 85,
  coal: 35,
  nuclear: 5,
}, {
  country: 'Canada',
  hydro: 90,
  oil: 110,
  gas: 120,
  coal: 5,
  nuclear: 20,
}, {
  country: 'Brazil',
  hydro: 110,
  oil: 150,
  gas: 50,
  coal: 15,
  nuclear: 5,
}];

@Injectable()
export class Service {
  getCountriesInfo(): CountryInfo[] {
    return countriesInfo;
  }

  getEnergySources(): EnergyDescription[] {
    return energySources;
  }
}
