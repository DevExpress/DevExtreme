import { Injectable } from '@angular/core';

export class PopulationData {
  country: string;

  val: number;
}

const population: PopulationData[] = [
  { country: 'China', val: 1382500000 },
  { country: 'India', val: 1314300000 },
  { country: 'United States', val: 324789000 },
  { country: 'Indonesia', val: 261600000 },
  { country: 'Brazil', val: 207332000 },
  { country: 'Pakistan', val: 196865000 },
  { country: 'Nigeria', val: 188500000 },
  { country: 'Bangladesh', val: 162240000 },
  { country: 'Russia', val: 146400000 },
  { country: 'Japan', val: 126760000 },
  { country: 'Mexico', val: 122273000 },
  { country: 'Ethiopia', val: 104345000 },
  { country: 'Philippines', val: 103906000 },
  { country: 'Egypt', val: 92847800 },
];

const overlappingModes = ['stagger', 'rotate', 'hide', 'none'];

@Injectable()
export class Service {
  getPopulation(): PopulationData[] {
    return population;
  }

  getOverlappingModes(): string[] {
    return overlappingModes;
  }
}
