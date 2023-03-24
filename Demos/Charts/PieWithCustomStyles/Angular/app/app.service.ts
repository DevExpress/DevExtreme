import { Injectable } from '@angular/core';

export class Data {
  type: string;

  value: number;
}

const data: Data[] = [{
  type: 'Stroke Pattern',
  value: 1,
}, {
  type: 'Square Pattern',
  value: 1,
}, {
  type: 'Linear Gradient',
  value: 1,
}, {
  type: 'Radial Gradient',
  value: 1,
}, {
  type: 'Pattern with image',
  value: 1,
}];

@Injectable()
export class Service {
  getData(): Data[] {
    return data;
  }
}
