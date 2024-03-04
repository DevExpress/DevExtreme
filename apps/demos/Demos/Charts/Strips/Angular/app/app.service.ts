import { Injectable } from '@angular/core';

export class Temperature {
  day: string;

  temperature: number;
}

const temperaturesData : Temperature[] = [
  { temperature: 52, day: '1' },
  { temperature: 57, day: '2' },
  { temperature: 58, day: '3' },
  { temperature: 56, day: '4' },
  { temperature: 59, day: '5' },
  { temperature: 59, day: '6' },
  { temperature: 56, day: '7' },
  { temperature: 62, day: '8' },
  { temperature: 57, day: '9' },
  { temperature: 54, day: '10' },
  { temperature: 52, day: '11' },
  { temperature: 58, day: '12' },
  { temperature: 53, day: '13' },
  { temperature: 54, day: '14' },
  { temperature: 57, day: '15' },
  { temperature: 61, day: '16' },
  { temperature: 58, day: '17' },
  { temperature: 63, day: '18' },
  { temperature: 64, day: '19' },
  { temperature: 52, day: '20' },
];

@Injectable()
export class Service {
  getTemperaturesData(): Temperature[] {
    return temperaturesData;
  }

  getRangeOfAverageTemperature() {
    return {
      highAverage: 60.8,
      lowAverage: 53,
    };
  }
}
